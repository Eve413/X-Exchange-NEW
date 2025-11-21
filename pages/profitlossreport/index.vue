<template>
  <view class="profit-loss-report-page">
    <!-- 固定头部 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <image class="back-arrow" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <view class="header-center">
        <text class="header-title">盈亏报表</text>
      </view>
      <view class="header-right">
        <!-- 占位，保持标题居中 -->
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 时间标签切换 -->
      <view class="time-tabs">
        <view :class="['time-tab', activeTab === 'today' ? 'active' : '']" @click="handleActiveTab('today')">{{t('profitleLose.today')}}</view>
        <view :class="['time-tab', activeTab === 'week' ? 'active' : '']" @click="handleActiveTab('week') ">{{t('profitleLose.this_week')}}</view>
        <view :class="['time-tab', activeTab === 'month' ? 'active' : '']" @click="handleActiveTab('month')">{{t('profitleLose.this_month')}}</view>
      </view>

      <!-- 总盈亏卡片 -->
      <view class="summary-card">
        <view class="summary-header">
          <view class="summary-title">{{t('profitleLose.total_profit_loss')}}</view>
          <view class="card-right">
            <text class="summary-value positive">{{ dataProfit?.TotalProfitLoss?.total }}</text>
            <text class="summary-label-bottom">{{ dataProfit?.TotalProfitLoss?.baseAsset }}</text>
          </view>
        </view>
        <view class="summary-percentage positive">{{ dataProfit?.TotalProfitLoss?.percent }}</view>
      </view>

      <!-- 盈亏类型卡片 -->
      <view class="profit-loss-cards">
        <view class="profit-loss-card">
          <text class="profit-loss-label">{{t('profitleLose.realized_profit_loss')}}</text>
          <text class="profit-loss-value positive">{{ dataProfit?.RealizedProfitLoss?.total }}</text>
          <text class="profit-loss-label-bottom">{{ dataProfit?.RealizedProfitLoss?.baseAsset }}</text>
        </view>
        <view class="profit-loss-card">
          <text class="profit-loss-label">{{t('profitleLose.unrealized_profit_loss')}}</text>
          <text class="profit-loss-value positive">{{ dataProfit?.UnrealizedProfitLoss?.total }}</text>
          <text class="profit-loss-label-bottom">{{ dataProfit?.UnrealizedProfitLoss?.baseAsset }}</text>
        </view>
      </view>

      <!-- 盈亏日历 -->
      <view class="calendar-section">
        <view class="calendar-header">
          <text class="section-title">{{t('profitleLose.profit_loss_calendar')}}</text>
          <view class="calendar-nav">
            <text class="nav-button" @click="prevMonth">&laquo;</text>
            <text class="nav-button" @click="prevYear">&lt;</text>
            <text class="current-date">{{ currentYear }}年{{ currentMonth }}月</text>
            <text class="nav-button" @click="nextYear">&gt;</text>
            <text class="nav-button" @click="nextMonth">&raquo;</text>
          </view>
        </view>

        <!-- 日历星期标题 -->
        <view class="calendar-weekdays">
          <view class="weekday">日</view>
          <view class="weekday">一</view>
          <view class="weekday">二</view>
          <view class="weekday">三</view>
          <view class="weekday">四</view>
          <view class="weekday">五</view>
          <view class="weekday">六</view>
        </view>

        <!-- 日历日期网格 -->
        <view class="calendar-grid">
          <view v-for="(day, index) in calendarDays" :key="index" :class="['calendar-day', {
            'other-month': !day.isCurrentMonth,
            'profit': day.status === 'profit',
            'loss': day.status === 'loss',
            'flat': day.status === 'flat'
          }]">
            <text class="day-number">{{ day.date }}</text>
            <text v-if="day.profitAmount" :class="['profit-amount', day.status]">
              {{ day.profitAmount }}
            </text>
          </view>
        </view>

        <!-- 图例说明 -->
        <view class="calendar-legend">
          <view class="legend-item">
            <view class="legend-color profit"></view>
            <text class="legend-text">{{t('profitleLose.profit')}}</text>
          </view>
          <view class="legend-item">
            <view class="legend-color loss"></view>
            <text class="legend-text">{{t('profitleLose.loss')}}</text>
          </view>
          <view class="legend-item">
            <view class="legend-color flat"></view>
            <text class="legend-text">{{t('profitleLose.breakeven')}}</text>
          </view>
        </view>
      </view>

      <!-- 交易列表 -->
      <view class="trade-list-section">
        <view class="section-header">
          <text class="section-title">{{t('profitleLose.trade_details')}}</text>
          <text class="trade-count">{{ tradeList.length }}{{t('profitleLose.count')}}</text>
        </view>

        <!-- 交易记录项 -->
        <view class="trade-item" v-for="(trade, index) in tradeList" :key="index">
          <view class="trade-main">
            <view class="trade-symbol">{{ trade.symbol }}</view>
            <view class="trade-status" :class="trade.isRealized ? 'realized' : 'unrealized'">{{ trade.type }}</view>
          </view>
          <view class="trade-center">
            <view class="trade-time">{{ trade.time }}</view>
            <view class="trade-result" :class="trade.profit > 0 ? 'positive' : 'negative'">
              {{ trade.profit > 0 ? '+' : '' }}{{ trade.profit }}USDT
            </view>
          </view>
          <view class="trade-details">
            <view class="trade-leverage">{{ trade.leverage }}</view>
            <view class="trade-percentage" :class="trade.profit > 0 ? 'positive' : 'negative'">
              {{ trade.profit > 0 ? '+' : '' }}{{ trade.percentage }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()
import {useUserStore, ProfitLossParams} from '@/store/modules/user'
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

// 当前选中的时间标签
const activeTab = ref('today')

// 盈亏数据
const totalProfit = ref({
  value: '+323.12',
  currency: 'USDT',
  percentage: '+2.54%',
  isPositive: true
})

const realizedProfit = ref({
  value: '+280.50',
  currency: 'USDT',
  isPositive: true
})

const unrealizedProfit = ref({
  value: '+52.64',
  currency: 'USDT',
  isPositive: true
})

// 日历数据
const currentYear = ref(2025)
const currentMonth = ref(11)

// 模拟的日历盈亏数据
const calendarProfitData = ref({
//   1: { status: 'profit', amount: '+120' },
//   2: { status: 'loss', amount: '-120' },
//   3: { status: 'profit', amount: '+120' }
})

// 生成日历数据
const calendarDays = ref([])

// 生成指定年月的日历
const generateCalendar = (year, month) => {
  const days = []
  // 获取当月第一天是星期几
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 获取当月的天数
  const daysInMonth = new Date(year, month, 0).getDate()
  // 获取上个月的天数
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  // 添加上个月的尾部日期
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      status: '',
      profitAmount: ''
    })
  }

  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = calendarProfitData.value[i] || { status: '', amount: '' }
    days.push({
      date: i,
      isCurrentMonth: true,
      status: dayData.status,
      profitAmount: dayData.amount
    })
  }

  // 补充下个月的日期，使网格完整
  const remainingDays = 42 - days.length // 6行7列
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      status: '',
      profitAmount: ''
    })
  }

  calendarDays.value = days
}

