import request from '@/utils/request'

export interface UserProfile {
  uid: string
  email: string
  phone?: string
  nickname?: string
  avatar?: string
  level: number
  isVip: boolean
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected'
  createTime: number
  lastLoginTime: number
}

export interface AssetInfo {
  asset: string
  free: string
  locked: string
  freeze: string
  withdrawing: string
  btcValue: string
  usdtValue: string
}

export interface DepositAddress {
  asset: string
  address: string
  tag?: string
  network: string
}

export interface WithdrawRequest {
  asset: string
  address: string
  amount: string
  network?: string
  addressTag?: string
  name?: string
}

export interface TransferRequest {
  asset: string
  amount: string
  fromAccountType: 'SPOT' | 'FUTURES' | 'MARGIN'
  toAccountType: 'SPOT' | 'FUTURES' | 'MARGIN'
}

/**
 * 用户API服务
 */
export const userApi = {
  /**
   * 获取用户信息
   */
  getProfile: () => {
    return request<UserProfile>({
      url: '/api/user/profile',
      method: 'GET'
    })
  },

  /**
   * 更新用户信息
   */
  updateProfile: (data: Partial<UserProfile>) => {
    return request<UserProfile>({
      url: '/api/user/profile',
      method: 'PUT',
      data
    })
  },

  /**
   * 上传头像
   */
  uploadAvatar: (file: any) => {
    return request<{ avatar: string }>({
      url: '/api/user/avatar',
      method: 'POST',
      data: file,
      header: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 获取资产信息
   */
  getAssets: () => {
    return request<AssetInfo[]>({
      url: '/api/user/assets',
      method: 'GET'
    })
  },

  /**
   * 获取充值地址
   */
  getDepositAddress: (asset: string, network?: string) => {
    return request<DepositAddress>({
      url: '/api/user/deposit/address',
      method: 'GET',
      data: { asset, network }
    })
  },

  /**
   * 获取充值历史
   */
  getDepositHistory: (params?: {
    asset?: string
    status?: number
    startTime?: number
    endTime?: number
    offset?: number
    limit?: number
  }) => {
    return request<{
      list: Array<{
        id: string
        amount: string
        asset: string
        address: string
        addressTag?: string
        txId: string
        insertTime: number
        network: string
        status: number
        confirmTimes: string
      }>
      total: number
    }>({
      url: '/api/user/deposit/history',
      method: 'GET',
      data: params
    })
  },

  /**
   * 提现
   */
  withdraw: (data: WithdrawRequest) => {
    return request<{ id: string }>({
      url: '/api/user/withdraw',
      method: 'POST',
      data
    })
  },

  /**
   * 获取提现历史
   */
  getWithdrawHistory: (params?: {
    asset?: string
    withdrawOrderId?: string
    status?: number
    startTime?: number
    endTime?: number
    offset?: number
    limit?: number
  }) => {
    return request<{
      list: Array<{
        id: string
        amount: string
        transactionFee: string
        asset: string
        address: string
        addressTag?: string
        txId: string
        applyTime: number
        network: string
        status: number
      }>
      total: number
    }>({
      url: '/api/user/withdraw/history',
      method: 'GET',
      data: params
    })
  },

  /**
   * 资产划转
   */
  transfer: (data: TransferRequest) => {
    return request<{ tranId: number }>({
      url: '/api/user/transfer',
      method: 'POST',
      data
    })
  },

  /**
   * 获取划转历史
   */
  getTransferHistory: (params?: {
    type: 'MAIN_C2C' | 'MAIN_UMFUTURE' | 'MAIN_CMFUTURE' | 'MAIN_MARGIN' | 'MAIN_MINING'
    startTime?: number
    endTime?: number
    current?: number
    size?: number
  }) => {
    return request<{
      rows: Array<{
        asset: string
        amount: string
        type: string
        status: string
        tranId: number
        timestamp: number
      }>
      total: number
    }>({
      url: '/api/user/transfer/history',
      method: 'GET',
      data: params
    })
  },

  /**
   * 修改密码
   */
  changePassword: (data: {
    oldPassword: string
    newPassword: string
  }) => {
    return request<{}>({
      url: '/api/user/password',
      method: 'PUT',
      data
    })
  },

  /**
   * 获取API密钥列表
   */
  getApiKeys: () => {
    return request<Array<{
      id: string
      label: string
      apiKey: string
      permissions: string[]
      ipRestrict: string[]
      createTime: number
      status: 'active' | 'disabled'
    }>>({
      url: '/api/user/api-keys',
      method: 'GET'
    })
  },

  /**
   * 创建API密钥
   */
  createApiKey: (data: {
    label: string
    permissions: string[]
    ipRestrict?: string[]
  }) => {
    return request<{
      id: string
      apiKey: string
      secretKey: string
    }>({
      url: '/api/user/api-keys',
      method: 'POST',
      data
    })
  },

  /**
   * 删除API密钥
   */
  deleteApiKey: (id: string) => {
    return request<{}>({
      url: `/api/user/api-keys/${id}`,
      method: 'DELETE'
    })
  }
}

export default userApi
