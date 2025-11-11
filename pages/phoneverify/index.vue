<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">手机验证</text>
    </view>

    <!-- 手机信息 -->
    <view class="phone-card">
      <image class="flag" src="/static/flags/cn.png" mode="aspectFill" />

      <view class="info">
        <text class="number">123****7163</text>
        <text class="date">添加于：2025年8月12日</text>
      </view>

      <view class="actions">
        <image class="icon" src="/static/icons/ic_edit.png" mode="aspectFit" @click="editPhone" />
        <image class="icon" src="/static/icons/ic_delete.png" mode="aspectFit" @click="deletePhone" />
      </view>
    </view>
  </view>
</template>

<script setup>
function goBack() {
  uni.navigateBack()
}

function editPhone() {
  uni.showToast({ title: '编辑号码 (Edit)', icon: 'none' })
}

function deletePhone() {
  uni.showModal({
    title: '提示',
    content: '确定要删除该手机号吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已删除', icon: 'none' })
      }
    }
  })
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

/* 手机卡片 */
.phone-card {
  background-color: #1c1c1e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 14px 16px;
}
.flag {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 12px;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.number {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}
.date {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}
.actions {
  display: flex;
  align-items: center;
}
.icon {
  width: 20px;
  height: 20px;
  margin-left: 14px;
  opacity: 0.8;
}
.icon:active {
  opacity: 1;
}
</style>
