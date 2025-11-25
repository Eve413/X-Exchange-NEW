<template>
  <view class="home-page">
    <!-- 页面内容 -->
    <view class="page-content">
      <SafeTop :extraPadding="0" />
      <view class="header">
        <!-- Avatar -->
        <image class="avatar" src="/static/icons/ic_avatar.png" mode="aspectFill" />

        <!-- Search Bar -->
        <view class="search-bar">
          <image class="search-icon" src="/static/icons/searchImg.png" mode="aspectFit" />
          <text class="search-text">{{ $t('home.search_select') }}</text>
        </view>
      </view>

      <view class="wallet-card">
        <!-- Baris 1 -->
        <view class="row top-row" @click="goToVerification">
          <image class="icon" src="/static/icons/ic_notif.png" mode="aspectFit" />
          <text class="text">{{
            $t(
              "home.please_complete_identity_verification_before_the_transaction"
            )
          }}</text>
          <text class="arrow">
            <image class="arrow-icon" src="/static/icons/ic_arrow_right.png" mode="aspectFit" />
          </text>
        </view>

        <!-- Baris 2 -->
        <view class="row middle-row" @click="goToAsset">
          <image class="icon" src="/static/icons/ic_eye.png" mode="aspectFit" />
          <text class="label">{{ $t("home.total_asset_valuation") }}</text>

          <!-- Unit + Arrow -->
          <view class="unit-wrapper">
            <text class="unit">{{ dashboardData?.User?.Currency?.alias }}</text>
            <image class="arrow-down" src="/static/icons/ic_arrow_down.png" mode="widthFix" />
          </view>
        </view>

        <!-- Baris 3 -->
        <view class="row amount-row">
          <text class="amount">{{ dashboardData?.User?.balance }}</text>
          <view class="recharge-btn" @click="goToRecharge">{{
            $t("home.go_to_top_up")
          }}</view>
        </view>

        <!-- Baris 4 -->
        <view class="row bottom-row">
          <text class="label">{{ $t("home.todays_profit_and_loss") }}</text>
          <text class="value">{{ dashboardData?.OrderHistory?.pnl }}</text>
          <text class="percent">{{ dashboardData?.OrderHistory?.pnl_percentage }}</text>
        </view>
      </view>

      <!-- Menu 1 -->
      <view class="menu1">
        <view v-for="item in menuItems" :key="item.text" class="menu1-item" @click="selectItem(item.id)">
          <image :src="item.icon" class="menu1-icon" mode="aspectFit" />
          <text class="menu1-label">
            {{ item.text }}
          </text>
        </view>
      </view>

      <view class="contractTrading" @click="goDetilNews({
  title: `${dashboardData?.Mission?.bonus} ${dashboardData?.Mission?.baseAsset}`,
  desc: dashboardData?.Mission?.description
})">
        <view class="contractTrading-left">
          <view class="contractTrading-title" v-html="dashboardData?.Mission?.description"></view>
          <view class="contractTrading-sub">
            <text class="contractTrading-amount">{{ dashboardData?.Mission?.bonus }}
              {{ dashboardData?.Mission?.baseAsset }}</text>
            <text class="contractTrading-desc">{{ $t('home.waiting_for_you') }}</text>
            <text class="contractTrading-arrow">›</text>
          </view>
        </view>

        <image src="/static/icons/ic_contract_trading.png" class="contractTrading-img" mode="widthFix" />
      </view>
      <view class="myFavorites">
        <text class="myFavorites-title">{{ $t("home.hot_news") }}</text>

        <view class="myFavorites-more">
          <text class="myFavorites-link">{{ $t("home.view_more") }}</text>
          <text class="myFavorites-arrow">›</text>
        </view>
      </view>

      <view class="newsContainer">
        <scroll-view scroll-y class="newsScroll" show-scrollbar="false">
          <view v-for="(item, index) in newsList" :key="index" class="newsCard" @click="goDetilNews(item)">
            <view class="newsContent">
              <view class="newsText">
                <text class="newsTitle">{{ item.title }}</text>
                <text class="newsSource">{{ item.source }} {{ item.time }}</text>
              </view>
              <image class="newsImage" :src="item.image" mode="aspectFill" />
            </view>
            <view class="divider"></view>
          </view>
        </scroll-view>
      </view>
      <view class="userCard">
        <view class="token-info">
          <view class="token-header">
            <view class="info-left">
              <view class="token-avatar">
                <image src="/static/icons/testAvatar.png" class="avatar-img" mode="aspectFit"></image>
              </view>
              <view class="token-details">
                <view class="token-name">{{ dashboardData?.Mission?.baseAsset }}</view>
                <view class="token-description">{{ $t('home.bitget_token') }}</view>
              </view>
            </view>
            <view class="info-right">
              <view class="token-price">
                <view class="price-num">{{ dashboardData?.Mission?.bonus }} </view>
                <view class="price-title"> {{ $t('home.latest_price') }} </view>
              </view>
              <view class="token-price1">
                <view class="price-change"> +7.40% </view>
                <view class="price-title"> {{ $t('home.price_change') }} </view>
              </view>
            </view>
          </view>
        </view>

        <view class="platform-badge">{{ $t('home.platform_coin') }}</view>
        <view class="activity-info">
          <image src="/static/icons/ic_eye.png" class="activity-icon" mode="aspectFit"></image>
          <span class="activity-text">{{ $t('home.btc_bgb_airdrop') }}</span>
        </view>
      </view>
      <view class="Activity">
        <view class="Activity-left">
          <view class="Activity-title">
            <view class="left-line"></view>{{ $t('home.task_center') }}
          </view>
          <view class="Activity-desc">
            {{ $t('home.max_reward_tasks') }}
            <text class="Activity-amount">{{ $t('home.doge_reward') }}</text>
            {{ $t('home.start_exploration') }}
          </view>
        </view>
        <image src="/static/icons/activeIcon.png" class="contractTrading-img" mode="widthFix" />
      </view>
      <view class="promoCards">
        <!-- Kartu kiri -->
        <view class="promoCards-item">
          <view class="promoCards-left">
            <text class="promoCards-title">
              {{ $t('home.contract_earn_bgb') }}<br />
              {{ $t('home.bgb_fan_airdrop') }}
            </text>
            <text class="promoCards-sub">{{ $t('home.claim_2025_airdrop') }}</text>
          </view>

          <image src="/static/icons/ic_gift1.png" class="promoCards-img" mode="widthFix" />

          <text class="promoCards-index">{{ $t('home.promo_index') }}</text>
        </view>

        <!-- Kartu kanan -->
        <view class="promoCards-item">
          <view class="promoCards-content">
            <text class="promoCards-header">{{ $t('home.wealth_treasure') }}</text>
            <image src="/static/icons/ic_uber.png" class="promoCards-logo" mode="widthFix" />
            <text class="promoCards-coin">{{ $t('home.btc') }}</text>
            <text class="promoCards-apr"><text>10.00%</text> {{ $t('home.apr') }}</text>
            <text class="promoCards-status">{{
              $t("home.flexible_deposit")
            }}</text>
          </view>

          <text class="promoCards-index">2/9</text>
        </view>
      </view>
      <view class="hot-box">
        <image src="/static/icons/ic_uber.png" class="hot-Icon" mode="widthFix" />
        <view class="hot-right">
          <view class="hot-title">
            <image src="/static/icons/fire-icon.png" class="fire-Icon" mode="widthFix" />{{ $t("home.hot_search") }}
          </view>
          <view class="hot-content">{{ $t("home.bgb_trading") }}</view>
        </view>
      </view>

      <view class="announcement" @click="goToNotification">
        <view class="announcement-content">
          <image src="/static/icons/ic_notif.png" class="announcement-icon" mode="widthFix" />
          <text class="announcement-text">
            {{ $t("home.announcement_text") }}
          </text>
        </view>
        <text class="announcement-arrow">›</text>
      </view>

      <view class="myFavorites">
        <text class="myFavorites-title">{{ $t("home.my_favorites") }}</text>

        <view class="myFavorites-more" @click="goToTrade">
          <text class="myFavorites-link">{{ $t("home.view_more") }}</text>
          <text class="myFavorites-arrow">›</text>
        </view>
      </view>

      <view class="cryptoList">
        <scroll-view class="cryptoList-scroll" scroll-x>
          <view v-for="(item, index) in cryptoData" :key="index" class="cryptoList-card">
            <view class="cryptoList-header">
              <image :src="item.icon" class="cryptoList-icon" mode="widthFix" />
              <text class="cryptoList-name">{{ item.name }}</text>
            </view>

            <text class="cryptoList-pair">{{ item.quoteAsset }}</text>

            <image :src="item.sparkline" class="cryptoList-chart" mode="widthFix" />

            <view class="cryptoList-footer">
              <text class="cryptoList-price">{{ item.lastPrice }}</text>
              <text class="cryptoList-change" :class="{
                up: item.percentChange24h > 0,
                down: item.percentChange24h < 0,
              }">
                {{ item.percentChange24h > 0 ? "▲" : "▼" }}
                {{ (item.percentChange24h.toFixed(2) * 100).toFixed(0) }}%
              </text>
            </view>
          </view>
        </scroll-view>
      </view>


    </view>

    <!-- 底部导航栏 -->
    <BottomTabBar :currentPath="currentRoute" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import { SafeTop, BottomTabBar } from "@/components";
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore, TickersParams, DashboardParams } from "@/store/modules/user";
import { onLoad } from "@dcloudio/uni-app";
import { goMarket, goTrade } from "@/utils/navigation";
const userInfo = uni.getStorageSync('userData')
const { t } = useI18n();

