/**
 * Iconoir图标管理工具
 * 基于 https://iconoir.com/ 图标库
 */

// 常用图标名称映射
export const ICONOIR_ICONS = {
  // 导航类
  home: 'home-simple',
  back: 'nav-arrow-left',
  forward: 'nav-arrow-right',
  up: 'nav-arrow-up',
  down: 'nav-arrow-down',
  menu: 'menu',
  close: 'cancel',
  
  // 用户相关
  user: 'profile-circle',
  users: 'group',
  login: 'log-in',
  logout: 'log-out',
  register: 'add-user',
  
  // 交易相关
  trade: 'stats-up-square',
  buy: 'arrow-tr',
  sell: 'arrow-br',
  chart: 'graph-up',
  trending: 'trending-up',
  portfolio: 'wallet',
  balance: 'piggy-bank',
  
  // 功能类
  search: 'search',
  filter: 'filter',
  sort: 'sort',
  refresh: 'refresh-double',
  download: 'download',
  upload: 'upload',
  share: 'share-ios',
  copy: 'copy',
  
  // 状态类
  success: 'check',
  error: 'cancel',
  warning: 'warning-triangle',
  info: 'info-circle',
  loading: 'refresh-double',
  
  // 设置类
  settings: 'settings',
  edit: 'edit-pencil',
  delete: 'bin',
  save: 'floppy-disk',
  undo: 'undo',
  redo: 'redo',
  
  // 媒体类
  play: 'play',
  pause: 'pause',
  stop: 'media-image',
  volume: 'sound-high',
  mute: 'sound-off',
  
  // 通信类
  mail: 'mail',
  phone: 'phone',
  message: 'chat-bubble',
  notification: 'bell',
  
  // 安全类
  lock: 'lock',
  unlock: 'unlock',
  shield: 'shield-check',
  key: 'key-alt',
  eye: 'eye',
  eyeOff: 'eye-off',
  
  // 时间类
  calendar: 'calendar',
  clock: 'clock',
  timer: 'timer',
  
  // 位置类
  location: 'pin',
  map: 'map',
  globe: 'globe',
  
  // 文件类
  file: 'page',
  folder: 'folder',
  image: 'media-image',
  video: 'media-video',
  
  // 电商类
  cart: 'cart',
  heart: 'heart',
  star: 'star',
  bookmark: 'bookmark',
  
  // 网络类
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  link: 'link',
  
  // 其他
  plus: 'plus',
  minus: 'minus',
  question: 'help-circle',
  exclamation: 'warning-triangle',
} as const

// 交易所专用图标组合
export const EXCHANGE_ICONS = {
  // 主要功能
  dashboard: ICONOIR_ICONS.home,
  market: ICONOIR_ICONS.chart,
  spot: ICONOIR_ICONS.trade,
  futures: 'graph-down',
  assets: ICONOIR_ICONS.portfolio,
  profile: ICONOIR_ICONS.user,
  
  // 交易操作
  buyOrder: ICONOIR_ICONS.buy,
  sellOrder: ICONOIR_ICONS.sell,
  orderBook: 'list',
  priceChart: ICONOIR_ICONS.chart,
  tradingPair: 'switch-horizontal',
  
  // 资产相关
  deposit: 'add-to-cart',
  withdraw: 'remove-from-cart',
  transfer: 'arrow-separate-vertical',
  history: 'clock-outline',
  balance: ICONOIR_ICONS.balance,
  
  // 安全设置
  twoFactor: 'smartphone-device',
  password: ICONOIR_ICONS.lock,
  device: 'computer',
  verification: ICONOIR_ICONS.shield,
  
  // 其他
  favorite: ICONOIR_ICONS.heart,
  language: ICONOIR_ICONS.globe,
  theme: 'half-moon',
  help: ICONOIR_ICONS.question,
} as const

// 图标尺寸预设
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
} as const

// 图标颜色预设
export const ICON_COLORS = {
  primary: '#6f4bfd',
  success: '#19af00',
  error: '#d92a2a',
  warning: '#ff9800',
  info: '#6f4bfd',
  neutral: '#9e9e9e',
  dark: '#3f3f3f',
  light: '#ffffff',
} as const

/**
 * 获取图标URL
 * @param iconName - 图标名称
 * @param cdn - CDN提供商 ('jsdelivr' | 'unpkg')
 * @returns 图标URL
 */
export function getIconUrl(iconName: string, cdn: 'jsdelivr' | 'unpkg' = 'jsdelivr'): string {
  const baseUrls = {
    jsdelivr: 'https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@main/icons',
    unpkg: 'https://unpkg.com/iconoir@latest/icons'
  }
  
  return `${baseUrls[cdn]}/${iconName}.svg`
}

