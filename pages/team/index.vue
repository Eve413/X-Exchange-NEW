<template>
  <view class="team-dashboard">
    <!-- 顶部安全区 -->
    <SafeTop :extraPadding="0" />

    <!-- 顶部导航栏 -->
    <view class="navbar">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon" @click="goBack" />
      <text class="title">{{ $t('team.title') }}</text>
      <!-- <view class="right-icons">
        <image src="/static/icons/ic_headphone.png" class="icon" @click="goToCustomerService" />
        <image src="/static/icons/ic_bell.png" class="icon" @click="goToNotification" />
      </view> -->
    </view>
    <view class="cardBox">
      <!-- 团队总人数 -->
      <view class="team-total">
        <view class="total-left">
          <view class="total-label">{{ $t('team.totalMembers') }}</view>
          <view class="total-number">86</view>
          <view class="num-content">
            <view class="num-hint">{{ $t('team.directInvite') }} 28</view>
            <view class="num-hint">{{ $t('team.indirectInvite') }} 23</view>
          </view>
        </view>
        <view class="total-right">
          <image src="/static/icons/teamHuman.png" class="teamIcon2" />
        </view>

      </view>

      <!-- 统计数据卡片 -->
      <view class="stats-card">
        <view class="stat-item">
          <image src="/static/icons/teamIcon1.png" class="teamIcon" />
          <view class="stat-number">12.0k</view>
          <view class="stat-label">{{ $t('team.monthlyPerformance') }}</view>
        </view>
        <view class="stat-item">
          <image src="/static/icons/teamIcon2.png" class="teamIcon" />
          <view class="stat-number">2,341</view>
          <view class="stat-label">{{ $t('team.withdrawable') }}</view>
        </view>
        <view class="stat-item">
          <image src="/static/icons/teamIcon3.png" class="teamIcon" />
          <view class="stat-number">L2</view>
          <view class="stat-label">{{ $t('team.level') }}</view>
        </view>
      </view>
    </view>

    <view class="btn-box">
      <view class="btn-item active-btn">
        {{ $t('team.withdrawBenefit') }}
      </view>
      <view class="btn-item">
          {{ $t('team.dataAnalysis') }}
        </view>
    </view>
    <!-- 等级升级进度卡片 -->
    <view class="level-card">
      <view class="card-header">
        <text class="card-title">{{ $t('team.levelUpProgress') }}</text>
        <text class="card-subtitle">{{ $t('team.levelIndicator') }}</text>
      </view>

      <!-- 整体进度 -->
      <view class="progress-container">
        <view class="progress-header">
          <text class="progress-text">{{ $t('team.totalProgress') }}</text>
          <text class="progress-percentage">{{ $t('team.percentageLabel') }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '84%' }"></view>
        </view>
      </view>

      <!-- 团队人数 -->
      <view class="progress-container">
        <view class="progress-header">
          <text class="progress-text">{{ $t('team.teamMembers') }}</text>
          <text class="progress-percentage">85/200 {{ $t('team.totalMembersUnit') }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '42.5%' }"></view>
        </view>
      </view>

      <!-- 直推有效用户 -->
      <view class="progress-container">
        <view class="progress-header">
          <text class="progress-text">{{ $t('team.directActiveUsers') }}</text>
          <text class="progress-percentage">28/30 {{ $t('team.totalMembersUnit') }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '93.3%' }"></view>
        </view>
      </view>

      <!-- 月业绩 -->
      <view class="progress-container">
        <view class="progress-header">
          <text class="progress-text">{{ $t('team.monthlyPerformance') }}</text>
          <text class="progress-percentage">120000/3000000 {{ $t('team.usdt') }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '4%' }"></view>
        </view>
      </view>
      <!-- 升级奖励按钮 -->
      <view class="upgrade-btn" @click="handleUpgrade">
        <text class="upgrade-btn-text">{{ $t('team.viewUpgradeGuide') }}</text>
      </view>
    </view>

    <!-- 数据概览卡片 -->
    <view class="overview-card">
      <view class="card-tabs">
        <text :class="activeTab === 'benefit' ? 'tab-active' : 'tab'" @click="activeTab = 'benefit'">{{
          $t('team.tabBenefit') }}</text>
        <text :class="activeTab === 'member' ? 'tab-active' : 'tab'" @click="activeTab = 'member'">{{
          $t('team.tabMember') }}</text>
        <text :class="activeTab === 'task' ? 'tab-active' : 'tab'" @click="activeTab = 'task'">{{ $t('team.tabTask')
        }}</text>
        <text :class="activeTab === 'rank' ? 'tab-active' : 'tab'" @click="activeTab = 'rank'">{{ $t('team.tabRank')
        }}</text>
      </view>

      <!-- 收益tab内容 -->
      <template v-if="activeTab === 'benefit'">
        <view class="overview-stats">
          <view class="overview-item">
            <image src="/static/icons/teamIcon1.png" class="teamIcon" />
            <view class="overview-number">17.52</view>
            <view class="overview-label">{{ $t('team.benefitSource') }}</view>
          </view>
          <view class="overview-item">
            <image src="/static/icons/teamIcon2.png" class="teamIcon" />
            <view class="overview-number">5,000</view>
            <view class="overview-label">{{ $t('team.completed') }}</view>
          </view>
          <view class="overview-item">
            <image src="/static/icons/teamIcon3.png" class="teamIcon" />
            <view class="overview-number">4,21</view>
            <view class="overview-label">{{ $t('team.pending') }}</view>
          </view>
        </view>
        <view class="listTitle">收益来源</view>
        <!-- 等级升级进度卡片 -->
        <view class="level-card level-card1">

          <!-- 整体进度 -->
          <view class="progress-container">
            <view class="progress-header">
              <text class="progress-text">{{ $t('team.teamTradeRebate') }}</text>
              <text class="progress-percentage">84%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: '84%' }"></view>
            </view>
          </view>

          <!-- 团队人数 -->
          <view class="progress-container">
            <view class="progress-header">
                <text class="progress-text">{{ $t('team.promotionReward') }}</text>
              <text class="progress-percentage">85/200 {{ $t('team.totalMembersUnit') }}</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: '42.5%' }"></view>
            </view>
          </view>

          <!-- 直推有效用户 -->
          <view class="progress-container">
            <view class="progress-header">
                <text class="progress-text">{{ $t('team.taskBonus') }}</text>
              <text class="progress-percentage">28/30 {{ $t('team.totalMembersUnit') }}</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: '93.3%' }"></view>
            </view>
          </view>
        </view>
        <!-- 团队交易量卡片 -->
        <!-- <view class="volume-card">
          <view class="card-header">
            <text class="card-title">{{ $t('team.teamVolume') }}</text>
            <text class="card-percentage">86%</text>
          </view>
          <view class="volume-stats">
            <view class="volume-item">
              <text class="volume-label">{{ $t('team.consumptionTotal') }}</text>
              <text class="volume-value">-1411</text>
            </view>
            <view class="volume-item">
              <text class="volume-label">{{ $t('team.taskReward') }}</text>
              <text class="volume-value">+800</text>
            </view>
          </view>
        </view> -->

        <!-- 效益趋势图表 -->
        <view class="trend-card">
          <view class="card-header">
            <text class="card-title">{{ $t('team.benefitTrend') }}</text>
            <text class="card-more">{{ $t('team.viewAll') }} &gt;</text>
          </view>
          <view class="chart-container">
            <!-- 模拟图表柱状图 -->
            <view class="chart-bars">
              <view class="chart-column" v-for="(item, index) in chartData" :key="index">
                <view class="chart-bar" :style="{ height: item.height, minHeight: '20rpx' }"></view>
                <text class="chart-date">{{ item.date }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 明细列表 -->
        <view class="detail-section">
          <view class="section-title">{{ $t('team.benefitDetail') }}</view>

          <!-- 明细项 -->
          <view class="detail-item" v-for="(item, index) in detailData" :key="index">
            <view class="detail-left">
              <text class="detail-title">{{ $t(`team.${item.textKey}`) }}</text>
              <text class="detail-date">{{ $t('team.contentSimulatedData') }}</text>
              <text class="detail-date">{{ item.date }}</text>
            </view>
            <text class="detail-amount" :class="item.amountType">+300 {{ $t('team.usdt') }}</text>
          </view>
        </view>
      </template>

      <!-- 成员tab内容 -->
      <template v-else-if="activeTab === 'member'">
        <view class="tab-header">
          <text class="tab-title">{{ $t('team.teamMemberLevel') }}</text>
          <text class="tab-count">2 {{ $t('team.totalMembersUnit') }}</text>
        </view>
        <view class="member-list">
          <view class="member-item" v-for="(member, index) in memberData" :key="index">
            <view class="member-left">
              <image class="member-avatar" :src="member.avatar" mode="aspectFill" />
              <view class="member-info">
                <text class="member-name">{{ member.name }}</text>
                <text class="member-detail">{{ $t('team.performance') }}{{ member.performance }} USD {{
                  $t('team.subordinate') }}{{ member.subCount }}{{ $t('team.totalMembersUnit') }}</text>
              </view>
            </view>
            <text class="member-arrow">&gt;</text>
          </view>
        </view>
      </template>

      <!-- 任务tab内容 -->
      <template v-else-if="activeTab === 'task'">
        <view class="tab-header">
          <text class="tab-title">{{ $t('team.teamTasks') }}</text>
          <text class="tab-count">2 {{ $t('team.totalMembersUnit') }}</text>
        </view>
        <view class="task-list">
          <view class="task-item" v-for="(task, index) in taskData" :key="index">
            <view class="task-content">
              <text class="task-title">{{ task.status === 'completed' ? (index === 0 ? $t('team.inviteRealUsers') :
                index === 1 ? $t('team.teamMonthlyPerformance') : $t('team.trainGoldCaptains')) :
                $t('team.trainGoldCaptains') }}</text>
              <text class="task-reward">{{ $t('team.taskReward') }} {{ task.reward }} {{ $t('team.usdt') }}</text>
            </view>
            <text :class="['task-status', task.status]">{{ task.status === 'completed' ? $t('team.statusCompleted') :
              $t('team.statusInProgress') }}</text>
          </view>
          <view class="task-progress">
            <text class="progress-label">{{ $t('team.completionRate') }}</text>
            <view class="progress-bar-small">
              <view class="progress-fill-small" :style="{ width: '65%' }"></view>
            </view>
            <text class="progress-value">{{ $t('team.progressValue') }}</text>
          </view>
        </view>
      </template>

      <!-- 排行tab内容 -->
      <template v-else-if="activeTab === 'rank'">
        <view class="tab-header">
          <text class="tab-title">{{ $t('team.teamRanking') }}</text>
          <text class="tab-count">2 {{ $t('team.totalMembersUnit') }}</text>
        </view>
        <view class="rank-list">
          <view class="rank-item" v-for="(rank, index) in rankData" :key="index">
            <view class="rank-left">
              <view class="rank-badge" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </view>
              <view class="rank-info">
                <text class="rank-team">{{ $t('team.teamName') }}</text>
                <text class="rank-captain">{{ $t('team.teamCaptain') }} {{ rank.captain }}</text>
                <text class="rank-stats">{{ $t('team.totalMembers') }}:{{ rank.totalMembers }}{{
                  $t('team.totalMembersUnit') }} ~{{ rank.totalAmount }} {{ $t('team.usdt') }}</text>
              </view>
            </view>
            <image class="rank-trophy" src="/static/icons/rankIcon.png" mode="aspectFit" />
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SafeTop } from '@/components';

