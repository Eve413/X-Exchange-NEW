<template>
  <view class="result-page">
    <!-- 返回按钮 -->
    <view class="back-button" @click="goBack">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon" mode="aspectFit" />
    </view>
    
    <!-- 结果内容区 -->
    <view class="result-content">
      <!-- 状态图标 -->
      <view class="status-icon-container">
        <image :src="statusImage" class="status-image" mode="aspectFit" />
      </view>
      
      <!-- 状态标题 -->
      <view class="status-title">{{ statusTitle }}</view>
      
      <!-- 奖励信息 -->
      <view class="reward-info">
        预计获得 {{ rewardAmount }} {{ rewardToken }} 代币
      </view>
      
      <!-- 完成按钮 -->
      <view class="complete-button" @click="completeAction">
        完成
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useUserStore, AirdropsParams} from '@/store/modules/user'
import { onLoad } from '@dcloudio/uni-app';

const route = useRoute();
const router = useRouter();

// 获取传入的状态参数，默认为成功状态
let status = 'success'; // 支持 'success', 'pending', 'failed'
let rewardData = { amount: '500', token: 'DOGE Bonus' };

onLoad((options) => {
  // 从路由参数中获取状态和奖励信息
  if (options.status) {
    status = options.status as string;
  }
  if (options.amount) {
    rewardData.amount = options.amount as string;
  }
  if (options.token) {
    rewardData.token = options.token as string;
  }
});

// 根据状态计算显示的图片
const statusImage = computed(() => {
  switch (status) {
    case 'pending':
      return '/static/icons/pendingImg.png';
    case 'failed':
      return '/static/icons/failedImg.png';
    case 'success':
    default:
      return '/static/icons/successImg.png';
  }
});

// 根据状态计算显示的标题
const statusTitle = computed(() => {
  switch (status) {
    case 'pending':
      return '参与处理中';
    case 'failed':
      return '参与失败';
    case 'success':
    default:
      return '参与成功';
  }
});

// 奖励金额
const rewardAmount = computed(() => rewardData.amount);

// 奖励代币类型
const rewardToken = computed(() => rewardData.token);

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 完成按钮操作
const completeAction = () => {
  // 如果是失败状态，返回详情页
  if (status === 'failed') {
    uni.navigateBack();
  } else {
    // 成功或处理中状态，返回空投列表页
    uni.switchTab({
      url: '/pages/home/index'
    });
  }
};
</script>

<style scoped>
.result-page {
  background-color: #202020;
  min-height: 100vh;
  padding: 80rpx 30rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 80rpx;
  left: 30rpx;
  z-index: 100;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 结果内容区 */
.result-content {
  /* height: 100vh; */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 200rpx;
  box-sizing: border-box;
  /* padding: 100rpx 0; */
}

/* 状态图标容器 */
.status-icon-container {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50rpx;
  /* 添加蓝色圆环动画效果 */
  /* box-shadow: 0 0 40rpx 10rpx rgba(85, 101, 185, 0.3); */
  /* background: radial-gradient(circle, rgba(85, 101, 185, 0.2) 0%, rgba(205, 88, 144, 0.1) 100%);  */
}

.status-image {
  width: 220rpx;
  height: 220rpx;
}

/* 状态标题 */
.status-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30rpx;
}

/* 奖励信息 */
.reward-info {
  font-size: 32rpx;
  color: #9AA4AE;
  margin-bottom: 120rpx;
}

/* 完成按钮 */
.complete-button {
  position: absolute;
  width: 90%;
  height: 100rpx;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 200rpx;
  /* box-shadow: 0 10rpx 30rpx rgba(85, 101, 185, 0.4); */
}

.complete-button:active {
  opacity: 0.9;
  transform: scale(0.98);
}
</style>