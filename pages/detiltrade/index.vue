<template>
  <view class="page">
    <!-- 顶部安全区占位 -->
    <SafeTop :extraPadding="0" />
    <!-- Header (tidak ikut scroll) -->
    <view class="header">
      <view class="nav">
        <image src="/static/icons/ic_arrow_left.png" class="icon" @click="goBack" />
        <text class="title">{{ detail.name }}</text>
        <view class="actions">
          <image src="/static/icons/star.png" @click="toggleFavorite()" class="icon" />
          <image src="/static/icons/share.png" class="icon" />
        </view>
      </view>

      <!-- Tabs -->
      <view class="tabs">
        <view v-for="(tab, index) in tabs" :key="index" :class="['tab', currentTab === index ? 'active' : '']"
          @click="selectTabs(index)">
          {{ t(tab) }}
        </view>
      </view>

      <view class="divider"></view>
    </view>

    <!-- Scrollable content -->
    <scroll-view class="scroll-content" scroll-y="true">
      <view v-if="marketQuotes">
        <!-- Harga -->
        <view class="price-section">
          <view class="left">
            <text class="label">{{ t("latest_price_usdt") }}</text>
            <view class="price-container">
              <text class="price">{{ marketResponse.latest_price_usdt }}</text>
              <text class="change">{{ marketResponse.price_change_percent * 100 }}%</text>
            </view>
            <view class="sub">
              <text class="a-share">{{ t("a_share") }} </text>
              <text class="a-share change-red">{{
                marketResponse.a_share_change
              }}</text>
              <text class="a-share change-red">{{ marketResponse.a_share_index }}
                {{ marketResponse.a_share_change_percent }}</text>
            </view>
          </view>

          <view class="right">
            <view class="row">
              <text class="label">{{ t("high_24h") }}</text>
              <text class="label">{{ t("volume_24h_btc") }}</text>
              <text class="value">{{ marketResponse.high_24h }}</text>
              <text class="value">{{ marketResponse.volume_btc_24h }}</text>
            </view>

            <view class="row">
              <text class="label">{{ t("low_24h") }}</text>
              <text class="label">{{ t("turnover_24h_usd") }}</text>
              <text class="value">{{ marketResponse.low_24h }}</text>
              <text class="value">{{
                marketResponse.quote_volume_usd_24h
              }}</text>
            </view>
          </view>
        </view>

        <!-- Info bawah -->
        <view class="bottom-info">
          <view class="info-row">
            <text class="info-label">{{ t("turnover") }}</text>
            <text class="info-value">{{ marketResponse.turnover }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">{{ t("pe_ttm") }}</text>
            <text class="info-value">{{ marketResponse.pe_ratio_ttm }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">{{ t("market_cap") }}</text>
            <text class="info-value">{{ marketResponse.market_cap }}</text>
          </view>
        </view>

        <!-- News -->
        <view class="news-bar">
          <image src="/static/icons/ic_speaker.png" class="news-icon" />
          <text class="news-text">
            {{ t("vaneck_2025_predictions") }}
          </text>
          <image src="/static/icons/ic_close.png" class="news-close" />
        </view>

        <view class="time-bar">
          <view class="time-options">
            <text v-for="(item, index) in timeList" :key="index"
              :class="['time-item', { active: selected.param === item.param }]" @click="selectTime(item)">
              {{ item.label }}
            </text>
          </view>

          <view class="settings">
            <image src="/static/icons/ic_gear.png" mode="aspectFit" class="gear-icon" />
          </view>
        </view>

        <!-- Candlestick Chart -->
        <view class="chart-container">
          <view id="lineChart" class="chart"></view>
        </view>

        <!-- Volume Chart -->
        <view class="volume-chart-container">
          <view id="volumeChart" class="volume-chart"></view>
        </view>

        <view class="divider"></view>

        <!-- Order Book -->
        <view class="order-book">
          <view class="order-header">
            <view class="side">
              <view class="bar-info-left">
                <text class="side-label">B</text>
                <text class="side-percent">59%</text>
              </view>
            </view>

            <view class="bar-wrapper">
              <!-- <view class="bar-info-left"> -->
              <view class="bar buy-bar" :style="{ width: '59%' }"></view>
              <view class="bar sell-bar" :style="{ width: '41%' }"></view>
              <!-- </view> -->
            </view>

            <view class="side">
              <view class="bar-info-right">
                <text class="side-percent">31%</text>
                <text class="side-label">S</text>
              </view>
            </view>
          </view>

          <view class="order-title">
            <text class="col-text">{{ t("amount_btc") }}</text>
            <text class="col-text">{{ t("price_usdt") }}</text>
            <text class="col-text">{{ t("quantity_btc") }}</text>
          </view>

          <view class="order-row" v-for="(row, index) in orderData" :key="index">
            <view class="col left">
              <view class="bar-bg buy-bg" :style="{ width: row.buyPercent + '%' }"></view>
              <text class="text">{{ row.buyQty }}</text>
            </view>

            <view class="col center">
              <text class="buy-price">{{ row.buyPrice }}</text>
              <text class="sell-price">{{ row.sellPrice }}</text>
            </view>

            <view class="col right">
              <view class="bar-bg-left sell-bg" :style="{ width: row.sellPercent + '%' }"></view>
              <text class="text">{{ row.sellQty }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="marketData">
        <!-- Tab Switch -->
        <view class="tab-header-data">
          <view class="tab-btn-data" :class="{ active: activeTab === 'flow' }" @click="activeTab = 'flow'">
            {{ t("capital_flow") }}
          </view>
          <view class="tab-btn-data" :class="{ active: activeTab === 'bar' }" @click="activeTab = 'bar'">
            {{ t("bar_data") }}
          </view>
        </view>

        <view class="section-title-data" v-if="activeTab !== 'bar'">
          {{ t("capital_flow_analysis") }}</view>

        <view class="data-card" v-if="activeTab !== 'bar'">
          <!-- Time Range Buttons -->
          <view class="time-tabs-data">
            <view v-for="item in timeRanges" :key="item" :class="[
              'time-btn-data',
              { active: activeTime.param === item.param },
            ]" @click="selectTimeRange(item)">
              {{ item.label }}
            </view>
          </view>

          <!-- Donut Chart -->
          <view>
            <view id="pieChart" class="pie-chart-data"></view>
          </view>

          <!-- Table -->
          <view class="table-data">
            <!-- Header -->
            <view class="table-row-data header">
              <text class="col-type"></text>
              <text class="col-buy">{{ t("buy_eth") }}</text>
              <text class="col-sell">{{ t("sell_eth") }}</text>
              <text class="col-net">{{ t("net_inflow") }}</text>
            </view>

            <!-- Isi tabel -->
            <view v-for="(row, index) in tableRows" :key="index" class="table-row-data">
              <text class="col-type">{{ row.type }}</text>
              <text class="col-buy buy-data">{{ row.buy }}</text>
              <text class="col-sell sell-data">{{ row.sell }}</text>
              <text class="col-net netflow-data">{{ row.net }}</text>
            </view>
          </view>
        </view>

        <!-- 5×24小时净流入 -->
        <view class="section-title-data" v-if="activeTab === 'bar'">{{
          t("five_24h_net_inflow_eth")
        }}</view>

        <view class="summary-data" v-if="activeTab === 'bar'">
          <text>{{ t("five_day_main_inflow") }} {{ summary.fiveDay }}</text>
          <text>{{ t("last_24h") }} {{ summary.last24h }}</text>
        </view>

        <!-- Bar Chart -->
        <view class="chart-box-data" v-if="activeTab === 'bar'">
          <canvas id="barChart" type="2d" class="bar-chart-data"></canvas>
        </view>
      </view>

      <view class="content-square" v-if="squareData">
        <!-- Tab Switch -->
        <view class="tab-container-square">
          <view v-for="(tab, index) in tabsSquare" :key="index"
            :class="['tab-item-square', { active: activeTabSquare === index }]" @click="selectActiveTabSquare(index)">
            {{ t(tab) }}
          </view>
        </view>

        <view>
          <!-- 新闻tab内容 - 仅显示原始新闻列表 -->
          <template v-if="activeTabSquare === 0">
            <!-- News List -->
            <view class="news-list-square">
              <view v-for="(item, index) in newsList" :key="index" class="news-card-square">
                <view class="news-info-square">
                  <text class="news-title-square">{{ item.title }}</text>
                  <text class="news-meta-square">{{ item.source_name }} · {{ item.date }}</text>
                </view>

                <image class="news-thumb-square" :src="item.banner" mode="aspectFill" />
              </view>
            </view>
          </template>

          <!-- 观点tab内容 - 当activeTabSquare为1时显示，包含热点资讯和个人观点 -->
          <template v-else-if="activeTabSquare === 1">
            <!-- 热点资讯显示在个人观点上方 -->
            <view class="news-container-square-News-Data">
              <view v-for="(item, index) in newsListSquareNewsData" :key="index" class="news-card-square-News-Data">
                <view class="news-left-square-News-Data">
                  <text class="news-title-square-News-Data"># {{ item.title }}</text>
                  <text class="news-views-square-News-Data">{{ item.views }} 765 浏览</text>
                </view>

                <view class="news-icon-square-News-Data">
                  <image src="/static/icons/icon-pen.png" mode="aspectFill" />
                </view>
              </view>
            </view>

            <view class="personal-views-content">
              <!-- 使用v-for渲染view-item -->
              <view class="view-item" v-for="item in viewItems" :key="item.id">
                <view class="view-header">
                  <image class="user-avatar" :src="item.avatar" />
                  <view class="user-info">
                    <view class="user-name">
                      <view class="name">{{ item.username }}</view>
                      <view class="time">{{ item.time }}</view>
                    </view>
                    <view class="follow-btn-mini">{{ t('detiltrade.follow') }}</view>
                  </view>
                </view>
                <text class="view-content">{{ item.content }}</text>
                <!-- 图片渲染区域 -->
                <view class="view-images" v-if="item.images && item.images?.length > 0">
                  <image v-for="(img, index) in item.images.slice(0, 2)" :key="index" :src="img" class="view-image" />
                </view>
                <view class="actions-box">
                  <view class="view-actions">
                    <view class="action-item">
                      <image src="/static/icons/LikeBtn.png" class="commentIcon" />
                      <text class="action-count">{{ item.likes }}</text>
                    </view>
                    <view class="action-item">
                      <image src="/static/icons/CommentIcon.png" class="commentIcon" />
                      <text class="action-count">{{ item.comments }}</text>
                    </view>
                    <view class="action-item">
                      <image src="/static/icons/shareIcon.png" class="commentIcon" />
                      <text class="action-count">{{ item.shares }}</text>
                    </view>
                  </view>
                  <text class="view-time">{{ item.footer }}</text>
                </view>

                <!-- 评论区域 -->
                <view class="comments-section" v-if="item.commentsList && item.commentsList.length > 0">
                  <view class="comment-item" v-for="comment in item.commentsList" :key="comment.id">
                    <view class="comment-header">
                      <text class="comment-username">{{ comment.username }}:</text>
                      <text class="comment-content">{{ comment.content }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-fixed">
      <view class="bottom-container">
        <!-- Menu Icon -->
        <!-- uni.navigateTo({ url: '/pages/detiltrade/index' }) -->
        <view class="menu">
          <view class="menu-item" v-for="(item, index) in menuList" :key="index" @tap="handleMenuClick(item, index)">
            <image :src="item.icon" class="menu-icon" />
            <text class="menu-text">{{ item.label }}</text>
          </view>
        </view>

        <!-- Tombol Buy / Sell -->
        <view class="action-buttons">
          <view class="btn buy">{{ t('trade.buy') }}</view>
          <view class="btn sell">{{ t('trade.sell') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, getCurrentInstance } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import * as echarts from "echarts";
import {
  useUserStore,
  MarketParams,
  OrderBookParams,
  ArticleParams,
  FundFlowParams,
  CandleParams,
  FavoriteParams,
} from "@/store/modules/user";
import { SafeTop } from "@/components";
import { tl } from "@/utils/i18n";
const t = tl;
const userStore = useUserStore();
let marketResponse = ref({});

const tabs = ["detiltrade.tabs.market_quotes", "detiltrade.tabs.data", "detiltrade.tabs.square"];
const currentTab = ref(0);
const chartContainer = ref(null);
const marketQuotes = ref(true);
const marketData = ref(false);
const squareData = ref(false);
const squareNewsData = ref(false);
const tabsSquare = ["trade.news", "trade.opinion"];
const activeTabSquare = ref(0);
const detail = ref({});
const orderData = ref([]);
const volumeChartSeriesLineMA5 = ref([]);
const volumeChartSeriesLineMA10 = ref([]);
const userInfo = uni.getStorageSync("userData");

// 模拟个人观点数据，与market/index页面保持一致
const viewItems = ref([
  {
    id: 1,
    avatar: "/static/icons/testAvatar.png",
    username: "SOOIN1126",
    time: "3小时前",
    content:
      "BTC现在处于关键阻力位，建议密切关注突破情况。如果能有效突破58000美元，可能会继续上涨至60000美元关口。",
    images: ["/static/icons/dynamicTest.png", "/static/icons/dynamicTest.png"],
    likes: 238,
    comments: 45,
    shares: 12,
    footer: "1.2万浏览",
    commentsList: [
      {
        id: 1,
        username: "交易小白",
        content: "分析得很到位，已经按照你的建议操作了",
        likes: 23,
      },
    ],
  },
  {
    id: 2,
    avatar: "/static/icons/testAvatar.png",
    username: "CryptoMaster",
    time: "5小时前",
    content:
      "ETH今日表现强势，已经突破前期高点。技术面来看，MACD指标形成金叉，短期可能还有上涨空间。",
    images: ["/static/icons/dynamicTest.png"],
    likes: 156,
    comments: 28,
    shares: 8,
    footer: "8.5千浏览",
    commentsList: [
      {
        id: 1,
        username: "DeFi爱好者",
        content: "Layer2解决方案也在不断发展，未来潜力很大",
        likes: 12,
      },
    ],
  },
  {
    id: 3,
    avatar: "/static/icons/testAvatar.png",
    username: "交易达人",
    time: "昨天",
    content:
      "最近山寨币表现活跃，建议关注一些基本面良好的小市值币种，可能会有不错的涨幅。",
    images: [],
    likes: 342,
    comments: 76,
    shares: 23,
    footer: "2.3万浏览",
    commentsList: [],
  },
  {
    id: 4,
    avatar: "/static/icons/testAvatar.png",
    username: "币圈小王子",
    time: "2天前",
    content:
      "因为评论法没放图片，所以新发一个推文说我现在手的这个仓位。才第四层仓，早得很，我这个系统大概承受大饼到130,000，所以突破前高前都不需要担心",
    images: ["/static/icons/dynamicTest.png", "/static/icons/dynamicTest.png"],
    likes: 138,
    comments: 92,
    shares: 45,
    footer: "11.6万浏览",
    commentsList: [
      {
        id: 1,
        username: "阿星哥",
        content: "十五倍杠杆都能爆",
        likes: 70,
      },
    ],
  },
]);

// 热点资讯数据 - 还原原来的数据结构
const newsListSquareNewsData = ref([
  {
    id: "1",
    title: "美国通胀数据低于预期，比特币价格应声上涨",
    views: 2345,
  },
  {
    id: "2",
    title: "以太坊2.0升级正式完成，质押数量创新高",
    views: 1890,
  },
  {
    id: "3",
    title: "SEC批准比特币ETF，机构资金持续流入",
    views: 3210,
  },
]);

// 帖子数据
const posts = ref([
  {
    id: "1",
    title: "币圈分析师张三",
    time: "2小时前",
    text: "今天的BTC走势非常关键，关注4小时K线能否有效突破。我认为现在是一个较好的入场时机，各位怎么看？",
    User: {
      photo: "/static/icons/testAvatar.png",
    },
    BlogImage: [
      {
        banner: "/static/icons/dynamicTest.png",
      },
    ],
    PageLike: {
      cnt: "128",
    },
    PageComment: {
      cnt: "36",
    },
    PageView: {
      cnt: "2456",
    },
    remark: "我看好BTC突破60000美元",
    footerText: "来自：币圈快讯",
  },
  {
    id: "2",
    title: "加密货币爱好者李四",
    time: "昨天",
    text: "ETH的Layer2解决方案正在改变整个生态系统，gas费大幅降低，交易速度提升，这将为DeFi和NFT带来新的机遇。",
    User: {
      photo: "/static/icons/testAvatar.png",
    },
    BlogImage: [],
    PageLike: {
      cnt: "89",
    },
    PageComment: {
      cnt: "24",
    },
    PageView: {
      cnt: "1532",
    },
    remark: "Layer2是未来趋势",
    footerText: "来自：区块链日报",
  },
]);

const volumeChartOrderBookQty = ref([]);
const volumeChartOrderBookAsk = ref([]);

const volumeChartCandleTimeStamp = ref([]);
const volumeChartCandleOpen = ref([]);
const volumeChartCandleHigh = ref([]);
const volumeChartCandleLow = ref([]);
const volumeChartCandleClose = ref([]);
const volumeChartCandleVolume = ref([]);

const newsList = ref([]);

// ✅ Fungsi kembali
const goBack = () => {
  uni.navigateBack();
};

watch([marketQuotes, marketData], async ([newMarketQuotes, newMarketData]) => {
  getBlog();
  if (newMarketQuotes) {
    getCandle();
  } else if (newMarketData) {
    await initPieChart();
    await initBarChart();
  }
});

async function getBlog() {
  const articleParams: ArticleParams = {
    passkey: userStore.pasKeyAuth,
    device: "android",
    appversion: "1.0",
    token: userInfo.token,
    lang: "eng",
    type: "opinion",
    symbol: detail.value.symbol,
    keyword: "",
    limit: 10,
  };

  const resultArticle = await userStore.article(articleParams);
  console.log("Newsssss");
  console.log(resultArticle.data.hot_news.Blog);
  newsList.value = resultArticle.data.hot_news.Blog;
  newsListSquareNewsData.value = resultArticle.data.hot_news.Blog;

  posts.value = resultArticle.data.data.Blog;
  console.log(posts.value, "?????????");
}

async function getCandle() {
  const candleParams: CandleParams = {
    passkey: userStore.pasKeyAuth,
    limit: "5",
    symbol: detail.value.symbol, //'BTCUSDT'
    interval: selected.value.param,
  };

  getFundFlow();

  const resultCandle = await userStore.getCandle(candleParams);

  resultCandle.candles.map((item, index) => {
    const timestamp = item.timestamp;
    const date = new Date(timestamp);

    const time =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");
    volumeChartCandleTimeStamp.value.push(time);
    volumeChartCandleOpen.value.push(item.open);
    volumeChartCandleHigh.value.push(item.high);
    volumeChartCandleLow.value.push(item.low);
    volumeChartCandleClose.value.push(item.close);
    volumeChartCandleVolume.value.push(item.volume);
  });

  await initMarketQuotes();
}

async function getFundFlow() {
  const funFlowParams: FundFlowParams = {
    passkey: userStore.pasKeyAuth,
    limit: "5",
    symbol: detail.value.symbol,
    interval: activeTime.value.param,
  };

  const resultFundFlow = await userStore.getFundFlow(funFlowParams);

  if (resultFundFlow?.data) {
    const data = resultFundFlow.data;
    const barChart = resultFundFlow.chart;
    tableRows.value.push({
      type: "Large",
      buy: Number(data.Large?.buy || 0),
      sell: Number(data.Large?.sell || 0),
      net: Number(data.Large?.net || 0),
    });

    tableRows.value.push({
      type: "Medium",
      buy: Number(data.Medium?.buy || 0),
      sell: Number(data.Medium?.sell || 0),
      net: Number(data.Medium?.net || 0),
    });

    tableRows.value.push({
      type: "Small",
      buy: Number(data.Small?.buy || 0),
      sell: Number(data.Small?.sell || 0),
      net: Number(data.Small?.net || 0),
    });

    tableRows.value.push({
      type: "Total",
      buy: Number(data.Total?.buy || 0),
      sell: Number(data.Total?.sell || 0),
      net: Number(data.Total?.net || 0),
    });

    pieOption.value = {
      backgroundColor: "transparent",
      color: ["#FFB74D", "#64B5F6", "#9575CD", "#F48FB1"],
      series: [
        {
          type: "pie",
          radius: ["50%", "70%"],
          label: { show: false },
          data: [
            { value: data.Large?.buy_percent * 100, name: "Large" },
            { value: data.Medium?.buy_percent * 100, name: "Medium" },
            { value: data.Small?.buy_percent * 100, name: "Small" },
            { value: data.Total?.buy_percent * 100, name: "Total" },
          ],
        },
      ],
    };
    barChart.map((item, index) => {
      barChartTableRows.value.push(Number(item.net.toFixed(1)));
    });

    console.log("Asuueee");
    console.log(barChartTableRows.value);
  }
}

async function getMarkets(detail: {}) {
  try {
    const marketParams: MarketParams = {
      passkey: userStore.pasKeyAuth,
      lang: "zh",
      symbol: detail.value.symbol,
    };

    const orderBookParams: OrderBookParams = {
      passkey: userStore.pasKeyAuth,
      limit: "10",
      symbol: detail.value.symbol,
    };

    const resultMarkets = await userStore.getMarkets(marketParams);

    const resultOrderBook = await userStore.getOrderBook(orderBookParams);

    marketResponse.value = resultMarkets;

    let amountBTC: any[] = [];
    let quantityBTC: any[] = [];
    resultOrderBook.bids.map((item, index) => {
      amountBTC.push(item[1]);
    });

    resultOrderBook.bids.map((item, index) => {
      quantityBTC.push(item[1]);
    });

    volumeChartOrderBookAsk.value = resultOrderBook.asks;

    // const orderBookQty = []

    // resultOrderBook.bids.map((bid, index) => {
    //   const ask = resultOrderBook.asks[index] || [];
    //   orderBookQty.push(bid[1])
    //   orderBookQty.push(ask[1])
    // });

    const result = resultOrderBook.bids.map((bid, index) => {
      const ask = resultOrderBook.asks[index] || [];
      volumeChartOrderBookQty.value.push(bid[1]);
      //  volumeChartOrderBookQty.value.push(ask[1])

      return {
        buyQty: bid[1],
        buyPrice: bid[0],
        sellPrice: ask[0],
        sellQty: ask[1],
        buyPercent: 80,
      };
    });

    orderData.value = result;
  } catch (e) {
    console.error("❌ Failed to load tickers:", e);
  }
}

onLoad((options) => {
  if (options.data) {
    try {
      detail.value = JSON.parse(decodeURIComponent(options.data));

      console.log("📦 Data via query:", detail.value);
    } catch (e) {
      console.error("❌ Gagal parse data dari query:", e);
    }
  }
});

onMounted(async () => {
  getBlog();
  if (marketQuotes.value) {
    getCandle();
  } else if (marketData.value) {
    await initPieChart();
    await initBarChart();
  }

  // ✅ Pastikan ini dipanggil DI DALAM onMounted
  const instance = getCurrentInstance();
  if (!instance || !instance.proxy) {
    console.warn("⚠️ getCurrentInstance() belum siap");
    return;
  }

  const eventChannel = instance.proxy.getOpenerEventChannel?.();
  if (!eventChannel) {
    console.warn(
      "⚠️ Tidak ada eventChannel (kemungkinan halaman dibuka langsung, bukan navigateTo)"
    );
    return;
  }

  eventChannel.on("sendData", (data) => {
    detail.value = data;
    console.log("✅ Data diterima:", data);
  });
});

const initMarketQuotes = async () => {
  await nextTick();
  const chartDom = document.getElementById("lineChart");
  const chart = echarts.init(chartDom);

  // === Simulasi data harga seperti Binance ===
  await getMarkets(detail);

  // Hitung MA60 sederhana (data fiktif)
  const ma60 = volumeChartCandleVolume.value.map((v, i) => {
    const start = Math.max(0, i - 5);
    const subset = volumeChartCandleVolume.value.slice(start, i + 1);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    return parseFloat(avg);
  });

  // === Konfigurasi Chart ===
  const option = {
    backgroundColor: "#202020",
    animation: true,
    grid: {
      left: "4%",
      right: "10%",
      top: "8%",
      bottom: "10%",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1e2329",
      borderColor: "#333",
      borderWidth: 1,
      textStyle: { color: "#fff", fontSize: 12 },
      axisPointer: {
        type: "cross",
        lineStyle: { color: "#888", width: 1, type: "dashed" },
      },
      formatter: (params) => {
        const price = params[0].value;
        return `<div style="color:#fff;">${params[0].axisValue}<br/>Price: ${price}</div>`;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: volumeChartCandleTimeStamp.value,
      axisLine: { lineStyle: { color: "#1f2329" } },
      axisLabel: { color: "#9ca3af", fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      position: "right",
      axisLine: { show: false },
      axisLabel: {
        color: "#9ca3af",
        fontSize: 10,
        align: "right",
        margin: 6,
      },
      splitLine: { lineStyle: { color: "#1f2329" } },
      scale: true,
    },
    series: [
      {
        name: "Open",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: volumeChartCandleOpen.value,
        lineStyle: {
          color: "#1E90FF",
          width: 2,
        },
        areaStyle: {
          opacity: 1,
          // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: 'rgba(240,185,11,0.3)' },
          //   { offset: 1, color: 'rgba(240,185,11,0)' },
          // ]),
        },
      },

      {
        name: "High",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: volumeChartCandleHigh.value,
        lineStyle: {
          color: "#0ECB81",
          width: 2,
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(240,185,11,0.3)" },
            { offset: 1, color: "rgba(240,185,11,0)" },
          ]),
        },
      },
      {
        name: "Low",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: volumeChartCandleLow.value,
        lineStyle: {
          color: "#F6465D",
          width: 2,
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(240,185,11,0.3)" },
            { offset: 1, color: "rgba(240,185,11,0)" },
          ]),
        },
      },
      {
        name: "Close",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: volumeChartCandleClose.value,
        lineStyle: {
          color: "#FFB800",
          width: 2,
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(240,185,11,0.3)" },
            { offset: 1, color: "rgba(240,185,11,0)" },
          ]),
        },
      },
      {
        name: "Volume",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: volumeChartCandleVolume.value,
        lineStyle: {
          color: "#8884d8",
          width: 2,
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(240,185,11,0.3)" },
            { offset: 1, color: "rgba(240,185,11,0)" },
          ]),
        },
      },
      {
        name: "MA60",
        type: "line",
        smooth: 0.5,
        symbol: "none",
        data: ma60,
        lineStyle: {
          color: "#999",
          width: 1,
          opacity: 0.8,
        },
      },
    ],
  };

  // === VOLUME CHART ===

  const chartVol = echarts.init(document.getElementById("volumeChart"));
  chartVol.setOption({
    backgroundColor: "#202020",
    grid: { left: 40, right: 40, top: 10, bottom: 40 },
    xAxis: {
      type: "category",
      data: [],
      axisLine: { lineStyle: { color: "#222" } },
      axisLabel: { color: "#888", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      position: "right",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#222" } },
      axisLabel: { color: "#888", fontSize: 10 },
    },
    series: [
      {
        name: "Volume",
        type: "bar",
        data: volumeChartOrderBookQty.value,
        barWidth: 8,
        itemStyle: {
          color: (p) => (p.dataIndex % 2 === 0 ? "#3DB063" : "#ef5350"),
        },
      },
      {
        name: "MA5",
        type: "line",
        data: volumeChartOrderBookAsk.value,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#f5b041", width: 1 },
      },
      // {
      //   name: 'MA10',
      //   type: 'line',
      //   data: [13, 12, 13, 10, 14, 12, 13, 11, 9, 10, 9, 8, 9, 11],
      //   smooth: true,
      //   showSymbol: false,
      //   lineStyle: { color: '#a569bd', width: 1 }
      // }
    ],
  });

  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
};