const userStore = useUserStore();

let cryptoData = ref([]);
let showSettingDialog = ref(false);
let dashboardData = ref(null);
// ✅ Lifecycle: onLoad
onLoad(async (options) => {
  console.log("options:", options);

  try {
    const tickersParams: TickersParams = {
      passkey: userStore.pasKeyAuth,
      type: "",
      limit: 100,
      lang: userStore.language
    };

    const dashboardParams: DashboardParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: userStore.language
    }

    const resultAuth = await userStore.getTickers(tickersParams);
    const resulDashboard = await userStore.getDashboard(dashboardParams);

    dashboardData.value = resulDashboard.data.data
    // Update reactive array dengan assignment, bukan push loop
    cryptoData.value = resultAuth.data;

    interface dataBlog {
      "title": string;
      "source": string;
      "time": string;
      "image": string;
      "desc": string;
    }
    let dataBlogs: dataBlog[] = []


    if (resulDashboard?.data?.status === -1) {
      handleLogout()
    }

    resulDashboard?.data?.data?.Blog?.forEach(item => {
      dataBlogs.push({
        "title": item?.title,
        "source": item?.source_name,
        "time": item?.date,
        "image": item?.banner,
        "desc": item?.desc
      })
    })

    newsList.value = dataBlogs

    console.log("✅ API Result:???????", dashboardData.value);
  } catch (e) {
    console.error("❌ Failed to load tickers:", e);
  }
});

