<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">修改密码</text>
    </view>

    <!-- 内容 -->
    <view class="content">
      <!-- 新密码 -->
      <view class="input-row">
        <input
          v-model="newPassword"
          :password="!showNewPassword"
          placeholder="新密码"
          placeholder-class="placeholder"
          class="input"
        />
        <image
          class="eye-icon"
          :src="showNewPassword ? '/static/icons/ic_eye_open.png' : '/static/icons/ic_eye_close.png'"
          @click="showNewPassword = !showNewPassword"
          mode="aspectFit"
        />
      </view>

      <!-- 提示 -->
      <view class="rules">
        <text>• 8-128 个字符</text>
        <text>• 至少 1 个数字</text>
        <text>• 至少 1 个大写字母</text>
      </view>

      <!-- 确认密码 -->
      <view class="input-row">
        <input
          v-model="confirmPassword"
          :password="!showConfirmPassword"
          placeholder="请确认密码"
          placeholder-class="placeholder"
          class="input"
        />
        <image
          class="eye-icon"
          :src="showConfirmPassword ? '/static/icons/ic_eye_open.png' : '/static/icons/ic_eye_close.png'"
          @click="showConfirmPassword = !showConfirmPassword"
          mode="aspectFit"
        />
      </view>

      <!-- 确认按钮 -->
      <view class="btn-confirm" @click="confirmChange">
        确认修改
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

function goBack() {
  uni.navigateBack()
}

function confirmChange() {
  if (!newPassword.value || !confirmPassword.value) {
    return uni.showToast({ title: '请输入密码', icon: 'none' })
  }
  if (newPassword.value !== confirmPassword.value) {
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  }
  if (newPassword.value.length < 8) {
    return uni.showToast({ title: '密码太短', icon: 'none' })
  }
  uni.showToast({ title: '密码修改成功', icon: 'none' })
}
</script>

<style scoped>
.page {
  background-color: #111;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
}

/* 内容 */
.content {
  padding: 20px 16px;
  flex: 1;
}
.input-row {
  display: flex;
  align-items: center;
  background-color: #1c1c1e;
  border-radius: 10px;
  padding: 0 10px;
  height: 44px;
  margin-bottom: 20px;
}
.input {
  flex: 1;
  color: #fff;
  font-size: 14px;
}
.placeholder {
  color: #777;
}
.eye-icon {
  width: 20px;
  height: 20px;
  margin-left: 8px;
}

/* 密码规则提示 */
.rules {
  color: #aaa;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 20px;
  line-height: 22px;
  display: flex;
  flex-direction: column;
}

/* 确认按钮 */
.btn-confirm {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  text-align: center;
  line-height: 44px;
  font-size: 15px;
  color: #fff;
  background: linear-gradient(90deg, #9b5cff, #ff5fa2);
}
</style>