const menuList = ref([
  {
    icon: "/static/icons/more.png",
    label: t('detiltrade.more'),
    path: "/pages/chartsettings/index",
  },
  {
    icon: "/static/icons/warning.png",
    label: t('detiltrade.alert'),
    path: "/pages/cretedreminder/index",
  },
  {
    icon: "/static/icons/balance.png",
    label: t('detiltrade.leverage'),
    path: "/pages/chartsettings/index",
  },
  {
    icon: "/static/icons/list.png",
    label: t('detiltrade.copy_trade'),
    path: "/pages/chartsettings/index",
  },
]);

const timeList = [
  { param: "1m", label: t("one_minute") },
  { param: "5m", label: t("five_minutes") },
  { param: "15m", label: t("fifteen_minutes") },
  { param: "1h", label: t("one_hour") },
  { param: "4h", label: t("four_hours") },
  { param: "1d", label: t("daily") },
];
const selected = ref({ param: "1m", label: t("one_minute") });

const selectTime = (item) => {
  selected.value = item;

  getCandle();
};

const selectTimeRange = (item) => {
  activeTime.value = item;

  getFundFlow();
};

const selectTabs = (index) => {
  marketQuotes.value = false;
  marketData.value = false;
  squareData.value = false;

  if (index == 0) {
    marketQuotes.value = true;
  } else if (index == 1) {
    marketData.value = true;
  } else if (index == 2) {
    squareData.value = true;
  }

  currentTab.value = index;
};

