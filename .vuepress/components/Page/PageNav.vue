<template>
  <nav v-if="prevNavLink || nextNavLink" class="page-nav">
    <p class="inner" :class="{ hasPrev: !!prevNavLink, hasNext: !!nextNavLink }">
      <span
        v-if="prevNavLink"
        class="page-nav-item nav-link prev"
        role="link"
        tabindex="0"
        @click="go(prevNavLink.link)"
        @keydown.enter="go(prevNavLink.link)"
      >
        <LucideIcon name="arrow-left" size="1rem" />
        <span class="nav-link__label">{{ prevNavLink.text }}</span>
      </span>

      <span
        v-if="nextNavLink"
        class="page-nav-item nav-link next"
        role="link"
        tabindex="0"
        @click="go(nextNavLink.link)"
        @keydown.enter="go(nextNavLink.link)"
      >
        <span class="nav-link__label">{{ nextNavLink.text }}</span>
        <LucideIcon name="arrow-right" size="1rem" />
      </span>
    </p>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vuepress/client'
import { isPlainObject, isString } from 'vuepress/shared'

import LucideIcon from '../LucideIcon.vue'

import { getNavLink, useSeriesItems, usePageFrontmatter } from '@composables/index.js'

import type { MenuLink, ResolvedSeriesItem } from '../../../node_modules/vuepress-theme-reco/lib/client/types/index.js'

const resolveFromFrontmatterConfig = (conf: unknown): null | false | MenuLink => {
  if (conf === false) {
    return null
  }

  if (isString(conf)) {
    return getNavLink(conf)
  }

  if (isPlainObject<MenuLink>(conf)) {
    return conf
  }

  return false
}

const resolveFromSeriesItems = (
  seriesItems: ResolvedSeriesItem[],
  currentPath: string,
  offset: number
): null | MenuLink => {
  const index = seriesItems.findIndex((item) => item.link === currentPath)
  if (index !== -1) {
    const targetItem = seriesItems[index + offset]
    if (!targetItem?.link) {
      return null
    }
    return targetItem as MenuLink
  }

  for (const item of seriesItems) {
    if (item.children) {
      const childResult = resolveFromSeriesItems(
        item.children,
        currentPath,
        offset
      )
      if (childResult) {
        return childResult
      }
    }
  }

  return null
}


const route = useRoute()
const router = useRouter()
const seriesItems = useSeriesItems()
const frontmatter = usePageFrontmatter()

const prevNavLink = computed(() => {
  const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev)
  if (prevConfig !== false) {
    return prevConfig
  }

  return resolveFromSeriesItems(seriesItems.value, route.path, -1)
})

const nextNavLink = computed(() => {
  const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next)
  if (nextConfig !== false) {
    return nextConfig
  }

  return resolveFromSeriesItems(seriesItems.value, route.path, 1)
})

const go = (link) => {
  router.push(link)
}
</script>

<style scoped>
.page-nav :deep(.inner) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.page-nav :deep(.inner .next) {
  margin-left: auto;
}

.nav-link {
  cursor: pointer;
  max-width: 46%;
}

.nav-link__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .nav-link {
    max-width: 100%;
  }
}
</style>