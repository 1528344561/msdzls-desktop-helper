<template>
  <div class="rain-root" aria-hidden="true">
    <!-- 天空底色 -->
    <div class="rain-backdrop" />

    <!-- 落雨（内容之下） -->
    <canvas ref="skyEl" class="rain-sky" />

    <!-- 环境光晕 + 雾面颗粒 -->
    <div class="rain-ambient" />
    <div class="rain-grain" />

    <!-- 闪电 -->
    <div ref="flashEl" class="rain-flash" />

    <!-- 玻璃上的水珠（内容之上） -->
    <canvas
      v-if="glassEnabled"
      ref="glassEl"
      class="rain-glass"
      :data-context="context"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * RainCanvas — 雨幕引擎
 *
 * 两层画布：
 *   1. sky   —— 三层视差雨丝，落在内容之下
 *   2. glass —— 附着在「屏幕玻璃」上的水珠，落在内容之上
 *
 * 水珠遵循一套简化的表面张力模型：
 *   凝结增大 → 质量突破静摩擦 → 加速下滑并左右摆动 →
 *   吞并途经的静止水珠（半径按体积守恒合并）→ 沿途留下逐渐蒸发的水痕。
 *
 * 性能守则：页面不可见时停帧、指针擦拭、低端设备与移动端自动关闭水珠层、
 * 尊重 prefers-reduced-motion、雨量可由用户三档调节。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** home 用满强度，doc 会自动收敛，避免长时间阅读疲劳 */
    context?: 'home' | 'doc'
  }>(),
  { context: 'doc' },
)

const skyEl = ref<HTMLCanvasElement | null>(null)
const glassEl = ref<HTMLCanvasElement | null>(null)
const flashEl = ref<HTMLDivElement | null>(null)
const glassEnabled = ref(false)

/* ------------------------------------------------------------------ 类型 */

interface Streak {
  x: number
  y: number
  len: number
  vy: number
  alpha: number
  width: number
}

interface Drop {
  x: number
  y: number
  r: number
  vy: number
  seed: number
  moving: boolean
  grow: number
  release: number
}

interface Residue {
  x: number
  y: number
  r: number
  life: number
}

/* ------------------------------------------------------- 运行时状态 */

let raf = 0
let running = false
let disposed = false

let skyCtx: CanvasRenderingContext2D | null = null
let glassCtx: CanvasRenderingContext2D | null = null

let W = 0
let H = 0
let dpr = 1

let layers: Streak[][] = []
let drops: Drop[] = []
let residues: Residue[] = []

let dropColor = '210, 240, 255'
let streakColor = '168, 208, 255'

let wind = 0
let windPhase = Math.random() * Math.PI * 2
let lastTime = 0
let nextLightning = 0
let spawnDebt = 0

const pointer = { x: -9999, y: -9999, active: false }

/** 雨量档位：2 强 / 1 弱 / 0 关 */
let level = 2

const LEVEL_KEY = 'rainy-rain-level'
const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------ 工具 */

function readLevel(): number {
  try {
    const raw = window.localStorage.getItem(LEVEL_KEY)
    if (raw === null) return 2
    const n = Number(raw)
    return n === 0 || n === 1 || n === 2 ? n : 2
  } catch {
    return 2
  }
}

function readPalette() {
  const cs = getComputedStyle(document.documentElement)
  dropColor = (cs.getPropertyValue('--drop-rgb') || '').trim() || '210, 240, 255'
  streakColor =
    (cs.getPropertyValue('--streak-rgb') || '').trim() || '168, 208, 255'
}

/** 低端设备 / 移动端不开水珠层：mix-blend-mode 全屏合成代价偏高 */
function canRunGlass(): boolean {
  if (typeof window === 'undefined') return false
  if (REDUCED()) return false
  if (window.innerWidth < 900) return false
  if (window.matchMedia('(hover: none)').matches) return false
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return false
  return true
}

/* --------------------------------------------------------- 初始化 */

function sizeCanvas(el: HTMLCanvasElement, ratio: number) {
  el.width = Math.floor(W * ratio)
  el.height = Math.floor(H * ratio)
  const ctx = el.getContext('2d')
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  return ctx
}

