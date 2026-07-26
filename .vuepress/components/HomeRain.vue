<template>
  <div ref="rootEl" class="home-rain">
    <!-- ================================================== 首屏 ============ -->
    <section class="hero">
      <!-- 巨型背景字：雨 -->
      <span ref="glyphEl" class="hero__glyph" aria-hidden="true">雨</span>

      <!-- 左侧竖排轨道 -->
      <div class="hero__rail" aria-hidden="true">
        <span class="hero__rail-text">RAINY&nbsp;/&nbsp;自动化&nbsp;/&nbsp;挂机</span>
      </div>

      <div class="hero__inner">
        <p class="hero__eyebrow reveal" data-delay="0">
          <span class="pulse" />
          MSDZLS
          <span class="sep">·</span>
          DESKTOP EDITION
        </p>

        <h1 class="hero__title" :aria-label="title">
          <span
            v-for="(ch, i) in titleChars"
            :key="`${ch}-${i}`"
            class="hero__char reveal"
            :data-delay="60 + i * 55"
            aria-hidden="true"
            >{{ ch }}</span
          >
        </h1>

        <p v-if="description" class="hero__desc reveal" data-delay="420">
          {{ description }}
        </p>

        <!-- 长文案拆成主句 + 提示条 -->
        <div v-if="taglineLead" class="hero__lead reveal" data-delay="500">
          <span class="hero__lead-bar" aria-hidden="true" />
          <p>{{ taglineLead }}</p>
        </div>

        <ul v-if="taglineNotes.length" class="hero__notes reveal" data-delay="560">
          <li v-for="(note, i) in taglineNotes" :key="i" class="hero__note">
            <LucideIcon name="info" size="0.9rem" />
            <span>{{ note }}</span>
          </li>
        </ul>

        <!-- 行动按钮 -->
        <ul v-if="buttons.length" class="hero__actions reveal" data-delay="640">
          <li v-for="(btn, i) in buttons" :key="i">
            <component
              :is="isExternal(btn.link) ? 'a' : 'RouterLink'"
              v-bind="linkAttrs(btn.link)"
              class="btn magnetic"
              :class="btn.type === 'plain' ? 'btn--plain' : 'btn--solid'"
            >
              <span class="btn__sheen" aria-hidden="true" />
              <LucideIcon :name="iconForButton(btn.text)" size="1.05rem" />
              <span class="btn__label">{{ btn.text }}</span>
              <LucideIcon
                v-if="isExternal(btn.link)"
                class="btn__ext"
                name="arrow-up-right"
                size="0.9rem"
              />
            </component>
          </li>
        </ul>

        <!-- 社交 -->
        <ul v-if="socialLinks.length" class="hero__social reveal" data-delay="720">
          <li v-for="(s, i) in socialLinks" :key="i">
            <a
              :href="s.link"
              class="social"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="socialLabel(s.icon)"
            >
              <LucideIcon :name="socialIcon(s.icon)" size="1.05rem" />
            </a>
          </li>
        </ul>
      </div>

      <a class="hero__scroll" href="#features" aria-label="向下浏览">
        <span class="hero__scroll-line" aria-hidden="true" />
        <LucideIcon name="arrow-down" size="1rem" />
      </a>
    </section>

    <!-- ================================================== 跑马灯 ========== -->
    <div v-if="marquee.length" class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="n in 2" :key="n" class="marquee__group">
          <span v-for="(word, i) in marquee" :key="`${n}-${i}`" class="marquee__word">
            {{ word }}
            <LucideIcon class="marquee__dot" name="droplet" size="0.75rem" />
          </span>
        </span>
      </div>
    </div>

    <!-- ================================================== 能力 ============ -->
    <section v-if="features.length" id="features" class="section features">
      <header class="section__head reveal">
        <span class="section__index">01</span>
        <h2 class="section__title">交给它去做</h2>
        <p class="section__sub">添加账号，剩下的都是自动的。</p>
      </header>

      <ul class="bento">
        <li
          v-for="(f, i) in features"
          :key="i"
          class="card glass reveal"
          :data-delay="i * 90"
          @pointermove="onCardMove"
          @pointerleave="onCardLeave"
        >
          <span class="glass-specular" aria-hidden="true" />
          <span class="card__no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="card__icon">
            <LucideIcon :name="iconForFeature(f.title)" size="1.35rem" />
          </span>
          <h3 class="card__title">{{ f.title }}</h3>
          <p v-if="f.details" class="card__desc">{{ f.details }}</p>
        </li>
      </ul>
    </section>

    <!-- ================================================== 三步 ============ -->
    <section class="section steps">
      <header class="section__head reveal">
        <span class="section__index">02</span>
        <h2 class="section__title">三步开始</h2>
        <p class="section__sub">遇到问题先翻文档，几乎都写过了。</p>
      </header>

      <ol class="steps__list">
        <li
          v-for="(s, i) in STEPS"
          :key="i"
          class="step reveal"
          :data-delay="i * 110"
        >
          <span class="step__num" aria-hidden="true">{{ s.num }}</span>
          <div class="step__body">
            <h3 class="step__title">{{ s.title }}</h3>
            <p class="step__desc">{{ s.desc }}</p>
            <RouterLink class="step__link" :to="s.link">
              {{ s.linkText }}
              <LucideIcon name="arrow-right" size="0.9rem" />
            </RouterLink>
          </div>
        </li>
      </ol>
    </section>

    <!-- ================================================== 收尾 ============ -->
    <section class="section cta-wrap">
      <div class="cta glass reveal" @pointermove="onCardMove" @pointerleave="onCardLeave">
        <span class="glass-specular" aria-hidden="true" />
        <div class="cta__text">
          <h2 class="cta__title">现在就让它替你上号</h2>
          <p class="cta__sub">下载后按文档配置一次，之后开着就行。</p>
        </div>
        <div class="cta__actions">
          <RouterLink class="btn btn--solid magnetic" to="/docs/guide/download.html">
            <span class="btn__sheen" aria-hidden="true" />
            <LucideIcon name="download" size="1.05rem" />
            <span class="btn__label">立即下载</span>
          </RouterLink>
          <RouterLink class="btn btn--plain magnetic" to="/docs/guide/">
            <span class="btn__sheen" aria-hidden="true" />
            <LucideIcon name="book-open" size="1.05rem" />
            <span class="btn__label">新手入门</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ================================================== 页脚 ============ -->
    <footer class="foot">
      <div class="foot__inner">
        <span class="foot__brand">
          <LucideIcon name="droplet" size="0.95rem" />
          {{ title }}
        </span>
        <span class="foot__copy">© {{ yearRange }} {{ author }}</span>
        <a
          v-if="record"
          class="foot__link"
          :href="recordLink"
          target="_blank"
          rel="noopener noreferrer"
          >{{ record }}</a
        >
        <a
          v-for="(s, i) in socialLinks"
          :key="i"
          class="foot__link"
          :href="s.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LucideIcon :name="socialIcon(s.icon)" size="0.95rem" />
          {{ socialLabel(s.icon) }}
        </a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
