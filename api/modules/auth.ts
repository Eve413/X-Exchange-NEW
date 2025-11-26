import request from '@/utils/request'
import type { AuthParams, LoginParams, RegisterParams, UserInfo, VerifyPhoneParams } from '@/store/modules/user'
import { Verify } from 'crypto'


export interface AuthResponse {
  msg : String,
  status : String,
  token : String 
}

// 接口响应类型定义
export interface LoginResponse {
  data: {
    msg: string
    status: number
    link: string | null
    appversion: string
    device: string
    token: string
    data: UserInfoResponse
  }
}

export interface VerifyPhoneResponse {
  data: {
    msg: string
    status: number
    link: string | null
    appversion: string
    device: string
  }
}



export interface UserInfoResponse {
  id: string
  group_id: string
  parent_id: string | null
  social_network_id: string | null
  social_network_type: string | null
  country_id: string
  lft: string
  rght: string
  code: string
  phone_code: string
  username: string
  password: string
  first_name: string
  last_name: string
  gender_id: string
  email: string
  balance: string
  token: string
  phone: string
  ip_address: string
  last_login: string
  last_online: string
  last_ip: string
  activation_code: string
  user_status: string
  read: boolean
  active: boolean
  status: boolean
  modified: string
  created: string
  full_name: string
  Group: GroupResponse
  photo: string
}

export interface GroupResponse {
  id: string
  slug: string
  name: string
  active: number
  status: number
  is_admin: boolean | null
  order: number | null
  created: string
  modified: string
}

export type MarketList = MarketItem[];

export interface MarketItem {
  symbol: string;                // Contoh: "0700"
  name: string;                  // Contoh: "Tencent Holdings Limited"
  baseAsset: string;             // Contoh: "0700" atau "BTC"
  quoteAsset: string;            // Contoh: "USDT"
  type: 'stock' | 'crypto';      // Jenis aset
  lastPrice: number;             // Harga terakhir
  percentChange24h: number;      // Perubahan harga 24 jam (persen)
  sparkline: string;             // Data gambar base64 chart mini
  icon: string;                  // URL ikon aset
}


export interface CaptchaResponse {
  captchaId: string
  captchaImage: string
}

export interface SmsCodeResponse {
  success: boolean
  message: string
}

export interface SmsCodeParams {
  phone: string
  scene: string
  captchaId?: string
  captchaCode?: string
}

export interface ResetPasswordParams {
  passkey: string,
    device: string,
    appversion: string,
    phone_code: string,
    username: string,
    session_id: string
    password: string,
    new_password: string,
    lang: string
}

export interface SettingsParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface KYCParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
  token:string;
  nationality_id:number;
  tax_residence_id:number;
  has_overseas_bank_account:number;
  id_type:string;
  id_front:string;
  id_back:string;
  full_name:string;
  gender_id:string;
  date_of_birth:string;
  id_number:string;
  address:string;
}

export interface OTPResponse {
    msg: string
    status: number
    link: string | null
    appversion: string
    device: string
    token: string
    session_id: UserInfoResponse
}


export interface TickersParams {
  passkey: string;
  limit: number;
}

export interface MarketParams {
  passkey: string;
  lang: string;
  symbol: string;
}

export interface OrderBookParams {
  passkey: string;
  limit: string;
  symbol: string;
}


export interface CandleParams {
  passkey: string;
  limit: string;
  symbol: string;
  interval: string;
}

export interface FundFlowParams {
  passkey: string;
  limit: string;
  symbol: string;
  interval: string;
}

export interface ArticleParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  type: string;
  symbol?: string;
  keyword?: string;
  limit?: number;
}

export interface AlertParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  symbol?: string;
  amount?: string;
  alert_type?: string;
  frequency?: string;
}

export interface FavoriteParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  symbol: string;
  favorite: string;
}

export interface ProfileParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface BannerParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface NotificationParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface WalletsParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface ReferalParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
}

export interface TransferParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  from_account:string;
  to_account:string;
  baseAsset:string;
  amount:string;
}

export interface WithdrawParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  baseAsset:string;
  network_id:string;
  wd_address:string;
  amount:string;
}

export interface DepositParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
}

export interface StakingsParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
}

export interface StakingsDetilsParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  staking_id:number;
}

export interface StakingsSubscriptionParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  staking_id:number;
  amount:string;
}

export interface ResetFundPasswordParams {
  phone: string
  smsCode: string
  captchaId: string
  captchaCode: string
  newFundPassword: string
}

export interface AirdropsParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
}
export interface AirdropsDetilsParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  airdrop_id:number;
}

