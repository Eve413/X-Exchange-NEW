<template>
  <view class="edit-page">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @click="goBack">
        <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="nav-title">{{ t('trade.add.title') }}</text>
      <view class="header-right"></view>
    </view>

    <!-- 顶部标签栏 -->
    <view class="tabs-container">
      <view v-for="(tab, index) in tabs" :key="index" :class="['tab', currentTab === index ? 'active' : '']"
        @click="switchTab(index)">
        {{ t(`trade.add.tabs.${tabKeys[index]}`) }}
      </view>
    </view>

    <!-- 操作栏 -->
    <view class="operation-bar">
      <view class="left-header">
        <view class="column-header1">
          {{ t('trade.add.name') }}
          <image src="/static/icons/donwArrow.png" class="arrow-icon" mode="widthFix" />
        </view>
      </view>
      <view class="column-headers">
        <view class="column-header">
            <text>{{ t('trade.add.chart') }}</text>
            <image src="/static/icons/donwArrow.png" class="arrow-icon" mode="widthFix" />
          </view>
          <view class="column-header2">
            <text>{{ t('trade.add.change24h') }}</text>
            <image src="/static/icons/donwArrow.png" class="arrow-icon" mode="widthFix" />
          </view>
      </view>
    </view>

    <!-- 列表区域 -->
    <scroll-view class="items-list" scroll-y>
      <view v-for="(item, index) in displayItems" :key="item.code || index" class="result-item">
        <!-- 选择框 -->
        <view class="checkbox" @click.stop="toggleSelect(item)">
          <view class="checkbox-inner" :class="{ selected: selectedItems.includes(item) }">
            <text v-if="selectedItems.includes(item)" class="check-icon">
              <image src="/static/icons/groupSelect.png" class="check-img" mode="aspectFit" />
            </text>
          </view>
        </view>

        <view class="item-left">
          <image :src="item.icon" class="item-icon" mode="aspectFit" />
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-code">{{ item.quoteAsset || item.code }}</text>
          </view>
          <image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock" mode="aspectFit" />
        </view>
        <view class="item-right">
          <text class="item-price">{{ item.lastPrice }}</text>
          <text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
            {{ item.percentChange24h > 0 ? '+' : '' }}{{ Math.round(item.percentChange24h * 100) / 100 }}%
          </text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="select-all" @click="toggleSelectAll">
        <view class="checkbox" :class="{ selected: isAllSelected }">
          <text v-if="isAllSelected" class="check-icon">
            <image src="/static/icons/groupSelect.png" class="check-img" mode="aspectFit" />
          </text>
        </view>
        <view class="select-all-text">{{ t('trade.add.select_all') }}</view>
      </view>
      <view class="delete-btn" @click="addSelected" :class="{ disabled: selectedItems.length === 0 }">
        {{ t('trade.add.add') }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore, TickersParams } from '@/store/modules/user'
import { useSafeArea } from '@/utils/composables/useSafeArea'
import { tl } from '@/utils/i18n/setup'

const t = tl

const userStore = useUserStore()
const { getTopStyle } = useSafeArea()

// 响应式数据
const currentTab = ref(0)
const tabs = ['全部', '推荐', '持仓', '历史']
const tabKeys = ['all', 'recommended', 'holdings', 'history']
const tradeList = ref<any[]>([])
const selectedItems = ref<any[]>([])
const isPinTopMode = ref(false)

// 格式化数值显示
function formatValue(value: number | string) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'

  // 处理大数字显示，如 25.41亿
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }

  return num.toString()
}

// 格式化价格显示
function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '0'

  // 根据价格大小使用不同的精度
  if (num >= 1000) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
  } else if (num >= 1) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 3 })
  } else {
    return num.toFixed(6).replace(/\.?0+$/, '')
  }
}

