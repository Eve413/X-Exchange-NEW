<template>
  <view class="upgrade-guide">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon" @click="goBack" />
      <text class="title">升级攻略</text>
      <view class="placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content" show-scrollbar="false">
      <!-- 等级显示卡片 -->
      <view class="level-card">
        <view class="level-item">
          <view class="level-label">当前等级</view>
          <view class="level-value level1" style="color: #9370DB;">L1</view>
        </view>
        <!-- <view class="arrow">→</view> -->
        <view class="level-item">
          <view class="level-label">目标等级</view>
          <view class="level-value level2" style="color: #FFD700;">L2</view>
        </view>
        <view class="time-estimate">
          <view class="estimation-badge">
            <!-- <image src="/static/icons/ic_new.png" class="badge-icon" /> -->
            <text class="estimation-text">预计 45天可达成</text>
          </view>
        </view>
      </view>

      <!-- 预计达成时间 -->

      <view class="section-title1">升级权益</view>
      <!-- 升级权益卡片 -->
      <view class="benefit-card">
        <view class="benefit-item">
          <view class="check-icon">✓</view>
          <text class="benefit-text">分佣比例提升至 40%+15%+8%</text>
        </view>

        <view class="benefit-item">
          <view class="check-icon">✓</view>
          <text class="benefit-text">月度分红资格</text>
        </view>

        <view class="benefit-item">
          <view class="check-icon">✓</view>
          <text class="benefit-text">专属VIP通道</text>
        </view>

        <view class="benefit-item">
          <view class="check-icon">✓</view>
          <text class="benefit-text">团队管理工具升级</text>
        </view>
      </view>
      <view class="section-title1">升级任务</view>
      <!-- 升级任务卡片 -->
      <view class="task-card">


        <!-- 任务项1 -->
        <view class="task-item">
          <text class="task-label">团队规模达200人</text>
          <text class="task-progress">65%</text>
          <view class="progress-container">
            <view class="progress-bar">
              <view class="progress-fill" style="width: 65%;"></view>
            </view>
            <text class="progress-text">85/200</text>
          </view>
          <text class="task-tip">↘ 加强垂直邀请，鼓励成员裂变</text>
        </view>

        <!-- 任务项2 -->
        <view class="task-item">
          <text class="task-label">月业绩达50万USDT</text>
          <text class="task-progress">65%</text>
          <view class="progress-container">
            <view class="progress-bar">
              <view class="progress-fill" style="width: 65%;"></view>
            </view>
            <text class="progress-text">85/200</text>
          </view>
          <text class="task-tip">↘ 举办线上分享会，提升转化率</text>
        </view>

        <!-- 任务项3 -->
        <view class="task-item">
          <text class="task-label">直推有效用户达30人</text>
          <text class="task-progress">65%</text>
          <view class="progress-container">
            <view class="progress-bar">
              <view class="progress-fill" style="width: 65%;"></view>
            </view>
            <text class="progress-text">85/200</text>
          </view>
          <text class="task-tip">↘ 激励团队交易活跃度，开展业绩竞赛</text>
        </view>
      </view>
      <view class="section-title1">升级策略</view>
      <!-- 升级策略卡片 -->
      <view class="strategy-card">


        <!-- 策略项1 -->
        <view class="strategy-item">
          <view class="strategy-number">1</view>
          <view class="item-right">
            <text class="strategy-title">直推策略</text>
            <text class="strategy-desc">每周新增3-5名高质量用户，提供一对一指导</text>
          </view>
        </view>

        <!-- 策略项2 -->
        <view class="strategy-item">
          <view class="strategy-number">2</view>
          <view class="item-right">
            <text class="strategy-title">团队裂变</text>
            <text class="strategy-desc">培养5名核心成员成为团队长，实现倍增效应</text>
          </view>
        </view>

        <!-- 策略项3 -->
        <view class="strategy-item">
          <view class="strategy-number">3</view>
          <view class="item-right"><text class="strategy-title">业绩冲刺</text>
            <text class="strategy-desc">月末开展业绩冲刺活动，设置阶梯奖励</text>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="bottom-btn">
        <text class="btn-text">开始冲刺升级</text>
      </view>

      <!-- 底部间距 -->
      <view class="bottom-spacing"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped lang="scss">
