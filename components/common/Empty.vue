<template>
  <view class="empty-container">
    <image 
      :src="icon || defaultIcon" 
      class="empty-icon"
      mode="aspectFit"
    />
    <text class="empty-text">{{ text || '暂无数据' }}</text>
    <text v-if="description" class="empty-description">{{ description }}</text>
    <button v-if="buttonText" class="empty-button" @click="handleClick">
      {{ buttonText }}
    </button>
  </view>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text?: string
  description?: string
  buttonText?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const defaultIcon = '/static/images/empty.png'

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100upx $uni-spacing-base;
  text-align: center;
  
  .empty-icon {
    width: 200upx;
    height: 200upx;
    margin-bottom: $uni-spacing-xl;
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: $uni-font-size-lg;
    color: $uni-text-color-secondary;
    margin-bottom: $uni-spacing-sm;
  }
  
  .empty-description {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
    margin-bottom: $uni-spacing-xl;
    line-height: 1.5;
  }
  
  .empty-button {
    background: $uni-color-primary;
    color: #fff;
    border: none;
    border-radius: $uni-border-radius-base;
    padding: $uni-spacing-base $uni-spacing-xl;
    font-size: $uni-font-size-base;
  }
}
</style>
