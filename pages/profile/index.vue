<template>
  <view class="page">
    <!-- 顶部安全区 -->
    <SafeTop :extraPadding="0" />
    <!-- Header Profil -->
    <view class="profile-header">
      <image
        class="avatar"
        src="/static/icons/ic_avatar.png"
        mode="aspectFill"
        @click="openDialog"
      />
      <view class="info-section">
        <view class="name-row">
          <text class="name">{{ dataProfile?.User?.full_name || "-" }}</text>
          <view class="vip-badge">{{
            dataProfile?.MemberGroup?.name || "-"
          }}</view>
          <image
            src="/static/icons/ic_headphone.png"
            class="icon-small"
            @click="goToChat"
          />
          <image
            src="/static/icons/ic_setting.png"
            class="icon-small"
            @click="openSettingDialog"
          />
          <image
            src="/static/icons/ic_bell.png"
            class="icon-small"
            @click="goToNotification"
          />
        </view>
        <view class="id-row">
          <view class="id-text"
            >ID：{{ dataProfile?.User?.id ?? "-" }}
            <image src="/static/icons/Export.png" class="icon-Export" />
          </view>
          <!-- <view class="divider">
           
          </view> -->
          <view class="xcoin-text"
            >{{ $t("profile.xcoins_points") }}
            <text class="points">{{
              dataProfile?.User?.point ?? "-"
            }}</text></view
          >
        </view>
      </view>
    </view>

    <!-- Baris verifikasi -->
    <view class="verify-row" @click="goToVerification">
      <image src="/static/icons/ic_notif.png" class="icon-left" />
      <text class="verify-text">{{
        $t("home.please_complete_identity_verification_before_the_transaction")
      }}</text>
      <image src="/static/icons/ic_arrow_right.png" class="arrow-right" />
    </view>
    <view class="verify-row" @click="goToVerification1">
      <image src="/static/icons/ic_notif.png" class="icon-left" />
      <text class="verify-text">{{ $t('profile.go_to_verification') }}</text>
      <image src="/static/icons/ic_arrow_right.png" class="arrow-right" />
    </view>

    <!-- Baris aset -->
    <view class="asset-row">
      <image src="/static/icons/ic_eye.png" class="icon-left" />
      <text class="asset-text">{{ $t("profile.total_asset_value") }}</text>
      <text class="asset-unit"
        >{{ dataProfile?.User?.Currency?.alias ?? "-" }} ▾</text
      >
    </view>

    <view class="wallet-section">
      <!-- Nilai aset -->
      <view class="asset-header">
        <view class="left">
          <text class="balance">{{ dataProfile?.User?.balance ?? "-" }}</text>
          <view class="profit-row">
            <text class="profit-label">{{ $t("profile.today_pnl") }}</text>
            <text class="profit-value">{{
              dataProfile?.OrderHistory?.pnl ?? "-"
            }}</text>
            <text class="profit-percent">{{
              dataProfile?.OrderHistory?.pnl_percentage != null
                ? (dataProfile?.OrderHistory?.pnl_percentage * 100).toFixed(2) +
                  "%"
                : "0"
            }}</text>
          </view>
        </view>

        <view class="recharge-btn" @click="goToRecharge">{{
          $t("profile.go_to_recharge")
        }}</view>
      </view>

      <view class="divider"></view>

      <!-- Grid Menu -->
      <view class="menu-grid">
        <view
          v-for="(item, index) in menus"
          :key="index"
          class="menu-item"
          @click="onMenuClick(item)"
        >
          <image :src="item.icon" class="menu-icon" mode="aspectFit" />
          <text class="menu-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="task-section">
      <!-- Banner Scroll Horizontal -->
      <scroll-view scroll-x class="banner-scroll" show-scrollbar="false">
        <view
          v-for="(banner, index) in banners"
          :key="index"
          class="banner-item"
        >
          <view class="banner-gradient">
            <image :src="banner.banner_url" class="banner-image" mode="aspectFill" />
            <text class="banner-text">{{ banner.title }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- Task Center -->
      <view class="task-center">
        <view class="task-text">
          <text class="title">{{ $t("profile.task_center") }}</text>
          <text class="desc">
            {{ $t("profile.max_reward_for_tasks") }}
            <text class="highlight"
              >{{ dataProfile?.OrderHistory?.bonus ?? "-" }}
              {{ dataProfile?.OrderHistory?.baseAsset ?? "-" }}</text
            >，
            {{ $t("profile.start_your_exploration_journey") }}
          </text>
        </view>
        <image
          src="/static/icons/ic_crown.png"
          class="task-icon"
          mode="aspectFit"
        />
      </view>
    </view>

    <view class="promo-section">
      <scroll-view scroll-x="true" class="promo-scroll" show-scrollbar="false">
        <!-- Card 1 -->
        <view class="promo-card">
          <view class="card-left">
            <text class="title">{{ dataProfile?.Staking?.title ?? "-" }} </text>
            <!-- <text class="subtitle">{{ dataProfile?.Staking?.baseAsset ?? '-' }}</text> -->

            <view
              class="desc"
              v-html="dataProfile?.Staking?.description || ''"
            ></view>
          </view>
          <view class="card-right">
            <image
              :src="dataProfile?.Staking?.icon || '/static/icons/ic_gift1.png'"
              class="gift-icon"
              mode="aspectFit"
            />
          </view>
        </view>

        <!-- Card 2 -->
        <view class="promo-card" @click="goToTeamDashboard">
          <view class="team-logo">{{ dataProfile?.Hot?.name ?? "-" }}</view>
          <view class="team-title">{{ $t('profile.my_team_title') }}</view>
          <view class="team-desc">{{
            dataProfile?.Hot?.description || $t('profile.team_description')
          }}</view>
          <view class="link">{{ $t('profile.team_dashboard') }}</view>
          <view class="link link1">&gt;</view>
        </view>
      </scroll-view>
    </view>

    <!-- <view class="profile-page">
    <view class="page-content">
      <GlassCard variant="primary" size="lg">
        <template #header>
          <Icon name="profile-circle" size="xl" color="success" />
          <text class="page-title">个人中心</text>
        </template>

<view class="coming-soon">
  <Icon name="settings" size="2xl" color="success" />
  <text class="title">个人中心开发中...</text>
  <text class="desc">账户设置、安全管理功能即将上线</text>
</view>

<!-- 页面主体内容结束 -->

    <BottomTabBar
      currentPath="/pages/profile/index"
      @change="handleTabChange"
    />
  </view>

  <view>
    <!-- Mask -->
    <view v-if="showDialog" class="mask" @click="closeDialog"></view>

    <!-- Bottom Sheet -->
    <view
      v-if="showDialog"
      class="sheet"
      :style="{ transform: `translateY(${translateY}px)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @click.stop
    >
      <!-- Handle bar -->
      <view class="handle"></view>

      <!-- Isi konten -->
      <scroll-view scroll-y class="content">
        <view class="profile">
          <view class="normal">{{ $t('profile.common') }}</view>
          <view class="header">
            <image class="avatar" src="/static/icons/ic_avatar.png" />
            <view class="info">
              <view class="row">
                <text class="name">{{ dataProfile?.User?.full_name || 'Demo User' }}</text>
                <view class="vip">{{ dataProfile?.MemberGroup?.name || 'VIP2' }}</view>
              </view>
              <text class="points"
                >Xcoins 积分 <text class="points-content">8943</text></text
              >
            </view>
          </view>

          <view class="uid-container-dialog">
            <!-- Baris 1 -->
            <view class="uid-top-row-dialog">
              <text class="uid-label-dialog">{{ $t('profile.binance_id') }}</text>
              <view class="uid-id-row-dialog">
                <text class="uid-value-dialog">64565</text>
                <image src="/static/icons/copy.png" class="copy-icon-dialog" />
              </view>
            </view>

            <!-- Baris 2 -->
            <view class="uid-bottom-row-dialog">
              <text class="register-label-dialog">{{ $t('profile.registration_info') }}</text>
              <view class="email-row-dialog">
                <text class="email-dialog">weo4134@gmail.com</text>
                <image
                  src="/static/tubiao/xianshi.png"
                  class="eye-icon-dialog"
                />
              </view>
            </view>
          </view>

          <view class="upgrade">
            <text class="upgrade-text">{{ $t('profile.upgrade_vip') }} 1</text>
            <view class="upgrade-link-box">
              <text class="upgrade-link">{{ $t('profile.advantages') }}</text>
              <image
                src="/static/icons/ic_arrow_right.png"
                class="arrow"
                mode="aspectFit"
              />
            </view>
          </view>

          <view class="upgrade-dialog">
            <text class="upgrade-text-dialog"
              >交易更多资产，以升至下一等级</text
            >
            <view class="progress-bar-dialog">
              <view class="progress-fill-dialog"></view>
            </view>
          </view>
        </view>

        <view class="menu-dialog">
          <view class="menu-item-dialog" @click="goToVerification">
            <image src="/static/icons/user.png" class="menu-icon-dialog" />
            <text class="menu-text-dialog">{{ $t('profile.identity_verification') }}</text>
            <image
              src="/static/icons/ic_arrow_right.png"
              class="arrow-icon-dialog"
            />
          </view>

          <view class="menu-item-dialog" @click="goToAccountSetting">
            <image src="/static/icons/lock.png" class="menu-icon-dialog" />
            <text class="menu-text-dialog">{{ $t('profile.account_security') }}</text>
            <image
              src="/static/icons/ic_arrow_right.png"
              class="arrow-icon-dialog"
            />
          </view>

          <view class="menu-item-dialog" @click="goToLink">
            <image src="/static/icons/link.png" class="menu-icon-dialog" />
            <text class="menu-text-dialog">{{ $t('profile.binding_management') }}</text>
            <image
              src="/static/icons/ic_arrow_right.png"
              class="arrow-icon-dialog"
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>

  <!-- 左侧设置弹窗 -->
  <view
    v-if="showSettingDialog"
    class="setting-dialog-overlay"
    @click="closeSettingDialog"
  >
    <view class="setting-dialog" @click.stop>
      <view class="setting-menu">
        <view class="setting-item" @click="goToGeneralSettings">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/popedit.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.general_settings') }}</text>
          </view>
          <image
            class="setting-arrow-icon"
            src="/static/icons/ic_arrow_right.png"
          ></image>
        </view>

        <view class="setting-item1">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/popthem.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.theme') }}</text>
          </view>
          <view class="setting-switch">
            <switch
              :checked="isDarkTheme"
              color="#325DF4"
              @change="toggleTheme"
            ></switch>
          </view>
        </view>

        <view class="setting-item1">
          <view class="setting-item-left" @click="goToLanguageSettings">
            <image
              class="setting-item-icon"
              src="/static/icons/popLange.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.language') }}</text>
          </view>
          <view class="setting-arrow" @click="goToLanguageSettings">
            <text class="setting-arrow-text">{{ currentLanguageName }}</text>
            <image
              class="setting-arrow-icon"
              :src="isLanguageListOpen ? '/static/icons/ic_arrow_up.png' : '/static/icons/ic_arrow_right.png'"
            ></image>
          </view>
        </view>
        
        <!-- 语言选择列表（手风琴式） -->
        <view v-if="isLanguageListOpen" class="language-list">
          <view 
            v-for="lang in languageList" 
            :key="lang.code"
            class="language-item"
            @click="selectLanguage(lang.code)"
          >
            <text class="language-name">{{ lang.name }}</text>
            <view v-if="currentLanguage === lang.code" class="check-icon">✓</view>
          </view>
        </view>
        <!-- 点击空白区域关闭：覆盖全屏但不影响列表点击 -->
        <view v-if="isLanguageListOpen" class="language-overlay" @click="closeLanguageList"></view>

        <view class="setting-item1">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/popnoice.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.notification') }}</text>
          </view>
          <view class="setting-switch">
            <switch
              :checked="isNotificationEnabled"
              color="#325DF4"
              @change="toggleNotification"
            ></switch>
          </view>
        </view>

        <view class="setting-item" @click="goToHelpCenter">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/pophelp.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.help_center') }}</text>
          </view>
          <image
            class="setting-arrow-icon"
            src="/static/icons/ic_arrow_right.png"
          ></image>
        </view>

        <view class="setting-item" @click="goToPrivacyCenter">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/popsafe.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.privacy_center') }}</text>
          </view>
          <image
            class="setting-arrow-icon"
            src="/static/icons/ic_arrow_right.png"
          ></image>
        </view>

        <view class="setting-item" @click="goToVersionInfo">
          <view class="setting-item-left">
            <image
              class="setting-item-icon"
              src="/static/icons/popversion.png"
            ></image>
            <text class="setting-item-text">{{ $t('profile.version_info') }}</text>
          </view>
          <text class="setting-version">v1.0.0</text>
        </view>
      </view>

      <view class="setting-footer">
        <button class="logout-btn" @click="handleLogout">{{ $t('profile.logout') }}</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { BottomTabBar, GlassCard, Icon, SafeTop } from "@/components";
import { ref, computed, watch } from "vue";
import {
  useUserStore,
  ProfileParams,
  BannerParams,
} from "@/store/modules/user";
import { onLoad } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";
import { useSafeArea } from "@/utils/composables/useSafeArea";
import { switchLanguage } from "@/utils/i18n";
import { onBackPress } from "@dcloudio/uni-app";

const { statusBarHeight } = useSafeArea();
const { t, locale } = useI18n();
const userInfo = uni.getStorageSync("userData");

const userStore = useUserStore();

// 当前语言
const currentLanguage = computed(() => locale.value);
// 当前语言名称
const currentLanguageName = computed(() => {
  const lang = languageList.find(l => l.code === locale.value);
  return lang ? lang.name : "中文";
});

// 监听语言变化
watch(() => locale.value, (newLocale) => {
  // 语言变化时可以在这里执行其他需要更新的逻辑
  console.log('Language changed to:', newLocale);
});

const menus = computed(() => [
  { id: 1, name: t('profile.copy_trading'), icon: "/static/icons/ic_copy.png" },
  { id: 2, name: t('profile.wealth_management'), icon: "/static/icons/ic_finance.png" },
  { id: 3, name: t('profile.airdrop_activity'), icon: "/static/icons/ic_airdrop.png" },
  { id: 4, name: t('profile.ipo_subscription'), icon: "/static/icons/ic_new.png" },
  { id: 5, name: t('profile.swap'), icon: "/static/icons/ic_swap.png" },
  { id: 6, name: t('profile.transfer'), icon: "/static/icons/ic_transfer.png" },
  { id: 7, name: t('profile.rewards'), icon: "/static/icons/ic_reward.png" },
  { id: 8, name: t('profile.wallet'), icon: "/static/icons/ic_wallet.png" },
]);
const banners = ref([]);
const dataProfile = ref({});
const showDialog = ref(false);
const showSettingDialog = ref(false);
const isDarkTheme = ref(true);
const isNotificationEnabled = ref(false);
// 语言切换（手风琴式）
const isLanguageListOpen = ref(false);
// 支持的语言列表
const languageList = [
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁体中文" },
  { code: "en-US", name: "English" }
];

function toggleLanguageList() {
  isLanguageListOpen.value = !isLanguageListOpen.value;
}

function selectLanguage(code: string) {
  // 切换语言
  switchLanguage(code as any);
  // 显示提示
  const selectedLang = languageList.find(lang => lang.code === code);
  if (selectedLang) {
    uni.showToast({ 
      title: `已切换至${selectedLang.name}`, 
      icon: 'none' 
    });
  }
  // 关闭列表
  isLanguageListOpen.value = false;
}

function closeLanguageList() {
  isLanguageListOpen.value = false;
}

onBackPress(() => {
  // 当语言列表展开时，优先关闭列表而不是离开页面
  if (isLanguageListOpen.value) {
    isLanguageListOpen.value = false;
    return true; // 阻止默认返回，先关闭列表
  }
  return false; // 未展开时按默认返回
});

onLoad(async (options) => {
  console.log("options:", options);
  console.log("User info exists:", !!userInfo && !!userInfo.data);

  // 模拟数据定义
  const mockProfileData = {
    User: {
      id: "123456",
      full_name: "Demo User",
      point: "8943",
      balance: "12845.67",
      Currency: {
        alias: "USDT",
      },
    },
    MemberGroup: {
      name: "VIP2",
    },
    OrderHistory: {
      pnl: "+245.32",
      pnl_percentage: 0.025,
      bonus: "150",
      baseAsset: "USDT",
    },
    Staking: {
      title: "质押奖励",
      baseAsset: "12.5% APY",
      description: "质押您的资产获取稳定收益",
      icon: "/static/icons/ic_gift1.png",
    },
    Hot: {
      name: "ober",
      description:
        "实时趋势与关键指标，驱动团队增长增长趋势与预估收益，尽在掌控",
      baseAsset: "立即参与",
    },
  };

  const mockBannerData = [
    {
      id: 1,
      title: "banner1",
      banner_url: "/static/icons/ic_gift1.png",
    },
    {
      id: 2,
      title: "banner2",
      banner_url: "/static/icons/ic_gift1.png",
    },
  ];

  try {
    // 确保用户信息存在
    if (!userInfo || !userInfo.data || !userInfo.data.token) {
      console.warn("❌ User token not found, using mock data");
      // 使用模拟数据
      dataProfile.value = mockProfileData;
      banners.value = mockBannerData;
      console.log("✅ Using mock data for profile and banners");
      return;
    }

    const profileParams: ProfileParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: "en",
    };

    const bannerParams: BannerParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      lang: "en",
    };

    console.log("🔄 Fetching profile data...");
    const resultProfile = await userStore.getProfile(profileParams);

    // 详细记录API返回状态
    console.log("🔍 Profile API result status:", resultProfile.data?.status);
    console.log("🔍 Profile API full result:", resultProfile);

    // 当API返回状态码为 -1（例如：账号在另一设备登录）时，强制退出并返回登录页
    if (resultProfile.data?.status === -1 || String(resultProfile.data?.data?.msg || '').includes('another device')) {
      uni.showToast({ title: '该账号已在另一设备登录，请重新登录', icon: 'none', duration: 2000 })
      try {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isRegistered')
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('login_cache')
        uni.removeStorageSync('token')
      } catch (_) {}
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/auth/login' })
      }, 300)
      return
    } else {
      // 正常情况：使用API返回的数据
      if (resultProfile.data?.data) {
        dataProfile.value = resultProfile.data.data;
        console.log("✅ Successfully loaded profile data");

        // 加载横幅数据
        try {
          const resultBanner = await userStore.getBanner(bannerParams);
          if (resultBanner.data?.data) {
            banners.value = resultBanner.data.data;
            console.log("✅ Successfully loaded banner data");
          } else {
            // 如果没有横幅数据，使用模拟横幅数据
            banners.value = resultBanner.data.data;
            console.log("⚠️  No banner data from API, using mock banners");
          }
        } catch (bannerError) {
          console.error("❌ Failed to load banner data:", bannerError);
          // 横幅加载失败时使用模拟数据
          banners.value = mockBannerData;
          console.log("⚠️  Using mock data for banners due to error");
        }
      } else {
        console.warn(
          "⚠️  No profile data available in API response, using mock data"
        );
        dataProfile.value = mockProfileData;
        banners.value = mockBannerData;
      }
    }
  } catch (e) {
    console.error("❌ Failed to load profile data:", e);
    // 捕获错误时使用模拟数据渲染页面
    console.log("⚠️  Using mock data due to API error");
    dataProfile.value = mockProfileData;
    banners.value = mockBannerData;
  }
});

