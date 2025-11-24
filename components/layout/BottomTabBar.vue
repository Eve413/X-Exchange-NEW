<template>
  <view class="bottom-tabbar">
    <view v-for="(tab, index) in tabs" :key="tab.path" class="tab-item" :class="{ active: currentPath === tab.path }"
      @tap="handleTabClick(tab, index)">
      <view v-if="currentPath === tab.path" class="tab-capsule" :class="`tab-${index}`">
        <image class="tab-icon active" :src="tab.activeIcon" mode="aspectFit" />
        <text class="tab-label active">{{ t(tab.label) }}</text>
      </view>

      <view v-else class="tab-inactive">
        <image class="tab-icon inactive" :src="tab.icon" mode="aspectFit" />
      </view>

      <view v-if="tab.showDot" class="icon-dot"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { tl } from "@/utils/i18n";
import { goto } from "@/utils/nav";

interface TabItem {
  path: string;
  icon: string;
  activeIcon: string;
  label: string;
  showDot?: boolean;
}

const props = defineProps({
  currentPath: String,
});

const emit = defineEmits(["change"]);
const t = tl;

const tabs = ref<TabItem[]>([
  {
    path: "/pages/home/index",
    icon: "/static/icons/tabbar/home.png",
    activeIcon: "/static/icons/tabbar/home1.png",
    label: "navigation.home",
  },
  {
    path: "/pages/trade/index",
    icon: "/static/icons/tabbar/Menu.png",
    activeIcon: "/static/icons/tabbar/Menu1.png",
    label: "navigation.trade",
  },
  {
    path: "/pages/market/index",
    icon: "/static/icons/tabbar/search.png",
    activeIcon: "/static/icons/tabbar/search1.png",
    label: "navigation.market",
  },
  // {
  //   path: "/pages/discover/index",
  //   icon: "/static/icons/tabbar/Frame.png",
  //   activeIcon: "/static/icons/tabbar/Frame1.png",
  //   label: "navigation.discover",
  // },
  {
    path: "/pages/profile/index",
    icon: "/static/icons/tabbar/user.png",
    activeIcon: "/static/icons/tabbar/user1.png",
    label: "navigation.profile",
  },
]);

const handleTabClick = (tab: TabItem, index: number) => {
  // 如果点击的是当前页面，直接返回
  if (tab.path === props.currentPath) return;

  // 触发事件（用于页面记录日志等）
  emit("change", tab, index);

  // 使用统一导航管理器，标记为 tabBar 切换
  // goto({ url: tab.path }).catch((err) => {
  //   console.error("❌ Navigation failed:", tab.path, err);
  // });
  uni.reLaunch({ url: tab.path }).catch((err) => {
    console.error("❌ Navigation failed:", tab.path, err);
  });
};
</script>

<style lang="scss" scoped>
.bottom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160rpx;
  background: #202020;
  // border-top: 1rpx solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  padding: 0 20rpx;
  /* App端安全区补偿（尤其是iOS底部） */
  padding-bottom: env(safe-area-inset-bottom);
  /* 旧iOS兼容 */
  padding-bottom: constant(safe-area-inset-bottom);
  box-sizing: border-box;
}

/* Tiap item tab */
.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Kapsul aktif */
.tab-capsule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  padding: 8px 34rpx;
  border-radius: 48rpx;
  transition: all 0.3s ease;
  // padding: 20rpx;
}

/* 不同tab的激活背景色 */
.tab-capsule.tab-0 {
  background: rgba(158, 134, 255, 0.15);
  // box-shadow: 0 0 16rpx rgba(158, 134, 255, 0.25);
}

.tab-capsule.tab-2 {
  background: rgba(53, 194, 233, 0.12);
  // box-shadow: 0 0 16rpx rgba(255, 107, 157, 0.25);
}

.tab-capsule.tab-1 {
  background: rgba(255, 221, 128, 0.12);
  // box-shadow: 0 0 16rpx rgba(107, 207, 255, 0.25);
}

// .tab-capsule.tab-3 {
//   background: rgba(242, 133, 182, 0.12);
//   // box-shadow: 0 0 16rpx rgba(255, 191, 107, 0.25);
// }

.tab-capsule.tab-3 {
  background: rgba(79, 206, 0, 0.12);
  // box-shadow: 0 0 16rpx rgba(107, 255, 144, 0.25);
}

/* Tidak aktif */
.tab-inactive {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ikon tab */
.tab-icon {
  width: 48rpx;
  /* sebelumnya 40rpx → diperbesar agar lebih jelas */
  height: 48rpx;
  transition: all 0.3s ease;

  &.inactive {
    opacity: 0.6;
  }

  &.active {
    opacity: 1;
  }
}

/* Label */
.tab-label {
  font-size: 20rpx;
  /* dari 24rpx → lebih besar */
  font-weight: 500;
  color: #b0b0b0;
}

/* 不同tab的激活标签颜色 */
.tab-item:nth-child(1) .tab-label.active {
  color: #9e86ff;
  font-weight: 600;
  white-space: nowrap;
}

.tab-item:nth-child(3) .tab-label.active {
  color: #35c2e9;
  font-weight: 600;
  white-space: nowrap;
}

.tab-item:nth-child(2) .tab-label.active {
  color: #ffdd80;
  font-weight: 600;
  white-space: nowrap;
}

// .tab-item:nth-child(4) .tab-label.active {
//   color: #f285b6;
//   font-weight: 600;
//   white-space: nowrap;
// }

.tab-item:nth-child(4) .tab-label.active {
  color: #4fce00;
  font-weight: 600;
  white-space: nowrap;
}

/* Titik merah */
.icon-dot {
  position: absolute;
  top: 10rpx;
  right: 30rpx;
  width: 14rpx;
  height: 14rpx;
  background: #ff4757;
  border-radius: 50%;
  border: 2rpx solid #131417;
}
</style>