// 切换到上个月
const prevMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 1) {
    currentMonth.value = 12
    currentYear.value--
  }
  generateCalendar(currentYear.value, currentMonth.value)
}

// 切换到下个月
const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 12) {
    currentMonth.value = 1
    currentYear.value++
  }
  generateCalendar(currentYear.value, currentMonth.value)
}

// 切换到上一年
const prevYear = () => {
  currentYear.value--
  generateCalendar(currentYear.value, currentMonth.value)
}

// 切换到下一年
const nextYear = () => {
  currentYear.value++
  generateCalendar(currentYear.value, currentMonth.value)
}

// 模拟交易数据
const tradeList = ref<Array<{
  time: string
  profit: number
  percentage: number
  symbol: string
  leverage: number
  isRealized: boolean,
  type:string
  
}>>([])

const dataProfit = ref(null)
// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  console.log('盈亏报表页面加载完成')
  // 生成日历
  generateCalendar(currentYear.value, currentMonth.value)
getProfitLoss();
  // 移除自动弹出的参与成功弹窗
  // setTimeout(() => {
  //   simulateParticipation()
  // }, 1000)
})

const getProfitLoss = async () =>  {
  try {
     tradeList.value = [];
          const profitLossParams: ProfitLossParams = {
            passkey: userStore.pasKeyAuth,
            device:userStore.deviceAuth,
            appversion:userStore.appversionAuth,
            token: userInfo.data.token,
            lang: "en",
            period: activeTab.value,
            calendar: currentYear.value +"-"+ currentMonth.value
          }

          

          const resultAirdrops = await userStore.getProfitLoss(profitLossParams)

      
              if (resultAirdrops?.data?.status === -1){
                            handleLogout()
                        }

     interface Trade {
            time: string
            profit: number
            percentage: number
            symbol: string
            leverage: number
            isRealized: boolean,
            type:string
            }

            let tradeData: Trade[] = []

            resultAirdrops?.data?.data?.List?.forEach(item => {
            tradeData.push({
                time: item?.time ?? '',
                profit: item?.total ?? 0,
                percentage: item?.percent ?? 0,
                symbol: item?.symbol ?? '',
                leverage: item?.leverage ?? 0,
                isRealized: item?.type === "Unrealized" ? false : true,
                type: item?.type 
            })
            })

        tradeList.value = tradeData

        dataProfit.value = resultAirdrops?.data?.data

        //   overviewStats.value = resultAirdrops.data.summary
        //   airdropList.value = resultAirdrops.data.data
          // coins.value = resultWallets.data.data.Asset.Currency.filter(item => item.type === fromAccount.value.id)
         

          // Update reactive array dengan assignment, bukan push loop
          // cryptoData.value = resultAuth.data

        } catch (e) {
          console.error('❌ Failed to load tickers:', e)
        }
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除所有用户相关数据
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isRegistered')
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('login_cache')

        // 显示退出成功提示
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })

        // 跳转到启动页
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/startup' })
        }, 1000)
      }
    }
  })
}

