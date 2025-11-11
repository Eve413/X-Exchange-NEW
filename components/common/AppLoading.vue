<template>
  <view class="app-loading" v-if="visible">
    <view class="app-loading__mask" @tap.stop></view>
    <view class="app-loading__content">
      <view class="app-loading__spinner">
        <view class="spinner-item" v-for="i in 12" :key="i"></view>
      </view>
      <text class="app-loading__text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  text: '加载中...'
})
</script>

<style lang="scss" scoped>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 12upx;
    padding: 40upx;
    min-width: 200upx;
  }

  &__spinner {
    position: relative;
    width: 60upx;
    height: 60upx;
    margin-bottom: 20upx;

    .spinner-item {
      position: absolute;
      width: 4upx;
      height: 16upx;
      background-color: #ffffff;
      border-radius: 2upx;
      animation: spinner-fade 1.2s infinite ease-in-out;
      transform-origin: 50% 100%;

      @for $i from 1 through 12 {
        &:nth-child(#{$i}) {
          transform: rotate(#{($i - 1) * 30deg}) translate(0, -26upx);
          animation-delay: #{($i - 1) * 0.1s};
        }
      }
    }
  }

  &__text {
    color: #ffffff;
    font-size: 28upx;
    text-align: center;
  }
}

@keyframes spinner-fade {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}</style> 