const onMenuClick = (item) => {
  if (item.id === 1) {
    // 点击跟单交易，跳转到market页面
    uni.navigateTo({
      url: '/pages/market/index'
    });
  } else if (item.id === 2) {
    // 点击理财，跳转到理财页面
    uni.navigateTo({
      url: '/pages/wealth/index'
    });
  } else if (item.id === 3) {
    // 点击空投活动，跳转到空投页面
    uni.navigateTo({
      url: '/pages/airdrop/index'
    });
  } else if (item.id === 5) {
    // 点击闪兑，跳转到market页面
    uni.navigateTo({
      url: '/pages/market/index'
    });
  } else if (item.id === 8) {
    // 点击钱包，跳转到assetsoverview页面
    uni.navigateTo({
      url: '/pages/assetsoverview/index'
    });
  } else if (item.id === 7) {
    goToShare();
  }
  // uni.showToast({
  //   title: `点击了 ${item.name}`,
  //   icon: 'none'
  // })
};

watch(showDialog, (val) => {
  if (val) {
    translateY.value = screenHeight; // posisi bawah
    setTimeout(() => {
      translateY.value = 0; // animasi naik
    }, 10);
  }
});

const handleTabChange = (tab: any) => {
  console.log("切换到:", tab.label);
};

// 退出登录
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