const onRefresh = (e) => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
};

const activeTab = ref("flow");
const timeRanges = [
  { param: "15m", label: t('detiltrade.time_ranges.15m') },
  { param: "30m", label: t('detiltrade.time_ranges.30m') },
  { param: "1h", label: t('detiltrade.time_ranges.1h') },
  { param: "2h", label: t('detiltrade.time_ranges.2h') },
  { param: "4h", label: t('detiltrade.time_ranges.4h') },
];
const activeTime = ref({ param: "15m", label: "15m" });

const tableRows = ref([]);
const barChartTableRows = ref([]);

const summary = ref({
  fiveDay: 471.9416,
  last24h: 260.0837,
});

const pieOption = ref({});

const initPieChart = async () => {
  await nextTick();
  const dom = document.getElementById("pieChart");
  if (!dom) {
    console.warn("❌ pieChart DOM belum siap");
    return;
  }

  const chart = echarts.init(dom);
  chart.setOption(pieOption.value);
  window.addEventListener("resize", () => chart.resize());
};

const initBarChart = async () => {
  await nextTick();

  const dom = document.getElementById("barChart");
  if (!dom) {
    console.warn("❌ barChart DOM belum siap");
    return;
  }

  const chart = echarts.init(dom);

  const data = [260.0837, -100.0696, 260.0837, -283.0696, -100.0696, 260.0837];
  const categories = [];

  const option = {
    backgroundColor: "transparent",
    grid: {
      left: "8%",
      right: "6%",
      top: "12%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#aaa", fontSize: 12 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#333" } },
      axisLabel: { show: false },
      axisTick: { show: false },
      min: -300,
      max: 300,
    },
    series: [
      // ✅ Positif (Hijau)
      {
        type: "bar",
        barWidth: 35,
        data: barChartTableRows.value.map((v) => (v > 0 ? v : 0)),
        itemStyle: { color: "#3DB063", borderRadius: [6, 6, 6, 6] },
        label: {
          show: true,
          position: "top",
          fontSize: 2,
          color: "#3DB063",
          fontWeight: "bold",
          formatter: (params) => (params.value > 0 ? params.value : ""),
        },
      },
      // ✅ Negatif (Merah)
      {
        type: "bar",
        barWidth: 35,
        data: barChartTableRows.value.map((v) => (v < 0 ? v : 0)),
        itemStyle: { color: "#EF5350", borderRadius: [6, 6, 6, 6] },
        label: {
          show: true,
          position: "bottom",
          distance: 12, // 👈 Tambah jarak bawah agar tidak nempel
          fontSize: 2,
          color: "#EF5350",
          fontWeight: "bold",
          formatter: (params) => (params.value < 0 ? params.value : ""),
        },
      },
    ],
    // ✅ Garis tengah (nol)
    markLine: {
      silent: true,
      data: [{ yAxis: 0 }],
      lineStyle: { color: "#555", width: 1 },
    },
    animationDuration: 800, // smooth animasi
  };

  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
};

