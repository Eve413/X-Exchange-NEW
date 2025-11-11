// src/utils/i18n/index.ts  （直接替换）
import dayjs from "dayjs";
import "dayjs/locale/en"; // dayjs 英文 locale
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";
import { setLocale, SUPPORTED_LOCALES, type Locale } from "./setup";

export function switchLanguage(next: Locale) {
  if (!SUPPORTED_LOCALES.includes(next)) return;

  // 1) 切 vue-i18n（Composition API）
  setLocale(next);

  // 2) 同步第三方库（例如 dayjs）
  const map: Record<Locale, string> = {
    "zh-CN": "zh-cn",
    "zh-TW": "zh-tw",
    "en-US": "en",
  };
  // 只有当语言在映射表中时才设置 dayjs locale
  if (map[next]) {
    dayjs.locale(map[next]);
  }

  console.info(`语言已切换到: ${next}`);
  // ✅ 不再强制 reload；组件内使用 useI18n() 的 t/locale 或 $t 会立即生效
}

// 导出类型和常量，保持向后兼容
export { SUPPORTED_LOCALES, tl, type Locale } from "./setup";

// 兼容旧的 i18nUtils 接口
export const i18nUtils = {
  setLocale: switchLanguage,
  getCurrentLocale() {
    return uni.getStorageSync("locale") || "zh-CN";
  },
  getLocaleName(locale: string) {
    const nameMap = {
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      "en-US": "English",
    };
    return nameMap[locale as Locale] || locale;
  },
  detectSystemLocale() {
    const systemInfo = uni.getSystemInfoSync();
    const language = systemInfo.language || "zh-CN";

    // 根据系统语言匹配支持的语言
    if (language.startsWith("zh")) {
      // 检测是否为繁体中文地区
      if (
        language.includes("TW") ||
        language.includes("HK") ||
        language.includes("MO")
      ) {
        return "zh-TW";
      }
      return "zh-CN";
    } else if (language.startsWith("en")) {
      return "en-US";
    }

    return "zh-CN"; // 默认语言
  },
};
