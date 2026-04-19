import { defineClientConfig } from 'vuepress/client'

const DOCSEARCH_APP_ID = 'PJ9U6DIZSJ'
const DOCSEARCH_API_KEY = '75f85ee4ec6d355a58cd133fa1f12240'
const DOCSEARCH_INDEX_NAME = 'Document Website'

let initialized = false
let retries = 0

function initDocSearch() {
  if (initialized || typeof window === 'undefined') {
    return
  }

  const container = document.querySelector('.search-box')
  const docsearch = (window as typeof window & { docsearch?: (options: Record<string, unknown>) => void }).docsearch

  if (!container || typeof docsearch !== 'function') {
    if (retries < 30) {
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

export default defineClientConfig({
  enhance() {
    if (typeof window === 'undefined') {
      return
    }

    window.setTimeout(() => {
      initDocSearch()
    }, 100)
  },
})