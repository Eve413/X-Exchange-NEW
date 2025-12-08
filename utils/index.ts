/**
 * 工具函数统一导出
 */

// 请求相关
export { default as request } from "./request";

// WebSocket相关
export {
  WebSocketManager,
  createWebSocket,
  destroyGlobalWebSocket,
  getGlobalWebSocket,
  initGlobalWebSocket,
} from "./websocket";

// 存储相关
export { STORAGE_KEYS, storage } from "./storage";

// 认证相关
export { AuthUtils } from "./auth";

// 格式化相关
export {
  DateFormat,
  NumberFormat,
  StringFormat,
  ValidationUtils,
} from "./format";

// 验证相关
export {
  FormValidator,
  validate2FA,
  validateBankCard,
  validateCaptcha,
  validateEmail,
  validateFundPassword,
  validateIdCard,
  validateInviteCode,
  validatePassword,
  validatePhone,
  validateRealName,
  validateSmsCode,
  validationRules,
} from "./validation";

// 提示相关
export { ActionSheet, Modal, Toast, default as toast } from "./toast";

// 全局设置
export { setupGlobalProperties } from "./global";

// 国际化
export { i18nUtils, SUPPORTED_LOCALES as supportedLocales } from "./i18n";

// 图标系统
export {
  EXCHANGE_ICONS,
  ICONOIR_ICONS,
  ICON_COLORS,
  ICON_SIZES,
  PRESET_ICONS,
  createIconConfig,
  getIconFallback,
  getIconUrl,
  hasIcon,
} from "./iconoir";
export type { IconColor, IconConfig, IconName, IconSize } from "./iconoir";

// 导航相关
export {
  navigateTo,
  reLaunch,
  redirectTo,
  navigateBack,
  switchTab,
  goHome,
  goLogin,
  goRegister,
  goStartup,
  goMarket,
  goTrade,
  goDiscover,
  goProfile,
  logout,
} from "./navigation";
export type { NavigationOptions, NavigateBackOptions } from "./navigation";