onMounted(() => {
  // 获取当前路由用于底部栏高亮
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    currentRoute.value = `/${currentPage.route}`;
  }
});


const handleLogout = () => {
  uni.showModal({
    title: t('profile.confirm_logout'),
    content: t('profile.confirm_logout_message'),
    success: (res) => {
      if (res.confirm) {
        try {
          // 清除所有用户相关数据
          uni.removeStorageSync("userInfo");
          uni.removeStorageSync("isRegistered");
          uni.removeStorageSync("isLoggedIn");
          uni.removeStorageSync("login_cache");
          uni.removeStorageSync("token"); // 额外清除token以提高安全性
          uni.removeStorageSync("userData"); // 清除初始化时使用的userData

          console.log("✅ 成功清除所有用户数据");

          // 显示退出成功提示
          uni.showToast({
            title: t('profile.logged_out'),
            icon: "success",
          });

          // 关闭设置弹窗
          showSettingDialog.value = false;

          // 跳转到登录页
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/auth/login" });
          }, 1000);
        } catch (error) {
          console.error("❌ 清除用户数据时出错:", error);
          // 即使出错也尝试跳转到登录页
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/auth/login" });
          }, 1000);
        }
      }
    },
  });
};

// 快捷操作
const goToMarket = () => {
  goMarket();
};

