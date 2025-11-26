<template>
  <view class="trade-page">
    <!-- 顶部安全区：参照市场页使用 getTopStyle -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>
    <!-- ✅ Navbar di luar scroll-view agar tetap terlihat -->
    <view class="navbar">
      <image class="avatar" src="/static/icons/ic_avatar.png" mode="aspectFill" />

      <view class="menu">
        <text v-for="(item, index) in menus" :key="index" class="menu-item" :class="{ active: activeMenu === item }"
          @tap="setActive(item)">
          {{ item.name }}
        </text>
      </view>

      <view class="actions">
        <image class="iconSearch" src="/static/icons/searchLight.png" mode="widthFix" @click="goToSearch" />
        <view class="notif-container" @click="goToNotification">
          <image class="icon" src="/static/icons/noiceLight.png" mode="aspectFit" />
          <view class="dot"></view>
        </view>
      </view>
    </view>

    <!-- 固定在顶部的tab-top - 仅在tradeStock或addFavorit视图中显示 -->
    <view class="tab-top" v-if="tradeStock || addFavorit">
      <view class="tabs-container">
        <view v-for="(tab, index) in tabs" :key="index" :class="['tab', currentTab === index ? 'active' : '']"
          @click="currentTab = index">
          {{ tab }}
        </view>
      </view>

      <!-- Header -->
      <view class="table-header">
        <view class="left-header">
          <view class="edit-btn" @click="goToEdit">{{ t('common.edit') }}
            <image src="/static/icons/editIcon.png" class="editIcon" mode="widthFix" />
          </view>
          <view class="column-header1" @click="showNameSortMenu = !showNameSortMenu">
            {{ nameSortOption === 'name' ? t('trade.name') : nameSortOption === 'volume' ? t('trade.volume') : t('trade.addTime') }}
            <image src="/static/icons/arrow-bottom.png" class="arrow-icon"
              :class="{ 'rotate': showNameSortMenu }" mode="widthFix" />
          </view>
        </view>
        <view class="column-headers">
          <view class="column-header" @click="showTrendFilterMenu = !showTrendFilterMenu">
            <text>{{ trendFilterOption === 'all' ? t('trade.all') : trendFilterOption === 'up' ? t('trade.onlyUp') : trendFilterOption === 'down' ? t('trade.onlyDown') : trendFilterOption === 'highVol' ? t('trade.highVolatilityFirst') : t('trade.lowVolatilityFirst') }}</text>
            <image src="/static/icons/arrow-bottom.png" class="arrow-icon"
              :class="{ 'rotate': showTrendFilterMenu }" mode="widthFix" />
          </view>
          <view class="column-header2" @click="showChangeSortMenu = !showChangeSortMenu">
            <text>{{ changeSortOption === 'highToLow' ? t('trade.highToLow') : changeSortOption === 'lowToHigh' ? t('trade.lowToHigh') : t('trade.byVolatility') }}</text>
            <image src="/static/icons/arrow-bottom.png" class="arrow-icon"
              :class="{ 'rotate': showChangeSortMenu }" mode="widthFix" />
          </view>
        </view>
      </view>

      <!-- 下拉菜单移到scroll-view外部 -->
      <!-- 名称排序下拉菜单 -->
      <view v-if="showNameSortMenu" class="filter-dropdown name-dropdown">
        <view class="filter-option" :class="{ 'active': nameSortOption === 'name' }"
          @click="nameSortOption = 'name'; showNameSortMenu = false">
          <text>{{ t('trade.name') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': nameSortOption === 'volume' }"
          @click="nameSortOption = 'volume'; showNameSortMenu = false">
          <text>{{ t('trade.volume') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': nameSortOption === 'addTime' }"
          @click="nameSortOption = 'addTime'; showNameSortMenu = false">
          <text>{{ t('trade.addTime') }}</text>
        </view>
      </view>

      <!-- 趋势筛选下拉菜单 -->
      <view v-if="showTrendFilterMenu" class="filter-dropdown trend-dropdown">
        <view class="filter-option" :class="{ 'active': trendFilterOption === 'all' }"
          @click="trendFilterOption = 'all'; showTrendFilterMenu = false">
          <text>{{ t('trade.all') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': trendFilterOption === 'up' }"
          @click="trendFilterOption = 'up'; showTrendFilterMenu = false">
          <text>{{ t('trade.onlyUp') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': trendFilterOption === 'down' }"
          @click="trendFilterOption = 'down'; showTrendFilterMenu = false">
          <text>{{ t('trade.onlyDown') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': trendFilterOption === 'highVol' }"
          @click="trendFilterOption = 'highVol'; showTrendFilterMenu = false">
          <text>{{ t('trade.highVolatilityFirst') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': trendFilterOption === 'lowVol' }"
          @click="trendFilterOption = 'lowVol'; showTrendFilterMenu = false">
          <text>{{ t('trade.lowVolatilityFirst') }}</text>
        </view>
      </view>

      <!-- 24h涨跌排序下拉菜单 -->
      <view v-if="showChangeSortMenu" class="filter-dropdown change-dropdown">
        <view class="filter-option" :class="{ 'active': changeSortOption === 'highToLow' }"
          @click="changeSortOption = 'highToLow'; showChangeSortMenu = false">
          <text>{{ t('trade.highToLow') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': changeSortOption === 'lowToHigh' }"
          @click="changeSortOption = 'lowToHigh'; showChangeSortMenu = false">
          <text>{{ t('trade.lowToHigh') }}</text>
        </view>
        <view class="filter-option" :class="{ 'active': changeSortOption === 'volatility' }"
          @click="changeSortOption = 'volatility'; showChangeSortMenu = false">
          <text>{{ t('trade.byVolatility') }}</text>
        </view>
      </view>

      <!-- 点击空白区域关闭下拉菜单 -->
      <view v-if="showNameSortMenu || showTrendFilterMenu || showChangeSortMenu" class="dropdown-backdrop"
        @click="closeAllDropdowns"></view>
    </view>

    <!-- ✅ Konten scrollable dengan pull refresh -->
    <scroll-view :class="['scroll-area', { 'has-tab-top': tradeStock || addFavorit }]" scroll-y refresher-enabled
      :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
      <view class="trade-content" v-if="tradeFavorite">
        <view class="header">
          <text class="title">{{ t('trade.addHotPairs') }}</text>
          <text class="subtitle">{{ t('trade.tradeType') }}</text>
        </view>

        <!-- Grid Kartu -->
        <view class="grid">
          <view v-for="(item, index) in tradeList" :key="index" class="card" @click="handleCardClick(item, index)">
            <view class="card-header">
              <image class="coin-icon" :src="item.icon" mode="aspectFit" />
              <view class="pair-info">
                <text class="pair-type">{{ t('trade.spot5x') }}</text>
                <text class="pair-name">{{ item.pair }}</text>
              </view>
              <view class="circle" :class="{ active: item.active }" @click.stop="toggleFavoriteStatus(item)"></view>
            </view>

            <image class="chart" :src="item.sparkline" mode="aspectFit" />

            <view class="card-footer">
              <text class="price">{{ item.lastPrice }}</text>
              <text class="percent" :class="{
                up: item.percentChange24h > 0,
                down: item.percentChange24h < 0,
              }">
                {{ item.percentChange24h > 0 ? "▲" : "▼" }}
                {{ Math.round(item.percentChange24h * 1000) / 1000 }}%
              </text>
            </view>
          </view>
        </view>

        <!-- Tombol Gradient -->
        <view class="add-button" @click="onAddClick">
          <text>{{ t('trade.allAtOnce') }}</text>
        </view>
      </view>

      <view class="page-stock" v-if="tradeStock">
        <!-- List - 根据当前选中的二级tab显示对应数据 -->
        <view class="results-list">
          <view v-for="(item, index) in getFilteredTradeList()" :key="index" class="result-item"
            @click="handleItemClick(item)">
            <view class="item-left">
              <image :src="item.icon ||
                `/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'
                }.png`
                " class="item-icon" mode="aspectFit" />
              <view class="item-info">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-code">{{
                  item.quoteAsset || item.code
                }}</text>
              </view>
              <image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock" mode="aspectFit" />
            </view>
            <view class="item-right">
              <text class="item-price">{{ formatPrice(item.lastPrice) }}</text>
              <text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
                {{ item.percentChange24h > 0 ? "+" : ""
                }}{{ Math.round(item.percentChange24h * 100) / 100 }}%
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="page-stock" v-if="addFavorit">
        <!-- List - 根据当前选中的二级tab显示对应数据 -->
        <view class="results-list">
          <view v-for="(item, index) in getFilteredTradeList()" :key="index" class="result-item"
            @click="handleItemClick(item)">
            <view class="item-left">
              <!-- <text v-if="item.id <= 5" class="item-rank">{{ item.id }}</text> -->
              <image :src="item.icon" class="item-icon" mode="aspectFit" />
              <view class="item-info">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-code">{{
                  item.quoteAsset || item.code
                }}</text>
              </view>
              <image :src="item.sparkline" class="graph-img-stock" mode="aspectFit" />
            </view>
            <view class="item-right">
              <text class="item-price">{{ formatPrice(item.lastPrice) }}</text>
              <text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
                {{ item.percentChange24h > 0 ? "+" : ""
                }}{{ Math.round(item.percentChange24h * 100) / 100 }}%
              </text>
            </view>
          </view>
        </view>

        <!-- Tombol Gradient -->
        <view class="add-button" @click="goToAdd">
          <text>{{ t('trade.add.add') }}</text>
        </view>
      </view>
    </scroll-view>
    <!-- Bottom Navigation -->
    <BottomTabBar currentPath="/pages/trade/index" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { BottomTabBar } from "@/components";
import { onLoad } from "@dcloudio/uni-app";
import { useUserStore, TickersParams } from "@/store/modules/user";
import { useSafeArea } from "@/utils/composables/useSafeArea";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const tradeFavorite = ref(false);
const tradeStock = ref(true);
const addFavorit = ref(false);
const { getTopStyle } = useSafeArea();

// 筛选状态变量 - 与market页面完全一致
const nameSortOption = ref('name'); // name: 名称, volume: 成交量, addTime: 添加时间
const trendFilterOption = ref('all'); // all: 全部, up: 只看上涨, down: 只看下跌, highVol: 高波动优先, lowVol: 低波动优先
const changeSortOption = ref('highToLow'); // highToLow: 涨幅从高到低, lowToHigh: 涨幅从低到高, volatility: 按波动排序

// 筛选菜单显示状态
const showNameSortMenu = ref(false);
const showTrendFilterMenu = ref(false);
const showChangeSortMenu = ref(false);

// 关闭所有下拉菜单
function closeAllDropdowns() {
	showNameSortMenu.value = false;
	showTrendFilterMenu.value = false;
	showChangeSortMenu.value = false;
}

// 获取热门交易数据 - 返回全量数据
function getHotTradingData() {
  // 优先使用从API获取的真实数据
  if (tradeList.value.length > 0) {
    return tradeList.value.map((item, index) => ({
      ...item,
      id: index + 1, // 添加排名ID
      icon:
        item.icon ||
        `/static/logo/logos_${item.code?.toLowerCase() || "bitcoin"}.png`,
      sparkline: "/static/icons/line_chart.png",
    }));
  } else {
    // 否则使用模拟数据
    return getMockData();
  }
}

// 根据当前选中的二级tab过滤交易数据
function getFilteredTradeList() {
  // 获取基础数据
  const baseData =
    tradeList.value.length > 0
      ? tradeList.value.map((item, index) => ({
        ...item,
        id: index + 1,
        icon:
          item.icon ||
          `/static/logo/logos_${item.code?.toLowerCase() || "bitcoin"}.png`,
        sparkline: item.sparkline || "/static/icons/line_chart.png",
      }))
      : getMockData();

  // 根据当前选中的二级tab进行过滤
  switch (currentTab.value) {
    case 0: // 全部
      return baseData;
    case 1: // 持仓
      // 模拟持仓数据 - 实际项目中应该从持仓接口获取
      return baseData.slice(0, 5);
    case 2: // 港股
      // 模拟港股数据 - 筛选包含特定关键词的数据
      return baseData.filter(
        (item) =>
          item.name?.includes("港") ||
          item.code?.toLowerCase().includes("hk") ||
          // 随机选择一些数据作为港股示例
          (item.id && item.id % 3 === 0)
      );
    case 3: // 现货
      // 模拟现货数据
      return baseData.filter(
        (item) =>
          item.name?.includes("现货") ||
          item.pair?.includes("/") ||
          // 随机选择一些数据作为现货示例
          (item.id && item.id % 3 === 1)
      );
    case 4: // Xcoins专区
      // 模拟Xcoins专区数据
      return baseData.filter(
        (item) =>
          item.name?.includes("X") ||
          item.code?.includes("X") ||
          // 随机选择一些数据作为Xcoins示例
          (item.id && item.id % 3 === 2)
      );
    default:
      return baseData;
  }
}

// 模拟数据 - 返回更多数据项
function getMockData() {
  return [
    {
      id: 1,
      name: "Bitcoin",
      code: "BTC",
      pair: "BTC/USDT",
      quoteAsset: "USDT",
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
      quoteAsset: "USDT",
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
      quoteAsset: "USDT",
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
      quoteAsset: "USDT",
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
      quoteAsset: "USDT",
      icon: "/static/logo/logos_cardano.png",
      lastPrice: 0.529,
      percentChange24h: -3.58,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 6,
      name: "Polkadot",
      code: "DOT",
      pair: "DOT/USDT",
      quoteAsset: "USDT",
      icon: "/static/logo/logos_binance.png",
      lastPrice: 7.85,
      percentChange24h: 2.14,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 7,
      name: "Chainlink",
      code: "LINK",
      pair: "LINK/USDT",
      quoteAsset: "USDT",
      icon: "/static/logo/logos_binance.png",
      lastPrice: 14.32,
      percentChange24h: -5.67,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 8,
      name: "Litecoin",
      code: "LTC",
      pair: "LTC/USDT",
      quoteAsset: "USDT",
      icon: "/static/logo/logos_bitcoin.png",
      lastPrice: 98.76,
      percentChange24h: 3.45,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 9,
      name: "Dogecoin",
      code: "DOGE",
      pair: "DOGE/USDT",
      quoteAsset: "USDT",
      icon: "/static/logo/logos_binance.png",
      lastPrice: 0.12,
      percentChange24h: -8.21,
      sparkline: "/static/icons/line_chart.png",
    },
    {
      id: 10,
      name: "Uniswap",
      code: "UNI",
      pair: "UNI/USDT",
      quoteAsset: "USDT",
      icon: "/static/logo/logos_eth.png",
      lastPrice: 6.78,
      percentChange24h: 1.92,
      sparkline: "/static/icons/line_chart.png",
    },
  ];
}

const userStore = useUserStore();

const tradeList = ref<any[]>([]);
const isRefreshing = ref(false);

onLoad(async () => {
  loadData("");
});

async function loadData(type: string) {
  try {
    const tickersParams: TickersParams = {
      passkey: userStore.pasKeyAuth,
      type,
      limit: 100,
      lang: userStore.language
    };
    const resultAuth = await userStore.getTickers(tickersParams);
    tradeList.value = resultAuth.data || [];
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

async function onRefresh() {
  isRefreshing.value = true;
  await loadData(activeMenu.value?.type || "");
  setTimeout(() => {
    isRefreshing.value = false;
  }, 800);
}

// 跳转到搜索页面
function goToSearch() {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/trade/search",
      success: () => console.log("✅ Navigated to search page"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 200);
}

// 跳转到编辑页面
function goToEdit() {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/trade/edit",
      success: () => console.log("✅ Navigated to edit page"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 200);
}

// 跳转到添加页面
function goToAdd() {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/trade/add",
      success: () => console.log("✅ Navigated to add page"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 200);
}

const menus = ref([
  { id: 1, name: t('market.hkStock'), type: "stock" },
  { id: 0, name: t('trade.favorites'), type: "" },
  { id: 2, name: t('trade.cryptoCurrency'), type: "crypto" },
]);
const activeMenu = ref(menus.value[0]);
console.log(activeMenu, '>>>>>>>>>>>>>>')

function setActive(item: any) {
  activeMenu.value = item;
  tradeFavorite.value = false;
  tradeStock.value = false;
  addFavorit.value = false;

  if (item.id == 0) {
    tradeFavorite.value = true;
  } else if (item.id == 1) {
    tradeStock.value = true;
  } else if (item.id == 2) {
    tradeStock.value = true;
  }

  // 重置二级tab到第一个
  currentTab.value = 0;

  tradeList.value = [];
  loadData(item.type || "");
}

function handleCardClick(item: any, index: number) {
  uni.navigateTo({
    url:
      "/pages/detiltrade/index?data=" +
      encodeURIComponent(JSON.stringify(item)),
  });
}

// 切换收藏状态
function toggleFavoriteStatus(item: any) {
  // 只切换当前卡片的选中状态
  item.active = !item.active;
}

// 跳转到消息通知页面
function goToNotification() {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/notification/index",
      success: () => console.log("✅ Navigated to notification page"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
}

// 当前选中的二级tab
const currentTab = ref(0);
// 二级tab列表
const tabs = ref([t('common.all'), t('trade.holdings'), t('market.hkStock'), t('market.spot'), t('market.xcoinZone')]);

// 监听currentTab变化
watch(
  () => currentTab.value,
  (newTab) => {
    console.log(`切换到二级tab: ${tabs[newTab]}`);
    // 这里可以根据需要重新加载特定tab的数据
  }
);

// 格式化价格
function formatPrice(price: number) {
  if (price >= 1000) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  return price;
}

// 与search页面一致的列表项点击处理函数
const handleItemClick = (item: any) => {
  // 跳转到详情页面 - 与search页面保持一致的参数传递方式
  uni.navigateTo({
    url:
      "/pages/detiltrade/index?data=" +
      encodeURIComponent(JSON.stringify(item)),
    success: () => console.log("✅ Navigated to detail page"),
    fail: (err) => console.error("❌ Navigation failed:", err),
  });
};

/* Fungsi klik tombol */
const onAddClick = () => {
  tradeFavorite.value = false;
  tradeStock.value = false;
  addFavorit.value = true;
};

// 处理Tab切换
const handleTabChange = (tab: any, index: number) => {
  console.log("Tab切换:", tab.label, index);
  // 导航由 BottomTabBar 组件处理，这里只需要记录日志
};
</script>

<style lang="scss" scoped>
.trade-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #202020;
}

/* ✅ Navbar fixed di atas */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #202020;
  padding: 0 24rpx;
  min-height: 100rpx;
  /* 顶部间距缩小，避免与状态栏占位叠加 */
  padding-top: 80rpx;
}

/* Konten scrollable di bawah navbar */
.tab-top {
  position: fixed;
  /* 动态计算顶部位置：状态栏高度 + navbar高度 */
  top: 196rpx;
  left: 0;
  right: 0;
  background-color: #202020;
  z-index: 999;
  padding: 10rpx 20rpx 0rpx;
  // border-bottom: 1px solid #333333;
}

.scroll-area {
  flex: 1;
  padding-top: 40rpx;
  /* 默认值，当tab-top不显示时 */
  height: calc(100vh - 110rpx);
  /* 默认高度，当tab-top不显示时 */
}

/* 当tab-top显示时的样式 */
.scroll-area.has-tab-top {
  padding-top: 150rpx;
  height: calc(100vh - 200rpx);
}

/* 已通过动态类绑定实现，这里不再需要额外规则 */

/* --- Navbar item --- */
.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.menu {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  // margin-left: 16rpx;
}

.menu-item {
  color: #9aa4ae;
  font-size: 28rpx;
  margin: 0 24rpx;
  white-space: nowrap;
}

.menu-item.active {
  color: #fff;
  font-weight: bold;
}

.actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.iconSearch {
  width: 46rpx;
  height: 46rpx;
  height: auto;
  margin-right: 8rpx;
}

.icon {
  width: 48rpx;
  height: 48rpx;
}

.notif-container {
  position: relative;
  display: flex;
  align-items: center;
}

.dot {
  position: absolute;
  top: 4rpx;
  right: 4rpx;
  width: 14rpx;
  height: 14rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
}

/* --- Trade Content --- */
.trade-content {
  padding: 40rpx 24rpx;
  color: #fff;
  background: #202020;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 40rpx 80rpx 20rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
}

.subtitle {
  color: #9aa4ae;
  font-size: 26rpx;
  margin-top: 12rpx;
  display: block;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.card {
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coin-icon {
  width: 50rpx;
  height: 50rpx;
}

.pair-info {
  flex: 1;
  margin-left: 12rpx;
}

.pair-type {
  color: #999;
  font-size: 22rpx;
}

.pair-name {
  font-weight: 600;
  font-size: 26rpx;
}

.circle {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #555;
}

.circle.active {
  background: #7b61ff;
}

.chart {
  width: 100%;
  height: 100rpx;
  margin: 20rpx 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 26rpx;
}

.percent {
  font-size: 24rpx;
}

.percent.up {
  color: #16c784;
}

.percent.down {
  color: #ff4d4d;
}

.add-button {
  margin-top: 60rpx;
  height: 84rpx;
  margin-bottom: 140rpx;
  text-align: center;
  background: linear-gradient(175deg, #5565b9, #cd5890);
  color: #fff;
  border-radius: 20rpx;
  padding: 24rpx 0;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-stock {
  background-color: #202020;
  color: #fff;
  min-height: 100vh;
  padding: 20rpx 30rpx;
  padding-bottom: 240rpx; // 为自定义底栏预留空间，避免App端遮挡
}

/* Tabs */
.tabs-container {
  display: flex;
  justify-content: space-between;
  // background: #1a1a1a;
  // border-radius: 20rpx;
  // padding:0 10rpx;
  margin-bottom: 30rpx;
  gap: 10rpx;
}

.tab {
		// flex: 1;
		min-width: 110rpx;
		height: 64rpx;
}

/* 筛选下拉菜单样式 - 与market页面完全一致 */
.filter-dropdown {
	position: absolute;
	background-color: #2a2a2a;
	border-radius: 12rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	z-index: 1000;
	min-width: 200rpx;
	overflow: hidden;
}

.filter-option {
	padding: 20rpx 30rpx;
	font-size: 24rpx;
	color: #fff;
	cursor: pointer;
	transition: background-color 0.2s ease;
	white-space: nowrap;
}

.filter-option:hover {
	background-color: #3c3c3c;
}

.filter-option.active {
	background-color: #3c3c3c;
	color: #165dff;
}

/* 不同位置的下拉菜单调整 */
.name-dropdown {
	top: 160rpx;
	left: 130rpx;
}

.trend-dropdown {
	top: 160rpx;
	right: 200rpx;
}

.change-dropdown {
	top: 160rpx;
	right: 20rpx;
}

/* 下拉菜单背景遮罩 */
.dropdown-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
	z-index: 999;
}

/* 箭头图标样式 */
.arrow-icon {
	width: 24rpx;
	height: 24rpx;
	transition: none !important;
	transform: rotate(0deg) !important;
	transform-origin: center center;
}

.arrow-icon.rotate {
	transform: rotate(180deg) !important;
	transition: none !important;
	transform-origin: center center;
}

/* 确保表头元素有相对定位，以便下拉菜单能正确定位 */
.column-header1,
.column-header,
.column-header2 {
	position: relative;
	// 确保有足够的高度容纳下拉菜单的触发区域
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	// gap: 8rpx;
	cursor: pointer;
}
.tab{
  text-align: center;
  padding: 0rpx 16rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #9aa4ae;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab.active {
  background: linear-gradient(90deg, #9c4df4, #ff4d6d);
  color: #fff;
  border-radius: 48rpx;
}

/* 原来的tabs-stock样式（保留兼容性） */
.tabs-stock {
  white-space: nowrap;
  display: flex;
  overflow-x: auto;
}

.tab-stock {
  display: inline-block;
  padding: 20rpx 30rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #666;
}

.active-stock {
  background: linear-gradient(90deg, #9c4df4, #ff4d6d);
  color: #fff;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rpx 0;
  color: #a5a7aa;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}

/* 左侧编辑按钮 */
.left-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.edit-btn {
  color: #9aa4ae;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}

.editIcon {
  width: 28rpx;
  height: 28rpx;
  margin-left: 10rpx;
}

/* 列头 */
.column-headers {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // gap: 80rpx;
  flex: 1;
  flex-shrink: 0;
}

.column-header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  // gap: 8rpx;
}

.column-header1 {
  display: flex;
  align-items: center;
  margin-left: 30rpx;
  font-size: 24rpx;
  flex-shrink: 0;
}

.column-header2 {
  display: flex;
  align-items: center;
  margin-left: 30rpx;
  font-size: 24rpx;
  flex-shrink: 0;
}

.arrow-icon {
  width: 20rpx;
  height: 20rpx;
  margin-left: 10rpx;
  margin-top: 4rpx;
  // opacity: 0.7;
}

/* 原来的表头样式（保留兼容性） */
.header-row-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0 20rpx 0;
  color: #a5a7aa;
  font-size: 26rpx;
}

.left-header-stock {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.add-box-stock {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #a5a7aa;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-stock {
  font-size: 24rpx;
  line-height: 1;
}

.center-header-stock {
  display: flex;
  align-items: center;
  gap: 70rpx;
}

.header-item-stock {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.arrow-stock {
  width: 18rpx;
  height: 18rpx;
  opacity: 0.7;
}

/* 列表样式 - 与search页面完全一致 */
.results-list {
  display: flex;
  flex-direction: column;
  // gap: 30rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 20rpx;
  height: 144rpx;
  border-radius: 20rpx;
  background-color: #2a2a2a;
  position: relative;
  margin-top: 30rpx;
}

.result-item .item-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8rpx;
}

.result-item .item-rank {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
}

.result-item .item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.result-item .item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8rpx;
  margin-right: 20rpx;
}

.result-item .item-name {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200rpx;
}

.result-item .item-code {
  color: #666;
  font-size: 22rpx;
}

/* 图表图片样式 - 与search页面一致 */
.result-item .graph-img-stock {
  width: 120rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.result-item .item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-left: 20rpx;
}

.result-item .item-price {
  color: #fff;
  font-size: 32rpx;
}

.result-item .item-percent {
  font-size: 28rpx;
}

.result-item .item-percent.up {
  color: #16c784;
}

.result-item .item-percent.down {
  color: #ff4d4d;
}

/* 原来的列表样式（保留兼容性） */
.list-stock {
  margin-top: 10rpx;
}

.stock-card-stock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

/* Left content */
.left-stock {
  display: flex;
  align-items: center;
}

.icon-stock {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.info-stock .title-stock {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.name-stock {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200rpx;
}

.leverage-stock {
  font-size: 24rpx;
  color: #999;
}

.code-stock {
  font-size: 22rpx;
  color: #666;
}

/* Graph */
.graph-box-stock {
  width: 180rpx;
  height: 60rpx;
  margin-right: 18rpx;
}

.graph-img-stock {
  width: 100%;
  height: 100%;
}

/* Right side */
.right-stock {
  text-align: right;
}

.price-stock {
  font-size: 30rpx;
}

.percent-stock {
  font-size: 26rpx;
}

.red-stock {
  color: #ff4d6d;
}

.green-stock {
  color: #4cff85;
}
</style>