const selectActiveTabSquare = (index) => {
  activeTabSquare.value = index;
  squareNewsData.value = true; // 确保内容区域始终显示
  console.log(posts);

  // 移除tab切换时的getBlog调用，只切换tab和列表内容
  // 数据已经在页面初始化时加载完成

  // 确保新闻列表数据不为空
  if (index === 0 && posts.value.length === 0) {
    // 如果posts为空，使用初始的模拟数据
    posts.value = [
      {
        id: "1",
        title: "币圈分析师张三",
        time: "2小时前",
        text: "今天的BTC走势非常关键，关注4小时K线能否有效突破。我认为现在是一个较好的入场时机，各位怎么看？",
        User: {
          photo: "/static/icons/testAvatar.png",
        },
        BlogImage: [
          {
            banner: "/static/icons/dynamicTest.png",
          },
        ],
        PageLike: {
          cnt: "128",
        },
        PageComment: {
          cnt: "36",
        },
        PageView: {
          cnt: "2456",
        },
        remark: "我看好BTC突破60000美元",
        footerText: "来自：币圈快讯",
      },
      {
        id: "2",
        title: "加密货币爱好者李四",
        time: "昨天",
        text: "ETH的Layer2解决方案正在改变整个生态系统，gas费大幅降低，交易速度提升，这将为DeFi和NFT带来新的机遇。",
        User: {
          photo: "/static/icons/testAvatar.png",
        },
        BlogImage: [],
        PageLike: {
          cnt: "89",
        },
        PageComment: {
          cnt: "24",
        },
        PageView: {
          cnt: "1532",
        },
        remark: "Layer2是未来趋势",
        footerText: "来自：区块链日报",
      },
    ];
  }
};