export interface AirdropsSubscriptionParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  airdrop_id:number;
}

export interface AirdropsSubscriptionDetilParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  id:number;
}

export interface EventParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  type: string;
}

export interface LoginGoogleParams {
  id_token: string;
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface AssetParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}
export interface ExchangeCheckParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  from_asset:string;
  to_asset:string;
}
export interface ExchangeParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  from_asset:string;
  to_asset:string;
  amount:string;
}
export interface ProfitLossParams {
  passkey: string;
  device: string;
  appversion: string;
  token:string;
  lang: string;
  period: string;
  calendar: string;
}
export interface DashboardParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}


export interface SocialLoginParams {
  provider: string
  token: string
  phone?: string
}

export interface SocialLoginResponse {
  token?: string
  userInfo?: UserInfo
  needBindPhone?: boolean
}

export interface Bind2FAParams {
  otp: string
}

export interface Unbind2FAParams {
  otp: string
}

export interface SettingResponse {
  data: {
    msg: string
    status: number
    link: string | null
    appversion: string
    device: string
    data: {
      Language: {
        name: string
        id: string
      }[]
      Country: {
        id: string
        name: string
        icon: string
        code: string
      }[]
      IdType: {
        id: string
        name: string
      }[]
      Network: {
        id: string
        logo: string
        code: string
        name: string
      }[]
    }
  }
}

/**
 * 认证相关API
 */
export class AuthAPI {


   static authenticated(params: AuthParams) {
    return request.post<AuthResponse>('/auth.json', params)
  }

  /**
   * 用户登录
   * @param params 登录参数
   */
  static login(params: LoginParams) {
    return request.post<LoginResponse>('/login.json', params)
  }
   static loginGoogle(params: LoginGoogleParams) {
    return request.post<LoginResponse>('/login/gmail.json', params)
  }

    static getAssetParams(params: AssetParams) {
    return request.post<LoginResponse>('/assets.json', params)
  }

  static getExchangeCheckParams(params: ExchangeCheckParams) {
    return request.post<LoginResponse>('/exchange_check.json', params)
  }

   static exchangeParams(params: ExchangeParams) {
    return request.post<LoginResponse>('/exchange.json', params)
  }

  
  
  

    static verifyPhone(params: VerifyPhoneParams) {
    return request.post<LoginResponse>('/verify.json', params)
  }

  static sendOTPForgot(params: VerifyPhoneParams) {
    return request.post<OTPResponse>('/forgot.json', params)
  }
  

  /**
   * 用户注册
   * @param params 注册参数
   */
  static register(params: RegisterParams) {
    return request.post('/register.json', params)
  }

 /**
   * 重置登录密码
   * @param params 重置密码参数
   */
  static resetPassword(params: ResetPasswordParams) {
    return request.post('/reset/password.json', params)
  }

    static getSettings(params: SettingsParams) {
    return request.get('/setting.json', params)
  }


   static createdKYC(params: KYCParams) {
    return request.post('/account/kyc.json', params)
  }
    static gettickers(params: TickersParams) {
    return request.getCripto('/api/tickers', params)
  }

  static getMarket(params: MarketParams) {
    return request.getCripto('/api/market', params)
  }

   static getOrderBook(params: OrderBookParams) {
    return request.getCripto('/api/orderbook', params)
  }
  
    static getCandle(params: CandleParams) {
    return request.getCripto('/api/candle', params)
  }

    static getFundFlow(params: FundFlowParams) {
    return request.getCripto('/api/fundflow', params)
  }

  
  
  static article(params: ArticleParams) {
    return request.post('/blog.json', params)
  }

   static createdAlert(params: AlertParams) {
    return request.post('/prices/alert.json', params)
  }

  static favorite(params: FavoriteParams) {
    return request.post('/markets/favorite.json', params)
  }

   static getProfile(params: ProfileParams) {
    return request.post('/account/profile.json', params)
  }

     static getBanner(params: BannerParams) {
    return request.post('/banners.json', params)
  }

       static getNotification(params: NotificationParams) {
    return request.post('/users/notifications.json', params)
  }
      static getWallets(params: WalletsParams) {
    return request.post('/wallet.json', params)
  }
    static getReferal(params: ReferalParams) {
    return request.post('/referral.json', params)
  }
   static getCommissions(params: ReferalParams) {
    return request.post('/referral/commissions.json', params)
  }

   static getInvitaions(params: ReferalParams) {
    return request.post('/referral/invitations.json', params)
  }

