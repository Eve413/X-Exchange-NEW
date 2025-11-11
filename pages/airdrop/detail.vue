<template>
  <view class="airdrop-detail-page">
    <!-- 顶部安全区 -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>
    
    <!-- 头部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="page-title">{{ t('airdrop.activity_title') }}</text>
      <view class="header-actions">
        <image class="share-icon" src="/static/icons/share.png" mode="aspectFit" @click="shareAirdrop" />
      </view>
    </view>
    
    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 活动信息卡片 -->
      <view class="activity-card">
        <!-- 卡片头部 -->
        <view class="card-header">
          <view class="left-content">
            <image class="activity-logo" :src="activityData.logo" mode="aspectFit" />
            <view class="activity-info">
              <text class="activity-name">{{ activityData.name }}</text>
              <text class="activity-reward">{{ activityData.rewardLabel }}</text>
            </view>
          </view>
          <view class="status-tag" v-if="activityData.status">
            <text class="status-text">{{ activityData.status }}</text>
          </view>
        </view>
        
        <!-- 活动奖励信息 -->
        <view class="reward-info-section">
          <view class="reward-item">
            <text class="reward-label">{{ t('airdrop.total_airdrop') }}</text>
            <text class="reward-value">{{ activityData.totalAirdrop }}</text>
          </view>
          <view class="reward-conversion" v-if="activityData.conversionRate">
            <text class="conversion-text">(≈{{ activityData.conversionRate }})</text>
          </view>
        </view>
        
        <!-- 活动统计信息 -->
        <view class="stats-info-section">
          <view class="stat-item">
            <text class="stat-label">{{ t('airdrop.participants') }}</text>
            <text class="stat-value">{{ activityData.participants }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">{{ t('airdrop.remaining_time') }}</text>
            <text class="stat-value">{{ activityData.countdown }}</text>
          </view>
        </view>
        
        <!-- 额外奖励信息 -->
        <view class="extra-reward-section">
          <text class="extra-reward-text">{{ activityData.taskInfo }}</text>
          <text class="extra-reward-subtext">{{ activityData.taskInfoSubtext }}</text>
        </view>
        
        <!-- 宝箱图标 -->
        <image class="treasure-icon" src="/static/icons/treasure.svg" mode="aspectFit" />
      </view>
      
      <!-- 进度条区域 -->
      <view class="progress-section">
        <view class="progress-header">
          <text class="progress-title">{{ t('airdrop.my_progress') }}</text>
          <text class="progress-bonus">{{ progressData.currentBonus }} {{ progressData.bonusType }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressData.progressPercentage + '%' }"></view>
        </view>
        <text class="progress-text">{{ progressData.completedTasks }}/{{ progressData.totalTasks }} {{ t('airdrop.tasks_completed') }}</text>
        <text class="progress-hint">{{ t('airdrop.more_tasks_hint') }}</text>
      </view>
      
      <!-- 参与条件区域 -->
      <view class="conditions-section">
        <text class="section-title">{{ t('airdrop.participation_conditions') }}</text>
        <view class="condition-list">
          <view class="condition-item" v-for="(condition, index) in conditionsList" :key="index">
            <view class="condition-check" :class="{ checked: condition.checked }">
              <text class="check-mark" v-if="condition.checked">✓</text>
            </view>
            <text class="condition-text">{{ condition.text }}</text>
          </view>
        </view>
      </view>
      
      <!-- 任务列表区域 -->
      <view class="tasks-section">
        <text class="section-title">{{ t('airdrop.task_list') }}</text>
        <view class="task-card" v-for="(task, index) in tasksList" :key="index">
          <view class="task-content">
            <view class="task-info">
              <text class="task-name">{{ task.name }}</text>
              <text class="task-reward">+{{ task.reward }} {{ task.rewardType }}</text>
            </view>
            <view class="task-action">
              <view v-if="task.completed" class="completed-badge">
                <text class="completed-text">{{ t('airdrop.completed') }}</text>
              </view>
              <view v-else class="go-complete-button" @click="goToCompleteTask(task.id)">
                <text class="go-complete-text">{{ t('airdrop.go_complete') }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 邀请好友区域 -->
      <view class="invite-section">
        <text class="invite-title">{{ t('airdrop.invite_more_friends') }}</text>
        <text class="invite-description">{{ t('airdrop.invite_description') }}</text>
        <view class="invite-action">
          <button class="copy-link-button" @click="copyInviteLink">
            <image class="copy-icon" src="/static/icons/copy.png" mode="aspectFit" />
            <text class="copy-text">{{ t('airdrop.copy_invite_link') }}</text>
          </button>
        </view>
      </view>
      
      <!-- 协议确认区域 -->
      <view class="agreement-section">
        <view class="checkbox-container" @click="toggleAgreement">
          <view class="checkbox" :class="{ checked: agreementChecked }">
            <text class="checkbox-mark" v-if="agreementChecked">✓</text>
          </view>
          <text class="agreement-text">
            {{ t('airdrop.agreement_text') }}
            <text class="agreement-link" @click.stop="goToRules"> {{ t('airdrop.rules') }}</text>
            {{ t('airdrop.and') }}
            <text class="agreement-link" @click.stop="goToPrivacy"> {{ t('airdrop.privacy_policy') }}</text>
          </text>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>
    
    <!-- 底部提交按钮 -->
    <view class="bottom-button-container" :style="getBottomStyle(0)">
      <button class="submit-button" :disabled="!agreementChecked" @click="submitParticipation">
        <text class="submit-text">{{ t('airdrop.submit_participation') }}</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { tl } from "@/utils/i18n";
import { useSafeArea } from "@/utils/composables/useSafeArea";

const { getTopStyle, safeAreaInsets } = useSafeArea();

// 计算底部安全区域样式
const getBottomStyle = (extraPadding: number = 0) => {
  const bottomInset = safeAreaInsets.value.bottom || 0;
  return {
    paddingBottom: `${bottomInset + extraPadding}px`,
  };
};
const t = tl;

// 页面参数
const airdropId = ref(1); // 默认值

// 从路由参数中获取airdropId
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage?.options?.id) {
    airdropId.value = parseInt(currentPage.options.id as string);
    console.log('获取到空投ID:', airdropId.value);
    // 这里可以根据airdropId加载对应的活动数据
  }
});

