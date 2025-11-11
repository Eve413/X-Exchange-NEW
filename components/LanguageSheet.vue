<template>
  <!-- 蒙层放最外层，阻止滚动 & 点击穿透 -->
  <view v-if="open" class="lang-mask" @tap="onMask" @touchmove.stop.prevent>
    <view class="lang-panel" @tap.stop>
      <view class="lang-hd">
        <text class="title">{{ t("lang.chooseTitle") }}</text>
        <text class="close" @tap="emit('close')">✕</text>
      </view>

      <view class="lang-list">
        <view
          v-for="code in localeCodes"
          :key="code"
          class="lang-item"
          @tap="onPick(code)"
        >
          <view class="item-txt">
            <text class="name">{{ t(`lang.names.${code}`) }}</text>
            <text class="sub">{{ t(`lang.subtitles.${code}`) }}</text>
          </view>

          <!-- 当前语言高亮对勾 -->
          <view class="check" v-if="code === current">
            <view class="tick"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { i18nUtils, switchLanguage } from "@/utils/i18n";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "changed", code: string): void;
}>();

const { t, locale } = useI18n();

// 仅存语言代码；显示文本都由 i18n 决定（无硬编码）
// 注意：这里只包含实际支持的语言，必须与 SUPPORTED_LOCALES 保持一致
const localeCodes = ["zh-CN", "zh-TW", "en-US"];
// 使用响应式的 locale，这样语言切换后会自动更新选中状态
const current = computed(() => locale.value);

function onMask() {
  emit("close");
}
function onPick(code: string) {
  if (code !== current.value) {
    // 类型安全：只允许支持的语言代码
    // 由于 localeCodes 已经过滤了不支持的语言，这里应该总是能找到
    if (localeCodes.includes(code)) {
      switchLanguage(code as any);
      emit("changed", code);
    } else {
      // 这种情况理论上不应该发生，但如果发生了，记录警告
      console.warn(
        `不支持的语言代码: ${code}，可用语言: ${localeCodes.join(", ")}`
      );
    }
  }
  emit("close");
}
</script>

<style scoped lang="scss">
.lang-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: flex-end;
  z-index: 9999; /* 关键：遮罩层级 */
}

.lang-panel {
  width: 86%;
  max-width: 720rpx;
  height: 100%;
  background: #2a2a2a;
  color: #fff;
  box-shadow: -8rpx 0 24rpx rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
}

.lang-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.06);
  .title {
    font-size: 36rpx;
    font-weight: 700;
  }
  .close {
    font-size: 40rpx;
    opacity: 0.8;
    padding: 8rpx 12rpx;
  }
}

.lang-list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.lang-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.06);
}
.item-txt {
  .name {
    display: block;
    font-size: 32rpx;
  }
  .sub {
    display: block;
    margin-top: 6rpx;
    font-size: 24rpx;
    color: #9aa4ae;
  }
}
.check {
  width: 42rpx;
  height: 42rpx;
  border-radius: 12rpx;
  background: #6f4bfd;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tick {
  width: 12rpx;
  height: 18rpx;
  border: 4rpx solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(45deg);
  border-radius: 2rpx;
}
</style>
