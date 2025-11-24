<template>
  <view class="trader-page">
    <view class="header">
      <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
      <text class="title">Order Detail</text>
      <view>
        <image class="icon-small" src="/static/icons/trade/ic_note.png" mode="aspectFit" />
        <image class="icon-small" src="/static/tubiao/xiaoxi.png" mode="aspectFit" />
      </view>
    </view>
    <view class="navbar-sub">
      <view class="menu">
        <text v-for="(item, index) in menus" :key="index" class="menu-item" :class="{ active: activeMenu === item }"
          @tap="setActive(item)">
          {{ item.name }}
        </text>
      </view>
    </view>
    <!--Start Component TradeHistoryHolder -->
    <view class="container-top">
        <scroll-view class="tabs-stock" scroll-x="true" show-scrollbar="false">
          <view v-for="(tab, index) in tabs" :key="index"
            :class="['tab-stock', currentTab === index ? 'active-stock' : '']" @click="onSelectTab(index)">
            {{ tab }}
          </view>
        </scroll-view>
        <view class="container-column">
          <text class="text">{{ $t('trade-page.tab-history-container-one.one') }}</text>
          <text class="text">{{ $t('trade-page.tab-history-container-one.two') }}</text>
        </view>
        <scroll-view class="scroll-area" scroll-y :refresher-enabled="true"
          :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
          <!-- Tab 0: Current Positions -->
          <template v-if="currentTab === 0">
            <TradePositionCard
              v-for="(pos, idx) in listCurrentPositions"
              :key="pos.id || pos.orderNo || idx"
              :order-id="String(pos.orderNo || '')"
              :date="pos.orderTime"
              :name="pos.assetName"
              icon="/static/tether.png"
              :position-type="pos.positionType"
              :leverage="pos.leverage || ''"
              :duration="pos.holdingDuration"
              :progress="0"
              :pnl="Number(pos.unrealizedPnl || 0)"
              :roi="Number(pos.roi || 0)"
              :quantity="Number(pos.positionQuantity || 0)"
              :open-price="Number(pos.entryPrice || 0)"
              :liquidation-price="Number(pos.liquidationPrice || 0)"
              :mark-price="Number(pos.markPrice || 0)"
              :mark-change="pos.roiDisplay || '0.00%'"
              :margin="Number(pos.margin ?? 0)"
              :margin-rate="pos.marginRatioDisplay || '0.00%'"
              @addReduce="onAddReduce(pos)"
              @takeProfitStopLoss="onTakeProfitStopLoss(pos)"
              @closePosition="onClosePosition(pos)"
            />
            <view class="container-button">
              <button class="btn right gradient-blue" @click="onRendem">{{ $t('trade-page.button-bellow') }}</button>
            </view>
          </template>

          <!-- Tab 1: Current Orders -->
          <view v-else-if="currentTab === 1" class="tab-section">
            <TradeOrderCard
              v-for="(ord, idx) in listCurrentOrders"
              :key="ord.id || ord.orderNo || idx"
              :order-id="String(ord.orderNo || '')"
              :date="ord.orderTime"
              icon="/static/tether.png"
              :name="ord.assetName"
              typeAsset="永续"  
              :type="ord.positionType"
              :leverage="ord.leverage || ''"
              :duration="ord.holdingDuration"
              :progress="100" 
              :price="Number(ord.entryPrice || 0)"
              :quantity="Number(ord.positionQuantity || 0)"
              :amount="Number(ord.margin ?? 0)"
              @cancelOrder="handleCancel(ord)"
            />
          </view>

          <!-- Tab 2: Trade History -->
          <view v-else-if="currentTab === 2" class="tab-section">
            <TradeOrderHistoryCard
              v-for="(hist, idx) in listTradeHistory"
              :key="hist.id || hist.orderNo || idx"
              :order-id="String(hist.orderNo || '')"
              :date="hist.orderTime"
              icon="/static/tether.png"
              :name="hist.assetName"
              typeAsset="永续"
              :type="hist.positionType"
              :leverage="hist.leverage || ''"
              :fee="0"
              :pnl="Number(hist.unrealizedPnl || 0)"
              :price="Number(hist.entryPrice || 0)"
              :quantity="Number(hist.positionQuantity || 0)"
              :amount="Number(hist.margin ?? 0)"
            />
          </view>

          <!-- Tab 3: Fund Flow -->
          <view v-else-if="currentTab === 3" class="tab-section">
            <TradeFundFlowCard
              v-for="(flow, idx) in listFundFlow"
              :key="flow.id || flow.orderNo || idx"
              :order-id="String(flow.orderNo || '')"
              :date="flow.orderTime"
              icon="/static/tether.png"
              :name="flow.assetName"
              typeAsset="永续"
              :type="flow.positionType"
              :leverage="flow.leverage || ''"
              :pnl="Number(flow.unrealizedPnl || 0)"
            />
          </view>


        </scroll-view>
    </view>

	<!-- Bottom Navigation -->
	<BottomTabBar currentPath="/pages/market/history" @change="handleTabChange" />
    <!--End Component TradeHistoryHolder -->
  </view>

