// utils/nav.ts - Unified navigation manager for UniApp/Uni
// Handles lock, debounce, timeout, and platform-safe routing

type NavTarget = { url: string; isTab?: boolean; reLaunch?: boolean; replace?: boolean }

const NAV_TIMEOUT = 3000
const NAV_GAP_MS = 250 // click throttle gap

// Known tab paths set for auto-detection when isTab is not provided
const TAB_PATHS = new Set<string>([
  '/pages/market/index',
  '/pages/trade/index',
  '/pages/discover/index',
  '/pages/profile/index',
])

// Global singleton to survive hot updates and avoid duplicate locks
// @ts-ignore
if (!globalThis.__NAV_LOCK__) globalThis.__NAV_LOCK__ = { locked: false, ts: 0, timer: 0, lastUrl: '' }
// @ts-ignore
const NAV = globalThis.__NAV_LOCK__ as { locked: boolean; ts: number; timer: number; lastUrl: string }

function now() { return Date.now() }

function currentPath(): string {
  try {
    const pages = getCurrentPages()
    const cur = pages[pages.length - 1] as any
    return (cur?.route ? '/' + cur.route : cur?.$page?.fullPath) || ''
  } catch {
    return ''
  }
}

const pure = (u: string) => u.split('?')[0]
function samePath(a: string, b: string) {
  return pure(a) === pure(b)
}

function wrapUniCall<T = any>(fn: Function, args: any): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      fn({
        ...args,
        success: (res: T) => resolve(res),
        fail: (err: any) => reject(err),
        complete: () => void 0,
      })
    } catch (err) {
      reject(err)
    }
  })
}

function unlock() {
  NAV.locked = false
  NAV.ts = 0
  if (NAV.timer) {
    clearTimeout(NAV.timer)
    NAV.timer = 0 as any
  }
}

export async function goto(target: NavTarget): Promise<void> {
  const url = target.url
  const p = pure(url)

  // 1) idempotency: ignore same path
  const cur = currentPath()
  if (samePath(cur || '', p)) return

  // 2) throttling and existing lock
  if (NAV.locked && now() - NAV.ts < NAV_TIMEOUT) {
    console.log(`Waiting to navigate to: ${NAV.lastUrl || url}, do not operate continuously: ${url}.`)
    return
  }

  // 3) lock expired: force unlock
  if (NAV.locked && now() - NAV.ts >= NAV_TIMEOUT) {
    console.warn('⚠️ Navigation timeout, force reset')
    unlock()
  }

  // 4) acquire lock
  NAV.locked = true
  NAV.ts = now()
  NAV.lastUrl = url
  if (NAV.timer) clearTimeout(NAV.timer)
  NAV.timer = setTimeout(() => {
    console.warn('⚠️ Navigation timeout, force reset by timer')
    unlock()
  }, NAV_TIMEOUT) as unknown as number

  // 5) detect tab target
  // 在使用自定义 BottomTabBar 的场景下，统一不使用系统 switchTab
  const targetIsTab = false

  // 6) perform navigation
  try {
    await new Promise(r => setTimeout(r, NAV_GAP_MS))
    if (target.reLaunch) {
      await wrapUniCall(uni.reLaunch, { url })
    } else if (target.replace) {
      await wrapUniCall(uni.redirectTo, { url })
    } else {
      await wrapUniCall(uni.navigateTo, { url })
    }
  } catch (err: any) {
    console.error('Navigation fail:', err, ' -> ', url)
    const msg = String(err?.errMsg || err)
    // 统一降级为 navigateTo，不再尝试 switchTab
    // Do not rethrow, allow caller to continue without breaking UX
  } finally {
    unlock()
  }
}

export function resetNavLock() {
  // @ts-ignore
  if (globalThis.__NAV_LOCK__) {
    // @ts-ignore
    globalThis.__NAV_LOCK__.locked = false
    // @ts-ignore
    globalThis.__NAV_LOCK__.ts = 0
    // @ts-ignore
    if (globalThis.__NAV_LOCK__.timer) {
      // @ts-ignore
      clearTimeout(globalThis.__NAV_LOCK__.timer)
      // @ts-ignore
      globalThis.__NAV_LOCK__.timer = 0
    }
  }
}