function buildStreaks() {
  const home = props.context === 'home'
  const density = (W * H) / 20000
  const scale = level === 2 ? 1 : 0.45
  const base = (home ? 1 : 0.62) * scale

  /* 三层视差：远处细而慢，近处粗而快 */
  const spec = [
    { n: 0.55, vy: [2.6, 4.2], len: [8, 16], w: 0.7, a: [0.1, 0.22] },
    { n: 0.3, vy: [5.5, 8.5], len: [16, 30], w: 1.05, a: [0.2, 0.38] },
    { n: 0.15, vy: [10, 15], len: [30, 56], w: 1.5, a: [0.32, 0.55] },
  ]

  layers = spec.map((s) => {
    const count = Math.round(density * s.n * base)
    const arr: Streak[] = []
    for (let i = 0; i < count; i += 1) {
      arr.push({
        x: Math.random() * (W + 220) - 110,
        y: Math.random() * H,
        len: s.len[0] + Math.random() * (s.len[1] - s.len[0]),
        vy: s.vy[0] + Math.random() * (s.vy[1] - s.vy[0]),
        alpha: s.a[0] + Math.random() * (s.a[1] - s.a[0]),
        width: s.w,
      })
    }
    return arr
  })
}

function resize() {
  if (disposed || typeof window === 'undefined') return

  /* 用 documentElement 而非 innerWidth：后者含滚动条宽度，
     会让画布坐标系比 fixed 元素的实际盒子宽出十几像素，雨丝被横向拉伸 */
  W = document.documentElement.clientWidth || window.innerWidth
  H = document.documentElement.clientHeight || window.innerHeight
  dpr = Math.min(window.devicePixelRatio || 1, 2)

  if (skyEl.value) skyCtx = sizeCanvas(skyEl.value, dpr)
  if (glassEl.value) glassCtx = sizeCanvas(glassEl.value, Math.min(dpr, 1.5))

  buildStreaks()
  drops = drops.filter((d) => d.x < W && d.y < H)
  residues = []
}

/* ------------------------------------------------------------ 雨丝 */

function stepStreaks(dt: number) {
  windPhase += dt * 0.00018
  wind = Math.sin(windPhase) * 1.6 + Math.sin(windPhase * 2.3) * 0.5

  const ctx = skyCtx
  if (!ctx) return

  ctx.clearRect(0, 0, W, H)
  ctx.lineCap = 'round'

  for (let li = 0; li < layers.length; li += 1) {
    const layer = layers[li]
    const drift = wind * (0.5 + li * 0.45)

    ctx.beginPath()
    ctx.lineWidth = layer.length ? layer[0].width : 1

    for (let i = 0; i < layer.length; i += 1) {
      const s = layer[i]
      s.y += s.vy * dt * 0.06
      s.x += drift * dt * 0.03

      if (s.y > H + s.len) {
        s.y = -s.len - Math.random() * 60
        s.x = Math.random() * (W + 220) - 110
      }
      if (s.x < -120) s.x = W + 100
      else if (s.x > W + 120) s.x = -100

      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + drift * 1.5, s.y + s.len)
    }

    /* 同层雨丝共享透明度，换取一次 stroke 的开销 */
    const a = layer.length ? layer[0].alpha : 0.2
    ctx.strokeStyle = `rgba(${streakColor}, ${a})`
    ctx.stroke()
  }
}

/* ------------------------------------------------------------ 水珠 */

function spawnDrops(dt: number) {
  const cap = props.context === 'home' ? 96 : 46
  if (drops.length >= cap) return

  const rate = (props.context === 'home' ? 0.026 : 0.014) * (level === 2 ? 1 : 0.4)
  spawnDebt += rate * dt

  while (spawnDebt >= 1 && drops.length < cap) {
    spawnDebt -= 1
    const r = 1.6 + Math.random() * 3.2
    drops.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r,
      vy: 0,
      seed: Math.random() * Math.PI * 2,
      moving: false,
      grow: 0.0016 + Math.random() * 0.004,
      release: 5.6 + Math.random() * 5.4,
    })
  }
}

