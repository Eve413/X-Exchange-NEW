/**
 * X交易所组件系统统一导出
 * 按模块分类，便于管理和使用
 */

// ===== 🎨 现代UI组件库 =====
export { default as GlassButton } from './ui/GlassButton.vue'
export { default as GlassCard } from './ui/GlassCard.vue'
export { default as Icon } from './ui/Icon.vue'
export { default as PortfolioCard } from './ui/PortfolioCard.vue'
export { default as ThemeSwitch } from './ui/ThemeSwitch.vue'

// ===== 🔧 通用组件 =====
export { default as AppLoading } from './common/AppLoading.vue'
export { default as AppToast } from './common/AppToast.vue'
export { default as CoinIcon } from './common/CoinIcon.vue'
export { default as Empty } from './common/Empty.vue'
export { default as LazyImage } from './common/LazyImage.vue'
export { default as Loading } from './common/Loading.vue'
export { default as NetworkMonitor } from './common/NetworkMonitor.vue'
export { default as PercentChange } from './common/PercentChange.vue'
export { default as PriceDisplay } from './common/PriceDisplay.vue'
export { default as VirtualList } from './common/VirtualList.vue'

// ===== 💼 业务组件 =====
export { default as TradingPair } from './business/TradingPair.vue'

// ===== 📊 图表组件 =====
export { default as BaseChart } from './charts/BaseChart.vue'

// ===== 🎨 布局组件 =====
export { default as BottomTabBar } from './layout/BottomTabBar.vue'
export { default as SafeTop } from './layout/SafeTop.vue'

// ===== 🌍 功能组件 =====
export { default as LanguageSheet } from './LanguageSheet.vue'

// ===== 📊 类型导出 (为组件使用者提供类型支持) =====
export type { TradingPairData } from './business/TradingPair.vue'