/**
 * 检查图标是否存在
 * @param iconName - 图标名称
 * @returns 是否存在
 */
export function hasIcon(iconName: string): boolean {
  return Object.values(ICONOIR_ICONS).includes(iconName as any) ||
         Object.values(EXCHANGE_ICONS).includes(iconName as any)
}

/**
 * 获取图标的后备显示
 * @param iconName - 图标名称
 * @returns Unicode字符
 */
export function getIconFallback(iconName: string): string {
  const fallbackMap: Record<string, string> = {
    [ICONOIR_ICONS.home]: '🏠',
    [ICONOIR_ICONS.user]: '👤',
    [ICONOIR_ICONS.settings]: '⚙️',
    [ICONOIR_ICONS.search]: '🔍',
    [ICONOIR_ICONS.heart]: '❤️',
    [ICONOIR_ICONS.star]: '⭐',
    [ICONOIR_ICONS.notification]: '🔔',
    [ICONOIR_ICONS.mail]: '📧',
    [ICONOIR_ICONS.phone]: '📞',
    [ICONOIR_ICONS.calendar]: '📅',
    [ICONOIR_ICONS.clock]: '⏰',
    [ICONOIR_ICONS.location]: '📍',
    [ICONOIR_ICONS.globe]: '🌐',
    [ICONOIR_ICONS.chart]: '📈',
    [ICONOIR_ICONS.portfolio]: '💼',
    [ICONOIR_ICONS.buy]: '📈',
    [ICONOIR_ICONS.sell]: '📉',
    [ICONOIR_ICONS.success]: '✅',
    [ICONOIR_ICONS.error]: '❌',
    [ICONOIR_ICONS.warning]: '⚠️',
    [ICONOIR_ICONS.info]: 'ℹ️',
    [ICONOIR_ICONS.lock]: '🔒',
    [ICONOIR_ICONS.unlock]: '🔓',
    [ICONOIR_ICONS.shield]: '🛡️',
    [ICONOIR_ICONS.eye]: '👁️',
    [ICONOIR_ICONS.eyeOff]: '🙈',
  }
  
  return fallbackMap[iconName] || '◯'
}

/**
 * 图标类型定义
 */
export type IconName = keyof typeof ICONOIR_ICONS | keyof typeof EXCHANGE_ICONS | string
export type IconSize = keyof typeof ICON_SIZES | number
export type IconColor = keyof typeof ICON_COLORS | string

/**
 * 图标配置接口
 */
export interface IconConfig {
  name: IconName
  size?: IconSize
  color?: IconColor
  strokeWidth?: number
  clickable?: boolean
}

/**
 * 创建图标配置
 * @param config - 图标配置
 * @returns 完整的图标配置
 */
export function createIconConfig(config: IconConfig): Required<IconConfig> {
  return {
    name: config.name,
    size: config.size || 'md',
    color: config.color || 'neutral',
    strokeWidth: config.strokeWidth || 1.5,
    clickable: config.clickable || false,
  }
}

// 预设图标组合
export const PRESET_ICONS = {
  // 导航栏
  navHome: createIconConfig({ name: EXCHANGE_ICONS.dashboard, size: 'md', color: 'primary' }),
  navMarket: createIconConfig({ name: EXCHANGE_ICONS.market, size: 'md', color: 'primary' }),
  navTrade: createIconConfig({ name: EXCHANGE_ICONS.spot, size: 'md', color: 'primary' }),
  navAssets: createIconConfig({ name: EXCHANGE_ICONS.assets, size: 'md', color: 'primary' }),
  navProfile: createIconConfig({ name: EXCHANGE_ICONS.profile, size: 'md', color: 'primary' }),
  
  // 交易操作
  buyButton: createIconConfig({ name: EXCHANGE_ICONS.buyOrder, size: 'sm', color: 'success' }),
  sellButton: createIconConfig({ name: EXCHANGE_ICONS.sellOrder, size: 'sm', color: 'error' }),
  
  // 状态指示
  success: createIconConfig({ name: ICONOIR_ICONS.success, size: 'md', color: 'success' }),
  error: createIconConfig({ name: ICONOIR_ICONS.error, size: 'md', color: 'error' }),
  warning: createIconConfig({ name: ICONOIR_ICONS.warning, size: 'md', color: 'warning' }),
  loading: createIconConfig({ name: ICONOIR_ICONS.loading, size: 'md', color: 'neutral' }),
} as const
