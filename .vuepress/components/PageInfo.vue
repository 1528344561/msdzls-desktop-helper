<template>
  <div v-if="showPageInfo" class="page-info">
    <Xicons v-if="!!author" :icon="IconUser" :text="author" />

    <Xicons
      v-if="lastUpdated"
      :icon="IconCalendar"
      :text="`${themeLocal.lastUpdatedText || 'Last Updated'} ${lastUpdated}`"
    />

    <Xicons v-if="metricsText" :icon="IconEye" :text="metricsText" />

    <Xicons v-if="!!date" :icon="IconCalendar" :text="date" />

    <Xicons v-if="categories.length > 0" :icon="IconFolder">
      <router-link
        v-for="({ label, pathValue }) in categories"
        :to="`/categories/${pathValue}/1.html`"
        :key="pathValue"
      >{{ label }}</router-link>
    </Xicons>

    <Xicons v-if="tags.length > 0" :icon="IconTag">
      <router-link
        v-for="({ label, pathValue }) in tags"
        :to="`/tags/${pathValue}/1.html`"
        :key="pathValue"
      >{{ label }}</router-link>
    </Xicons>

    <Xicons v-if="showValineViews || showWalineViews" :icon="IconEye">
      <ValineViews v-if="showValineViews" :idVal="path" />
      <WalineViews v-if="showWalineViews" :path="path" />
    </Xicons>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { convertToPinyin, removeEmptyString } from '@vuepress-reco/shared'
import { useComment } from '@vuepress-reco/vuepress-plugin-comments/composables'
import { IconUser, IconCalendar, IconFolder, IconTag, IconEye } from '@components/icons/index.js'

import { formatISODate } from '@utils/other'
import { useThemeLocaleData } from '@composables/index.js'

type UmamiMetrics = {
  pageviews: number
  active_visitors: number
}

const UMAMI_METRICS_URL = 'https://helper.rainysnow.com/metrics'

function formatCategory(category: string) {
  return convertToPinyin(removeEmptyString(category))
}

const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
  currentCategory: {
    type: String,
    default: '',
  },
  currentTag: {
    type: String,
    default: '',
  },
  hideViews: {
    type: Boolean,
    default: false,
  },
})
const { pageData, hideViews } = toRefs(props)

const themeLocal = useThemeLocaleData()
const { solution, options } = useComment()
const umamiMetrics = ref<UmamiMetrics | null>(null)
const route = useRoute()

const author = computed(
  () => pageData?.value?.frontmatter?.author || themeLocal.value.author || ''
)

const metricsText = computed(() => {
  if (!umamiMetrics.value) {
    return ''
  }

  const pageviews = umamiMetrics.value.pageviews.toLocaleString()
  const activeVisitors = umamiMetrics.value.active_visitors.toLocaleString()

  return `本页访问 ${pageviews} · 当前在线 ${activeVisitors}`
})

const path = computed(
  () => pageData?.value?.path || '/'
)

const lastUpdated = computed(() => {
  const updatedTime = pageData?.value?.git?.updatedTime

  if (!updatedTime) {
    return ''
  }

  return new Date(updatedTime).toLocaleString()
})

const date = computed(() => {
  const d = pageData?.value?.frontmatter?.date
  return d ? formatISODate(d) : ''
})

const categories = computed(() => {
  return (pageData?.value?.frontmatter?.categories || []).map(category => {
    return {
      label: category,
      pathValue: formatCategory((category))
    }
  })
})

const tags = computed(() => {
  return (pageData?.value?.frontmatter?.tags || []).map(category => {
    return {
      label: category,
      pathValue: formatCategory((category))
    }
  })
})

const showPageInfo = computed(
  () =>
    !!author.value ||
    !!metricsText.value ||
    !!lastUpdated.value ||
    !!date.value ||
    !!(categories.value && categories.value.length > 0) ||
    !!(tags.value && tags.value.length > 0)
)

const fetchMetrics = async () => {
  try {
    const normalizedPath = route.path || '/'
    const response = await fetch(
      `${UMAMI_METRICS_URL}?path=${encodeURIComponent(normalizedPath)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      umamiMetrics.value = null
      return
    }

    const data = await response.json() as UmamiMetrics

    if (
      typeof data?.pageviews === 'number' &&
      typeof data?.active_visitors === 'number'
    ) {
      umamiMetrics.value = data
      return
    }

    umamiMetrics.value = null
  } catch {
    umamiMetrics.value = null
  }
}

watch(
  () => route.path,
  () => {
    void fetchMetrics()
  },
  { immediate: true }
)

const showValineViews = computed(() => {
  return (
    solution.value === 'valine' &&
    options.value.visitor != false &&
    !hideViews.value
  )
})

const showWalineViews = computed(() => {
  return (
    solution.value === 'waline' &&
    options.value.pageview != false &&
    !hideViews.value
  )
})
</script>