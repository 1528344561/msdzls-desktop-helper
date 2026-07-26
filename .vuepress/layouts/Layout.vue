<template>
  <GenericContainer :width-style="isHome ? 'full' : 'max-width'">
    <HomeRain v-if="isHome" />

    <Transition
      v-else
      name="fade-slide-y"
      mode="out-in"
      @before-enter="onBeforeEnter"
      @before-leave="onBeforeLeave"
    >
      <Page :key="page.path" />
    </Transition>
  </GenericContainer>
</template>

<script lang="ts" setup>
/* 雨幕与配色控制台注册在 client.ts 的 rootComponents 里，
   这样主题自带的 404 / 分类 / 标签布局也能共用同一套背景 */
import { computed, onMounted, watch } from 'vue'
import { usePageFrontmatter, useRoute } from 'vuepress/client'

import GenericContainer from '@components/GenericContainer/index.vue'
import Page from '../components/Page/index.vue'
import HomeRain from '../components/HomeRain.vue'

import {
  usePageData,
  useMagicCard,
  useScrollPromise,
} from '@composables/index.js'

const page = usePageData()
const frontmatter = usePageFrontmatter()

const isHome = computed(() => frontmatter.value.home === true)

const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending

const { initMagicCard } = useMagicCard()
onMounted(() => {
  initMagicCard()
})

const route = useRoute()
watch(route, () => {
  initMagicCard()
})
</script>