function stepDrops(dt: number) {
  spawnDrops(dt)

  /* 帧时长归一化系数：不做的话 120Hz 屏上阻尼、摆动、水痕都会翻倍 */
  const k = dt / 16

  for (let i = drops.length - 1; i >= 0; i -= 1) {
    const d = drops[i]

    /* 指针擦拭玻璃 */
    if (pointer.active) {
      const dx = d.x - pointer.x
      const dy = d.y - pointer.y
      if (dx * dx + dy * dy < 4900) {
        drops.splice(i, 1)
        continue
      }
    }

    if (!d.moving) {
      /* 凝结长大，直到质量压过表面张力 */
      d.r += d.grow * dt
      if (d.r >= d.release) {
        d.moving = true
        d.vy = 0.12
      }
      continue
    }

    /* 重力随体积增大，阻力随速度增大 */
    d.vy += (0.0022 * d.r) * dt
    d.vy -= d.vy * 0.005 * k
    d.vy = Math.min(d.vy, d.r * 0.9)

    d.y += d.vy * dt * 0.06
    d.x += Math.sin(d.y * 0.028 + d.seed) * 0.22 * k + wind * 0.012 * dt * 0.06

    /* 水痕 */
    if (Math.random() < 0.34 * k && residues.length < 420) {
      residues.push({
        x: d.x + (Math.random() - 0.5) * d.r * 0.5,
        y: d.y - d.r * 0.6,
        r: d.r * (0.16 + Math.random() * 0.2),
        life: 1,
      })
      d.r *= 0.9975
    }

    /* 吞并途经的静止水珠 —— 体积守恒 */
    for (let j = drops.length - 1; j >= 0; j -= 1) {
      if (j === i) continue
      const o = drops[j]
      if (o.moving) continue
      const dx = o.x - d.x
      const dy = o.y - d.y
      const reach = d.r + o.r
      if (dx * dx + dy * dy < reach * reach) {
        d.r = Math.sqrt(d.r * d.r + o.r * o.r)
        drops.splice(j, 1)
        if (j < i) i -= 1
      }
    }

    if (d.y - d.r > H || d.x < -40 || d.x > W + 40) drops.splice(i, 1)
  }

  for (let i = residues.length - 1; i >= 0; i -= 1) {
    residues[i].life -= 0.0012 * dt
    if (residues[i].life <= 0) residues.splice(i, 1)
  }
}