// 模拟数据 - 与index.vue保持一致
function getMockData() {
  return [
    {
      id: 1,
      name: 'Bitcoin',
      code: 'BTC',
      pair: 'BTC/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_bitcoin.png',
      lastPrice: 2509.75,
      percentChange24h: 9.7,
      sparkline: '/static/icons/line_chart.png',
      pinned: true
    },
    {
      id: 2,
      name: 'Ethereum',
      code: 'ETH',
      pair: 'ETH/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_ethereum.png',
      lastPrice: 2509.75,
      percentChange24h: -21.0,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    },
    {
      id: 3,
      name: 'Binance Coin',
      code: 'BNB',
      pair: 'BNB/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 305.67,
      percentChange24h: 5.32,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    },
    {
      id: 4,
      name: 'Solana',
      code: 'SOL',
      pair: 'SOL/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_solana.png',
      lastPrice: 105.06,
      percentChange24h: 16.31,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    },
    {
      id: 5,
      name: 'Cardano',
      code: 'ADA',
      pair: 'ADA/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_cardano.png',
      lastPrice: 0.529,
      percentChange24h: -3.58,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    },
    {
      id: 6,
      name: 'Polkadot',
      code: 'DOT',
      pair: 'DOT/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 7.85,
      percentChange24h: 2.14,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    },
    {
      id: 7,
      name: 'Chainlink',
      code: 'LINK',
      pair: 'LINK/USDT',
      quoteAsset: 'USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 14.32,
      percentChange24h: -5.67,
      sparkline: '/static/icons/line_chart.png',
      pinned: false
    }
  ]
}

// 获取热门交易数据 - 与index.vue保持一致的逻辑
function getHotTradingData() {
  // 优先使用从API获取的真实数据
  if (tradeList.value.length > 0) {
    return tradeList.value.map((item, index) => ({
      ...item,
      id: index + 1,
      icon: item.icon || `/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'}.png`,
      sparkline: item.sparkline || '/static/icons/line_chart.png',
      quoteAsset: item.quoteAsset || item.code || ''
    }))
  } else {
    // 否则使用模拟数据
    return getMockData()
  }
}

// 计算属性
const displayItems = computed(() => {
  // 根据当前标签筛选数据
  let data = getHotTradingData()

  // 按照置顶状态和ID排序
  return data.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return a.id - b.id
  })
})

const isAllSelected = computed(() => {
  return selectedItems.value.length === displayItems.value.length && displayItems.value.length > 0
})

// 加载数据
async function loadData() {
  try {
    const tickersParams: TickersParams = {
      passkey: userStore.pasKeyAuth,
      type: '',
      limit: 20
    }

    const resultAuth = await userStore.getTickers(tickersParams)

    if (resultAuth && resultAuth.data && Array.isArray(resultAuth.data)) {
      tradeList.value = resultAuth.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
        icon: item.icon || `/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'}.png`,
        sparkline: item.sparkline || '/static/icons/line_chart.png',
        quoteAsset: item.quoteAsset || item.code || '',
        pinned: Math.random() > 0.7 // 随机模拟部分置顶
      }))
    } else {
      // 使用模拟数据
      tradeList.value = getMockData()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    // 加载失败时使用模拟数据
    tradeList.value = getMockData()
  }
}

// 标签切换
function switchTab(index: number) {
  currentTab.value = index
  // 切换标签时清空选择
  selectedItems.value = []
}

// 选择/取消选择
function toggleSelect(item: any) {
  const index = selectedItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
}

// 全选/取消全选
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...displayItems.value]
  }
}

// 置顶/取消置顶
function handlePinTop(item: any) {
  // 切换置顶状态
  item.pinned = !item.pinned
  console.log(`设置 ${item.name} 置顶状态: ${item.pinned}`)

  // 在实际应用中，这里应该调用API更新置顶状态
  // 模拟API调用
  setTimeout(() => {
    if (item.pinned) {
      uni.showToast({
        title: t('trade.add.pin_success', { name: item.name }),
        icon: 'none',
        duration: 1500
      })
    }
  }, 300)
}

// 切换置顶模式
function togglePinTop() {
  isPinTopMode.value = !isPinTopMode.value
  // 清空选择
  selectedItems.value = []

  if (isPinTopMode.value) {
      uni.showToast({
        title: t('trade.add.pin_top_mode_enabled'),
        icon: 'none',
        duration: 1500
      })
    } else {
      uni.showToast({
        title: t('trade.add.pin_top_mode_disabled'),
        icon: 'none',
        duration: 1500
      })
    }
}

// 排序
function sortItems() {
  // 实现简单的排序功能
  const sorted = [...tradeList.value].sort((a, b) => {
    // 先按置顶状态排序
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    // 再按名称排序
    return a.name.localeCompare(b.name)
  })

  // 更新列表
  tradeList.value = sorted

  // 显示排序成功提示
    uni.showToast({
      title: t('trade.add.sort_complete'),
      icon: 'success',
      duration: 1500
    })

  // 在实际应用中，这里应该调用API保存排序结果
  console.log('排序结果:', sorted)
}