// posts 变量已在文件上方声明，这里不需要重复声明

const handleMenuClick = (item, index) => {
  console.log("Klik:", item.label, index);

  // contoh navigasi ke halaman
  uni.navigateTo({
    url:
      item.path + "?data=" + encodeURIComponent(JSON.stringify(detail.value)),
  });
};

async function toggleFavorite() {
  console.log(userInfo);
  const favoriteParams: FavoriteParams = {
    passkey: userStore.pasKeyAuth,
    device: "android",
    appversion: "1.0",
    token: userInfo.data.token,
    lang: "eng",
    symbol: detail.value.symbol,
    favorite: true,
  };

  const resultCandle = await userStore.favorite(favoriteParams);
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Konten bisa di-scroll */
.scroll-content {
  height: 100vh;
  // padding-top: calc(170rpx + constant(safe-area-inset-top));
  // padding-top: calc(170rpx + env(safe-area-inset-top));
  /* Sesuaikan agar tidak tertutup header */
  padding-left: 30rpx;
  padding-right: 30rpx;
  padding-bottom: 170rpx;
  // box-sizing: border-box;
  padding-top: 220rpx !important;
}

.price-section {
  color: white;
  padding: 10px 0;
  margin-top: 10px;
}

.disabled {
  display: none;
}

/* Header fixed di atas */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #202020;
  z-index: 99;
  padding: 80rpx 20rpx 0 !important;
  // padding-top: calc(40rpx + constant(safe-area-inset-top));
  // padding-top: calc(40rpx + env(safe-area-inset-top));
  // box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.4);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.icon {
  width: 40rpx;
  height: 32rpx;
}

