<template>
  <view class="edit-page">
    <SafeTop :extraPadding="0" />
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @click="goBack">
        <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="nav-title">{{ t('trade.edit.title') }}</text>
      <view class="header-right"></view>
    </view>

    <!-- 顶部标签栏 -->
    <view class="tabs-container">
      <view v-for="(tab, index) in tabs" :key="index" :class="['tab', currentTab === index ? 'active' : '']"
        @click="switchTab(index)">
        {{ tab }}
      </view>
    </view>

    <!-- 操作栏 -->
    <view class="operation-bar">
      <view class="select-title">{{ t('trade.edit.select_product') }}</view>
      <view class="operations">
        <view class="operation-btn">{{ t('trade.edit.pin_top') }}</view>
        <view class="operation-btn operation-btn1">{{ t('trade.edit.sort') }}</view>
      </view>
    </view>

    <!-- 列表区域 -->
    <scroll-view class="items-list" scroll-y>
      <view v-for="(item, index) in displayItems" :key="item.code || index" class="item-row">
        <!-- 选择框 -->
        <view class="checkbox" @click.stop="toggleSelect(item)">
          <view class="checkbox-inner" :class="{ selected: selectedItems.includes(item) }">
            <text v-if="selectedItems.includes(item)" class="check-icon">
              <image src="/static/icons/groupSelect.png" class="check-img" mode="aspectFit" />
            </text>

          </view>
        </view>

        <!-- 项目信息 -->
        <view class="item-info">
          <image :src="item.icon" class="item-icon" mode="aspectFit" />
          <view class="item-details">
            <view class="item-left">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-hint">{{ item.lastPrice }}</text>
            </view>

            <text v-if="item.leverage" class="leverage">{{ item.leverage }}</text>
          </view>
          <!-- <text class="item-value">{{ formatValue(item.lastPrice) }}</text> -->
        </view>

        <!-- 置顶图标 -->
        <view class="pin-icon" @click.stop="handlePinTop(item)">
          <image src="/static/icons/PinnedIcon.png" class="pin-img" mode="widthFix" />
        </view>

        <!-- 排序图标 -->
        <view class="drag-icon">
          <image src="/static/icons/sortIcon.png" class="drag-img" mode="widthFix" />
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
        <view class="select-all-text">{{ t('trade.edit.select_all') }}</view>
      </view>
      <view class="delete-btn" @click="deleteSelected" :class="{ disabled: selectedItems.length === 0 }">
        {{ t('trade.edit.delete') }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore, TickersParams } from '@/store/modules/user'
import { SafeTop } from '@/components'
import { tl } from '@/utils/i18n'

const userStore = useUserStore()
const t = tl

// 响应式数据
const currentTab = ref(0)
const tabs = ref([
  t('trade.edit.tabs.all'), 
  t('trade.edit.tabs.holdings'), 
  t('trade.edit.tabs.hongkong_stocks'), 
  t('trade.edit.tabs.spot'), 
  t('trade.edit.tabs.contract'), 
  t('trade.edit.tabs.xcoins_zone')
])
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