const goToVerification = () => {
  // 跳转到认证中心页面
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/createkyc/intro",
      success: () => console.log("✅ 成功跳转到认证中心"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
  }, 500);
};
const goToVerification1 = () => {
  // 跳转到认证中心页面
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/auth/status",
      success: () => console.log("✅ 成功跳转到认证中心"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
  }, 500);
};


const goToNotification = () => {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/notification/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

const goToTeamDashboard = () => {
  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/team/index",
      success: () => console.log("✅ 成功跳转到团队看板"),
      fail: (err) => console.error("❌ 跳转失败:", err),
    });
  }, 500);
};

const goToLink = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/linkedaccounts/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

const goToShare = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/share/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

const goToChat = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/customerservice/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

const goToAccountSetting = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: "/pages/accountsecurity/index",
      success: () => console.log("✅ Navigated"),
      fail: (err) => console.error("❌ Navigation failed:", err),
    });
  }, 500);
};

const goToRecharge = () => {
  // Arahkan ke halaman recharge
  try {
    console.log("🔄 开始跳转到充值页面");
    setTimeout(() => {
      uni.navigateTo({
        url: "/pages/recharge/index",
        success: () => console.log("✅ 成功跳转到充值页面"),
        fail: (err) => {
          console.error("❌ 跳转到充值页面失败:", err);
          // 失败时尝试使用备选方案
          uni.redirectTo({
            url: "/pages/recharge/index",
            success: () => console.log("✅ 使用redirectTo成功跳转到充值页面"),
            fail: (redirectErr) =>
              console.error("❌ 所有跳转方案均失败:", redirectErr),
          });
        },
      });
    }, 300);
  } catch (error) {
    console.error("❌ 跳转到充值页面发生异常:", error);
    uni.showToast({
          title: $t('profile.navigation_failed'),
          icon: "none",
        });
  }
};