/**
 * HomeRain — 首页
 *
 * 完全接管 reco 的 Home 模块，内容仍然全部来自 README.md 的 frontmatter，
 * 因此改文案不需要动代码。视觉上按「站在窗内看雨」组织：
 * 巨型背景字 + 竖排轨道做纵深，玻璃面板承载正文，磁吸按钮与镜面光斑做微交互。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'

import LucideIcon from './LucideIcon.vue'

interface ButtonItem {
  text: string
  link: string
  type?: string
}

interface FeatureItem {
  title: string
  details?: string
}

interface SocialItem {
  icon?: string
  link: string
}

const frontmatter = usePageFrontmatter<Record<string, any>>()
const rootEl = ref<HTMLElement | null>(null)
const glyphEl = ref<HTMLElement | null>(null)

/* -------------------------------------------------- frontmatter 读取 */

const banner = computed<Record<string, any>>(
  () => frontmatter.value?.bannerBrand || {},
)

const title = computed<string>(() => banner.value.title || '美食桌面版')
const description = computed<string>(() => banner.value.description || '')
const author = computed<string>(() => frontmatter.value?.author || 'Rainy')

const titleChars = computed(() => Array.from(title.value))

/** 超长 tagline 拆成主句 + 若干提示条（原文用双空格分段） */
const taglineParts = computed<string[]>(() => {
  const raw = String(banner.value.tagline || '').trim()
  if (!raw) return []
  return raw
    .split(/\s{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
})

const taglineLead = computed(() => taglineParts.value[0] || '')
const taglineNotes = computed(() => taglineParts.value.slice(1))

const buttons = computed<ButtonItem[]>(() =>
  Array.isArray(banner.value.buttons) ? banner.value.buttons : [],
)

const socialLinks = computed<SocialItem[]>(() =>
  Array.isArray(banner.value.socialLinks) ? banner.value.socialLinks : [],
)

const features = computed<FeatureItem[]>(() =>
  Array.isArray(frontmatter.value?.features) ? frontmatter.value.features : [],
)

const marquee = computed(() => {
  const words = features.value.map((f) => f.title).filter(Boolean)
  return words.length ? words : ['自动化']
})

const footer = computed<Record<string, any>>(
  () => frontmatter.value?.footer || {},
)

const record = computed<string>(() => footer.value.record || '')
const recordLink = computed<string>(
  () => footer.value.recordLink || 'https://beian.miit.gov.cn',
)

/* 当前年份只在客户端补上：写进预渲染 HTML 会在跨年后触发 hydration 不一致 */
const thisYear = ref('')

const yearRange = computed(() => {
  const start = String(footer.value.startYear || '')
  if (!thisYear.value) return start
  return start && start !== thisYear.value ? `${start}–${thisYear.value}` : thisYear.value
})

const STEPS = [
  {
    num: '01',
    title: '装好',
    desc: '先看前置知识和 Flash 安装，再跑主程序，少走一半弯路。',
    link: '/docs/guide/introduce.html',
    linkText: '开始安装',
  },
  {
    num: '02',
    title: '配好',
    desc: '添加账号、设置刷图方案，配置可以整套迁移到新机器。',
    link: '/docs/guide/config.html',
    linkText: '软件配置与迁移',
  },
  {
    num: '03',
    title: '挂上',
    desc: '一键挂机、自动战斗序列、公会任务与签到，全程不用守着。',
    link: '/docs/guide/auto_play.html',
    linkText: '一键挂机',
  },
]

/* ---------------------------------------------------------- 图标匹配 */

function pick(text: string, table: [string[], string][], fallback: string) {
  const t = String(text || '')
  for (const [keys, icon] of table) {
    if (keys.some((k) => t.includes(k))) return icon
  }
  return fallback
}

function iconForFeature(text: string) {
  return pick(
    text,
    [
      [['战斗', '序列', '悬赏'], 'swords'],
      [['公会'], 'users'],
      [['签到', '日常'], 'calendar-check'],
      [['上号', '切号', '刷图'], 'repeat'],
      [['魔塔'], 'layers'],
    ],
    'zap',
  )
}

function iconForButton(text: string) {
  return pick(
    text,
    [
      [['下载'], 'download'],
      [['入门', '文档', '知识'], 'book-open'],
      [['空间', '群', 'QQ'], 'message-circle'],
      [['VIP'], 'sparkles'],
      [['点券'], 'coins'],
      [['插件'], 'puzzle'],
    ],
    'arrow-right',
  )
}

function socialIcon(icon?: string) {
  return String(icon || '').toLowerCase().includes('github')
    ? 'github'
    : 'external-link'
}

function socialLabel(icon?: string) {
  return socialIcon(icon) === 'github' ? 'GitHub' : '外部链接'
}

/* ------------------------------------------------------------ 链接 */

function isExternal(link: string) {
  return /^(https?:)?\/\//.test(String(link || ''))
}

function linkAttrs(link: string) {
  return isExternal(link)
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link }
}

/* -------------------------------------------------------- 微交互 */

function onCardMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

function onCardLeave(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.removeProperty('--mx')
  el.style.removeProperty('--my')
}

let observer: IntersectionObserver | null = null
let magnets: HTMLElement[] = []
let scrollRaf = 0
let revealTimers: number[] = []

function onMagnetMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18
  const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3
  el.style.transform = `translate(${dx}px, ${dy}px)`
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

function onMagnetLeave(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.transform = ''
}

function onScroll() {
  if (scrollRaf) return
  scrollRaf = window.requestAnimationFrame(() => {
    scrollRaf = 0
    if (!glyphEl.value) return
    const y = window.scrollY || 0
    glyphEl.value.style.transform = `translate3d(0, ${y * -0.12}px, 0)`
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  thisYear.value = String(new Date().getFullYear())

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targets = Array.from(
    rootEl.value?.querySelectorAll<HTMLElement>('.reveal') || [],
  )

  /* 首屏内的元素直接落位。SSR 出来的 HTML 会先画一帧，
     若此时才把它们打回 opacity:0 再淡入，用户会看到「闪一下又消失」 */
  const folded = new Set<HTMLElement>()
  if (!reduced) {
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) folded.add(el)
    })
  }

  /* 标记 JS 就绪后才生效入场样式 —— 脚本挂了也不会白屏 */
  rootEl.value?.classList.add('js-ready')
  folded.forEach((el) => el.classList.add('is-in'))

  const rest = targets.filter((el) => !folded.has(el))

  if (reduced || !('IntersectionObserver' in window)) {
    rest.forEach((el) => el.classList.add('is-in'))
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.delay || 0)
          revealTimers.push(
            window.setTimeout(() => el.classList.add('is-in'), delay),
          )
          observer?.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    )
    rest.forEach((el) => observer?.observe(el))
  }

  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    magnets = Array.from(
      rootEl.value?.querySelectorAll<HTMLElement>('.magnetic') || [],
    )
    magnets.forEach((el) => {
      el.addEventListener('pointermove', onMagnetMove as EventListener)
      el.addEventListener('pointerleave', onMagnetLeave as EventListener)
    })
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  revealTimers.forEach((t) => window.clearTimeout(t))
  revealTimers = []
  magnets.forEach((el) => {
    el.removeEventListener('pointermove', onMagnetMove as EventListener)
    el.removeEventListener('pointerleave', onMagnetLeave as EventListener)
  })
  magnets = []
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', onScroll)
  if (scrollRaf) window.cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
