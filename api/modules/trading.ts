import request from '@/utils/request'
import { StringLiteral } from 'typescript'

export interface TraderPerformaResponse {
  data: {
    msg: string
    status: number
    link: string | null
    appversion: string
    device: string
    token: string
    data: TreraderPerforma[]
  }
}   

export interface TreraderPerforma {
  traderId: number
  photo: string
  code: string
  traderName: string
  totalFollowers: number
  activeFollower: number
  pnl30Days: number
  yield30Days:string
  aum:number
  sharpeRatio: number
}

export interface TreraderHistoryPerforma {
  traderId: number
  photo: string
  code: string
  traderName: string
  totalFollowers: number
  activeFollower: number
  pnl30Days: number
  yield30Days:string
  aum:number
  sharpeRatio: number
}


export interface BaseParam {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface BaseParamOther {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface AirdropParam extends BaseParam {
  // Add Airdrop-specific fields here
  limit: number;
  keyword?: string;
  status?: string
}

export interface SubscribeParam extends BaseParam {
  // Add Subscribe-specific fields here
  expertId?: number;
  userId?: number;
  amount?: number;
  copyAllTrade?: boolean;
  status: true
}

export class TradingApi {
    static traderPerforma(userId: number, params: BaseParam) {
        return request.postTrading<TraderPerformaResponse>(`/api/trader/performance/user/${userId}`, params)
    }

    static traderPerformaByUserId(expertID: number,userId: number, params: BaseParam) {
        return request.postTrading<TraderPerformaResponse>(`/api/trader/performance/${expertID}/detail/user/${userId}`, params)
    }

    static subscribeToTrader(params: SubscribeParam) {
        return request.postTrading<any>('/api/copy-trade/subscribe', params)
    }

    static unSubscribeToTrader(expertId: number, userId: number, params: BaseParam) {
      ///unsubscribe/expert/{idExpert}/user/{idUser}
        return request.postTrading<any>(`/api/copy-trade/unsubscribe/expert/${expertId}/user/${userId}`, params)
    }

    static getBanner(params: BaseParamOther) {
      return request.post<any>('/banners.json', params);
    }

    static getCopyTradeSummary(expertId: number, userId: number, params: BaseParam) {
      ///subscribe/summary/expert/{expertId}/user/{userId}
        return request.postTrading<any>(`/api/copy-trade/subscribe/summary/expert/${expertId}/user/${userId}`, params);
    }

    static getRecentOrders(expertId: number, limit: number, params: BaseParam) {
      ///subscribe/summary/expert/{expertId}/user/{userId}
        return request.postTrading<any>(`/api/trading/order/latest-summary/expert/${expertId}/limit/${limit}`, params);
    }

     static getAirdrops(params: AirdropParam) {
      ///subscribe/summary/expert/{expertId}/user/{userId}
        return request.post<any>(`/airdrops.json`, params);
    }

     static traderPerformaByUserIdByDay(userId: number,day: number, params: BaseParam) {
        return request.postTrading<TreraderHistoryPerforma>(`/api/trader/performance/user/${userId}/day/${day}`, params)
    }

    static tradeHistory(userId: number, type: string, assetType: string, params: BaseParam) {
        return request.postTrading<any>(`/api/trader/performance/history/user/${userId}/type/${type}/asset/${assetType}`, params)
    }
    
}

export default TradingApi