// 模拟数据 - 与index.vue保持一致
function getMockData() {
  return [
    {
      id: 1,
      name: 'BTC',
      code: 'BTC',
      pair: 'BTC/USDT',
      icon: '/static/logo/logos_bitcoin.png',
      lastPrice: 254100000000,
      percentChange24h: 9.7,
      leverage: '永续',
      pinned: true
    },
    {
      id: 2,
      name: 'ETH',
      code: 'ETH',
      pair: 'ETH/USDT',
  icon: '/static/logo/logos_eth.png',
      lastPrice: 16687000000,
      percentChange24h: -21.0,
      leverage: '5X',
      pinned: false
    },
    {
      id: 3,
      name: 'BAND',
      code: 'BAND',
      pair: 'BAND/USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 101340000,
      percentChange24h: 5.32,
      leverage: '永续',
      pinned: false
    },
    {
      id: 4,
      name: 'ADA',
      code: 'ADA',
      pair: 'ADA/USDT',
      icon: '/static/logo/logos_cardano.png',
      lastPrice: 98650262.62,
      percentChange24h: -3.58,
      leverage: '20X',
      pinned: false
    },
    {
      id: 5,
      name: 'TRX',
      code: 'TRX',
      pair: 'TRX/USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 43580000,
      percentChange24h: 16.31,
      leverage: '10X',
      pinned: false
    },
    {
      id: 6,
      name: 'USDC',
      code: 'USDC',
      pair: 'USDC/USDT',
      icon: '/static/logo/logos_binance.png',
      lastPrice: 94724207,
      percentChange24h: -8.21,
      leverage: '15X',
      pinned: false
    },
    {
      id: 7,
      name: 'USDC',
      code: 'USDC',
      pair: 'USDC/USDT',
      icon: '/static/logo/logos_bitcoin.png',
      lastPrice: 94724207,
      percentChange24h: 1.92,
      leverage: '15X',
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
      leverage: item.leverage || (item.code === 'BTC' || item.code === 'BAND' ? '永续' : Math.floor(Math.random() * 20) + 1 + 'X')
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
      limit: 100,
      lang: userStore.language
    }

    const resultAuth = await userStore.getTickers(tickersParams)

    if (resultAuth && resultAuth.data && Array.isArray(resultAuth.data)) {
      tradeList.value = resultAuth.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
        icon: item.icon || `/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'}.png`,
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
        title: t('trade.edit.pin_success', { name: item.name }),
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
      title: t('trade.edit.pin_top_mode_enabled'),
      icon: 'none',
      duration: 1500
    })
  } else {
    uni.showToast({
      title: t('trade.edit.pin_top_mode_disabled'),
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
    title: t('trade.edit.sort_complete'),
    icon: 'success',
    duration: 1500
  })

  // 在实际应用中，这里应该调用API保存排序结果
  console.log('排序结果:', sorted)
}

// 删除选中项
function deleteSelected() {
  if (selectedItems.value.length === 0) return

  // 显示确认对话框
  uni.showModal({
    title: t('trade.edit.confirm_delete'),
    content: t('trade.edit.confirm_delete_content', { count: selectedItems.value.length }),
    success: (res) => {
      if (res.confirm) {
        // 删除选中项
        selectedItems.value.forEach(item => {
          const index = tradeList.value.findIndex(i => i.id === item.id)
          if (index > -1) {
            tradeList.value.splice(index, 1)
          }
        })

        // 清空选择
        selectedItems.value = []

        // 显示删除成功提示
        uni.showToast({
          title: t('trade.edit.delete_success'),
          icon: 'success',
          duration: 1500
        })
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
  padding: 20rpx 38rpx;
  background-color: #202020;
  /* border-bottom: 1rpx solid #333333; */
  position: sticky;
  top: 156rpx;
  z-index: 98;
}

.select-title {
  font-size: 24rpx;
  color: #9AA4AE;
}

.operations {
  display: flex;
  gap: 30rpx;
}

.operation-btn {
  font-size: 24rpx;
  color: #9AA4AE;
}

.operation-btn {
  margin-left: 70rpx;
}

/* 列表区域 */
.items-list {
  flex: 1;
  padding: 0 30rpx 140rpx;
  background-color: #202020;
  height: calc(100vh - 286rpx);
}

.item-row {
  display: flex;
  align-items: center;
  padding: 30rpx 30rpx;
  background-color: #2A2A2A;
  border-radius: 20rpx;
  margin-top: 20rpx;
  /* border-bottom: 1rpx solid #333333; */
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
  /* background-color: #9370db; */
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

/* 项目信息 */
.item-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  margin-left: 10rpx;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.item-left {
  display: flex;
  flex-direction: column;
}

.item-hint {
  font-size: 20rpx;
  color: #9AA4AE;

}

.item-name {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200rpx;
}

.leverage {
  font-size: 24rpx;
  color: #9AA4AE;
  background-color: #2a2a2a;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: flex-start;
}

.item-value {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  flex-shrink: 0;
  margin-left: 20rpx;
}

/* 置顶和排序图标 */
.pin-icon,
.drag-icon {
  /* margin: 0 50rpx; */
  flex-shrink: 0;
}

.pin-img,
.drag-img {
  width: 36rpx;
  height: 36rpx;
}

.drag-icon {
  margin-left: 100rpx;
}

.pin-img {
  transition: transform 0.3s;
}

.pin-img.pinned {
  transform: rotate(180deg);
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