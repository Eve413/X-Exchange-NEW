<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">更改邮箱</text>
    </view>

    <!-- 内容 -->
    <view class="content">
      <!-- 邮箱地址 -->
      <text class="label">邮箱地址</text>
      <view class="input-row">
        <input
          v-model="email"
          type="text"
          placeholder="请输入邮箱地址"
          placeholder-class="placeholder"
          class="input"
        />
        <view class="btn-send" @click="sendCode">发送验证码</view>
      </view>

      <!-- 验证码 -->
      <text class="label">验证码</text>
      <view class="code-box">
        <input
          v-for="(v, i) in 6"
          :key="i"
          type="number"
          maxlength="1"
          class="code-input"
          v-model="code[i]"
          :focus="focusIndex === i"
          @input="handleInput($event, i)"
          @focus="focusIndex = i"
        />
      </view>

      <text class="hint">验证码已发送至您的邮箱，请查收并填写</text>

      <!-- 确认按钮 -->
      <view class="btn-confirm" @click="confirmBind">
        确认绑定
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const email = ref('')
const code = ref(['', '', '', '', '', ''])
const focusIndex = ref(0)

function goBack() {
  uni.navigateBack()
}

function sendCode() {
  uni.showToast({ title: '验证码已发送', icon: 'none' })
  focusIndex.value = 0
  nextTick(() => {
    focusIndex.value = 0
  })
}

function handleInput(e, i) {
  const val = e.detail.value.slice(-1)
  code.value[i] = val
  if (val && i < 5) {
    focusIndex.value = i + 1
  }
}

function confirmBind() {
  const inputCode = code.value.join('')
  if (inputCode.length < 6) {
    uni.showToast({ title: '请输入完整验证码', icon: 'none' })
    return
  }
  uni.showToast({ title: '绑定成功(示例)', icon: 'none' })
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
.label {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 6px;
  display: block;
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
.btn-send {
  padding: 6px 12px;
  background: linear-gradient(90deg, #9b5cff, #ff5fa2);
  border-radius: 20px;
  font-size: 13px;
  color: #fff;
  margin-left: 8px;
}

/* 验证码输入框 */
.code-box {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
}
.code-input {
  width: 44px;
  height: 44px;
  background-color: #1c1c1e;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  font-size: 18px;
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
