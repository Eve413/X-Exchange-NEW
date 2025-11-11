<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">设置PIN码</text>
    </view>

    <!-- 内容 -->
    <view class="content">
      <view class="pin-label">
        <text>创建支付PIN码</text>
        <image
          class="eye-icon"
          :src="showPin ? '/static/icons/ic_eye_open.png' : '/static/icons/ic_eye_close.png'"
          @click="toggleShowPin"
          mode="aspectFit"
        />
      </view>

      <!-- PIN输入框 -->
      <view class="code-box">
        <input
          v-for="(v, i) in 6"
          :key="i"
          type="number"
          maxlength="1"
          class="code-input"
          v-model="pin[i]"
          :password="!showPin"
          :focus="focusIndex === i"
          @input="handleInput($event, i)"
          @focus="focusIndex = i"
        />
      </view>

      <!-- 提示文字 -->
      <text class="hint">
        密码不能过于简单(如 123456、987654)，同一个数字不能出现 2 次以上。
      </text>

      <!-- 确认按钮 -->
      <view class="btn-confirm" @click="confirmPin">
        确认
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const pin = ref(['', '', '', '', '', ''])
const focusIndex = ref(0)
const showPin = ref(false)

function goBack() {
  uni.navigateBack()
}

function toggleShowPin() {
  showPin.value = !showPin.value
}

function handleInput(e, i) {
  const val = e.detail.value.slice(-1)
  pin.value[i] = val
  if (val && i < 5) {
    focusIndex.value = i + 1
  }
}

function confirmPin() {
  const pinValue = pin.value.join('')
  if (pinValue.length < 6) {
    return uni.showToast({ title: '请输入完整PIN码', icon: 'none' })
  }
  // contoh validasi sederhana
  if (/^(?:012345|123456|234567|345678|987654)$/.test(pinValue)) {
    return uni.showToast({ title: 'PIN码太简单', icon: 'none' })
  }
  uni.showToast({ title: '设置成功', icon: 'none' })
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
.pin-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 12px;
}
.eye-icon {
  width: 20px;
  height: 20px;
}

/* PIN 输入框 */
.code-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.code-input {
  width: 44px;
  height: 44px;
  background-color: #1c1c1e;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  font-size: 20px;
}
.code-input:focus {
  border: 1px solid #9b5cff;
  outline: none;
}

/* 提示文字 */
.hint {
  color: #888;
  font-size: 13px;
  margin-bottom: 30px;
  line-height: 1.5;
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