.home-rain {
  --gutter: clamp(1.25rem, 5vw, 5rem);
  --measure: 1240px;
  position: relative;
  width: 100%;
  overflow-x: clip;
}

/* 入场：只有 JS 就绪后才隐藏，避免脚本失败导致空白页 */
.home-rain.js-ready .reveal {
  opacity: 0;
  transform: translateY(22px);
  filter: blur(8px);
  transition: opacity 0.85s var(--ease-out-expo),
    transform 0.85s var(--ease-out-expo), filter 0.85s var(--ease-out-expo);
}

.home-rain.js-ready .reveal.is-in {
  opacity: 1;
  transform: none;
  filter: none;
}

/* ============================================================ 首屏 */

.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  margin-top: -4rem;
  padding: 8rem var(--gutter) 6rem;
}

.hero__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--measure);
  margin: 0 auto;
}

/* 巨型背景字 */
.hero__glyph {
  position: absolute;
  top: 50%;
  right: -0.08em;
  z-index: 0;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(20rem, 46vw, 46rem);
  font-weight: 900;
  line-height: 0.72;
  letter-spacing: -0.06em;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 26%, transparent);
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  translate: 0 -50%;
  will-change: transform;
}

/* 左侧竖排轨道 */
.hero__rail {
  position: absolute;
  left: max(0.9rem, calc(var(--gutter) - 2.4rem));
  top: 50%;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  translate: 0 -50%;
  pointer-events: none;
}

