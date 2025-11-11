<template>
  <!-- 顶部状态栏安全区占位，与 pages/market/index.vue 保持一致 -->
  <view class="status-bar-spacer" :style="getTopStyle(extraPadding || 0)"></view>
</template>

<script setup lang="ts">
import { useSafeArea } from "@/utils/composables/useSafeArea";

const props = defineProps<{ extraPadding?: number }>();
const { getTopStyle } = useSafeArea();
</script>

<style scoped lang="scss">
.status-bar-spacer {
  width: 100%;
  /* 作为 CSS 兜底，优先由内联样式设置 paddingTop */
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  background-color: #202020;
  flex-shrink: 0;
}
</style>