const router = useRouter();

// 当前激活的tab
const activeTab = ref('benefit');

// 计算进度百分比的辅助函数
const calculateProgress = (current: number, total: number) => {
  return Math.min(Math.round((current / total) * 100), 100) + '%';
}

// 模拟图表数据 - 提供更真实的效益趋势数据
const chartData = ref([
  { date: '10/01', height: '35%' },
  { date: '10/02', height: '42%' },
  { date: '10/03', height: '38%' },
  { date: '10/04', height: '55%' },
  { date: '10/05', height: '68%' },
  { date: '10/06', height: '62%' },
  { date: '10/07', height: '48%' },
]);

// 模拟团队成员数据
const memberData = ref([
  { name: 'Alice', performance: '2000', subCount: 5, avatar: '/static/icons/user.png' },
  { name: 'Alice', performance: '2000', subCount: 5, avatar: '/static/icons/user.png' }
]);

// 模拟任务数据
const taskData = ref([
  { reward: 50, status: 'completed' },
  { reward: 50, status: 'completed' },
  { reward: 500, status: 'in-progress' }
]);

// 模拟排行榜数据
const rankData = ref([
  { teamName: 'SuperTeam', captain: 'TUY***', totalMembers: 980, totalAmount: '528K' },
  { teamName: 'SuperTeam', captain: 'TUY***', totalMembers: 980, totalAmount: '528K' },
  { teamName: 'SuperTeam', captain: 'TUY***', totalMembers: 980, totalAmount: '528K' }
]);

