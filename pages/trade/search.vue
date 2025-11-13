<template>
  <view class="search-page">
    <!-- 搜索栏 - 固定在顶部 -->
    <view class="search-header fixed-header">
      <view class="search-input-wrapper">
        <image
          src="/static/icons/searchLight.png"
          class="search-icon"
          mode="widthFix"
        />
        <input
          class="search-input"
          v-model="searchQuery"
          :placeholder="t('trade.search.placeholder')"
          placeholder-style="color: #999"
          @input="handleSearch"
        />
      </view>
      <text class="cancel-btn" @click="handleCancel">{{ t('trade.search.cancel') }}</text>
    </view>

    <!-- 内容区域 - 可滚动 -->
    <view class="scrollable-content">
      <!-- 历史搜索 - 只有在有历史数据且没有搜索查询时显示 -->
      <view
        class="history-section"
        v-if="historySearches.length > 0 && !searchQuery"
      >
        <view class="history-header">
          <text class="history-title">{{ t('trade.search.history.title') }}</text>
          <image
            src="/static/icons/clearIcon.png"
            class="delete-icon"
            mode="widthFix"
            @click="clearHistory"
          />
        </view>
        <view
          class="history-tags"
          :class="{ 'history-tags-expanded': isHistoryExpanded }"
        >
          <text
            v-for="(item, index) in historySearches"
            :key="index"
            class="history-tag"
            @click="searchHistoryItem(item)"
          >
            {{ item }}
          </text>
        </view>
        <!-- 只有当历史记录超过两行时显示展开/收起按钮 -->
        <view
          v-if="historySearches.length > 16"
          class="expand-history-btn"
          @click="toggleHistoryExpand"
        >
          <text>{{ isHistoryExpanded ? t('trade.search.history.collapse') : t('trade.search.history.expand') }}</text>
          <image
            src="/static/icons/arrow-bottom.png"
            class="arrow-bottom"
            mode="widthFix"
          />
        </view>
      </view>

      <!-- 搜索结果 - 有搜索查询时显示搜索结果，无搜索查询时显示热门交易 -->
      <view class="results-section">
        <!-- 热门交易标题 - 只有在无搜索查询时显示 -->
        <view class="results-header" v-if="!searchQuery">
          <text class="results-title">{{ t('trade.search.hot') }}</text>
        </view>
        <view class="results-list">
          <!-- 正常搜索结果 -->
          <template
            v-if="
              filteredResults.length > 0 && !filteredResults[0].isEmptyResult
            "
          >
            <view
              v-for="(item, index) in filteredResults"
              :key="index"
              class="result-item"
              @click="handleItemClick(item)"
            >
              <view class="item-left">
                <text v-if="item.id <= 5" class="item-rank">{{ item.id }}</text>
                <image :src="item.icon" class="item-icon" mode="aspectFit" />
                <view class="item-info">
                  <text class="item-name">{{ item.name }}</text>
                  <text class="item-code">{{
                    item.quoteAsset || item.code
                  }}</text>
                </view>
                <image
                  :src="item.sparkline"
                  class="graph-img-stock"
                  mode="aspectFit"
                />
              </view>
              <view class="item-right">
                <text class="item-price">{{
                  formatPrice(item.lastPrice)
                }}</text>
                <text
                  class="item-percent"
                  :class="item.percentChange24h > 0 ? 'up' : 'down'"
                >
                  {{ item.percentChange24h > 0 ? "+" : ""
                  }}{{ Math.round(item.percentChange24h * 100) / 100 }}%
                </text>
              </view>
            </view>
          </template>

          <!-- 空状态UI -->
          <template
            v-else-if="
              filteredResults.length > 0 && filteredResults[0].isEmptyResult
            "
          >
            <view class="empty-state">
              <image
                src="/static/icons/empty_bell.png"
                class="empty-icon"
                mode="aspectFit"
              />
              <text class="empty-title">{{ t('trade.search.empty.title') }}</text>
              <text class="empty-subtitle">{{ t('trade.search.empty.subtitle') }}</text>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore, TickersParams } from "@/store/modules/user";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 响应式数据
const searchQuery = ref("");
const tradeList = ref<any[]>([]);
const historySearches = ref<string[]>([
  "SOON",
  "PEPE",
  "AVAX",
  "SOON",
  "PEPE",
  "AAX",
  "SOON",
  "PEPE",
  "AVAX",
  "SOON",
  "PEPE",
  "AAX",
  "SOON",
  "PEPE",
  "AVAX",
  "SOON",
  "PEPE",
  "AAX",
]);
const isHistoryExpanded = ref(false);

const userStore = useUserStore();

