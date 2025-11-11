/**
 * API类型定义
 */

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页响应类型
export interface PaginationResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 错误响应类型
export interface ErrorResponse {
  code: number
  message: string
  details?: any
}

// 请求配置类型
export interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  headers?: Record<string, string>
  timeout?: number
  retry?: number
}

// 文件上传类型
export interface UploadFile {
  name: string
  filePath: string
  formData?: Record<string, any>
}

// WebSocket消息类型
export interface WSMessage {
  id?: string
  method: string
  params?: any
  result?: any
  error?: {
    code: number
    message: string
  }
}

// 订阅参数类型
export interface SubscribeParams {
  method: string
  params: any[]
  id?: string
}

// 市场数据类型
export interface TickerData {
  symbol: string
  price: string
  change: string
  changePercent: string
  volume: string
  high: string
  low: string
  count: number
}

export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
}

export interface DepthData {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

export interface TradeData {
  id: number
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
}

// 订单类型
export interface OrderData {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: OrderStatus
  timeInForce: TimeInForce
  type: OrderType
  side: OrderSide
  stopPrice?: string
  icebergQty?: string
  time: number
  updateTime: number
  isWorking: boolean
}

export type OrderStatus = 
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'PENDING_CANCEL'
  | 'REJECTED'
  | 'EXPIRED'

export type OrderType = 
  | 'LIMIT'
  | 'MARKET'
  | 'STOP_LOSS'
  | 'STOP_LOSS_LIMIT'
  | 'TAKE_PROFIT'
  | 'TAKE_PROFIT_LIMIT'
  | 'LIMIT_MAKER'

export type OrderSide = 'BUY' | 'SELL'

export type TimeInForce = 'GTC' | 'IOC' | 'FOK'

// 账户类型
export interface AccountInfo {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  accountType: string
  balances: Balance[]
  permissions: string[]
}

export interface Balance {
  asset: string
  free: string
  locked: string
}

// 用户信息类型
export interface UserInfo {
  userId: string
  email: string
  phone?: string
  nickname?: string
  avatar?: string
  level: number
  vipLevel: number
  kycStatus: KycStatus
  twoFactorEnabled: boolean
  createTime: number
  lastLoginTime: number
  country?: string
  language: string
  timezone: string
}

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

// 资产相关类型
export interface AssetDetail {
  asset: string
  assetFullName: string
  amountFree: string
  btcValuation: string
  usdtValuation: string
  freeze: string
  locked: string
  withdrawing: string
}

export interface DepositInfo {
  address: string
  addressTag?: string
  asset: string
  network: string
  url?: string
}

export interface WithdrawInfo {
  id: string
  amount: string
  transactionFee: string
  asset: string
  address: string
  addressTag?: string
  txId: string
  applyTime: number
  network: string
  status: WithdrawStatus
  info?: string
}

export type WithdrawStatus = 
  | 0  // Email Sent
  | 1  // Cancelled
  | 2  // Awaiting Approval
  | 3  // Rejected
  | 4  // Processing
  | 5  // Failure
  | 6  // Completed

// 通知类型
export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  content: string
  data?: any
  read: boolean
  createTime: number
}

export type NotificationType = 
  | 'order'
  | 'deposit'
  | 'withdraw'
  | 'security'
  | 'system'
  | 'price_alert'

// 安全相关类型
export interface SecurityLog {
  id: string
  action: string
  ip: string
  location: string
  device: string
  time: number
  status: 'success' | 'failed'
}

export interface ApiKeyInfo {
  id: string
  label: string
  apiKey: string
  permissions: string[]
  ipRestrict: string[]
  createTime: number
  lastUsedTime?: number
  status: 'active' | 'disabled'
}
