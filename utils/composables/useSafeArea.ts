import { ref, onMounted } from "vue";
import { useAppStore } from "@/store/modules/app";

/**
 * 安全区处理 Composable
 * 用于获取状态栏高度和安全区域信息
 */
export function useSafeArea() {
  const appStore = useAppStore();
  const statusBarHeight = ref(0);
  const safeAreaInsets = ref({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const initSafeArea = () => {
    try {
      const systemInfo = uni.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 0;

      // 获取安全区域信息
      if (systemInfo.safeAreaInsets) {
        safeAreaInsets.value = {
          top: systemInfo.safeAreaInsets.top || 0,
          bottom: systemInfo.safeAreaInsets.bottom || 0,
          left: systemInfo.safeAreaInsets.left || 0,
          right: systemInfo.safeAreaInsets.right || 0,
        };
      } else {
        // 如果没有 safeAreaInsets，使用 statusBarHeight 作为 top
        safeAreaInsets.value.top = statusBarHeight.value;
      }

      // 更新 store 中的系统信息
      if (systemInfo) {
        appStore.setSystemInfo(systemInfo);
      }
    } catch (error) {
      console.error("获取安全区信息失败:", error);
      // 设置默认值
      statusBarHeight.value = 0;
      safeAreaInsets.value = { top: 0, bottom: 0, left: 0, right: 0 };
    }
  };

  // 计算顶部 padding（优先使用安全区顶部）
  const getTopPadding = (extraPadding: number = 0) => {
    const topInset = safeAreaInsets.value.top || statusBarHeight.value || 0;
    return topInset + extraPadding;
  };

  // 获取顶部样式对象
  const getTopStyle = (extraPadding: number = 0) => {
    return {
      paddingTop: `${getTopPadding(extraPadding)}px`,
    };
  };

  // 立即初始化（不等待 onMounted）
  initSafeArea();

  return {
    statusBarHeight,
    safeAreaInsets,
    initSafeArea,
    getTopPadding,
    getTopStyle,
  };
}
