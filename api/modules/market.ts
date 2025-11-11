import request from '@/utils/request'

export interface MarketTickerResponse {
  symbol: string
  price: string
  change: string
  changePercent: string
  volume: string
  high: string
  low: string
  openTime: number
  closeTime: number
}

export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
}

export interface DepthData {
  lastUpdateId: number
  bids: Array<[string, string]>
  asks: Array<[string, string]>
}

export interface TradeData {
  id: number
  price: string
  qty: string
  time: number
  isBuyerMaker: boolean
}

/**
 * 市场API服务
 */
export const marketApi = {
  /**
   * 获取所有交易对行情
   */
  getAllTickers: () => {
    return request<MarketTickerResponse[]>({
      url: '/api/market/ticker/24hr',
      method: 'GET'
    })
  },

  /**
   * 获取单个交易对行情
   */
  getTicker: (symbol: string) => {
    return request<MarketTickerResponse>({
      url: '/api/market/ticker/24hr',
      method: 'GET',
      data: { symbol }
    })
  },

  /**
   * 获取K线数据
   */
  getKlines: (params: {
    symbol: string
    interval: string
    startTime?: number
    endTime?: number
    limit?: number
  }) => {
    return request<KlineData[]>({
      url: '/api/market/klines',
      method: 'GET',
      data: params
    })
  },

  /**
   * 获取深度数据
   */
  getDepth: (symbol: string, limit: number = 20) => {
    return request<DepthData>({
      url: '/api/market/depth',
      method: 'GET',
      data: { symbol, limit }
    })
  },

  /**
   * 获取最新成交记录
   */
  getRecentTrades: (symbol: string, limit: number = 50) => {
    return request<TradeData[]>({
      url: '/api/market/trades',
      method: 'GET',
      data: { symbol, limit }
    })
  },

  /**
   * 获取历史成交记录
   */
  getHistoricalTrades: (params: {
    symbol: string
    limit?: number
    fromId?: number
  }) => {
    return request<TradeData[]>({
      url: '/api/market/historicalTrades',
      method: 'GET',
      data: params
    })
  },

  /**
   * 获取聚合交易记录
   */
  getAggTrades: (params: {
    symbol: string
    fromId?: number
    startTime?: number
    endTime?: number
    limit?: number
  }) => {
    return request<any[]>({
      url: '/api/market/aggTrades',
      method: 'GET',
      data: params
    })
  },

  /**
   * 获取24小时价格变化统计
   */
  get24hrStats: (symbol?: string) => {
    return request<MarketTickerResponse | MarketTickerResponse[]>({
      url: '/api/market/ticker/24hr',
      method: 'GET',
      data: symbol ? { symbol } : {}
    })
  }
}

export default marketApi
