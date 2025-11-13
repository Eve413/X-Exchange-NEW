<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">账户安全</text>
    </view>

    <!-- 内容区 -->
    <view class="content">
      <text class="title">双重验证 (2FA)</text>
      <view class="subtitle">
        为保障账户安全，请至少启用两种双重身份的验证形式。
      </view>

      <!-- 验证选项 -->
      <view class="option" v-for="(item, i) in options" :key="i" @click="goToNextPage(item)">
        <view class="option-left">
          <image class="icon" :src="item.icon" mode="aspectFit" />
          <text class="label">{{ item.label }}</text>
        </view>

        <view v-if="item.active" class="check-circle">
          <view class="dot"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const options = ref([
  {
    label: '邮箱',
    icon: '/static/icons/user.png',
    page: '/pages/changeemail/index',
    active: true
  },
  {
    label: '登陆密码',
    page: '/pages/changepassword/index',
    icon: '/static/icons/lock.png',
    active: false
  },
  {
    label: '支付PIN码',
    page: '/pages/setpincode/index',
    icon: '/static/icons/lock.png',
    active: false
  },
  {
    label: '手机号',
    page: '/pages/phoneverify/index',
    icon: '/static/icons/user.png',
    active: false
  }
])

function goBack() {
  uni.navigateBack()
}

function goToNextPage(item) {
  console.log(item, '>>>>>>>>>>>')
  uni.navigateTo({
    url: item.page,
    success: () => console.log('✅ Navigated'),
    fail: (err) => console.error('❌ Navigation failed:', err)
  })
}
</script>

<style scoped>
.page {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  padding-top: 40rpx;
  box-sizing: content-box;
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.05); */
}

.back-btn {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 22px;
  height: 22px;
}

.header-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 40px;
  /* agar tetap center */
}

/* 内容区 */
.content {
  padding: 20px 16px;
  flex: 1;
}

.title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* 选项卡 */
.option {
  background-color: #2A2A2A;
  border-radius: 10px;
  padding: 14px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.option-left {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.label {
  font-size: 14px;
}

/* 勾选圆圈 */
.check-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #4e8cff;
  border-radius: 50%;
}
</style>