// tinggi layar
const screenHeight = uni.getSystemInfoSync().windowHeight;

// posisi awal dan batas
const startY = ref(0);
const translateY = ref(screenHeight * 0.5); // mulai dari setengah layar
const minY = 0; // posisi terbuka penuh
const maxY = screenHeight * 0.5; // posisi setengah
const closeThreshold = screenHeight * 0.3; // batas swipe tutup

let currentY = 0;

const onTouchStart = (e) => {
  startY.value = e.touches[0].clientY;
};

const onTouchMove = (e) => {
  const deltaY = e.touches[0].clientY - startY.value;
  const newY = translateY.value + deltaY;
  if (newY >= minY && newY <= screenHeight) {
    translateY.value = newY;
  }
};

const onTouchEnd = () => {
  if (translateY.value > closeThreshold) {
    // swipe kebawah => tutup
    closeDialog();
  } else if (translateY.value > maxY / 2) {
    // kembali ke posisi setengah
    translateY.value = maxY;
  } else {
    // buka penuh
    translateY.value = minY;
  }
};

const openDialog = () => {
  // Reset posisi dialog sebelum tampil
  translateY.value = screenHeight * 0.5;
  showDialog.value = true;
};

const closeDialog = () => {
  translateY.value = screenHeight; // geser keluar layar
  setTimeout(() => {
    showDialog.value = false;
  }, 300); // tunggu animasi selesai
};