// 协议勾选状态
const agreementChecked = ref(false);

// 活动数据 - 模拟数据
const activityData = {
  id: 1,
  name: 'PAWS',
  logo: '/static/icons/giftDark.png',
  rewardLabel: t('airdrop.bonus_reward'),
  status: t('airdrop.ongoing'),
  totalAirdrop: '500,000 PROMPT',
  conversionRate: '246,565 USD',
  participants: '2,371',
  countdown: '04D:15H:23M:11S',
  taskInfo: t('airdrop.trading_task_info'),
  taskInfoSubtext: t('airdrop.trading_task_info_subtext')
};

// 进度数据 - 模拟数据
const progressData = {
  currentBonus: '0',
  bonusType: 'DOGE Bonus',
  completedTasks: 1,  // 更新完成任务数以匹配30%进度
  totalTasks: 5,
  progressPercentage: 30  // 设置进度条为30%
};

// 参与条件 - 模拟数据
const conditionsList = [
  { text: t('airdrop.condition_kyc'), checked: true },
  { text: t('airdrop.condition_balance'), checked: true },
  { text: t('airdrop.condition_invite'), checked: false }
];

// 任务列表 - 模拟数据
const tasksList = [
  {
    id: 1,
    name: t('airdrop.task_follow_twitter'),
    reward: 50,
    rewardType: '',
    completed: false
  },
  {
    id: 2,
    name: t('airdrop.task_invite_friends'),
    reward: 50,
    rewardType: '',
    completed: true
  },
  {
    id: 3,
    name: t('airdrop.task_retweet'),
    reward: 50,
    rewardType: '',
    completed: false
  },
  {
    id: 4,
    name: t('airdrop.task_deposit'),
    reward: 50,
    rewardType: '',
    completed: true
  }
];

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 分享空投
const shareAirdrop = () => {
  console.log('分享空投活动:', airdropId.value);
  // 这里可以实现分享功能
  uni.showToast({
    title: t('airdrop.share_success'),
    icon: 'success'
  });
};

// 切换协议勾选状态
const toggleAgreement = () => {
  agreementChecked.value = !agreementChecked.value;
};

// 去完成任务
const goToCompleteTask = (taskId: number) => {
  console.log('去完成任务:', taskId);
  // 根据不同任务类型跳转到不同页面
  uni.showToast({
    title: t('airdrop.task_redirecting'),
    icon: 'none'
  });
};

// 复制邀请链接
const copyInviteLink = () => {
  console.log('复制邀请链接');
  // 这里可以实现复制功能
  uni.showToast({
    title: t('airdrop.link_copied'),
    icon: 'success'
  });
};

// 跳转到活动规则
const goToRules = () => {
  console.log('跳转到活动规则');
  // 这里可以跳转到活动规则页面
  uni.showToast({
    title: t('airdrop.viewing_rules'),
    icon: 'none'
  });
};

// 跳转到隐私政策
const goToPrivacy = () => {
  console.log('跳转到隐私政策');
  // 这里可以跳转到隐私政策页面
  uni.showToast({
    title: t('airdrop.viewing_privacy'),
    icon: 'none'
  });
};

