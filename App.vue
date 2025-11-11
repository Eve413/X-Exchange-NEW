<template>
  <view id="app">
    <router-view />
    <view id="modal-root"></view>
    <!-- 全局加载状态 -->
    <AppLoading v-if="isLoading" />

    <!-- 全局提示组件 -->
    <AppToast />

    <!-- 网络状态监控 -->
    <NetworkMonitor />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAppStore } from "./store/modules/app";
import AppLoading from "./components/common/AppLoading.vue";
import AppToast from "./components/common/AppToast.vue";
import NetworkMonitor from "./components/common/NetworkMonitor.vue";
import { safeReLaunch } from "./utils/navigation";
import { resetNavLock } from "@/utils/nav";
import { onLaunch, onShow } from "@dcloudio/uni-app";

const appStore = useAppStore();
const isLoading = ref(false);
let hasInitialized = false;
let loadingTimeout: ReturnType<typeof setTimeout> | null = null;
let didBootRoute = false;

onMounted(() => {
  // 初始化应用
  if (!hasInitialized) {
    initApp();
    hasInitialized = true;
  }
});

// 启动与显示时重置导航锁，避免热更新或异常后残留锁影响交互
onLaunch(() => resetNavLock());
onShow(() => resetNavLock());

const initApp = async () => {
  try {
    isLoading.value = true;

    // 设置超时保护：如果5秒后还在加载，强制关闭
    loadingTimeout = setTimeout(() => {
      if (isLoading.value) {
        console.warn("⚠️ 加载状态超时，强制关闭");
        isLoading.value = false;
      }
    }, 5000);

    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    appStore.setSystemInfo(systemInfo);

    // 检查网络状态
    const networkInfo = await uni.getNetworkType();
    appStore.setNetworkType(networkInfo.networkType);

    // 初始化用户信息
    await appStore.initUserInfo();
  } catch (error) {
    console.error("应用初始化失败:", error);
  } finally {
    // 清除超时定时器
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      loadingTimeout = null;
    }

    // 确保在跳转前关闭加载状态
    isLoading.value = false;

    // 检查用户登录状态，决定是否跳转到启动页
    checkUserAuthStatus();
  }
};

// 检查用户认证状态
const checkUserAuthStatus = () => {
  try {
    if (didBootRoute) return;
    const isLoggedIn = uni.getStorageSync("isLoggedIn");
    const isRegistered = uni.getStorageSync("isRegistered");
    const userInfo = uni.getStorageSync("userInfo");
    const userData = uni.getStorageSync("userData");
    const pages = getCurrentPages();
    const curPage: any = pages[pages.length - 1];
    const cur = (curPage?.route ? "/" + curPage.route : curPage?.$page?.fullPath) || "";

    // 如果用户已登录，直接跳转到首页
    if (isLoggedIn && (isRegistered || userInfo || userData)) {
      console.log("✅ 用户已登录，跳转到首页");
      if (cur !== "/pages/home/index") {
        didBootRoute = true;
        safeReLaunch("/pages/home/index");
      }
      return;
    }

    // 检查用户是否已注册（通过多种方式判断）
    // 1. 检查 isRegistered 标志
    // 2. 检查 userInfo 是否存在
    // 3. 检查 userData 是否存在
    const hasRegistered = isRegistered || userInfo || userData;

    if (hasRegistered) {
      // 已注册用户，跳转到登录页面
      console.log("✅ 用户已注册，跳转到登录页");
      if (cur !== "/pages/auth/login") {
        didBootRoute = true;
        safeReLaunch("/pages/auth/login");
      }
    } else {
      // 未注册用户，跳转到注册页面
      console.log("✅ 用户未注册，跳转到注册页");
      if (cur !== "/pages/auth/register") {
        didBootRoute = true;
        safeReLaunch("/pages/auth/register");
      }
    }
  } catch (error) {
    console.error("❌ 检查用户认证状态失败:", error);
    // 出错时默认跳转到注册页面
    const pages = getCurrentPages();
    const curPage: any = pages[pages.length - 1];
    const cur = (curPage?.route ? "/" + curPage.route : curPage?.$page?.fullPath) || "";
    if (cur !== "/pages/auth/register") {
      didBootRoute = true;
      safeReLaunch("/pages/auth/register");
    }
  }
};

// 监听网络状态变化
uni.onNetworkStatusChange((res) => {
  appStore.setNetworkType(res.networkType);
});

// 全局错误处理
uni.onError((error) => {
  console.error("全局错误:", error);
  appStore.showToast("系统错误，请稍后重试", "error");
});

// 全局未处理的promise错误
uni.onUnhandledRejection((event) => {
  console.error("未处理的Promise错误:", event);
  event.preventDefault();
});
</script>

<style lang="scss">
@import "./uni.scss";

/* 全局样式 */
page {
  background-color: $uni-bg-color-grey;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  line-height: 1.6;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

/* 安全区域适配 */
.safe-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 顶部安全区适配 */
.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 全方向安全区适配 */
.safe-area-all {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: constant(safe-area-inset-left);
  padding-left: env(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);
  padding-right: env(safe-area-inset-right);
}

/* 通用类 */
.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
