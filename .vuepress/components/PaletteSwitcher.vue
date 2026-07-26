<template>
  <div
    ref="rootEl"
    class="palette-switcher"
    :class="{ 'is-open': open }"
  >
    <!-- 面板 -->
    <Transition name="ps-pop">
      <section
        v-if="open"
        class="ps-panel"
        role="dialog"
        aria-label="外观设置"
      >
        <header class="ps-panel__head">
          <span class="ps-panel__title">雨的颜色</span>
          <button
            type="button"
            class="ps-close"
            aria-label="关闭"
            @click="open = false"
          >
            <LucideIcon name="x" size="1rem" />
          </button>
        </header>

        <ul class="ps-list">
          <li v-for="p in PALETTES" :key="p.id">
            <button
              type="button"
              class="ps-item"
              :class="{ 'is-active': p.id === current }"
              :aria-pressed="p.id === current"
              @click="pick(p.id)"
            >
              <span
                class="ps-orb"
                :style="{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }"
              />
              <span class="ps-item__text">
                <span class="ps-item__name">{{ p.name }}</span>
                <span class="ps-item__desc">{{ p.desc }}</span>
              </span>
              <LucideIcon
                v-if="p.id === current"
                class="ps-item__check"
                name="check"
                size="1rem"
              />
            </button>
          </li>
        </ul>

        <footer class="ps-panel__foot">
          <span class="ps-foot__label">
            <LucideIcon name="droplets" size="0.95rem" />
            雨量
          </span>
          <div class="ps-seg" role="group" aria-label="雨量">
            <button
              v-for="opt in LEVELS"
              :key="opt.value"
              type="button"
              class="ps-seg__btn"
              :class="{ 'is-active': opt.value === level }"
              :aria-pressed="opt.value === level"
              @click="setLevel(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </footer>
      </section>
    </Transition>

    <!-- 触发按钮 -->
    <button
      type="button"
      class="ps-trigger"
      :aria-expanded="open"
      aria-label="切换配色与雨量"
      @click="open = !open"
    >
      <LucideIcon :name="open ? 'x' : 'palette'" size="1.15rem" />
    </button>
  </div>
</template>

<script lang="ts" setup>
/**
 * PaletteSwitcher — 配色与雨量控制台
 *
 * 配色写入 <html data-palette>，雨量写入 CSS 变量 --rain-opacity，
 * 两者都持久化到 localStorage，并广播自定义事件供 RainCanvas 取色 / 调档。
 * 浅色配色（冷雾晨白）会同步摘掉主题的 .dark 类，让 reco 自身的暗色样式让位。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

import LucideIcon from './LucideIcon.vue'

interface Palette {
  id: string
  name: string
  desc: string
  from: string
  to: string
  light?: boolean
}

const PALETTES: Palette[] = [
  {
    id: 'midnight',
    name: '深夜暴雨',
    desc: '近黑底 · 冷蓝霓虹',
    from: '#4f8cff',
    to: '#73e0ff',
  },
  {
    id: 'neon',
    name: '霓虹雨夜',
    desc: '紫粉倒影 · 冲击最强',
    from: '#c05bff',
    to: '#ff4fa3',
  },
  {
    id: 'moss',
    name: '苔雨青林',
    desc: '雨林深绿 · 沉静',
    from: '#34d399',
    to: '#7dd3fc',
  },
  {
    id: 'amber',
    name: '琥珀夜灯',
    desc: '钠灯暖橙 · 潮湿街道',
    from: '#ffa94d',
    to: '#ffd43b',
  },
  {
    id: 'mist',
    name: '冷雾晨白',
    desc: '浅色雾玻璃 · 白天可读',
    from: '#2f6fe4',
    to: '#cdd9e8',
    light: true,
  },
]

const LEVELS = [
  { value: 0, label: '关' },
  { value: 1, label: '弱' },
  { value: 2, label: '强' },
]

const PALETTE_KEY = 'rainy-palette'
const LEVEL_KEY = 'rainy-rain-level'

const rootEl = ref<HTMLElement | null>(null)
const open = ref(false)
const current = ref('midnight')
const level = ref(2)

function applyPalette(id: string) {
  const palette = PALETTES.find((p) => p.id === id) || PALETTES[0]
  const html = document.documentElement

  html.dataset.palette = palette.id

  /* 浅色配色需要让 reco 的 dark 变体退场 */
  if (palette.light) html.classList.remove('dark')
  else html.classList.add('dark')

  try {
    window.localStorage.setItem(PALETTE_KEY, palette.id)
    /* 主题自带的明暗切换虽然被 CSS 藏了，组件仍会在 onMounted 里按这个键
       重新决定 html.dark。写同一个键，两边才不会打架（键名取自
       vuepress-theme-reco 的 ToggleDarkModeButton.vue） */
    window.localStorage.setItem(
      'vuepress-reco-color-scheme',
      palette.light ? 'light' : 'dark',
    )
  } catch {
    /* 隐私模式下写入失败，不影响本次会话 */
  }

  current.value = palette.id
  window.dispatchEvent(
    new CustomEvent('rainy:palette', { detail: { palette: palette.id } }),
  )
}