.hero__rail::before {
  content: "";
  width: 1px;
  height: 5.5rem;
  background: linear-gradient(180deg, transparent, var(--accent), transparent);
}

.hero__rail-text {
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.34em;
  white-space: nowrap;
  writing-mode: vertical-rl;
}

/* 眉标 */
.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 1.4rem;
  padding: 0.4rem 0.95rem;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-pill);
  background: color-mix(in srgb, var(--bg-1) 46%, transparent);
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.24em;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hero__eyebrow .sep {
  opacity: 0.45;
}

.pulse {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-2);
  box-shadow: 0 0 10px var(--accent-2);
}

.pulse::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 1px solid var(--accent-2);
  border-radius: 50%;
  opacity: 0.6;
  animation: pulse-ring 2.4s var(--ease-out-expo) infinite;
}

@keyframes pulse-ring {
  0% {
    opacity: 0.65;
    transform: scale(0.6);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1.9);
  }
}

/* 主标题 */
.hero__title {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 1.1rem;
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 1.4rem + 8.6vw, 9rem);
  font-weight: 900;
  line-height: 0.94;
  letter-spacing: -0.055em;
}

.hero__char {
  display: inline-block;
  color: var(--ink-1);
}

/* 渐变走竖直方向：每个字各自成框也能拼成一条连续的色阶。
   不支持 background-clip: text 的引擎退回纯色，避免标题整个消失 */
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .hero__char {
    color: transparent;
    background: linear-gradient(
      180deg,
      var(--ink-1) 0%,
      var(--accent-2) 74%,
      var(--accent) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero__desc {
  max-width: 40ch;
  margin: 0 0 1.6rem;
  color: var(--ink-1);
  font-size: clamp(1.05rem, 0.85rem + 0.9vw, 1.65rem);
  font-weight: 300;
  line-height: 1.45;
  letter-spacing: 0.005em;
}

/* 主文案 */
.hero__lead {
  position: relative;
  display: flex;
  gap: 1rem;
  max-width: 62ch;
  margin: 0 0 1.1rem;
}

.hero__lead-bar {
  flex: none;
  width: 2px;
  border-radius: var(--r-pill);
  background: linear-gradient(180deg, var(--accent), transparent);
}

.hero__lead p {
  margin: 0;
  color: var(--ink-2);
  font-size: 0.98rem;
  line-height: 1.8;
}

/* 提示条 */
.hero__notes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 68ch;
  margin: 0 0 2rem;
  padding: 0;
  list-style: none;
}

.hero__note {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.42rem 0.8rem;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-pill);
  background: color-mix(in srgb, var(--bg-1) 42%, transparent);
  color: var(--ink-3);
  font-size: 0.78rem;
  line-height: 1.5;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.hero__note :deep(svg) {
  margin-top: 0.2rem;
  color: var(--accent);
}

/* ============================================================ 按钮 */

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin: 0 0 1.6rem;
  padding: 0;
  list-style: none;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--r-pill);
  font-size: 0.92rem;
  font-weight: 650;
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.28s var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo),
    box-shadow var(--dur-fast) var(--ease-out-expo),
    background var(--dur-fast) var(--ease-out-expo);
}