  static getTransfer(params: TransferParams) {
    return request.post('/transfer.json', params)
  }
  static postWithdraw(params: WithdrawParams) {
    return request.post('/withdraw.json', params)
  }

  static getDeposit(params: DepositParams) {
    return request.post('/deposit.json', params)
  }
   static getStakings(params: StakingsParams) {
    return request.post('/stakings.json', params)
  }
   static getStakingsDetil(params: StakingsDetilsParams) {
    return request.post('/staking.json', params)
  }

    static postStakingsSubscriptionParams(params: StakingsSubscriptionParams) {
    return request.post('/staking/subscription.json', params)
  }

  static getAirdrops(params: AirdropsParams) {
    return request.post('/airdrops.json', params)
  }
   static getAirdropsDetil(params: AirdropsDetilsParams) {
    return request.post('/airdrop.json', params)
  }
  
  static postAirdropsSubscription(params: AirdropsSubscriptionParams) {
    return request.post('/airdrop/subscription.json', params)
  }
   static postAirdropsSubscriptionDetil(params: AirdropsSubscriptionDetilParams) {
    return request.post('/airdrop/subscription_detail.json', params)
  }

   static getEvents(params: EventParams) {
    return request.post('/events.json', params)
  }
   static getSubscriptions(params: AirdropsParams) {
    return request.post('/airdrop/subscriptions.json', params)
  }
  
   static getProfitLoss(params: ProfitLossParams) {
    return request.post('/profit_loss.json', params)
  }

  static getDashboard(params: DashboardParams) {
    return request.post('/dashboard.json', params)
  }

  

  

  

  /**
   * 用户登出
   */
  static logout() {
    return request.post('/auth/logout')
  }

  /**
   * 刷新token
   * @param refreshToken 刷新token
   */
  static refreshToken(refreshToken: string) {
    return request.post<{ token: string; expiresIn: number }>('/auth/refresh', {
      refreshToken
    })
  }

  /**
   * 获取图片验证码
   */
  static getCaptcha() {
    return request.get<CaptchaResponse>('/auth/captcha')
  }

  /**
   * 发送短信验证码
   * @param params 短信验证码参数
   */
  static sendSmsCode(params: SmsCodeParams) {
    return request.post<SmsCodeResponse>('/auth/sms-code', params)
  }

  /**
   * 发送邮箱验证码
   * @param email 邮箱
   * @param type 验证码类型
   */
  static sendEmailCode(email: string, type: string) {
    return request.post<SmsCodeResponse>('/auth/email-code', { email, type })
  }

 

  /**
   * 重置资金密码
   * @param params 重置资金密码参数
   */
  static resetFundPassword(params: ResetFundPasswordParams) {
    return request.post('/auth/reset-fund-password', params)
  }

  /**
   * 社交账号登录
   * @param params 社交登录参数
   */
  static socialLogin(params: SocialLoginParams) {
    return request.post<SocialLoginResponse>('/auth/social-login', params)
  }

  /**
   * 验证邮箱
   * @param token 验证token
   */
  static verifyEmail(token: string) {
    return request.post('/auth/verify-email', { token })
  }

  /**
   * 绑定手机号
   * @param params 绑定参数
   */
  static bindPhone(params: { phone: string; code: string }) {
    return request.post('/auth/bind-phone', params)
  }

  /**
   * 绑定邮箱
   * @param params 绑定参数
   */
  static bindEmail(params: { email: string; code: string }) {
    return request.post('/auth/bind-email', params)
  }

  /**
   * 启用/禁用双因素认证
   * @param enabled 是否启用
   * @param secret 密钥（启用时需要）
   */
  static toggle2FA(enabled: boolean, secret?: string) {
    return request.post('/auth/2fa/toggle', { enabled, secret })
  }

  /**
   * 绑定2FA
   * @param params 绑定参数
   */
  static bind2FA(params: Bind2FAParams) {
    return request.post('/auth/2fa/bind', params)
  }

  /**
   * 解绑2FA
   * @param params 解绑参数
   */
  static unbind2FA(params: Unbind2FAParams) {
    return request.post('/auth/2fa/unbind', params)
  }

  /**
   * 验证双因素认证码
   * @param code 认证码
   */
  static verify2FA(code: string) {
    return request.post('/auth/2fa/verify', { code })
  }

  /**
   * 获取双因素认证二维码
   */
  static get2FAQRCode() {
    return request.get<{ qrCode: string; secret: string }>('/auth/2fa/qrcode')
  }

  /**
   * 终止所有会话
   */
  static terminateAllSessions() {
    return request.post('/auth/terminate-all-sessions')
  }
}

export default AuthAPI