function pick(id: string) {
  applyPalette(id)
}

function setLevel(value: number) {
  level.value = value
  try {
    window.localStorage.setItem(LEVEL_KEY, String(value))
  } catch {
    /* 同上 */
  }
  window.dispatchEvent(
    new CustomEvent('rainy:rain-level', { detail: { level: value } }),
  )
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  if (typeof window === 'undefined') return

  let savedPalette = 'midnight'
  let savedLevel = 2
  try {
    savedPalette = window.localStorage.getItem(PALETTE_KEY) || 'midnight'
    const raw = window.localStorage.getItem(LEVEL_KEY)
    if (raw !== null) {
      const n = Number(raw)
      if (n === 0 || n === 1 || n === 2) savedLevel = n
    }
  } catch {
    /* 读不到就用默认值 */
  }

  applyPalette(savedPalette)
  level.value = savedLevel

  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.palette-switcher {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 9500;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}

/* ---- 触发按钮 ---- */
.ps-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.85rem;
  height: 2.85rem;
  padding: 0;
  border: 1px solid var(--glass-line);
  border-radius: 50%;
  background-image: var(--glass-fill);
  background-color: color-mix(in srgb, var(--bg-1) 62%, transparent);
  box-shadow: var(--glass-rim), var(--glass-shadow);
  color: var(--ink-1);
  cursor: pointer;
  -webkit-backdrop-filter: blur(18px) saturate(170%);
  backdrop-filter: blur(18px) saturate(170%);
  transition: transform var(--dur-fast) var(--ease-spring),
    border-color var(--dur-fast) var(--ease-out-expo),
    box-shadow var(--dur-fast) var(--ease-out-expo);
}

.ps-trigger::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 68%);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.ps-trigger:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}

.ps-trigger:hover::after {
  opacity: 0.7;
}

.is-open .ps-trigger {
  border-color: color-mix(in srgb, var(--accent) 65%, transparent);
}

/* ---- 面板 ---- */
.ps-panel {
  width: 17.5rem;
  padding: 0.85rem;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  background-image: var(--glass-fill);
  background-color: color-mix(in srgb, var(--bg-1) 78%, transparent);
  box-shadow: var(--glass-rim), var(--glass-shadow);
  -webkit-backdrop-filter: blur(26px) saturate(175%);
  backdrop-filter: blur(26px) saturate(175%);
}

.ps-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  padding: 0 0.2rem;
}

.ps-panel__title {
  font-family: var(--font-display);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--ink-3);
}

.ps-close {
  display: inline-flex;
  padding: 0.25rem;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--ink-3);
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out-expo),
    background var(--dur-fast) var(--ease-out-expo);
}

.ps-close:hover {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--ink-1);
}

.ps-list {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ps-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.5rem 0.55rem;
  border: 1px solid transparent;
  border-radius: 13px;
  background: transparent;
  color: var(--ink-2);
  text-align: left;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo),
    transform var(--dur-fast) var(--ease-spring);
}

.ps-item:hover {
  background: color-mix(in srgb, var(--accent) 11%, transparent);
  transform: translateX(2px);
}

.ps-item.is-active {
  border-color: color-mix(in srgb, var(--accent) 42%, transparent);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--ink-1);
}

.ps-orb {
  flex: none;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 50%;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 3px 10px rgba(0, 0, 0, 0.35);
}

.ps-item__text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.ps-item__name {
  font-size: 0.86rem;
  font-weight: 650;
  line-height: 1.2;
}

.ps-item__desc {
  overflow: hidden;
  color: var(--ink-3);
  font-size: 0.68rem;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ps-item__check {
  margin-left: auto;
  color: var(--accent-2);
}

/* ---- 雨量 ---- */
.ps-panel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--glass-line);
}

.ps-foot__label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding-left: 0.2rem;
  color: var(--ink-3);
  font-size: 0.76rem;
  font-weight: 600;
}

.ps-seg {
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-pill);
  background: color-mix(in srgb, var(--bg-0) 44%, transparent);
}

.ps-seg__btn {
  min-width: 2.1rem;
  padding: 0.22rem 0.45rem;
  border: 0;
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--ink-3);
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out-expo),
    color var(--dur-fast) var(--ease-out-expo);
}

.ps-seg__btn:hover {
  color: var(--ink-1);
}

.ps-seg__btn.is-active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: var(--accent-ink);
}

/* ---- 出场 ---- */
.ps-pop-enter-active {
  transition: opacity 0.28s var(--ease-out-expo),
    transform 0.34s var(--ease-out-expo);
}

.ps-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.ps-pop-enter-from,
.ps-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

@media (max-width: 640px) {
  .palette-switcher {
    left: 0.85rem;
    bottom: 0.85rem;
  }

  .ps-panel {
    width: min(16.5rem, calc(100vw - 1.7rem));
  }
}
</style>