// 添加选中项
function addSelected() {
  if (selectedItems.value.length === 0) return

  // 显示确认对话框
  uni.showModal({
    title: t('trade.add.confirm_add'),
    content: t('trade.add.confirm_add_content', { count: selectedItems.value.length }),
    success: (res) => {
      if (res.confirm) {
        // 在实际应用中，这里应该调用API添加到自选
        console.log('添加项目:', selectedItems.value)

        // 清空选择
        selectedItems.value = []

        // 显示添加成功提示
        uni.showToast({
          title: t('trade.add.add_success'),
          icon: 'success',
          duration: 1500
        })
        
        // 延时返回自选持有页面
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.edit-page {
  background-color: #202020;
  color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航栏 */
.nav-header {
  background-color: #202020;
  padding: 80rpx 30rpx 10rpx !important;
  /* padding-top: calc(30rpx + constant(safe-area-inset-top));
  padding-top: calc(30rpx + env(safe-area-inset-top)); */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  width: 60rpx;
}

.back {
  width: 40rpx;
  height: 36rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #ffffff;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  text-align: center;
}

.header-right {
  width: 60rpx;
}

/* 标签栏 */
.tabs-container {
  display: flex;
  padding: 0 20rpx;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  background-color: #202020;
  position: sticky;
  top: 92rpx;
  z-index: 99;
  height: 64rpx;
  align-items: center;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  height: 54rpx;
  line-height: 54rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #9AA4AE;
  margin-right: 10rpx;
  border-radius: 48rpx;
  background-color: #202020;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tab.active {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
}

/* 操作栏 */
.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #202020;
  position: sticky;
  top: 156rpx;
  z-index: 98;
  color: #a5a7aa;
  font-size: 26rpx;
}

/* 左侧头部 */
.left-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 列头样式 */
.column-headers {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.column-header1 {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #a5a7aa;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #a5a7aa;
  margin-right: 60rpx;
}

.column-header2 {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #a5a7aa;
}

.arrow-icon {
  width: 20rpx;
  height: 20rpx;
}

/* 列表区域 */
.items-list {
  flex: 1;
  padding: 0 30rpx 140rpx;
  background-color: #202020;
  height: calc(100vh - 286rpx);
}

/* 选择框 */
.checkbox {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.checkbox-inner {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 1rpx solid #888888;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.checkbox-inner.selected {
  border: none;
}

.check-icon {
  color: #ffffff;
  font-size: 24rpx;
}

.check-img {
  width: 36rpx;
  height: 36rpx;
}

/* 列表项样式 */
.result-item {
  display: flex;
  align-items: center;
  padding: 30rpx 30rpx;
  background-color: #2A2A2A;
  border-radius: 20rpx;
  margin-top: 20rpx;
}

/* 项目左侧 */
.item-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

/* 图标 */
.item-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 项目信息 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

/* 项目名称 */
.item-name {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180rpx;
}

/* 项目代码 */
.item-code {
  font-size: 24rpx;
  color: #9AA4AE;
}

/* 图表 */
.graph-img-stock {
  width: 140rpx;
  height: 60rpx;
  flex-shrink: 0;
}

/* 项目右侧 */
.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
  margin-left: 30rpx;
}

/* 价格 */
.item-price {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
  max-width: 120rpx;
  overflow: hidden;
}

/* 涨跌幅 */
.item-percent {
  font-size: 24rpx;
}

.item-percent.up {
  color: #16c784;
}

.item-percent.down {
  color: #ff4d4d;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx 40rpx;
  background-color: #1D1F24;
  /* border-top: 1rpx solid #333333; */
}

.select-all {
  display: flex;
  align-items: center;
}

.select-all .checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15rpx;
  margin-left: 0;
}

.select-all .checkbox.selected {
  /* background-color: #9370db; */
  border:none;
}

.select-all-text {
  font-size: 28rpx;
  color: #ffffff;
}

.delete-btn {
  padding: 15rpx 0;
  /* background-color: #9370db; */
  /* border-radius: 40rpx; */
  font-size: 28rpx;
  color: #D92A2A;
  font-weight: 500;
}

.delete-btn.disabled {
  /* background-color: #333333; */
  color: #666666;
}
</style>