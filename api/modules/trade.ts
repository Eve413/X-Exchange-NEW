import request from '@/utils/request'

export interface OrderRequest {
  symbol: string
  side: 'BUY' | 'SELL'
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  quantity: string
  price?: string
  stopPrice?: string
  icebergQty?: string
  newOrderRespType?: 'ACK' | 'RESULT' | 'FULL'
}

export interface OrderResponse {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  transactTime: number
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'PENDING_CANCEL' | 'REJECTED' | 'EXPIRED'
  timeInForce: string
  type: string
  side: string
  fills: Array<{
    price: string
    qty: string
    commission: string
    commissionAsset: string
  }>
}

export interface OrderQuery {
  symbol: string
  orderId?: number
  origClientOrderId?: string
}

export interface OrderHistory {
  symbol?: string
  orderId?: number
  startTime?: number
  endTime?: number
  limit?: number
}

/**
 * 交易API服务
 */
export const tradeApi = {
  /**
   * 下单
   */
  createOrder: (orderData: OrderRequest) => {
    return request<OrderResponse>({
      url: '/api/trade/order',
      method: 'POST',
      data: orderData
    })
  },

  /**
   * 测试下单
   */
  testOrder: (orderData: OrderRequest) => {
    return request<{}>({
      url: '/api/trade/order/test',
      method: 'POST',
      data: orderData
    })
  },

  /**
   * 查询订单
   */
  getOrder: (params: OrderQuery) => {
    return request<OrderResponse>({
      url: '/api/trade/order',
      method: 'GET',
      data: params
    })
  },

  /**
   * 撤销订单
   */
  cancelOrder: (params: OrderQuery) => {
    return request<OrderResponse>({
      url: '/api/trade/order',
      method: 'DELETE',
      data: params
    })
  },

  /**
   * 撤销指定交易对的所有订单
   */
  cancelAllOrders: (symbol: string) => {
    return request<OrderResponse[]>({
      url: '/api/trade/openOrders',
      method: 'DELETE',
      data: { symbol }
    })
  },

  /**
   * 查询当前挂单
   */
  getOpenOrders: (symbol?: string) => {
    return request<OrderResponse[]>({
      url: '/api/trade/openOrders',
      method: 'GET',
      data: symbol ? { symbol } : {}
    })
  },

  /**
   * 查询所有订单
   */
  getAllOrders: (params: OrderHistory) => {
    return request<OrderResponse[]>({
      url: '/api/trade/allOrders',
      method: 'GET',
      data: params
    })
  },

  /**
   * 查询账户信息
   */
  getAccount: () => {
    return request<{
      makerCommission: number
      takerCommission: number
      buyerCommission: number
      sellerCommission: number
      canTrade: boolean
      canWithdraw: boolean
      canDeposit: boolean
      updateTime: number
      accountType: string
      balances: Array<{
        asset: string
        free: string
        locked: string
      }>
    }>({
      url: '/api/account',
      method: 'GET'
    })
  },

  /**
   * 查询账户成交历史
   */
  getMyTrades: (params: {
    symbol: string
    orderId?: number
    startTime?: number
    endTime?: number
    fromId?: number
    limit?: number
  }) => {
    return request<Array<{
      symbol: string
      id: number
      orderId: number
      orderListId: number
      price: string
      qty: string
      quoteQty: string
      commission: string
      commissionAsset: string
      time: number
      isBuyer: boolean
      isMaker: boolean
      isBestMatch: boolean
    }>>({
      url: '/api/trade/myTrades',
      method: 'GET',
      data: params
    })
  }
}

export default tradeApi