const openSettingDialog = () => {
  showSettingDialog.value = true;
};

const closeSettingDialog = () => {
  // H5 环境下安全获取弹窗元素并添加关闭动画类
  let dialogElement: Element | null = null;
  // #ifdef H5
  if (typeof document !== 'undefined') {
    dialogElement = document.querySelector('.setting-dialog');
    if (dialogElement) {
      dialogElement.classList.add('closing');
    }
  }
  // #endif

  // 动画完成后再隐藏弹窗
  setTimeout(() => {
    showSettingDialog.value = false;
    // 移除关闭动画类，以便下次打开时能正常显示
    // #ifdef H5
    if (dialogElement) {
      dialogElement.classList.remove('closing');
    }
    // #endif
  }, 300);
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  // 这里可以添加实际的主题切换逻辑
};

const toggleNotification = () => {
  isNotificationEnabled.value = !isNotificationEnabled.value;
  // 这里可以添加实际的通知设置逻辑
};

const goToGeneralSettings = () => {
  // 跳转到通用设置页面
  console.log("Navigate to general settings");
};

const goToLanguageSettings = () => {
  // 切换语言列表显示状态
  toggleLanguageList();
};

const goToHelpCenter = () => {
  // 跳转到帮助中心
  console.log("Navigate to help center");
};

