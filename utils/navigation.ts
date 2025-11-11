/**
 * 统一导航工具函数
 * 封装 uni-app 的导航方法，提供统一的接口和错误处理
 */

// 导航防抖：记录最后一次导航时间和目标
let lastNavigation: { url: string; time: number } | null = null;
const NAVIGATION_DEBOUNCE_MS = 300; // 300ms 防抖

// reLaunch 幂等 + 防抖辅助
let _lastReLaunchAt = 0;
let _lastReLaunchTo = "";

const pure = (u: string) => u.split("?")[0];
const currentPath = () => {
  const pages = getCurrentPages();
  const cur: any = pages[pages.length - 1];
  return (cur?.route ? "/" + cur.route : cur?.$page?.fullPath) || "";
};

function wrap<T = any>(fn: Function, args: any): Promise<T> {
  return new Promise((resolve, reject) => {
    fn({
      ...args,
      success: (res: T) => resolve(res),
      fail: (err: any) => reject(err),
    });
  });
}

export async function safeReLaunch(url: string) {
  const now = Date.now();
  const cur = pure(currentPath());
  const dst = pure(url);

  // 已在目标页 → 不跳
  if (cur === dst) return;

  // 3 秒内同目标重复 reLaunch → 跳过，防止死循环
  if (_lastReLaunchTo === dst && now - _lastReLaunchAt < 3000) {
    console.warn("skip relaunch loop:", dst);
    return;
  }
  _lastReLaunchTo = dst;
  _lastReLaunchAt = now;

  await wrap(uni.reLaunch, { url: dst });
}

export interface NavigationOptions {
  url: string;
  params?: Record<string, any>;
  success?: () => void;
  fail?: (err: any) => void;
  complete?: () => void;
}

export interface NavigateBackOptions {
  delta?: number;
  success?: () => void;
  fail?: (err: any) => void;
  complete?: () => void;
}

/**
 * 构建带参数的 URL
 */
function buildUrl(url: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const query = Object.entries(params)
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return null;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .filter(Boolean)
    .join("&");

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${query}`;
}

/**
 * 普通跳转（保留当前页面，可以返回）
 * @param options 导航选项
 */
export function navigateTo(options: NavigationOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = buildUrl(options.url, options.params);

    uni.navigateTo({
      url,
      success: () => {
        console.log(`✅ Navigate to: ${url}`);
        options.success?.();
        resolve();
      },
      fail: (err) => {
        console.error(`❌ Navigate failed: ${url}`, err);
        options.fail?.(err);
        reject(err);
      },
      complete: () => {
        options.complete?.();
      },
    });
  });
}

/**
 * 重新启动到指定页面（关闭所有页面，打开新页面）
 * 适用于：登录后跳转首页、tab切换等场景
 * @param options 导航选项
 */
export function reLaunch(options: NavigationOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = buildUrl(options.url, options.params);
    const now = Date.now();

    // 防抖检查：如果相同 URL 在短时间内被调用，忽略
    if (
      lastNavigation &&
      lastNavigation.url === url &&
      now - lastNavigation.time < NAVIGATION_DEBOUNCE_MS
    ) {
      console.log(`⏭️ Navigation debounced: ${url}`);
      // 仍然调用 success 回调，但不实际导航
      options.success?.();
      resolve();
      return;
    }

    // 更新最后导航记录
    lastNavigation = { url, time: now };

    const pureUrl = url.split("?")[0];
    safeReLaunch(pureUrl)
      .then(() => {
        console.log(`✅ ReLaunch to: ${pureUrl}`);
        options.success?.();
        resolve();
      })
      .catch((err) => {
        console.error(`❌ ReLaunch failed: ${pureUrl}`, err);
        // 清除导航记录，允许重试
        if (lastNavigation?.url === url) {
          lastNavigation = null;
        }
        options.fail?.(err);
        reject(err);
      })
      .finally(() => {
        options.complete?.();
      });
  });
}

/**
 * 重定向到指定页面（关闭当前页面，打开新页面）
 * 适用于：登录页跳转首页等不需要返回的场景
 * @param options 导航选项
 */
export function redirectTo(options: NavigationOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = buildUrl(options.url, options.params);

    uni.redirectTo({
      url,
      success: () => {
        console.log(`✅ Redirect to: ${url}`);
        options.success?.();
        resolve();
      },
      fail: (err) => {
        console.error(`❌ Redirect failed: ${url}`, err);
        options.fail?.(err);
        reject(err);
      },
      complete: () => {
        options.complete?.();
      },
    });
  });
}

/**
 * 返回上一页
 * @param options 返回选项
 */
export function navigateBack(options: NavigateBackOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta: options.delta || 1,
      success: () => {
        console.log(`✅ Navigate back (delta: ${options.delta || 1})`);
        options.success?.();
        resolve();
      },
      fail: (err) => {
        console.error(`❌ Navigate back failed`, err);
        options.fail?.(err);
        reject(err);
      },
      complete: () => {
        options.complete?.();
      },
    });
  });
}

/**
 * 切换 Tab（仅在配置了 tabBar 时使用）
 * @param options 导航选项
 */
export function switchTab(options: NavigationOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = buildUrl(options.url, options.params);

    uni.switchTab({
      url,
      success: () => {
        console.log(`✅ Switch tab to: ${url}`);
        options.success?.();
        resolve();
      },
      fail: (err) => {
        console.error(`❌ Switch tab failed: ${url}`, err);
        options.fail?.(err);
        reject(err);
      },
      complete: () => {
        options.complete?.();
      },
    });
  });
}

/**
 * 导航到首页
 */
export function goHome(): Promise<void> {
  return safeReLaunch("/pages/home/index");
}

/**
 * 导航到登录页
 */
export function goLogin(): Promise<void> {
  return safeReLaunch("/pages/auth/login");
}

/**
 * 导航到注册页
 */
export function goRegister(): Promise<void> {
  return safeReLaunch("/pages/auth/register");
}

/**
 * 导航到启动页
 */
export function goStartup(): Promise<void> {
  return safeReLaunch("/pages/auth/startup");
}

/**
 * 导航到市场页
 */
export function goMarket(): Promise<void> {
  // 无系统 tabBar 时统一走 navigateTo（由 nav.ts 做动态降级）
  return navigateTo({ url: "/pages/market/index" });
}

/**
 * 导航到交易页
 */
export function goTrade(): Promise<void> {
  return navigateTo({ url: "/pages/trade/index" });
}

/**
 * 导航到发现页
 */
export function goDiscover(): Promise<void> {
  return navigateTo({ url: "/pages/discover/index" });
}

/**
 * 导航到个人中心页
 */
export function goProfile(): Promise<void> {
  return navigateTo({ url: "/pages/profile/index" });
}

/**
 * 退出登录并跳转到启动页
 */
export function logout(): Promise<void> {
  return goStartup();
}
