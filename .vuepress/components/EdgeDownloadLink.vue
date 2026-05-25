<template>
  <span class="edge-download-link">
    <a
      :href="href"
      class="edge-download-link__anchor"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClick"
    >
      <slot>{{ text }}</slot>
    </a>
  </span>

  <div v-if="visible" class="edge-download-link__overlay" @click.self="noop">
    <div
      class="edge-download-link__modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edge-download-title"
    >
      <h3 id="edge-download-title">下载遇到问题?</h3>
      <p class="edge-download-link__desc">检测到你正在使用<strong> Edge 浏览器</strong>，下载软件后, 请按下面操作处理下载拦截问题。</p>

      <table class="edge-download-link__table">
        <tr>
          <td>
            <img :src="downloadImage" alt="下载提示" />
            <p class="edge-download-link__highlight"><strong>1.右键展开点保留</strong></p>
          </td>
          <td>
            <img :src="keepImage" alt="保留按钮" />
            <p class="edge-download-link__highlight"><strong>2.点击此按钮, 点保留</strong></p>
          </td>
        </tr>
      </table>
      <p> 此弹窗是作者实在忍受不了后才做的, 如造成不便敬请谅解</p>
      <p> 请原谅我这么啰嗦，如果我不做弹窗，那么真的会有人在<strong>答案不管贴在下载的上面还是下面</strong>的情况下，愣是<strong>没看到</strong>，然后去群里问<strong>为什么无法下载</strong></p>
      <p> <del>请原谅我这么啰嗦，如果我把下载放在最上面，那么真的会有人在<strong>答案就贴在下载的下面</strong>的情况下，告诉我<strong>没看到</strong>，然后去群里问<strong>为什么无法下载</strong></del></p>
      <div class="edge-download-link__actions">
        <button type="button" class="edge-download-link__secondary edge-download-link__button" @click="closeModal">
          关闭
        </button>
        <button
          type="button"
          class="edge-download-link__primary edge-download-link__button"
          :disabled="countdown > 0"
          @click="openAfterConfirm"
        >
          {{ countdown > 0 ? `${countdown} 秒后可点击立即下载` : closeText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { withBase } from '@vuepress/client'

const props = withDefaults(
  defineProps<{
    href: string
    text?: string
    closeText?: string
    downloadImg?: string
    keepImg?: string
  }>(),
  {
    text: '点我下载桌面版',
    closeText: '我知道了, 立即下载',
    downloadImg: '/docs/guide/img/qa_download.png',
    keepImg: '/docs/guide/img/qa_keep.png',
  },
)

const visible = ref(false)
const countdown = ref(3)
let timer: ReturnType<typeof setInterval> | null = null
let unlockAt = 0

const downloadImage = computed(() => withBase(props.downloadImg))
const keepImage = computed(() => withBase(props.keepImg))

const isEdgeBrowser = () => {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent
  return ua.includes('Edg/')
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const startCountdown = () => {
  clearTimer()
  countdown.value = 5
  unlockAt = Date.now() + 5000
  timer = setInterval(() => {
    const remainMs = Math.max(0, unlockAt - Date.now())
    const remainSeconds = Math.ceil(remainMs / 1000)

    countdown.value = remainSeconds

    if (remainSeconds <= 0) {
      countdown.value = 0
      clearTimer()
      return
    }
  }, 250)
}

const openTarget = () => {
  if (typeof window === 'undefined') {
    return
  }
  window.open(props.href, '_blank', 'noopener,noreferrer')
}

const handleClick = (event: MouseEvent) => {
  if (!isEdgeBrowser()) {
    return
  }

  event.preventDefault()
  visible.value = true
  startCountdown()
}

const openAfterConfirm = () => {
  if (Date.now() < unlockAt) {
    return
  }

  clearTimer()
  openTarget()
}

const closeModal = () => {
  visible.value = false
  clearTimer()
  unlockAt = 0
}

const noop = () => {}

onBeforeUnmount(() => {
  clearTimer()
  unlockAt = 0
})
</script>

<style scoped>
.edge-download-link__anchor {
  color: #0066cc;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.edge-download-link__anchor:visited {
  color: #551a8b;
}

.edge-download-link__anchor:hover {
  color: #004ea3;
}

.edge-download-link__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
}

.edge-download-link__modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 24px;
  border-radius: 16px;
  background: #fff;
  color: #222;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.edge-download-link__desc {
  margin: 12px 0 8px;
}

.edge-download-link__highlight {
  margin: 0 0 16px;
  font-size: 18px;
}

.edge-download-link__table {
  width: 100%;
  border-collapse: collapse;
}

.edge-download-link__table td {
  width: 50%;
  padding: 8px;
  text-align: center;
  vertical-align: top;
}

.edge-download-link__table img {
  max-width: 100%;
  height: auto;
}

.edge-download-link__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.edge-download-link__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  padding: 10px 18px;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  box-sizing: border-box;
}

.edge-download-link__primary {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

.edge-download-link__secondary {
  background: #e5e7eb;
  color: #222;
  border-color: #d1d5db;
}

.edge-download-link__primary:hover:not(:disabled) {
  background: #1e40af;
  border-color: #1e40af;
}

.edge-download-link__primary:disabled {
  background: #d1d5db;
  color: #374151;
  border-color: #cbd5e1;
  opacity: 1;
  cursor: not-allowed;
}
</style>
