import { nextTick, onMounted } from 'vue'
import { defineClientConfig } from 'vuepress/client'

const DOCSEARCH_APP_ID = 'PJ9U6DIZSJ'
const DOCSEARCH_API_KEY = '75f85ee4ec6d355a58cd133fa1f12240'
const DOCSEARCH_INDEX_NAME = 'Document Website'
const DOCSEARCH_INIT_RETRY_LIMIT = 100
const HOME_ACTION_BUTTONS_READY_CLASS = 'home-action-buttons-ready'

let initialized = false
let retries = 0

function initDocSearch() {
  if (initialized || typeof window === 'undefined') {
    return
  }

  const container = document.querySelector('.search-box')
  const docsearch = (window as typeof window & { docsearch?: (options: Record<string, unknown>) => void }).docsearch

  if (!container || typeof docsearch !== 'function') {
    if (retries < DOCSEARCH_INIT_RETRY_LIMIT) {
      retries += 1
      window.setTimeout(initDocSearch, 100)
    }
    return
  }

  initialized = true

  try {
    docsearch({
      appId: DOCSEARCH_APP_ID,
      apiKey: DOCSEARCH_API_KEY,
      indexName: DOCSEARCH_INDEX_NAME,
      container: '.search-box',
      debug: false,
    })
  } catch (error) {
    console.log(error)
  }
}

function markHomeActionButtonsReady() {
  if (typeof window === 'undefined') {
    return
  }

  void nextTick(() => {
    const markReady = () => {
      document.documentElement.classList.add(HOME_ACTION_BUTTONS_READY_CLASS)
    }

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(markReady)
      return
    }

    markReady()
  })
}

export default defineClientConfig({
  enhance() {
    if (typeof window === 'undefined') {
      return
    }

    window.setTimeout(() => {
      initDocSearch()
    }, 100)
  },
  setup() {
    onMounted(markHomeActionButtonsReady)
  },
})
