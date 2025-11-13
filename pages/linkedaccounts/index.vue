<template>
  <view class="bind-page-dialog">
    <!-- Header -->
    <view class="header-dialog">
      <image
        src="/static/icons/ic_arrow_left.png"
        class="back-icon-dialog"
        @click="goBack"
      />
      <text class="title-dialog">账户绑定</text>
    </view>

    <!-- Account List -->
    <view class="account-list-dialog">
      <view v-for="(item, index) in accounts" :key="index" class="account-item-dialog">
        <view class="account-left-dialog">
          <image :src="item.icon" class="account-icon-dialog" />
          <view class="account-info-dialog">
            <text class="account-name-dialog">{{ item.name }}</text>
            <text class="account-detail-dialog">{{ item.detail }}</text>
          </view>
        </view>

        <view
          class="account-btn-dialog"
          :class="{ unbind: item.isLinked }"
          @click="toggleLink(item)"
        >
          {{ item.isLinked ? '解除关联' : '关联' }}
        </view>
      </view>
    </view>

    <!-- Account Activity -->
    <view class="activity-box-dialog">
      <view class="activity-header-dialog">
        <image src="/static/icons/ic_gift.png" class="activity-icon-dialog" />
        <text>查看账户活动</text>
      </view>
      <text class="activity-desc-dialog">
        点击以下链接，即可查看所有账户活动
      </text>
      <text class="activity-link-dialog" @click="goToMydevice">账户活动</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const accounts = ref([
  {
    name: 'Gmail',
    detail: 'inwei.sun@gmailcom',
    icon: '/static/icons/ic_gmail.png',
    isLinked: true
  },
  {
    name: 'Facebook',
    detail: '未关联',
    icon: '/static/icons/ic_facebook.png',
    isLinked: false
  },
  {
    name: 'WhatsApp',
    detail: '+86 182****8273',
    icon: '/static/icons/ic_whatsapp.png',
    isLinked: true
  },
  {
    name: 'Apple ID',
    detail: '未关联',
    icon: '/static/icons/ic_apple.png',
    isLinked: false
  }
])

function toggleLink(item) {
  item.isLinked = !item.isLinked
}

function goBack() {
  uni.navigateBack()
}

const goToMydevice= () => {
      // Arahkan ke halaman verifikasi

    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/mydevice/index',
        success: () => console.log('✅ Navigated'),
        fail: (err) => console.error('❌ Navigation failed:', err)
      })
    }, 500)
     
    }


</script>

<style scoped>
.bind-page-dialog {
  background-color: #202020;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100rpx;
  background-color: #202020;
  padding-top: 40rpx;
  /* border-bottom: 1rpx solid #2a2a2a; */
}
.back-icon-dialog {
  position: absolute;
  left: 24rpx;
  width: 40rpx;
  height: 40rpx;
}
.title-dialog {
  font-size: 34rpx;
  font-weight: bold;
}

/* Account List */
.account-list-dialog {
  padding: 24rpx;
}
.account-item-dialog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2A2A2A;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}
.account-left-dialog {
  display: flex;
  align-items: center;
}
.account-icon-dialog {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.account-info-dialog {
  display: flex;
  flex-direction: column;
}
.account-name-dialog {
  font-size: 30rpx;
  color: #fff;
}
.account-detail-dialog {
  font-size: 26rpx;
  color: #a6a8ad;
}

/* Gradient Button */
.account-btn-dialog {
  background: linear-gradient(90deg, #9c4df4, #ff4d6d);
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #fff;
}
.account-btn-dialog.unbind {
  background: linear-gradient(90deg, #555, #777);
}

/* Activity Box */
.activity-box-dialog {
  background-color: #2A2A2A;
  border-radius: 16rpx;
  margin: 40rpx 24rpx;
  padding: 24rpx;
}
.activity-header-dialog {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 30rpx;
  color: #fff;
  margin-bottom: 10rpx;
}
.activity-icon-dialog {
  width: 34rpx;
  height: 34rpx;
}
.activity-desc-dialog {
  color: #a6a8ad;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}
.activity-link-dialog {
  color: #7c6aff;
  font-size: 28rpx;
}
</style>