const goToTrade = () => {
  goTrade();
};

const goDetilNews = (item) => {
uni.navigateTo({ url: `/pages/detilnews/index?title=${item?.title}&desc=${item?.desc}` });
};



// 跳转到通知页面
const goToNotification = () => {
  uni.navigateTo({ url: "/pages/notification/index" });
};

// const activeItem = ref("奖励");

// 将menuItems改为计算属性，确保语言切换时自动更新
const menuItems = computed(() => [
  { text: t('home.rewards'), icon: "/static/icons/ic_gift.png", id: 1 },
  { text: t('home.follow_trading'), icon: "/static/icons/ic_follow_orders.png", id: 2 },
  { text: t('home.airdrop'), icon: "/static/icons/ic_airdrop.png", id: 3 },
  { text: t('home.new_listing'), icon: "/static/icons/ic_make_new_ones.png", id: 4 },
]);

const selectItem = (id: any) => {
  // activeItem.value = id;
  // 点击跟单按钮跳转到跟单页面
  console.log(id, '?????????')

  if (id == 1) {
    // setTimeout(() => {
    // uni.navigateTo({
    //   url: "/pages/share/index",
    //   success: () => console.log("✅ 跳转到奖励页面"),
    //   fail: (err) => console.error("❌ 跳转失败:", err),
    // });
    uni.navigateTo({
      url: "/pages/locked/index",
      success: () => console.log("✅ 跳转到功能未解锁页面"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
    // }, 100)
  }
  else if (id == 2) {
    // setTimeout(() => {
    uni.navigateTo({
      url: "/pages/follow/index",
      success: () => console.log("✅ 跳转到跟单页面"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
    // }, 100)
  } else if (id == 3) {
    // 点击空投按钮跳转到空投页面
    // uni.navigateTo({
    //   url: "/pages/airdrop/index",
    //   success: () => console.log("✅ 跳转到空投页面"),
    //   fail: (err) => console.error("❌ 跳转失败:", err),
    // });
    // 功能未解锁，跳转到锁定页面
    uni.navigateTo({
      url: "/pages/locked/index",
      success: () => console.log("✅ 跳转到功能未解锁页面"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
  } else if (id == 4) {
    // 点击打新按钮跳转到打新页面
    // uni.navigateTo({
    //   url: "/pages/wealth/newlisting",
    //   success: () => console.log("✅ 跳转到打新页面"),
    //   fail: (err) => console.error("❌ 跳转失败:", err),
    // });
    // 功能未解锁，跳转到锁定页面
    uni.navigateTo({
      url: "/pages/locked/index",
      success: () => console.log("✅ 跳转到功能未解锁页面"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
  }
};

// 当前路由用于 BottomTabBar 高亮
const currentRoute = ref("/pages/home/index");

// 处理底部栏切换事件（实际导航由 BottomTabBar 内部处理）
const handleTabChange = (tab: any, index: number) => {
  console.log("首页底部Tab切换:", tab?.label, index);
};

const cryptoDatas = [
  {
    name: "Bitcoin",
    pair: "BTC/USD",
    price: "$29,732.54",
    change: 16.38,
    icon: "/static/logo/logos_bitcoin.png",
    chart: "/static/icons/line_chart.png",
  },
  {
    name: "Ethereum",
    pair: "ETH/USD",
    price: "$1,998.70",
    change: 16.38,
    icon: "/static/logo/logos_eth.png",
    chart: "/static/icons/line_chart.png",
  },
  {
    name: "BNB",
    pair: "BNB/USD",
    price: "$315.78",
    change: -2.45,
    icon: "/static/logo/logos_bnb.png",
    chart: "/static/icons/line_chart.png",
  },
];

const newsList = ref<Array<{
  "title": string;
  "source": string;
  "time": string;
  "image": string;
}>>([])


const goToVerification = () => {
  // Arahkan ke halaman verifikasi

  // setTimeout(() => {
  uni.navigateTo({
    url: "/pages/createkyc/intro",
    success: () => console.log("✅ Navigated"),
    fail: (err) => console.error("❌ Navigation failed:", err),
  });
  // }, 500)
};

const goToAsset = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/assetsoverview/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

// 跳转到充值页面
const goToRecharge = () => {
  console.log('跳转')
  // setTimeout(() => {
  uni.navigateTo({
    url: "/pages/recharge/index",
    success: () => console.log("✅ 跳转到充值页面成功"),
    fail: (err) => console.error("❌ 跳转到充值页面失败:", err),
  });
  // }, 100)
};
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #202020;
  padding-bottom: 240upx; // 为底部导航栏留出空间 (176upx高度 + 60upx底部间距)
}

.page-content {
  padding: 20upx 32upx 40upx;
  padding-top: 80rpx;
}

.welcome-section {
  margin-bottom: 48upx;
}

.quick-actions {
  display: flex;
  gap: 24upx;
  margin-top: 32upx;
}

.demo-title {
  font: $font-heading-medium;
  color: $primary-700;
  margin-left: 16upx;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 16upx;
}

.demo-text {
  font: $font-body-bold;
  color: $text-color-primary;
  text-align: center;
}

.demo-desc {
  font: $font-caption-medium;
  color: $text-color-secondary;
  text-align: center;
  line-height: 1.6;
}

.header {
  display: flex;
  align-items: center;
  padding: 6rpx 0;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.search-bar {
  flex: 1;
  height: 72rpx;
  margin-right: 90rpx;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.search-icon {
  width: 38rpx;
  height: 38rpx;
  // opacity: 0.7;
}

.search-text {
  color: #cccccc;
  font-size: 28rpx;
  margin-left: 8rpx;
}

.wallet-card {
  color: #fff;
  padding: 28rpx 0;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  width: 28rpx;
  height: 28rpx;
  // opacity: 0.8;
  margin-right: 8rpx;
}

.text {
  flex: 1;
  font-size: 28rpx;
  color: #9aa4ae;
}

.arrow {
  font-size: 34rpx;
  color: #666;
}

.middle-row {
  justify-content: flex-start;
  display: flex;
  align-items: center;

  .unit-wrapper {
    display: flex;
    align-items: center;
  }

  .label {
    font-size: 28rpx;
    color: #9aa4ae;
    margin-left: 8rpx;
  }

  .unit {
    font-size: 28rpx;
    color: #9aa4ae;
    margin-left: 10rpx;
  }

  .icon {
    width: 36rpx;
    height: 36rpx;
  }

  .arrow-down {
    width: 32rpx;
    height: 32rpx;
    margin-left: 4rpx;
  }
}

.top-row {
  .icon {
    width: 32rpx;
    height: 32rpx;
  }

  .arrow-icon {
    width: 28rpx;
    height: 28rpx;
  }
}

.amount-row {
  margin-top: 4rpx;

  .amount {
    font-size: 60rpx;
    font-weight: bold;
  }

  .recharge-btn {
    // background: linear-gradient(90deg, #6f5ef9, #b36bff);
    background: linear-gradient(175deg, #5565b9, #cd5890);
    border-radius: 999rpx;
    padding: 10rpx 28rpx;
    font-size: 26rpx;
    color: #fff;
  }
}

.bottom-row {
  justify-content: flex-start;
  font-size: 26rpx;
  color: #999;

  .label {
    margin-right: 10rpx;
  }

  .value {
    color: #ccc;
    margin-right: 10rpx;
  }

  .percent {
    color: #999;
  }
}

/* Menu 1 */
.menu1 {
  position: relative;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;

  /* Garis atas dan bawah */
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.menu1-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu1-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 8rpx;
}

.menu1-label {
  font-size: 26rpx;
  color: #ccc;
}

.menu1-active {
  color: #a855f7;
  font-weight: 600;
}

.contractTrading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0rpx;
  border-radius: 16rpx;
}

.contractTrading-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contractTrading-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.contractTrading-sub {
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 26rpx;
}

.contractTrading-amount {
  color: #8b5cf6;
  /* warna ungu lembut */
  margin-right: 8rpx;
  font-weight: 600;
}

.contractTrading-desc {
  margin-right: 6rpx;
}

.contractTrading-arrow {
  font-size: 30rpx;
  color: #aaa;
}

.contractTrading-img {
  width: 140rpx;
  height: auto;
}

.Activity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0rpx;
  border-radius: 16rpx;
}

.Activity-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.Activity-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
  position: relative;
  padding-left: 20rpx;
  box-sizing: border-box;
}

.left-line {
  width: 5rpx;
  height: 24rpx;
  border-radius: 6rpx;
  background-color: #8b5cf6;
  position: absolute;
  top: 16rpx;
  left: 0rpx;
}

.Activity-sub {
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 26rpx;
}

.Activity-amount {
  color: #8b5cf6;
  /* warna ungu lembut */
  margin-right: 8rpx;
  font-weight: 600;
}

.Activity-desc {
  margin-right: 6rpx;
  color: #9aa4ae;
  font-size: 26rpx;
}

.Activity-arrow {
  font-size: 30rpx;
  color: #aaa;
}

.Activity-img {
  width: 140rpx;
  height: auto;
}

.promoCards {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;
}

.promoCards-item {
  flex: 1;
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 24rpx;
  position: relative;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.promoCards-title {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
}

.promoCards-sub {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 8rpx;
}

.promoCards-img {
  width: 140rpx;
  height: auto;
  align-self: flex-end;
  margin-top: 20rpx;
}

.promoCards-index {
  position: absolute;
  bottom: 16rpx;
  right: 24rpx;
  font-size: 22rpx;
  color: #999;
}

/* Kartu kanan */
.promoCards-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.promoCards-header {
  color: #8b5cf6;
  font-weight: 600;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.promoCards-logo {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
}

.promoCards-coin {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}

.promoCards-apr {
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}

.promoCards-apr text {
  font-size: 28rpx;
  color: #fff;
}

.promoCards-status {
  font-size: 24rpx;
  color: #aaa;
}

.announcement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0rpx;
  /* Garis atas dan bawah */
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.announcement-content {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;
}

.announcement-icon {
  width: 34rpx;
  height: 34rpx;
  margin-right: 16rpx;
  opacity: 0.9;
}

.announcement-text {
  font-size: 26rpx;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-arrow {
  color: #aaa;
  font-size: 36rpx;
  margin-left: 20rpx;
}

.hot-box {
  width: 100%;
  border-radius: 24rpx;
  background-color: #2a2a2a;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 30rpx;
}

.fire-Icon {
  width: 24rpx;
  margin-right: 10rpx;
  // height: 26rpx;
}

.hot-Icon {
  width: 56rpx;
  height: 56rpx;
}

.hot-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 26rpx;
}

.hot-title {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.hot-content {
  color: #9aa4ae;
  font-size: 24rpx;
}

.myFavorites {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0rpx;
}

.myFavorites-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
}

.myFavorites-more {
  display: flex;
  align-items: center;
}

.myFavorites-link {
  color: #a0a0a0;
  font-size: 28rpx;
  margin-right: 6rpx;
}

.myFavorites-arrow {
  color: #a0a0a0;
  font-size: 32rpx;
  line-height: 1;
}

.cryptoList {
  padding: 20rpx 0;
}

.cryptoList-scroll {
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}

.cryptoList-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 24rpx;
  width: 300rpx;
  margin-left: 20rpx;
  color: #fff;
}

/* 第一个 cryptoList-card 移除 margin-left 和 padding */
.cryptoList-card:first-child {
  margin-left: 0;
  // padding: 0;
}

.cryptoList-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.cryptoList-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.cryptoList-name {
  font-size: 24rpx;
  color: #9ca3af;
  display: inline-block;
  max-width: 200rpx;
  /* atur sesuai kebutuhan */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.cryptoList-pair {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10rpx;
}

.cryptoList-chart {
  width: 100%;
  height: auto;
  margin-bottom: 16rpx;
}

.cryptoList-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cryptoList-price {
  font-size: 18rpx;
  font-weight: 600;
}

.cryptoList-change {
  font-size: 24rpx;
  font-weight: 600;
}

.cryptoList-change.up {
  color: #22c55e;
}

.cryptoList-change.down {
  color: #ef4444;
}

.newsContainer {
  padding: 20rpx 0;
  min-height: 60vh;
  overflow-y: auto;
}

.newsScroll {
  display: flex;
  flex-direction: column;
}

.newsCard {
  margin-bottom: 20rpx;
}

.newsContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.newsText {
  flex: 1;
  margin-right: 20rpx;
}

.newsTitle {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  display: block;
  margin-bottom: 10rpx;
}

.newsSource {
  color: #9ca3af;
  font-size: 24rpx;
}

.newsImage {
  width: 160rpx;
  height: 120rpx;
  border-radius: 16rpx;
}

.divider {
  height: 2rpx;
  background-color: #2e2e2e;
  margin-top: 20rpx;
}

.userCard {
  width: 100%;
  border-radius: 20rpx;
  background: #2a2a2a;
  padding: 32rpx 20rpx;
  margin-bottom: 32rpx;
  position: relative;
  box-sizing: border-box;
}

.token-info {
  display: flex;
  flex-direction: column;
}

.token-header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.info-left {
  display: flex;
  align-items: center;
}

.info-right {
  display: flex;
  align-items: center;
}

.token-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  // background-color: #4c5ef3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  overflow: hidden;
}

.avatar-img {
  width: 72rpx;
  height: 72rpx;
}

.token-details {
  display: flex;
  flex-direction: column;
}

.token-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.token-description {
  font-size: 24rpx;
  color: #999999;
}

.token-price {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.token-price1 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  margin-left: 80rpx;
}

.price-num {
  font-size: 34rpx;
  color: #fff;
  font-weight: 600;
}

.price-change {
  font-size: 34rpx;
  color: #22c55e;
  font-weight: 600;
}

.price-title {
  font-size: 26rpx;
  color: #9aa4ae;
}

.platform-badge {
  // position: absolute;
  // top: 32rpx;
  // right: 32rpx;
  width: fit-content;
  padding: 6rpx 18rpx;
  border-radius: 12rpx;
  background-color: #333f59;
  font-size: 24rpx;
  color: #fff;
}

.activity-info {
  display: flex;
  align-items: center;
  background-color: #3b3b3b;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
  margin-top: 30rpx;
}

.activity-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
  color: #4c5ef3;
}

.activity-text {
  font-size: 26rpx;
  color: #ffffff;
  flex: 1;
}
</style>
