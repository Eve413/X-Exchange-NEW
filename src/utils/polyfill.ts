/**
 * Polyfill 兜底机制
 * 防止老代码在非H5端白屏
 * 在 main.ts 最顶端 import 此文件
 */

/* #ifndef H5 */
const g: any = globalThis as any

// 基础对象 polyfill
g.window ||= g
g.document ||= {}

// 事件监听器 polyfill
for (const k of ['addEventListener', 'removeEventListener']) {
  g.window[k] ||= () => {}
  g.document[k] ||= () => {}
}

// matchMedia polyfill
g.matchMedia ||= () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {}
})

// 其他常用浏览器API polyfill
g.navigator ||= {
  userAgent: 'UniApp',
  platform: 'UniApp'
}

g.location ||= {
  href: '',
  protocol: 'https:',
  host: '',
  hostname: '',
  port: '',
  pathname: '/',
  search: '',
  hash: ''
}

g.history ||= {
  pushState: () => {},
  replaceState: () => {},
  go: () => {},
  back: () => {},
  forward: () => {}
}

// 防止某些库直接访问 window 属性导致错误
g.innerWidth ||= 375
g.innerHeight ||= 667
g.devicePixelRatio ||= 1

// 控制台增强（可选）
if (!g.console) {
  g.console = {
    log: () => {},
    warn: () => {},
    error: () => {},
    info: () => {},
    debug: () => {}
  }
}

console.log('[Polyfill] 非H5端浏览器API兜底已加载')
/* #endif */

/* #ifdef H5 */
console.log('[Polyfill] H5端无需polyfill')
/* #endif */
