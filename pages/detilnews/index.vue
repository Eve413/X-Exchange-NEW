<template>
  <view class="message-page-dialog">
    <!-- Header (Fixed) -->
    <view class="header-dialog">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon-dialog" @click="goBack" />
      <text class="title-dialog">{{ "" }}</text>
    </view>

    

    <!-- Scrollable Message List -->
    <view class="scroll-container-dialog">
      
      <scroll-view scroll-y class="message-empty-page-dialog">

        <!-- <text class="message-title-dialog" v-html="title"></text>

         <text class="message-body-dialog" v-html="desc"></text> -->
         <rich-text lass="message-title-dialog" :nodes="title"></rich-text>
<rich-text class="message-body-dialog" :nodes="desc"></rich-text>

      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { onLoad } from '@dcloudio/uni-app'
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const title = ref("")
const desc = ref("")

onLoad(async (options) => {
  console.log('options:', options?.desc)
title.value = decodeURIComponent(options?.title || "");
desc.value =  decodeURIComponent(options?.desc || "");

})

function goBack() {
  uni.navigateBack()
}


</script>

<style scoped>
/* Main Container */
.message-page-dialog {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header - Fixed at top */
.header-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  height: 100rpx;
  border-bottom: 1rpx solid #202020;
  background-color: #202020;
  flex-shrink: 0;
  padding-top: 40rpx;
  box-sizing: content-box;
}

.back-icon-dialog {
  position: absolute;
  left: 24rpx;
  width: 40rpx;
  height: 36rpx;
}

.title-dialog {
  font-size: 34rpx;
  font-weight: bold;
}

/* Tabs - Fixed below header */
.tabs-dialog {
  display: flex;
  justify-content: space-around;
  position: sticky;
  top: 120rpx; /* Height of header + padding */
  z-index: 10;
  background-color: #202020;
  padding: 20rpx 0;
  flex-shrink: 0;
  overflow: hidden;
}

.tab-item-dialog {
  color: #aaa;
  font-size: 28rpx;
  text-align: center;
}

.tab-item-dialog.active {
  color: #fff;
  font-weight: 600;
  padding-bottom: 6rpx;
}

/* Divider */
.divider-dialog {
  height: 1rpx;
  background-color: #2a2a2a;
  flex-shrink: 0;
}

/* Scroll Container - Takes remaining space */
.scroll-container-dialog {
  flex: 1;
  overflow: hidden;
  background-color: #202020;
}

/* Message List - Scrollable */
.message-list-dialog {
  height: 100%;
  padding:0 24rpx 0rpx;
  background-color: #202020;
}

/* Message Card */
.message-card-dialog {
  display: flex;
  flex-direction: row;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.icon-box-dialog {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-dialog {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}

.message-content-dialog {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-title-dialog {
 
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10rpx;
}

.message-body-dialog {
  color: #A0A6B9;
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;        /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30rpx;
   margin-top: 18rpx;
}

.message-time-dialog {
  color: #A0A6B9;
  font-size: 22rpx;
}

/* Empty State - Scrollable */
.message-empty-page-dialog {
  height: 100%;
  background-color: #202020;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
}

/* Container tengah */
.empty-container-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 400rpx;
}

/* Gambar lonceng besar */
.empty-icon-dialog {
  width: 460rpx;
  height: 460rpx;
  margin-bottom: 30rpx;
  opacity: 0.95;
}

/* Teks "暂无消息" */
.empty-text-dialog {
  color: #a6a8ad;
  font-size: 28rpx;
  text-align: center;
}
</style>