// 计算属性：过滤搜索结果
const filteredResults = computed(() => {
  // 根据搜索状态返回数据
  if (!searchQuery.value || searchQuery.value.trim() === "") {
    // 无搜索查询时，显示热门交易数据
    // 如果有实际获取的数据，优先使用
    if (tradeList.value.length > 0) {
      return tradeList.value.slice(0, 5).map((item, index) => ({
        ...item,
        id: index + 1, // 添加排名ID
      }));
    } else {
      // 否则使用热门交易模拟数据
      return getHotTradingData();
    }
  } else {
    // 有搜索查询时，返回搜索结果
    const query = searchQuery.value.toLowerCase();
    const filtered = tradeList.value.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.code?.toLowerCase().includes(query) ||
        item.pair?.toLowerCase().includes(query)
    );

    // 如果没有匹配结果，显示提示信息
    if (filtered.length === 0) {
      return [
        {
          id: -1,
          name: "暂无匹配结果",
          code: "",
          icon: "",
          lastPrice: 0,
          percentChange24h: 0,
          isEmptyResult: true,
        },
      ];
    }

    return filtered;
  }
});

// 获取热门交易数据
function getHotTradingData() {
  // 确保返回的热门交易数据包含正确的ID，用于显示排名
  return [
    {
      id: 1,
      name: "Bitcoin",
      code: "BTC",
      pair: "BTC/USDT",
      icon: "/static/logo/logos_bitcoin.png",
      lastPrice: 2509.75,
      percentChange24h: 9.7,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 2,
      name: "Ethereum",
      code: "ETH",
      pair: "ETH/USDT",
  icon: "/static/logo/logos_eth.png",
      lastPrice: 2509.75,
      percentChange24h: -21.0,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 3,
      name: "Binance Coin",
      code: "BNB",
      pair: "BNB/USDT",
      icon: "/static/logo/logos_binance.png",
      lastPrice: 305.67,
      percentChange24h: 5.32,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 4,
      name: "Solana",
      code: "SOL",
      pair: "SOL/USDT",
      icon: "/static/logo/logos_solana.png",
      lastPrice: 105.06,
      percentChange24h: 16.31,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 5,
      name: "Cardano",
      code: "ADA",
      pair: "ADA/USDT",
      icon: "/static/logo/logos_cardano.png",
      lastPrice: 0.529,
      percentChange24h: -3.58,
      sparkline: "/static/icons/line_chart.png",
    },
  ];
}

// 生命周期
onMounted(() => {
  console.log("Search page mounted");
  loadData(""); // 按照trade页面的方式传入type参数
});

// 加载数据 - 与trade页面保持一致的参数和处理方式
async function loadData(type: string) {
  try {
    const tickersParams: TickersParams = {
      passkey: userStore.pasKeyAuth,
      type: type || "",
      limit: 100, // 使用与trade页面相同的limit值
    };
    const resultAuth = await userStore.getTickers(tickersParams);
    tradeList.value = resultAuth.data;
    console.log("✅ Loaded trade data:", tradeList.value.length, "items");

    // 如果API返回的数据为空，使用模拟数据
    if (!tradeList.value || tradeList.value.length === 0) {
      console.log("⚠️  API returned empty data, using mock data");
      tradeList.value = getMockData();
    }
  } catch (e) {
    console.error("❌ Failed to load tickers:", e);
    // 如果加载失败，使用模拟数据
    tradeList.value = getMockData();
    console.log("⚠️  Using mock data due to API error");
  }
}

// 模拟数据
function getMockData() {
  return [
    {
      id: 1,
      name: "Bitcoin",
      code: "BTC",
      pair: "BTC/USDT",
      icon: "/static/logo/logos_bitcoin.png",
      lastPrice: 2509.75,
      percentChange24h: 9.7,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 2,
      name: "Ethereum",
      code: "ETH",
      pair: "ETH/USDT",
  icon: "/static/logo/logos_eth.png",
      lastPrice: 2509.75,
      percentChange24h: -21.0,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 3,
      name: "Binance Coin",
      code: "BNB",
      pair: "BNB/USDT",
      icon: "/static/logo/logos_binance.png",
      lastPrice: 305.67,
      percentChange24h: 5.32,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 4,
      name: "Solana",
      code: "SOL",
      pair: "SOL/USDT",
      icon: "/static/logo/logos_solana.png",
      lastPrice: 105.06,
      percentChange24h: 16.31,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 5,
      name: "Cardano",
      code: "ADA",
      pair: "ADA/USDT",
      icon: "/static/logo/logos_cardano.png",
      lastPrice: 0.529,
      percentChange24h: -3.58,
      sparkline: "/static/icons/line_chart.png",
    },
  ];
}