.title {
  margin-left: 20rpx;
  // margin-right: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.actions {
  display: flex;
  gap: 20rpx;

  .icon {
    width: 32rpx;
    height: 32rpx;
  }
}

.tabs {
  display: flex;
  // gap: 60rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  margin-top: 20rpx;
}

.tab {
  color: #888;
  margin-right: 60rpx;
}

.tab.active {
  color: #fff;
  font-weight: bold;
}

.divider {
  border-bottom: 1px solid #333;
  margin: 20rpx 0;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left {
  flex: 1;
}

.label {
  font-size: 20rpx;
  color: #888;
}

.price-container {
  display: flex;
  align-items: flex-start;
}

.price {
  color: #3db063;
  font-size: 40rpx;
  margin-right: 16rpx;
  font-weight: bold;
  line-height: 1.2;
}

.change {
  color: #3db063;
  font-size: 18rpx;
}

.sub {
  margin-top: 10rpx;
}

.a-share {
  color: #888;
  margin-right: 10rpx;
  font-size: 22rpx;
}

.change-red {
  color: #3db063;
}

.right {
  flex: 1;
  text-align: right;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.value {
  color: #fff;
  font-size: 28rpx;
}

.chart {
  width: 100%;
  height: 600rpx;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #ccc;
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.info-label {
  font-size: 20rpx;
}

.info-value {
  margin-left: 16rpx;
  font-size: 20rpx;
}

.news-bar {
  margin-top: 40rpx;
  border-radius: 8rpx;
  padding: 16rpx 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.news-icon {
  width: 28rpx;
  height: 28rpx;
}

.news-close {
  width: 30rpx;
  height: 30rpx;
  margin-left: auto;
  /* dorong ke kanan */
  border-radius: 50%;
}

.news-text {
  color: #ccc;
  font-size: 18rpx;
}

.chart-container {
  background-color: #202020;
  padding: 20rpx 0;
}

.chart {
  width: 100%;
  height: 600rpx;
}

.time-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 0rpx;
}

.time-options {
  display: flex;
  align-items: center;
  flex: 1;
}

.time-item {
  color: #ccc;
  margin-right: 30rpx;
  font-size: 16rpx;
  padding: 4rpx 8rpx;
  border-radius: 50rpx;
  transition: all 0.2s ease;
}

.time-item.active {
  background-color: #fff;
  color: #000;
}

.settings {
  display: flex;
  align-items: center;
}

.gear-icon {
  width: 40rpx;
  height: 40rpx;
}

/* Charts */
.chart-container {
  padding: 20rpx;
}

.chart {
  width: 100%;
  height: 600rpx;
}

.volume-chart-container {
  padding: 20rpx;
  margin-top: -40rpx;
}

.volume-chart {
  width: 100%;
  height: 300rpx;
}

.order-book {
  width: 100%;
  background-color: #202020;
  padding: 20rpx;
  color: #fff;
  font-size: 26rpx;
}

/* === HEADER === */
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  width: 100%;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  height: 36rpx;
  display: flex;
  position: relative;
  // margin: 0 10rpx;
  // background-color: #1a1a1a;
  border-radius: 8rpx;
  overflow: hidden;
}

.bar-info-left {
  position: absolute;
  z-index: 1;
  left: 20rpx;
}

.bar-info-left {
  .side-label {
    color: #00be4f;
    padding: 0 10rpx;
    border-radius: 6rpx;
    border: 1rpx solid #00be4f;
  }

  .side-percent {
    color: #00be4f;
    margin-left: 10rpx;
  }
}

.bar-info-right {
  position: absolute;
  z-index: 1;
  right: 20rpx;
}

.bar-info-right {
  .side-label {
    color: #ee3c4a;
    padding: 0 10rpx;
    border-radius: 6rpx;
    border: 1rpx solid #ee3c4a;
  }

  .side-percent {
    margin-right: 10rpx;
    color: #ee3c4a;
  }
}

.bar {
  height: 100%;
  position: absolute;
  top: 0;
}

.buy-bar {
  left: 0;
  background-color: rgba(25, 175, 0, 0.12);
}

.sell-bar {
  right: 0;
  background-color: rgba(238, 60, 74, 0.12);
}

.side {
  display: flex;
  align-items: center;
  // gap: 8rpx;
}

.side.buy .side-label {
  color: #3db063;
  border: 1rpx solid #3db063;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
}

.side.sell .side-label {
  color: #6b50ef;
  border: 1rpx solid #a9100d;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
}

.side-percent {
  font-size: 24rpx;
}

/* === TABLE === */
.order-title {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  font-size: 22rpx;
  color: #fff;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 60rpx;
}

.col {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
}

.col.center {
  justify-content: center;
  gap: 8rpx;
}

.col.right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40rpx;
  overflow: hidden;
}

.buy-price {
  color: #3db063;
}

.sell-price {
  color: #ef5350;
}

.text {
  position: relative;
  z-index: 2;
}

.bar-bg {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1;
  // opacity: 0.2;
}

.bar-bg-left {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
  // opacity: 0.2;
}

.buy-bg {
  background-color: rgba(25, 175, 0, 0.12);
}

.buy-bg-2 {
  background-color: #3db063;
  // opacity: 0.2;
}

.sell-bg {
  background-color: rgba(238, 60, 74, 0.12);
}

/* ====== Layout Utama ====== */
.bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1c1d20;
  z-index: 100;
}