.btn--solid {
  background: linear-gradient(132deg, var(--accent), var(--accent-2));
  color: var(--accent-ink);
  box-shadow: 0 14px 34px -14px var(--glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.34);
}

.btn--solid:hover {
  box-shadow: 0 20px 46px -14px var(--glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.btn--plain {
  border-color: var(--glass-line);
  background-image: var(--glass-fill);
  background-color: color-mix(in srgb, var(--bg-1) 44%, transparent);
  color: var(--ink-1);
  box-shadow: var(--glass-rim);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
}

.btn--plain:hover {
  border-color: color-mix(in srgb, var(--accent) 58%, transparent);
  background-color: color-mix(in srgb, var(--accent) 14%, transparent);
}

/* 掠过的一道镜面反光 */
.btn__sheen {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    140px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.32),
    transparent 60%
  );
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.btn:hover .btn__sheen {
  opacity: 1;
}

.btn__ext {
  opacity: 0.7;
}

/* 社交 */
.hero__social {
  display: flex;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid var(--glass-line);
  border-radius: 50%;
  background: color-mix(in srgb, var(--bg-1) 42%, transparent);
  color: var(--ink-2);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition: transform var(--dur-fast) var(--ease-spring),
    border-color var(--dur-fast) var(--ease-out-expo),
    color var(--dur-fast) var(--ease-out-expo);
}

.social:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--accent) 58%, transparent);
  color: var(--ink-1);
}

/* 滚动提示 */
.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 1.8rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  color: var(--ink-3);
  translate: -50% 0;
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.hero__scroll:hover {
  color: var(--accent-2);
}

.hero__scroll-line {
  width: 1px;
  height: 2.6rem;
  background: linear-gradient(180deg, transparent, var(--accent));
  animation: drip 2.6s var(--ease-in-out-quint) infinite;
  transform-origin: top;
}