const handleActiveTab = (value:string) => {
activeTab.value = value
getProfitLoss()
}

</script>

<style lang="scss" scoped>
.profit-loss-report-page {
  min-height: 100vh;
  background: #202020;
  color: #ffffff;
}

/* 头部样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 32rpx 24rpx;
  background: #202020;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-arrow {
  width: 40rpx;
  height: 32rpx;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* 内容区域 */
.content {
  padding: 0 32rpx 32rpx;
}

/* 时间标签样式 */
.time-tabs {
  display: flex;
  gap: 32rpx;
  margin-bottom: 32rpx;
  padding-top: 16rpx;
}

.time-tab {
  padding: 16rpx 40rpx;
  border-radius: 40rpx;
  background: #2a2a2a;
  color: #9AA4AE;
  font-size: 28rpx;
  text-align: center;
}

.time-tab.active {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
}

/* 总盈亏卡片 */
.summary-card {
  background: #2a2a2a;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.summary-header {
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  // align-items: center;
  margin-bottom: 16rpx;
}

.card-right {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.summary-title {
  font-size: 28rpx;
  color: #9AA4AE;
}

.summary-value {
  font-size: 48rpx;
  font-weight: 700;
}

.summary-value.positive {
  color: #22c55e;
}

.summary-value.negative {
  color: #ef4444;
}

.summary-percentage {
  font-size: 26rpx;
}

.summary-percentage.positive {
  color: #22c55e;
}

.summary-percentage.negative {
  color: #ef4444;
}

/* 盈亏类型卡片 */
.profit-loss-cards {
  display: flex;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.profit-loss-card {
  flex: 1;
  background: #2a2a2a;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
}

.profit-loss-label {
  font-size: 28rpx;
  color: #9AA4AE;
  margin-bottom: 12rpx;
  display: block;
}

.profit-loss-label-bottom {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 12rpx;
  display: block;
}

.summary-label-bottom {
  font-size: 26rpx;
  color: #9AA4AE;
  margin-left: 12rpx;
  // margin-bottom: 12rpx;
  // display: block;
}

.profit-loss-value {
  font-size: 36rpx;
  font-weight: 600;
}

.profit-loss-value.positive {
  color: #22c55e;
}

.profit-loss-value.negative {
  color: #ef4444;
}

/* 盈亏日历 */
.calendar-section {
  background: #2a2a2a;
  border-radius: 24rpx;
  padding: 24rpx 32rpx 32rpx;
  margin-bottom: 24rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.nav-button {
  color: #9AA4AE;
  font-size: 28rpx;
  width: 40rpx;
  text-align: center;
}

.current-date {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.weekday {
  text-align: center;
  color: #9AA4AE;
  font-size: 24rpx;
  padding: 12rpx 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  // padding: 4rpx; 
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.profit {
  background: rgba(34, 197, 94, 0.1);
}

.calendar-day.loss {
  background: rgba(239, 68, 68, 0.1);
}

.calendar-day.flat {
  background: rgba(154, 164, 174, 0.1);
}

.day-number {
  font-size: 28rpx;
  color: #ffffff;
  margin-bottom: 4rpx;
}

.profit-amount {
  font-size: 20rpx;
}

.profit-amount.profit {
  color: #22c55e;
}

.profit-amount.loss {
  color: #ef4444;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 32rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-color {
  width: 16rpx;
  height: 16rpx;
  border-radius: 4rpx;
}

.legend-color.profit {
  background: #22c55e;
}

.legend-color.loss {
  background: #ef4444;
}

.legend-color.flat {
  background: #9AA4AE;
}

.legend-text {
  font-size: 24rpx;
  color: #9AA4AE;
}

/* 交易列表 */
.trade-list-section {
  background: #2a2a2a;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.trade-count {
  font-size: 24rpx;
  color: #9AA4AE;
}

.trade-item {
  // background: #3B3B3B;
  // border-radius: 16rpx;
  padding: 24rpx 0;
  margin-bottom: 16rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.trade-item:last-child {
  margin-bottom: 0;
}

.trade-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.trade-symbol {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

.trade-status {
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
  font-weight: 500;
}

.trade-status.realized {
  background: rgba(85, 101, 185, 0.2);
  color: #5565B9;
}

.trade-status.unrealized {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}
.trade-center{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trade-time {
  font-size: 22rpx;
  color: #9AA4AE;
  margin-bottom: 12rpx;
}

.trade-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-result {
  font-size: 28rpx;
  font-weight: 600;
}

.trade-result.positive {
  color: #22c55e;
}

.trade-result.negative {
  color: #ef4444;
}

.trade-leverage {
  font-size: 24rpx;
  color: #9AA4AE;
}

.trade-percentage {
  font-size: 24rpx;
  font-weight: 500;
}

.trade-percentage.positive {
  color: #22c55e;
}

.trade-percentage.negative {
  color: #ef4444;
}
</style>