</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { TradePositionCard, TradeOrderCard, TradeOrderHistoryCard, TradeFundFlowCard, BottomTabBar } from '@/components';
import { useTradingStore } from '@/store/modules/trading';
import { onLoad } from '@dcloudio/uni-app';
const tradingStore = useTradingStore()
const { t } = useI18n();

const goBack = () => {
  uni.navigateBack()
}

const onRendem = () => {
  uni.showToast({ title: '跳转到赎回页面', icon: 'none' })
}
const menus = ref([
  { id: 0, name: t('trade-page.tab-history-one.one'), type: '' },
  { id: 1, name: t('trade-page.tab-history-one.two'), type: 'stock' },
  { id: 2, name: t('trade-page.tab-history-one.three'), type: 'stock' },
  { id: 3, name: t('trade-page.tab-history-one.four'), type: 'contract' },
  { id: 4, name: t('trade-page.tab-history-one.five'), type: 'finance' },
])
const activeMenu = ref(menus.value[0])
const all = ref(true)
const hongkong = ref(false)
const spot = ref(false)
const contracts = ref(false)
const finance = ref(false)

const listCurrentPositions = ref<any[]>([])
const listCurrentOrders = ref<any[]>([])
const listTradeHistory = ref<any[]>([])
const listFundFlow = ref<any[]>([])

onLoad( () => {
  onLoadHistory(0)
} )

function setActive(item: any) {
  activeMenu.value = item
  console.log('Selected Menu:', activeMenu.value)
  onLoadHistory(activeMenu.value.id)
}

const onLoadHistory = async (item: number) => {
  console.log('Load history data based on selected tab:', item)
  var type = "position";
  var assetType = "all";
  if (item === 0) { 
    assetType = "all"
  }else if (item === 1) {
    assetType = "stock"
  }else if (item === 2) {
    type = "spot"
  }else if (item === 3) {
    type = "contract"
  }

  try {
    const resultCurrentPosition = await tradingStore.fetchTradingHistory('position', assetType);
    const resultCurrentOrder = await tradingStore.fetchTradingHistory('order', assetType);
    listCurrentPositions.value = resultCurrentPosition.data;
    listCurrentOrders.value = resultCurrentOrder.data;
    listTradeHistory.value = resultCurrentPosition.data;
    listFundFlow.value = resultCurrentPosition.data;

    console.log('Fetched Trading History:', listCurrentPositions.value);
    console.log('Fetched Current Orders:', listCurrentOrders.value);
    console.log('Fetched Trade History:', listTradeHistory.value);
    console.log('Fetched Fund Flow:', listFundFlow.value);
  } catch (err) {
    console.error('Error fetching trading history:', err)
  }
}

const currentTab = ref(0)
const tabs = [t('trade-page.tab-history-two.one'), t('trade-page.tab-history-two.two'), t('trade-page.tab-history-two.three'), t('trade-page.tab-history-two.four')]
const isRefreshing = ref(false)

// handle tab change (centralized for future logic like analytics or data fetch)
function onSelectTab(index: number) {
  if (currentTab.value === index) return
  currentTab.value = index
  // TODO: trigger specific data fetch per tab when backend endpoints are ready
}

// Handle pull-to-refresh
const onRefresh = async () => {
  isRefreshing.value = true
  try {
    await onLoadHistory(activeMenu.value.id)
    console.log('Data refreshed successfully')
  } catch (err) {
    console.error('Error refreshing data:', err)
  } finally {
    isRefreshing.value = false
  }
}