@keyframes drip {
  0%,
  100% {
    opacity: 0.35;
    transform: scaleY(0.5);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* ========================================================== 跑马灯 */

.marquee {
  position: relative;
  padding: 1.1rem 0;
  border-top: 1px solid var(--glass-line);
  border-bottom: 1px solid var(--glass-line);
  background: color-mix(in srgb, var(--bg-1) 32%, transparent);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: slide 34s linear infinite;
}

.marquee__group {
  display: flex;
  align-items: center;
}

.marquee__word {
  display: inline-flex;
  align-items: center;
  gap: 1.6rem;
  padding-right: 1.6rem;
  color: var(--ink-3);
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 0.9rem + 1vw, 1.9rem);
  font-weight: 750;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.marquee__dot {
  color: var(--accent);
}

@keyframes slide {
  to {
    transform: translateX(-50%);
  }
}

/* ============================================================ 区块 */

.section {
  max-width: var(--measure);
  margin: 0 auto;
  padding: clamp(4rem, 9vw, 8rem) var(--gutter);
}

.section__head {
  max-width: 46ch;
  margin-bottom: clamp(2rem, 4vw, 3.4rem);
}

.section__index {
  display: block;
  margin-bottom: 0.7rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.3em;
}

.section__title {
  margin: 0 0 0.6rem;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 1.2rem + 2.6vw, 3.4rem);
  font-weight: 850;
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: var(--ink-1);
}

.section__sub {
  margin: 0;
  color: var(--ink-3);
  font-size: 1rem;
  line-height: 1.7;
}

/* ---- 能力卡片 ---- */
.bento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.7rem 1.5rem 1.8rem;
  overflow: hidden;
  transition: transform var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo);
}

.card:hover {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--accent) 44%, transparent);
}

/* 第一张卡在宽屏跨两列，打破均分节奏 */
.bento > .card:first-child {
  grid-column: span 2;
}

.card__no {
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  opacity: 0.6;
}

.card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  margin-bottom: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent-2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  color: var(--ink-1);
}

.card__desc {
  margin: 0;
  color: var(--ink-3);
  font-size: 0.9rem;
  line-height: 1.65;
}

/* ---- 三步 ---- */
.steps__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(1.4rem, 3vw, 2.6rem);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.step {
  position: relative;
  padding-top: 1.6rem;
  border-top: 1px solid var(--glass-line);
}

.step__num {
  display: block;
  margin-bottom: 0.7rem;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 1.6rem + 3vw, 4.4rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.06em;
  -webkit-text-stroke: 1.4px color-mix(in srgb, var(--accent) 60%, transparent);
}

.step__title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-1);
}

.step__desc {
  margin: 0 0 0.9rem;
  color: var(--ink-3);
  font-size: 0.92rem;
  line-height: 1.7;
}

.step__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent-2);
  font-size: 0.88rem;
  font-weight: 650;
  text-decoration: none;
}

.step__link :deep(svg) {
  transition: transform var(--dur-fast) var(--ease-out-expo);
}

.step__link:hover :deep(svg) {
  transform: translateX(3px);
}

/* ---- 收尾 ---- */
.cta-wrap {
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.cta {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: clamp(2rem, 4vw, 3.4rem);
  overflow: hidden;
}

.cta__title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.1rem + 1.8vw, 2.4rem);
  font-weight: 850;
  letter-spacing: -0.035em;
  color: var(--ink-1);
}

.cta__sub {
  margin: 0;
  color: var(--ink-3);
  font-size: 0.95rem;
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

/* ---- 页脚 ---- */
.foot {
  border-top: 1px solid var(--glass-line);
  background: color-mix(in srgb, var(--bg-0) 34%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.foot__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.4rem;
  max-width: var(--measure);
  margin: 0 auto;
  padding: 1.6rem var(--gutter);
  color: var(--ink-3);
  font-size: 0.82rem;
}

.foot__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--ink-2);
  font-weight: 650;
}

.foot__brand :deep(svg) {
  color: var(--accent);
}

.foot__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--ink-3);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.foot__link:hover {
  color: var(--accent-2);
}

.foot__copy {
  margin-right: auto;
}

/* ======================================================== 响应式 */

@media (max-width: 900px) {
  .bento > .card:first-child {
    grid-column: span 1;
  }

  .hero__rail {
    display: none;
  }

  .hero__glyph {
    opacity: 0.32;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: 7rem;
    padding-bottom: 5rem;
  }

  .hero__title {
    line-height: 1;
  }

  .btn {
    padding: 0.66rem 1.05rem;
    font-size: 0.86rem;
  }

  .foot__copy {
    margin-right: 0;
  }
}
</style>