const goToPrivacyCenter = () => {
  // 跳转到隐私中心
  console.log("Navigate to privacy center");
};

const goToVersionInfo = () => {
  // 跳转到版本信息页面
  console.log("Navigate to version info");
};
</script>

<style lang="scss" scoped>
$page-pad: 32rpx;
$bg: #202020;
$muted: #9aa4ae;
$white: #ffffff;
$brand: #6f4bfd;

.page {
  min-height: 100vh;
  background: $bg;
  color: $white;
  padding: 20rpx 24rpx 20rpx;
  padding-bottom: 240rpx; // 为自定义底栏预留空间，避免App端遮挡
  box-sizing: border-box;
  padding-top: 80rpx;
}

.profile-container {
  color: #fff;
  padding: 16rpx 30rpx;
  box-sizing: border-box;
}

.profile {
  background-color: #3b3b3b;
  padding: 20rpx;
  border-radius: 20rpx;
  margin-top: 20rpx;
}

/* Header */
.profile-header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}

.info-section {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.name {
  font-size: 34rpx;
  font-weight: 700;
}

.vip-badge {
  background: rgba(111, 75, 253, 0.5);
  color: #fff;
  font-size: 22rpx;
  border-radius: 40rpx;
  padding: 4rpx 16rpx;
}

.icon-small {
  width: 36rpx;
  height: 36rpx;
  margin-left: 20rpx;
}

.id-row {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #9aa4ae;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.xcoin-text {
  margin-left: 20rpx;
}

.points {
  color: #ffffff !important;
  // font-weight: 600;
}

.points-content {
  color: #ffffff;
}

.divider {
  color: #555;
}

/* Baris verifikasi */
.verify-row {
  display: flex;
  align-items: center;
  margin-top: 40rpx;
  color: #9aa4ae;
}

.icon-left {
  width: 34rpx;
  height: 34rpx;
  margin-right: 16rpx;
}

.verify-text {
  flex: 1;
  font-size: 26rpx;
}

.arrow-right {
  width: 24rpx;
  height: 24rpx;
}

/* Baris aset */
.asset-row {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
  color: #9aa4ae;
}

.asset-text {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.asset-unit {
  color: #fff;
  font-weight: 600;
}

.profile-container {
  color: #fff;
  padding: 16rpx 30rpx;
  box-sizing: border-box;
}

/* Header */
.profile-header {
  padding-top: 12rpx;
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}

.info-section {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.name {
  font-size: 34rpx;
  font-weight: 700;
}

.icon-small {
  width: 36rpx;
  height: 36rpx;
  margin-left: 20rpx;
}

.id-row {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #9aa4ae;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.id-text {
  display: flex;
  align-items: center;
}

.divider {
  color: #555;
}

/* Baris verifikasi */
.verify-row {
  display: flex;
  align-items: center;
  margin-top: 40rpx;
  color: #9aa4ae;
}

.icon-left {
  width: 34rpx;
  height: 34rpx;
  margin-right: 16rpx;
}

.verify-text {
  flex: 1;
  font-size: 26rpx;
}

.arrow-right {
  width: 24rpx;
  height: 24rpx;
}

/* Baris aset */
.asset-row {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
  color: #9aa4ae;
}

.asset-text {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.asset-unit {
  color: #fff;
  font-weight: 600;
}

.wallet-section {
  // background-color: #1a1a1a;
  color: #fff;
  // padding: 30rpx;
  // border-radius: 20rpx;
  margin-top: 30rpx;
}

/* Header saldo */
.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.balance {
  font-size: 64rpx;
  font-weight: 700;
}

.profit-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: #9aa4ae;
  margin-top: 10rpx;
}

.profit-label {
  font-size: 24rpx;
}

.profit-value,
.profit-percent {
  font-size: 24rpx;
}

.recharge-btn {
  background: linear-gradient(175deg, #5565b9, #cd5890);
  border: none;
  color: #fff;
  border-radius: 100rpx;
  font-size: 24rpx;
  padding: 10rpx 30rpx;
}

/* Garis pembatas */
.divider {
  height: 1rpx;
  background-color: #2a2a2a;
  margin: 30rpx 0;
}

/* Grid Menu */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // gap: 40rpx 0;
  text-align: center;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 12rpx;
}

.menu-text {
  font-size: 26rpx;
  color: #dcdcdc;
}

.task-section {
  // background-color: #121212;
  padding: 20rpx;
}

/* Scroll horizontal */
.banner-scroll {
  display: flex;
  white-space: nowrap;
  overflow-x: scroll;
  margin-bottom: 40rpx;
}

.banner-item {
  display: inline-block;
  width: 600rpx;
  height: 200rpx;
  margin-right: 20rpx;
  border-radius: 30rpx;
  overflow: hidden;
}

.banner-gradient {
  position: relative;
  width: 100%;
  height: 200rpx;
  background: linear-gradient(175deg, #5565b9, #cd5890);
  /* Bisa kamu sesuaikan */
  overflow: hidden;
  border-radius: 20rpx;
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-text {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  /* agar teks terlihat jelas */
  font-size: 28rpx;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.2);
  /* opsional: lapisan gelap agar teks lebih jelas */
}

/* Task Center */
.task-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-text .title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.task-text .desc {
  font-size: 26rpx;
  color: #9aa4ae;
  margin-top: 10rpx;
  display: block;
}

.highlight {
  color: #6a5af9;
}

.task-icon {
  width: 120rpx;
  height: 120rpx;
}

.promo-section {
  // background-color: #121212;
  padding: 20rpx 0;
}

/* scroll horizontal */
.promo-scroll {
  white-space: nowrap;
  /* penting agar horizontal */
  padding-left: 20rpx;
  box-sizing: border-box;
}

/* setiap card tampil sejajar */
.promo-card {
  display: inline-block;
  /* penting agar sejajar horizontal */
  vertical-align: top;
  width: 330rpx;
  height: 340rpx;
  background-color: #2a2a2a;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-right: 20rpx;
  box-sizing: border-box;
  color: #fff;
  position: relative;
}

.team-title {
  color: #6f4bfd;
  font-size: 28rpx;
  font-weight: 600;
}

.icon-Export {
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
}

/* isi card pertama */
.card-left {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 30rpx;
  font-weight: bold;
}

.subtitle {
  font-size: 28rpx;
  margin-top: 6rpx;
}

.desc {
  font-size: 24rpx;
  color: #9aa4ae;
  margin-top: 14rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;        /* 显示2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-right {
  // position: relative;
  // right: 200rpx;
  // bottom: 30rpx;
  text-align: center;
  display: flex;
  justify-content: flex-end;
}

.gift-icon {
  width: 140rpx;
  height: 140rpx;
  // position: absolute;
  // right: 10rpx;
  // bottom: 20rpx;
  // margin-bottom: 30rpx;
}

.index {
  color: #aaa;
  font-size: 22rpx;
}

/* isi card kedua */
.team-logo {
  display: inline-block;
  background: #000;
  color: #fff;
  border-radius: 50%;
  // padding: 6rpx 18rpx;
  width: 56rpx;
  height: 56rpx;
  font-weight: bold;
  font-size: 20rpx;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-title {
  color: #8b63ff;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.highlight {
  color: #8b63ff;
}

.team-desc {
  font-size: 24rpx;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space:;
  // line-height: 1.6;
}

.link {
  width: 100%;
  text-align: right;
  color: #8b63ff;
  // margin-top: 20rpx;
  font-size: 26rpx;
  margin-top: 40rpx;
  // display: inline-block;
}

.link1 {
  margin-top: 0rpx;
}

.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  height: 400rpx;
  z-index: 99;
}

.sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80%;
  background: #1f1f1f;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  z-index: 100;
  transition: transform 0.25s ease;
  overflow: hidden;
}

.handle {
  width: 100rpx;
  height: 8rpx;
  background: #666;
  border-radius: 4rpx;
  margin: 16rpx auto;
}

.uni-scroll-view-content {
  height: fit-content;
}

.content {
  // height: 100%;
  padding: 0 30rpx;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.info .row {
  display: flex;
  align-items: center;
}

.name {
  flex: 1;
  font-size: 30rpx;
  font-weight: bold;
  margin-right: 10rpx;
  color: #fff;
}

.vip {
  background: rgba(111, 75, 253, 0.5);
  color: #fff;
  // font-size: 22rpx;
  border-radius: 40rpx;
  padding: 2rpx 22rpx;
  // border-radius: 10rpx;
  font-size: 22rpx;
  color: #fff;
  margin-right: 8rpx;
}

.normal {
  position: absolute;
  top: 20rpx;
  right: 0;
  background: rgba(154, 164, 174, 1);
  color: #fff;
  border-radius: 0 20rpx 0 20rpx;
  padding: 6rpx 20rpx;
  font-size: 22rpx;
}

.points {
  color: #aaa;
  font-size: 26rpx;
}

.uid-row {
  margin: 20rpx 0;
  color: #aaa;
  font-size: 26rpx;
}

.email {
  display: block;
  margin-top: 6rpx;
  color: #ccc;
}

.upgrade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
}

.upgrade-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.upgrade-link-box {
  display: flex;
  align-items: center;
}

.upgrade-link {
  color: #7c5cff;
  /* ungu seperti di gambar */
  font-size: 26rpx;
}

.arrow {
  width: 20rpx;
  height: 20rpx;
  margin-left: 10rpx;
  vertical-align: middle;
}

.progress-bar {
  width: 100%;
  height: 10rpx;
  background: #333;
  border-radius: 10rpx;
  margin-top: 10rpx;
}

.progress-fill {
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, #8a5af8, #b56bff);
  border-radius: 10rpx;
}

.menu {
  margin-top: 40rpx;
  color: #fff;
}

.menu-item {
  padding: 24rpx 0;
  // border-bottom: 1rpx solid #333;
  font-size: 28rpx;
}

.uid-container-dialog {
  // background-color: #2b2b2b;
  border-start-start-radius: 12rpx;
  padding: 24rpx 28rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  font-size: 26rpx;
  position: relative;
  padding-top: 50rpx;
  overflow: hidden;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

/* Baris atas */
.uid-top-row-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uid-label-dialog {
  color: #9ca3af;
}

.uid-id-row-dialog {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.uid-value-dialog {
  font-size: 28rpx;
  color: #fff;
}

.copy-icon-dialog {
  width: 34rpx;
  height: 34rpx;
  // opacity: 0.8;
}

/* Baris bawah */
.uid-bottom-row-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.register-label-dialog {
  color: #9ca3af;
}

.email-row-dialog {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.email-dialog {
  color: #fff;
}

.eye-icon-dialog {
  width: 30rpx;
  height: 34rpx;
  // opacity: 0.8;
}

.menu-dialog {
  border-radius: 12rpx;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

/* Item baris */
.menu-item-dialog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0rpx;
  // border-bottom: 1rpx solid #3a3a3a;
}

/* Ikon kiri */
.menu-icon-dialog {
  width: 36rpx;
  height: 36rpx;
  margin-right: 20rpx;
  opacity: 0.85;
}

/* Teks utama */
.menu-text-dialog {
  flex: 1;
  color: #fff;
  font-size: 28rpx;
}

/* Panah kanan */
.arrow-icon-dialog {
  width: 24rpx;
  height: 24rpx;
  // opacity: 0.8;
}

.upgrade-dialog {
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.upgrade-text-dialog {
  color: #b0b0b0;
  font-size: 26rpx;
  margin-bottom: 14rpx;
  display: block;
}

.progress-bar-dialog {
  width: 100%;
  height: 10rpx;
  background-color: #3a3a3a;
  border-radius: 10rpx;
  overflow: hidden;
}

.progress-fill-dialog {
  width: 40%;
  /* ubah sesuai progress */
  height: 100%;
  background-color: #7b4dfd;
  border-radius: 10rpx;
}

/* 左侧设置弹窗样式 */
.setting-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: flex-start;
}

.setting-dialog {
  width: 80%;
  height: 100vh;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease;
  // max-height: 80vh;
  overflow-y: auto;
  padding-bottom: 240rpx; // 为底栏留白，防止App端抽屉内容被遮挡
}

/* 语言列表样式 */
.language-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent; // 透明遮罩，用于点击空白关闭
  z-index: 1000;
}

.language-list {
  // background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12rpx;
  margin: 0 32rpx 32rpx;
  overflow: hidden;
  position: relative;
  z-index: 1001; // 确保列表在遮罩之上可点击
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  // transition: background-color 0.2s;
}

.language-item:last-child {
  border-bottom: none;
}

.language-item:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.language-name {
  font-size: 28rpx;
  color: #ffffff;
}

.check-icon {
  font-size: 32rpx;
  color: #4CAF50;
  font-weight: bold;
}

.setting-dialog.closing {
  animation: slideOutLeft 0.3s ease;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

.setting-header {
  padding: 60rpx 30rpx 40rpx;
  border-bottom: 1rpx solid #333;
}

.setting-user-info {
  display: flex;
  align-items: center;
}

.setting-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.setting-user-details {
  flex: 1;
}

.setting-username {
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
  display: block;
  margin-bottom: 10rpx;
}

.setting-user-id {
  font-size: 26rpx;
  color: #9aa4ae;
  display: block;
}

.setting-menu {
  flex: 1;
  padding: 20rpx 0;
  padding-top: 50rpx;
  overflow-y: auto;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 30rpx;
  // border-bottom: 1rpx solid #333;
}

.setting-item1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 30rpx;
  padding-left: 70rpx;
  // border-bottom: 1rpx solid #333;

  .setting-item-text {
    color: #9aa4ae;
  }
}

.setting-item-left {
  display: flex;
  align-items: center;
}

.setting-item-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 24rpx;
}

.setting-item-text {
  font-size: 30rpx;
  color: #fff;
}

.setting-switch {
  transform: scale(0.8);
}

.setting-arrow {
  display: flex;
  align-items: center;
}

.setting-arrow-text {
  font-size: 28rpx;
  color: #9aa4ae;
  margin-right: 10rpx;
}

.setting-arrow-icon {
  width: 24rpx;
  height: 24rpx;
  opacity: 0.6;
}

.setting-version {
  font-size: 28rpx;
  color: #9aa4ae;
}

.setting-footer {
  padding: 40rpx 30rpx;
  border-top: 1rpx solid #333;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(175deg, #5565b9, #cd5890);
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.logout-btn::after {
  border: none;
}
</style>