function drawDrops() {
  const ctx = glassCtx
  if (!ctx) return

  ctx.clearRect(0, 0, W, H)

  /* 水痕先画，压在水珠之下 */
  for (let i = 0; i < residues.length; i += 1) {
    const t = residues[i]
    ctx.beginPath()
    ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${dropColor}, ${0.16 * t.life})`
    ctx.fill()
  }

  for (let i = 0; i < drops.length; i += 1) {
    const d = drops[i]
    const stretch = d.moving ? 1 + Math.min(d.vy * 0.06, 0.55) : 1

    ctx.save()
    ctx.translate(d.x, d.y)
    ctx.scale(1, stretch)

    /* 珠体：偏心径向渐变模拟透镜聚光 */
    const g = ctx.createRadialGradient(
      -d.r * 0.34,
      -d.r * 0.38,
      d.r * 0.06,
      0,
      0,
      d.r,
    )
    g.addColorStop(0, `rgba(${dropColor}, 0.9)`)
    g.addColorStop(0.4, `rgba(${dropColor}, 0.3)`)
    g.addColorStop(0.78, `rgba(${dropColor}, 0.1)`)
    g.addColorStop(1, `rgba(${dropColor}, 0)`)

    ctx.beginPath()
    ctx.arc(0, 0, d.r, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

    /* 高光点 */
    if (d.r > 2.4) {
      ctx.beginPath()
      ctx.ellipse(
        -d.r * 0.3,
        -d.r * 0.34,
        d.r * 0.2,
        d.r * 0.14,
        -0.6,
        0,
        Math.PI * 2,
      )
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.fill()
    }

    ctx.restore()
  }
}

/* ---------------------------------------------------------- 闪电 */

function scheduleLightning(now: number) {
  nextLightning = now + 16000 + Math.random() * 26000
}

function strike() {
  if (!flashEl.value) return

  const seq = [0.34, 0, 0.5, 0, 0.16, 0]
  let i = 0
  const tick = () => {
    if (disposed || !flashEl.value) return
    flashEl.value.style.opacity = String(seq[i])
    i += 1
    if (i < seq.length) window.setTimeout(tick, i % 2 === 0 ? 70 : 55)
  }
  tick()
}

/* ----------------------------------------------------------- 主循环 */

function frame(now: number) {
  if (disposed) return

  const dt = Math.min(now - lastTime, 50) || 16
  lastTime = now

  stepStreaks(dt)

  if (glassCtx) {
    stepDrops(dt)
    drawDrops()
  }

  if (props.context === 'home' && level === 2) {
    if (!nextLightning) scheduleLightning(now)
    else if (now > nextLightning) {
      strike()
      scheduleLightning(now)
    }
  }

  raf = window.requestAnimationFrame(frame)
}

function start() {
  if (running || disposed || level === 0 || REDUCED()) return
  running = true
  lastTime = performance.now()
  raf = window.requestAnimationFrame(frame)
}

function stop() {
  running = false
  if (raf) window.cancelAnimationFrame(raf)
  raf = 0
}

/* ---------------------------------------------------------- 事件 */

let resizeTimer = 0

function onResize() {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(resize, 160)
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

let pointerIdle = 0

function onPointerMove(e: PointerEvent) {
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.active = true

  /* pointerleave 不冒泡到 window，只能靠静止超时收工 —— 否则光标停下的位置
     会在玻璃上留一块永久擦干的死区 */
  window.clearTimeout(pointerIdle)
  pointerIdle = window.setTimeout(onPointerLeave, 220)
}

function onPointerLeave() {
  pointer.active = false
  pointer.x = -9999
  pointer.y = -9999
}

function applyLevel(next: number) {
  level = next
  document.documentElement.style.setProperty(
    '--rain-opacity',
    next === 2 ? '1' : next === 1 ? '0.55' : '0',
  )

  if (next === 0) {
    stop()
    if (skyCtx) skyCtx.clearRect(0, 0, W, H)
    if (glassCtx) glassCtx.clearRect(0, 0, W, H)
    drops = []
    residues = []
    return
  }

  buildStreaks()
  start()
}

function onPaletteChange() {
  readPalette()
}

function onRainLevel(e: Event) {
  const detail = (e as CustomEvent<{ level: number }>).detail
  if (!detail) return
  applyLevel(detail.level)
}

/* ------------------------------------------------------- 生命周期 */

onMounted(() => {
  if (typeof window === 'undefined') return

  glassEnabled.value = canRunGlass()
  level = readLevel()
  readPalette()

  /* 等 v-if 的水珠画布真正落到 DOM 上再测量，否则量到的是 null */
  void nextTick(() => {
    if (disposed) return
    resize()
    applyLevel(level)
  })

  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('blur', onPointerLeave)
  window.addEventListener('rainy:palette', onPaletteChange)
  window.addEventListener('rainy:rain-level', onRainLevel)
})

onBeforeUnmount(() => {
  disposed = true
  stop()
  if (typeof window === 'undefined') return
  window.clearTimeout(resizeTimer)
  window.clearTimeout(pointerIdle)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('blur', onPointerLeave)
  window.removeEventListener('rainy:palette', onPaletteChange)
  window.removeEventListener('rainy:rain-level', onRainLevel)
})

/* 首页 ↔ 文档页切换时重建雨丝密度 */
watch(
  () => props.context,
  () => {
    if (!disposed) {
      buildStreaks()
      nextLightning = 0
    }
  },
)
</script>

<style scoped>
/* display: contents —— 不生成盒子，避免包裹层建立层叠上下文
   把 z-index 9000 的水珠画布困在内部 */
.rain-root {
  display: contents;
}

/* 天空底色 —— 上方压暗，地平线泛起冷光 */
.rain-backdrop {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background: linear-gradient(
    172deg,
    var(--sky-a) 0%,
    var(--sky-b) 46%,
    var(--sky-c) 100%
  );
  transition: background 0.9s var(--ease-out-expo);
}
</style>