// Handle position actions
const onAddReduce = (position: any) => {
  console.log('Add/Reduce position:', position)
  uni.showToast({ title: t('trade-page.add-reduce-position'), icon: 'none' })
}

const onTakeProfitStopLoss = (position: any) => {
  console.log('Take Profit/Stop Loss for:', position)
  uni.showToast({ title: t('trade-page.set-tp-sl'), icon: 'none' })
}

const onClosePosition = (position: any) => {
  console.log('Close position:', position)
  uni.showToast({ title: t('trade-page.close-position'), icon: 'none' })
}

const handleCancel = (order: any) => {
  console.log('Cancel order:', order)
  uni.showToast({ title: t('trade-page.cancel-order'), icon: 'none' })
}

const handleTabChange = (tab: any, index: number) => {
  console.log('Tab changed:', tab, index)
}


</script>

<style scoped>
.trader-page {
  display: flex;
  flex-direction: column;
  height: 300vh;
  background-color: #121212;
  /* Push content below fixed header height (120rpx) */
  padding-top: 120rpx;
}

.container-top {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #121212;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120rpx;
  padding: 10rpx 40rpx 0 40rpx;
  box-sizing: border-box;
}

.back {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
}

.left {
  align-items: flex-end;
}

.right {
  align-items: flex-start;
}

.icon {
  width: 35rpx;
  height: 35rpx;
  opacity: 1;
  margin-left: 15rpx;
}

.icon-small {
  width: 28rpx;
  height: 28rpx;
  opacity: 1;
  margin-right: 8rpx;
}

.text {
  font-size: 18rpx;
  margin-left: 20rpx;
}

.container-row {
  display: flex;
  flex-direction: row;
}

.container-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* position children (button) at the right side */
  padding: 0 24rpx;
  /* optional horizontal padding for alignment with content */
  width: 100%;
  /* make the row full-width */
}

.container-column {
  display: flex;
  flex-direction: column;
}

/* ✅ Navbar fixed at the top */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
  padding: 0 24rpx;
  height: 100rpx;
  border-bottom: 1rpx solid #2a2a2a;
  flex-shrink: 0;
  /* Prevent navbar from shrinking */
}

/* ✅ Navbar fixed at the top */
.navbar-sub {
  position: sticky;
  /* Stick below the fixed header (120rpx) */
  top: 120rpx;
  /* Keep below header z-index (header is 20) to avoid visual overlap */
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0 24rpx;
  height: 100rpx;
  border-bottom: 1rpx solid #2a2a2a;
  flex-shrink: 0;
  /* Prevent navbar from shrinking */
  background-color: #121212;
}

.page-content {
  flex: 1;
  /* Take remaining space */
  /* avoid clipping absolutely-positioned dropdowns */
  overflow: visible;
  position: relative;
  padding: 24rpx;
}

/* removed global mask in favor of document-level outside click handler */

.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30rpx;
  margin-bottom: 5rpx;
}

.menu-item {
  color: #999;
  font-size: 25rpx;
  padding: 8rpx 8rpx 8rpx 8rpx;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
}

.menu-item.active {
  color: #fff;
  font-weight: bold;
}

/* Konten scrollable di bawah navbar */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 200rpx;
}

/* Tabs */
.tabs-stock {
  white-space: nowrap;
  display: flex;
  overflow-x: auto;
  margin: 20rpx;
  padding-right: 20rpx;
}

.tab-stock {
  display: inline-block;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  font-size: 25rpx;
  color: #666;
  margin-right: 10rpx;
}

.active-stock {
  background: linear-gradient(90deg, #9c4df4, #ff4d6d);
  color: #fff;
}

/* Tab content sections */
.tab-section {
  padding: 32rpx 24rpx 64rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 0rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}

.placeholder {
  font-size: 24rpx;
  color: #888;
}

.btn {
  flex: 0;
  /* prevent stretching */
  margin: 0 6rpx;
  border-radius: 12rpx;
  padding: 12rpx 0;
  font-size: 28rpx;
  color: white;
  border: none;
  display: inline-flex;
  /* ensure proper centering */
  justify-content: center;
  align-items: center;
}

.btn.right {
  /* specialized width + alignment for redeem button */
  flex: 0 0 auto;
  /* prevent stretching */
  width: 200rpx;
  /* specific width; adjust as needed */
  text-align: center;
  margin-left: auto;
  /* push to the far right in flex row */
}

.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>