<template>
  <RainCanvas :context="isHome ? 'home' : 'doc'" />

  <ClientOnly>
    <PaletteSwitcher />
  </ClientOnly>
</template>

<script lang="ts" setup>
/**
 * RainRoot — 雨幕与配色控制台的挂载点
 *
 * 注册为 rootComponent 而不是塞进 Layout：这样 404、分类、标签这些
 * 主题自带的布局也能拿到同一套雨夜背景，不会突然掉回纯黑底。
 */
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'

import RainCanvas from './RainCanvas.vue'
import PaletteSwitcher from './PaletteSwitcher.vue'

const frontmatter = usePageFrontmatter()
const isHome = computed(() => frontmatter.value.home === true)
</script>