// 模拟明细数据
const detailData = ref([
  { textKey: 'teamTradeReward', date: '2023-10-28 10:30', amountType: 'positive' },
  { textKey: 'teamTradeReward', date: '2023-10-26 09:40', amountType: 'positive' },
  { textKey: 'taskCompletionReward', date: '2023-10-24 11:30', amountType: 'positive' },
  { textKey: 'managementNodeReward', date: '2023-10-23 15:45', amountType: 'positive' },
  { textKey: 'levelReward', date: '2023-10-22 10:00', amountType: 'positive' },
]);

// 返回上一页
const goBack = () => {
  router.back();
};

// 跳转到客服页面
const goToCustomerService = () => {
  router.push('/pages/customerservice/index');
};

// 跳转到通知页面
const goToNotification = () => {
  router.push('/pages/notification/index');
};

// 处理升级攻略点击
const handleUpgrade = () => {
  router.push('/pages/upgradeguide/index');
};
</script>

<style scoped lang="scss">
.team-dashboard {
  background-color: #202020;
  min-height: 100vh;
  padding: 0 30rpx;
  color: #fff;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  background-color: #202020;
  z-index: 10;
  padding-top: 60rpx;
}

.back-icon {
  width: 40rpx;
  height: 32rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.right-icons {
  display: flex;
  gap: 30rpx;
}

.icon {
  width: 44rpx;
  height: 44rpx;
}

.cardBox {
  background-color: #2A2A2A;
  border-radius: 20rpx;
}

.team-total {
  // background-color: #2A2A2A;
  padding: 20rpx 30rpx 10rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-right {
  background-color: rgba(111, 75, 253, 0.12);
  border-radius: 50%;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 20rpx;
}

.teamIcon2 {
  width: 44rpx;
  height: 44rpx;
}

.team-total {
  // text-align: center;
  // margin: 40rpx 0;
}

.num-hint {}

.num-content {
  display: flex;
}

.total-number {
  font-size: 50rpx;
  font-weight: bold;
  color: #fff;
}

.num-hint {
  color: #9AA4AE;
  font-size: 26rpx;
  margin-right: 8rpx;
}

.total-label {
  font-size: 28rpx;
  color: #9AA4AE;
  margin-top: 10rpx;
}

.stats-card {
  // background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.stat-item {
  text-align: center;
  // flex: 1;
  width: 200rpx;
  background-color: #3B3B3B;
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
}

.stat-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-top: 10rpx;
}

.level-card {
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.level-card1 {
  // margin-top: 40rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.card-subtitle {
  font-size: 28rpx;
  color: #6F4BFD;
}

.progress-container {
  margin-bottom: 24rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #9AA4AE;
}

.progress-bar {
  width: 100%;
  height: 20rpx;
  background-color: rgba(111, 75, 253, 0.12);
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  background-color: #6F4BFD;
  border-radius: 6rpx;
}

.progress-percentage {
  font-size: 24rpx;
  color: #fff;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.listTitle {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
  padding: 20rpx 0;
}

.tab-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
}

.tab-count {
  font-size: 24rpx;
  color: #9AA4AE;
}

/* 成员列表样式 */
.member-list {
  margin-top: 20rpx;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: 2a2a2a;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.member-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  // border-radius: 50%;
  // background-color: #2a2a2a;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.member-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
}

.member-detail {
  font-size: 24rpx;
  color: #9AA4AE;
}

.member-arrow {
  font-size: 32rpx;
  color: #9AA4AE;
}

/* 任务列表样式 */
.task-list {
  margin-top: 20rpx;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 8rpx;
  display: block;
}

.task-reward {
  font-size: 24rpx;
  color: #9AA4AE;
}

.task-status {
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 16rpx;
}

.task-status.completed {
  color: #00C853;
  background-color: rgba(0, 200, 83, 0.1);
}

.task-status.in-progress {
  color: #6F4BFD;
  background-color: rgba(138, 43, 226, 0.1);
}

.task-progress {
  background-color: #2a2a2a;
  border-radius: 16rpx;
  padding: 20rpx;
}

.progress-label {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 12rpx;
  display: block;
}

.progress-bar-small {
  width: 100%;
  height: 16rpx;
  background-color: rgba(138, 43, 226, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.progress-fill-small {
  height: 100%;
  background-color: #6F4BFD;
  border-radius: 4rpx;
}

.progress-value {
  font-size: 24rpx;
  color: #6F4BFD;
}

/* 排行榜样式 */
.rank-list {
  margin-top: 20rpx;
}

.teamIcon {
  width: 36rpx;
  height: 36rpx;
}

.rank-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.rank-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rank-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  color: #fff;
}

.rank-badge.rank-1 {
  background-color: #FFD700;
}

.rank-badge.rank-2 {
  background-color: #C0C0C0;
}

.rank-badge.rank-3 {
  background-color: #CD7F32;
}

.rank-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.rank-team {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
}

.rank-captain,
.rank-stats {
  font-size: 24rpx;
  color: #9AA4AE;
}

.rank-trophy {
  width: 48rpx;
  height: 48rpx;
}

.team-count {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #9AA4AE;
}

.team-count-value {
  color: #fff;
}

.overview-card {
  // background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx 0;
  margin-bottom: 30rpx;
}

.card-tabs {
  display: flex;
  gap: 40rpx;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #3B3B3B;
}

.tab-active {
  font-size: 30rpx;
  font-weight: 500;
  color: #fff;
  position: relative;

  // &::after {
  //   content: '';
  //   position: absolute;
  //   bottom: -20rpx;
  //   left: 0;
  //   width: 100%;
  //   height: 6rpx;
  //   background-color: #8a2be2;
  //   border-radius: 3rpx;
  // }
}

.tab {
  font-size: 30rpx;
  color: #9AA4AE;
  font-weight: 500;
}

.overview-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.overview-item {
  text-align: center;
  // flex: 1;
  width: 190rpx;
  background-color: #3B3B3B;
  padding: 20rpx;
  border-radius: 16rpx;

}

.overview-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.overview-label {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-top: 10rpx;
}

.volume-card {
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.card-percentage {
  font-size: 28rpx;
  color: #9AA4AE;
}

.volume-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.volume-item {
  flex: 1;
}

.volume-label {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 10rpx;
}

.volume-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.trend-card {
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
}

.card-more {
  font-size: 24rpx;
  color: #9AA4AE;
}

.chart-container {
  height: 300rpx;
  margin-top: 30rpx;
  display: flex;
  align-items: flex-end;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  // height:300rpx;
  width: 100%;
  padding: 0 5rpx;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 30rpx;
  height: 100%;
}

.chart-bar {
  width: 40rpx;
  background: #6F4BFDF4;
  // border-radius: 10rpx 10rpx 0 0;
  margin-bottom: 10rpx;
  min-height: 20rpx;
}

.chart-date {
  font-size: 20rpx;
  color: #9AA4AE;
}

.detail-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  padding-bottom: 20rpx;
}

.detail-item {
  background-color: #2A2A2A;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 8rpx;
}

.detail-date {
  font-size: 22rpx;
  color: #9AA4AE;
}

.detail-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #4CAF50;
}

.upgrade-btn {
  // background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  text-align: center;
  // margin-bottom: 60rpx;
  color: #9AA4AE;
  border: 1rpx solid #9AA4AE;
  margin-top: 40rpx;
}

.btn-box {
  display: flex;
  justify-content: space-between;
  padding-bottom: 40rpx;
}



.btn-item {
  width: 320rpx;
  height: 84rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9AA4AE;
  border: 1rpx solid #9AA4AE;
}

.active-btn {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border: none;
  color: #fff;
}

.upgrade-btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}
</style>