.bottom-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
}

/* ====== Menu Ikon ====== */
.menu {
  display: flex;
  align-items: center;
  // gap: 40rpx; 
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
}

.menu-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 8rpx;
}

.menu-text {
  font-size: 16rpx;
  color: #fff;
}

/* ====== Tombol Buy / Sell ====== */
.action-buttons {
  display: flex;
  align-items: center;
  // gap: 20rpx;
}

.btn {
  width: 158rpx;
  height: 80rpx;
  margin-left: 20rpx;
  box-sizing: border-box;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dcd0d0;
  font-size: 26rpx;
  background-image: linear-gradient(180deg, #394a78, #8c4d56);
}

.buy {
  background-image: linear-gradient(180deg, #374d7e, #8d5262);
}

.sell {
  background-image: linear-gradient(180deg, #3a4d7b, #884f5f);
}

/* 🌈 Tabs di bagian atas */
.tab-header-data {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 30rpx 0 40rpx;
  position: relative;
  z-index: 2;
  /* pastikan tidak tertutup */
}

.tab-btn-data {
  padding: 8rpx 36rpx;
  border-radius: 60rpx;
  // background: #1a1a1a;
  color: #9aa4ae;
  font-size: 30rpx;
  transition: all 0.3s ease;
  border: 1px solid #9aa4ae;
  box-sizing: border-box;
}

.tab-btn-data.active {
  background: linear-gradient(175deg, #5565b9, #cd5890);
  color: #fff;
  border: none;
  // box-shadow: 0 0 10rpx rgba(255, 77, 109, 0.5);
}

/* 🧩 Judul section */
.section-title-data {
  font-size: 32rpx;
  font-weight: 700;
  margin: 40rpx 0 20rpx;
  color: #fff;
  z-index: 2;
  position: relative;
}

/* Kontainer utama biar tidak ketimpa header */
.page-content-data {
  margin-top: 200rpx;
  /* jarak dari header tetap */
  padding: 0 30rpx 100rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* ⏱️ Tombol rentang waktu */
.time-tabs-data {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.time-btn-data {
  // background: rgba(28, 28, 28, 0.8);
  color: #aaa;
  padding: 10rpx 26rpx;
  border-radius: 40rpx;
  // border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 26rpx;
  transition: all 0.2s ease;
}

.time-btn-data.active {
  background: linear-gradient(175deg, #5565b9, #cd5890);
  color: #fff;
  border-color: transparent;
}

/* 📊 Chart Container */
.chart-box-data {
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 0;
}

.data-card {
  background: #2a2a2a;
  /* transparan elegan */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.pie-chart-data {
  width: 100%;
  height: 400rpx;
  /* bisa disesuaikan */
}

.bar-chart-data {
  width: 100%;
  height: 400rpx;
  /* atau lebih tinggi */
}

.table-data {
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.table-row-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 24rpx;
  font-size: 26rpx;
  color: #ddd;
  border-bottom: 1px solid #2a2a2a;
}

/* Header table */
.table-row-data.header {
  background: #2a2a2a;
  color: #aaa;
  font-weight: 600;
  font-size: 28rpx;
  border-bottom: 1px solid #5b5959;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Kolom individual — agar sejajar */
.col-type {
  flex: 1.5;
  text-align: left;
}

.col-buy,
.col-sell,
.col-net {
  flex: 1;
  text-align: center;
  font-size: 20rpx;
}

/* Warna status */
.buy-data {
  color: #00e676;
}

.sell-data {
  color: #ff5252;
}

.netflow-data {
  color: #ffb74d;
}

.buy-data {
  color: #00e676;
}

.sell-data {
  color: #ff5252;
}

.netflow-data {
  color: #ffb74d;
}

/* 📈 Summary section */
.summary-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #ccc;
  margin-bottom: 20rpx;
  background: #2a2a2a;
  padding: 20rpx 30rpx;
  border-radius: 20rpx;
  // box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.25);
  z-index: 1;
  position: relative;
}

.content-square {
  padding: 40rpx 0rpx 24rpx;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
}

/* Tabs */
.tab-container-square {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // margin-bottom: 30rpx;
  // margin-top: 20rpx;
  // gap: 20rpx;
}

.tab-item-square {
  padding: 8rpx 40rpx;
  border-radius: 999rpx;
  border: 1rpx solid #9aa4ae;
  color: #9aa4ae;
  font-size: 28rpx !important;
  background: transparent;
  transition: all 0.3s;
  margin-right: 20rpx;
}

.tab-item-square.active {
  background: linear-gradient(175deg, #5565b9, #cd5890);
  color: #fff;
  // font-weight: 500;
  border: none;
}

/* News Card */
.news-card-square {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
  padding: 20rpx 0;
  /* 统一垂直间距为 12rpx，保持与市场页一致 */
  margin-bottom: 12rpx;
}

/* 新闻列表容器：启用列布局和统一间距 */
.news-list-square {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.news-list-square .news-card-square:last-child {
  margin-bottom: 0;
}

.news-info-square {
  flex: 1;
  padding-right: 20rpx;
}

.news-title-square {
  font-size: 28rpx;
  font-weight: 500;
  color: #f1f1f1;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-meta-square {
  font-size: 24rpx;
  color: #9a9a9a;
  display: block;
}

.news-thumb-square {
  width: 128rpx;
  height: 108rpx;
  border-radius: 12rpx;
  object-fit: cover;
}

.news-container-square-News-Data {
  display: flex;
  gap: 20rpx;
  overflow-x: scroll;
  padding: 20rpx 0;
}

.news-card-square-News-Data {
  flex: 0 0 auto;
  width: 452rpx;
  background: #2a2a2a;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border: 1rpx solid rgba(255, 255, 255, 0.08);
  // box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
}

.news-left-square-News-Data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.news-title-square-News-Data {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.5;
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30rpx;
}

.news-views-square-News-Data {
  font-size: 22rpx;
  color: #9ca3af;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-icon-square-News-Data {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(175deg, #5565b9, #cd5890);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}

.news-icon-square-News-Data image {
  width: 25rpx;
  height: 32rpx;
}

/* 📱 Responsif kecil */
@media screen and (max-width: 500px) {
  .time-btn-data {
    font-size: 24rpx;
    padding: 8rpx 20rpx;
  }

  .section-title-data {
    font-size: 28rpx;
  }

  .table-row-data {
    font-size: 24rpx;
  }
}

.news-list-square-News-Data {
  background: #0b0b0b;
  padding: 20rpx;
}

/* Card */
.post-item-square-News-Data {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 26rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 28rpx;
}

/* Header */
.post-header-square-News-Data {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar-square-News-Data {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.userinfo-square-News-Data {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username-square-News-Data {
  font-weight: 600;
  font-size: 30rpx;
}

.time-square-News-Data {
  color: #9ca3af;
  font-size: 26rpx;
}

.follow-btn-square-News-Data {
  background: linear-gradient(90deg, #b44cff, #ff4dc4);
  color: #fff;
  border-radius: 40rpx;
  padding: 8rpx 28rpx;
  font-size: 26rpx;
}

/* Content */
.post-content-square-News-Data {
  color: #e5e7eb;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

/* Images */
.post-images-square-News-Data {
  display: flex;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.post-images-square-News-Data image {
  width: 48%;
  border-radius: 12rpx;
}

/* Actions */
.post-actions-square-News-Data {
  display: flex;
  gap: 50rpx;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.action-item-square-News-Data {
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 26rpx;
}

.action-icon-square-News-Data {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
  opacity: 0.9;
}

/* Footer */
.post-footer-square-News-Data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 26rpx;
}

.footer-user-square-News-Data {
  color: #fff;
  font-weight: 500;
}

.footer-text-square-News-Data {
  flex: 1;
  margin-left: 8rpx;
  color: #9ca3af;
}

.views-square-News-Data {
  font-size: 24rpx;
  color: #6b7280;
}

/* Personal Views Content - 与market/index页面保持一致 */
.personal-views-content {
  padding: 0 0rpx;
  /* 使用列布局与 gap 增强列表间距的可控性 */
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.view-item {
  padding: 24rpx 0 0;
  /* 与整体统一：垂直间距 12rpx */
  margin-bottom: 12rpx; /* 作为旧设备的回退方案 */
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.personal-views-content .view-item:last-child {
  margin-bottom: 0;
}

.view-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.user-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-size: 28rpx;
}

.user-name .name {
  font-weight: 500;
}

.name {
  font-size: 28rpx;
}

.follow-btn-mini {
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  padding: 8rpx 22rpx;
  border-radius: 40rpx;
  font-size: 20rpx;
}

.view-content {
  font-size: 26rpx;
  line-height: 1.5;
}

.view-images {
  padding-top: 16rpx;
  display: flex;
  margin-bottom: 14rpx;
  gap: 12rpx;
}

.view-image {
  width: 270rpx;
  height: 196rpx;
  border-radius: 16rpx;
  object-fit: cover;
}

.view-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 32rpx;
  margin-bottom: 12rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.commentIcon {
  width: 36rpx;
  height: 36rpx;
}

.action-count {
  font-size: 24rpx;
  color: #9aa4ae;
}

.view-time {
  font-size: 22rpx;
  color: #9aa4ae;
}

.actions-box {
  padding-top: 20rpx;
  display: flex;
  justify-content: space-between;
}

/* 评论区域样式 */
.comments-section {
  margin-top: 10rpx;
}

.comment-item {
  margin-bottom: 24rpx;
}

.comment-header {
  margin-bottom: 8rpx;
}

.comment-username {
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
}

.comment-content {
  font-size: 22rpx;
  color: #9aa4ae;
  line-height: 1.5;
  margin-left: 6rpx;
  margin-bottom: 12rpx;
}

.time {
  color: #9aa4ae;
  font-size: 24rpx;
}
</style>