.upgrade-guide {
  background-color: #202020;
  min-height: 100vh;
  color: #fff;
}

// 顶部导航栏
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 120rpx;
  background-color: #202020;
  position: sticky;
  top: 0;
  padding-top: 30rpx;
  box-sizing: content-box;
  z-index: 1000;

  .back-icon {
    width: 40rpx;
    height: 40rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
  }

  .placeholder {
    width: 40rpx;
  }
}

// 内容区域
.content {
  padding: 0 30rpx;
  min-height: calc(100vh - 120rpx);
  overflow-y: auto;
}

// 等级显示卡片
.level-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;

  .level-item {
    margin-top: 10rpx;
    width: 100%;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .level-label {
    font-size: 28rpx;
    color: #9AA4AE;
    margin-bottom: 10rpx;
  }

  .level-value {
    font-size: 30rpx;
    width: 70rpx;
    height: 50rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    // font-weight: 700;
  }


  .arrow {
    font-size: 40rpx;
    color: #666;
  }
}

.level1 {
  background-color: rgba(108, 74, 244, 0.12);
}

.level2 {
  background-color: rgba(212, 175, 55, 0.12);
}

// 预计达成时间
.time-estimate {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 30rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.12);

  // .estimation-badge {
  //   display: flex;
  //   align-items: center;
  //   background-color: rgba(128, 0, 128, 0.1);
  //   padding: 10rpx 20rpx;
  //   border-radius: 20rpx;
  // }



  .badge-icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 10rpx;
  }

  .estimation-text {
    font-size: 26rpx;
    color: #6F4BFD;
  }
}

// 通用卡片样式
.benefit-card,
.task-card,
.strategy-card {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
}

.section-title1 {
  font-size: 30rpx;
  font-weight: 500;
  color: #fff;
  // margin-bottom: 20rpx;
  margin-top: 30rpx;
  display: block;
}

// 升级权益卡片
.benefit-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;

  .check-icon {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background-color: #4CAF50;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    margin-right: 20rpx;
  }

  .benefit-text {
    font-size: 28rpx;
    color: #fff;
  }
}

// 升级任务卡片
.task-item {
  margin-bottom: 30rpx;
  position: relative;

  .task-label {
    font-size: 28rpx;
    color: #fff;
    margin-bottom: 10rpx;
    display: block;
  }

  .task-progress {
    font-size: 28rpx;
    color: #6F4BFD;
    float: right;
    margin-bottom: 10rpx;
    position: absolute;
    right: 10rpx;
    top: 10rpx;
  }

  .progress-container {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }

  .progress-bar {
    flex: 1;
    height: 18rpx;
    background-color: rgba(111, 75, 253, 0.12);
    border-radius: 4rpx;
    overflow: hidden;
    margin-right: 20rpx;
  }

  .progress-fill {
    height: 100%;
    background-color: #6F4BFD;
    border-radius: 4rpx;
  }

  .progress-text {
    font-size: 24rpx;
    color: #9AA4AE;
  }

  .task-tip {
    font-size: 24rpx;
    color: #9AA4AE;
  }
}

// 升级策略卡片
.strategy-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: flex-start;

  .strategy-number {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background-color: rgba(111, 75, 253, 0.12);
    color: #6F4BFD;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: 600;
    margin-bottom: 10rpx;
    margin-right: 30rpx;
  }

  .strategy-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10rpx;
    display: block;
  }

  .strategy-desc {
    font-size: 24rpx;
    color: #9AA4AE;
    line-height: 1.5;
  }
}

// 底部按钮
.bottom-btn {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 40rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;

  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }
}

// 底部间距
.bottom-spacing {
  height: 60rpx;
}
</style>