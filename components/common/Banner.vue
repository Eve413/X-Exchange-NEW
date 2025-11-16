<template>
  <view class="banner">
    <scroll-view 
      class="banner-scroll" 
      scroll-x 
      :show-scrollbar="false"
      :enable-flex="true"
    >
      <view class="banner-container">
        <view 
          v-for="(banner, index) in banners" 
          :key="index"
          class="card-banner"
          @tap="handleBannerClick(banner)"
        >
          <image 
            v-if="banner.banner_url" 
            class="banner-image" 
            :src="banner.banner_url" 
            mode="aspectFill"
          />
          <view 
            v-else 
            class="banner-content"
          >
            <text class="card-banner-title">{{ banner.title }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
interface BannerItem {
  id: number | string
  title?: string
  banner_url?: string
}

interface Props {
  banners: BannerItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [banner: BannerItem]
}>()

const handleBannerClick = (banner: BannerItem) => {
  emit('click', banner)
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.banner-scroll {
  width: 100%;
  height: 240rpx;
}

.banner-container {
  display: flex;
  flex-direction: row;
  padding: 0 5rpx;
  height: 100%;
}

.card-banner {
  flex-shrink: 0;
  width: 560rpx;
  height: 220rpx;
  border-radius: 24rpx;
  margin-right: 24rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
  
  &:last-child {
    margin-right: 0;
  }
}

.banner-image {
  width: 100%;
  height: 100%;
  display: block;
}

.banner-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32rpx;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    opacity: 0.5;
  }
}

.card-banner-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.card-banner-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.95);
  z-index: 1;
}
</style>