// 提交参与
const submitParticipation = () => {
  if (!agreementChecked.value) {
    uni.showToast({
      title: t('airdrop.agree_terms_first'),
      icon: 'none'
    });
    return;
  }
  
  console.log('提交参与空投活动:', airdropId.value);
  // 这里可以实现提交参与的逻辑
  uni.showToast({
    title: t('airdrop.participation_submitted'),
    icon: 'success'
  });
};
</script>

<style lang="scss" scoped>
.airdrop-detail-page {
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
  position: relative;
}

.status-bar-spacer {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #202020;
  position: sticky;
  padding-top: 50rpx;
  top: 0;
  z-index: 100;
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon{
  width: 40rpx;
  height: 32rpx;
}

.back-arrow {
  font-size: 24px;
  color: #ffffff;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
}

.share-icon {
  width: 24px;
  height: 24px;
  margin-left: 16px;
}

.content-scroll {
  flex: 1;
  padding-bottom: 100rpx;
}

/* 活动信息卡片 */
.activity-card {
  margin: 16px;
  padding: 20px;
  background: #252525;
  border-radius: 16px;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left-content {
  display: flex;
  align-items: center;
}

.activity-logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.activity-info {
  display: flex;
  flex-direction: column;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.activity-reward {
  font-size: 12px;
  color: #fff;
  background: rgba(138, 43, 226, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

.status-tag {
  background: #4caf50;
  padding: 4px 12px;
  border-radius: 10rpx;
}

.status-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
}

.reward-info-section {
  margin-bottom: 16px;
}

.reward-item {
  margin-bottom: 4px;
}

.reward-label {
  font-size: 14px;
  color: #8e8e93;
  margin-right: 8px;
}

.reward-value {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.conversion-text {
  font-size: 14px;
  color: #8e8e93;
}

.stats-info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #8e8e93;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.extra-reward-section {
  margin-bottom: 16px;
}

.extra-reward-text {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 4px;
  display: block;
}

.extra-reward-subtext {
  font-size: 14px;
  color: #8e8e93;
  display: block;
}

.treasure-icon {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
}

/* 进度条区域 */
.progress-section {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: #252525;
  border-radius: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.progress-bonus {
  font-size: 14px;
  color: #8a2be2;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #3a3a3a;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 4px;
}

.progress-text {
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 4px;
  display: block;
}

.progress-hint {
  font-size: 12px;
  color: #8e8e93;
  display: block;
}

/* 参与条件区域 */
.conditions-section {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: #252525;
  border-radius: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  display: block;
}

.condition-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.condition-item {
  display: flex;
  align-items: center;
}

.condition-check {
  width: 20px;
  height: 20px;
  border: 2px solid #8e8e93;
  border-radius: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.condition-check.checked {
  background: #4caf50;
  border-color: #4caf50;
}

.check-mark {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.condition-text {
  font-size: 14px;
  color: #ffffff;
  flex: 1;
}

/* 任务列表区域 */
.tasks-section {
  margin: 0 16px 16px 16px;
}

.task-card {
  padding: 16px;
  background: #252525;
  border-radius: 12px;
  margin-bottom: 12px;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 4px;
  display: block;
}

.task-reward {
  font-size: 12px;
  color: #8a2be2;
  font-weight: 500;
  display: block;
}

.task-action {
  display: flex;
  align-items: center;
}

.completed-badge {
  background: #4caf50;
  padding: 6px 16px;
  border-radius: 12px;
}

.completed-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
}

.go-complete-button {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  padding: 6px 16px;
  border-radius: 12px;
}

.go-complete-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
}

/* 邀请好友区域 */
.invite-section {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: #252525;
  border-radius: 16px;
}

.invite-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  display: block;
}

.invite-description {
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 16px;
  display: block;
  line-height: 1.5;
}

.invite-action {
  margin-bottom: 8px;
}

.copy-link-button {
  width: 100%;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
  border: none;
  padding: 12rpx;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.copy-text {
  color: #ffffff;
}

/* 协议确认区域 */
.agreement-section {
  margin: 0 16px 16px 16px;
  padding: 0 4px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #8e8e93;
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #8a2be2;
  border-color: #8a2be2;
}

.checkbox-mark {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.agreement-text {
  font-size: 12px;
  color: #8e8e93;
  line-height: 1.5;
  flex: 1;
}

.agreement-link {
  color: #8a2be2;
  text-decoration: underline;
}

/* 底部占位 */
.bottom-spacer {
  height: 80px;
}

/* 底部提交按钮 */
.bottom-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: 60rpx !important;
  background: #1a1a1a;
  // border-top: 1px solid #3a3a3a;
  z-index: 99;
}

.submit-button {
  width: 100%;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
  border: none;
  padding:8rpx 14rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.submit-button:disabled {
  opacity: 0.5;
}
</style>