// 格式化价格
function formatPrice(price: number) {
  if (price >= 1000) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  return price;
}

// 处理搜索
function handleSearch() {
  console.log("搜索查询:", searchQuery.value);
  console.log("过滤结果数量:", filteredResults.value.length);
}

// 点击历史搜索项
function searchHistoryItem(item: string) {
  searchQuery.value = item;
}

// 清除历史记录
function clearHistory() {
  historySearches.value = [];
}

// 处理取消
function handleCancel() {
  uni.navigateBack();
}

// 切换历史记录展开/收起状态
function toggleHistoryExpand() {
  isHistoryExpanded.value = !isHistoryExpanded.value;
}

// 处理列表项点击 - 与trade页面保持一致的跳转方式
function handleItemClick(item: any) {
  // 不处理空结果项的点击
  if (item.isEmptyResult) {
    return;
  }

  // 添加到历史搜索
  if (!historySearches.value.includes(item.code || item.pair)) {
    historySearches.value.unshift(item.code || item.pair);
    // 最多保留6个历史记录
    if (historySearches.value.length > 6) {
      historySearches.value.pop();
    }
  }

  // 跳转到详情页面 - 与trade页面保持一致的参数传递方式
  uni.navigateTo({
    url:
      "/pages/detiltrade/index?data=" +
      encodeURIComponent(JSON.stringify(item)),
    success: () => console.log("✅ Navigated to detail page"),
    fail: (err) => console.error("❌ Navigation failed:", err),
  });
}
</script>

<style scoped>
.search-page {
  background-color: #202020;
  min-height: 100vh;
  color: #fff;
  position: relative;
  padding-bottom: 30rpx;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

/* 固定在顶部的样式 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 80rpx 30rpx 30rpx;
  /* padding-top: calc(50rpx + constant(safe-area-inset-top)); */
  /* padding-top: calc(50rpx + env(safe-area-inset-top)); */
  background-color: #202020;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 可滚动内容区域 */
.scrollable-content {
  padding: 180rpx 30rpx 0;
  padding-top: calc(180rpx + constant(safe-area-inset-top));
  padding-top: calc(180rpx + env(safe-area-inset-top));
  overflow-y: auto;
  max-height: calc(100vh - 40rpx);
}

.search-input-wrapper {
  width: 600rpx;
  height: 64rpx;
  /* flex: 1; */
  background-color: #434343;
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 20rpx;
}

.search-input {
  flex: 1;
  color: #fff;
  font-size: 28rpx;
}

.cancel-btn {
  color: #6f4bfd;
  font-size: 28rpx;
}

.history-section {
  margin-bottom: 40rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.history-title {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}

.delete-icon {
  width: 30rpx;
  height: 30rpx;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  max-height: 120rpx;
  /* 限制两行高度 */
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.history-tags-expanded {
  max-height: none;
  /* 展开时不限制高度 */
}

.expand-history-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8rpx;
  margin-top: 20rpx;
  padding: 10rpx;
}

.arrow-bottom {
  width: 26rpx;
  height: 26rpx;
}

.expand-history-btn text {
  color: #6f4bfd;
  font-size: 24rpx;
}

.expand-icon {
  width: 20rpx;
  height: 20rpx;
}

.history-tag {
  background-color: #2a2a2a;
  color: #fff;
  padding: 6rpx 22rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
}

.results-section {
  min-height: 70vh;
}

.results-header {
  margin-bottom: 30rpx;
}

.results-title {
  color: #fff;
  font-size: 28rpx;
}

.results-list {
  display: flex;
  flex-direction: column;
  /* gap: 30rpx; */
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 20rpx;
  height: 144rpx;
  border-radius: 20rpx;
  background-color: #2a2a2a;
  /* border-bottom: 1rpx solid #333; */
  position: relative;
  margin-top: 30rpx;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8rpx;
}

.item-rank {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  /* margin-right: 16rpx; */
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8rpx;
  margin-right: 20rpx;
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

.item-code {
  color: #666;
  font-size: 22rpx;
}

.item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-left: 20rpx;
}

.item-price {
  color: #fff;
  font-size: 32rpx;
}

.item-percent {
  font-size: 28rpx;
}

.item-percent.up {
  color: #16c784;
}

.item-percent.down {
  color: #ff4d4d;
}

/* 图表图片样式 */
.graph-img-stock {
  width: 120rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  text-align: center;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
  opacity: 0.7;
}

.empty-title {
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.empty-subtitle {
  color: #666;
  font-size: 28rpx;
}

/* 确保有足够的底部间距 */
.search-page {
  /* padding-bottom: 100rpx; */
}
</style>
