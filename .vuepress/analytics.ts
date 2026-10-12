import { withBase } from 'vuepress/client'

// 快照来源：https://umami.rainysnow.com/script.js（2026-10-13）。
// 更新 Umami 后重新同步脚本，并更新文件名中的 SHA-256 前缀以刷新缓存。
export function scheduleAnalytics() {
  const load = () => {
    // 延后插入，统计资源即使失败或长时间无响应也不参与页面 load。
    window.setTimeout(() => {
      const script = document.createElement('script')
      script.async = true
      script.src = withBase('/analytics/umami.1ad1145d.js')
      script.dataset.websiteId = '4a8a1af4-c021-45e3-8a33-8b798e1d362f'
      // 静态托管只迁移脚本；数据仍需上报到 Umami 服务。
      script.dataset.hostUrl = 'https://umami.rainysnow.com'
      script.onerror = () => script.remove()
      document.head.appendChild(script)
    }, 0)
  }

  if (document.readyState === 'complete') {
    load()
  } else {
    window.addEventListener('load', load, { once: true })
  }
}
