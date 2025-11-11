/**
 * API集成测试
 * 测试API模块的集成和错误处理
 */
import { authApi, marketApi, userApi, apiUtils } from '@/api'
import { mockUniResponse, mockUniError } from '../setup'

// Mock request utility
jest.mock('@/utils/request', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}))

import request from '@/utils/request'
const mockRequest = request as jest.Mocked<typeof request>

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication API', () => {
    it('should handle successful login flow', async () => {
      const mockLoginResponse = {
        data: {
          token: 'jwt-token-123',
          userInfo: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
          },
          expiresIn: 86400
        }
      }

      mockRequest.post.mockResolvedValue(mockLoginResponse)

      const result = await authApi.login({
        phone: '13812345678',
        password: 'password123'
      })

      expect(mockRequest.post).toHaveBeenCalledWith('/auth/login', {
        phone: '13812345678',
        password: 'password123'
      })
      expect(result.data.token).toBe('jwt-token-123')
      expect(result.data.userInfo.username).toBe('testuser')
    })

    it('should handle login failure', async () => {
      mockRequest.post.mockRejectedValue(new Error('Invalid credentials'))

      await expect(authApi.login({
        phone: '13812345678',
        password: 'wrong-password'
      })).rejects.toThrow('Invalid credentials')
    })

    it('should handle registration with validation', async () => {
      mockRequest.post.mockResolvedValue({ data: { success: true } })

      const registerParams = {
        phone: '13812345678',
        smsCode: '123456',
        loginPassword: 'password123',
        confirmPassword: 'password123',
        fundPassword: 'fundpass123',
        captchaId: 'captcha-id',
        captchaCode: 'ABCD'
      }

      const result = await authApi.register(registerParams)

      expect(mockRequest.post).toHaveBeenCalledWith('/auth/register', registerParams)
      expect(result.data.success).toBe(true)
    })
  })

  describe('Market API', () => {
    it('should fetch all tickers', async () => {
      const mockTickers = [
        {
          symbol: 'BTCUSDT',
          price: '50000.00',
          changePercent: '2.5',
          volume: '1000000',
          high: '51000.00',
          low: '49000.00'
        },
        {
          symbol: 'ETHUSDT',
          price: '3000.00',
          changePercent: '-1.2',
          volume: '500000',
          high: '3100.00',
          low: '2900.00'
        }
      ]

      mockRequest.get.mockResolvedValue({ data: mockTickers })

      const result = await marketApi.getAllTickers()

      expect(mockRequest.get).toHaveBeenCalledWith('/api/market/ticker/24hr', undefined)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].symbol).toBe('BTCUSDT')
    })

    it('should fetch single ticker', async () => {
      const mockTicker = {
        symbol: 'BTCUSDT',
        price: '50000.00',
        changePercent: '2.5',
        volume: '1000000',
        high: '51000.00',
        low: '49000.00'
      }

      mockRequest.get.mockResolvedValue({ data: mockTicker })

      const result = await marketApi.getTicker('BTCUSDT')

      expect(mockRequest.get).toHaveBeenCalledWith('/api/market/ticker/24hr', { symbol: 'BTCUSDT' })
      expect(result.data.symbol).toBe('BTCUSDT')
    })

    it('should fetch klines data', async () => {
      const mockKlines = [
        {
          openTime: 1640995200000,
          open: '49000.00',
          high: '50000.00',
          low: '48000.00',
          close: '49500.00',
          volume: '100.5',
          closeTime: 1640995259999
        }
      ]

      mockRequest.get.mockResolvedValue({ data: mockKlines })

      const result = await marketApi.getKlines({
        symbol: 'BTCUSDT',
        interval: '1h',
        limit: 100
      })

      expect(mockRequest.get).toHaveBeenCalledWith('/api/market/klines', {
        symbol: 'BTCUSDT',
        interval: '1h',
        limit: 100
      })
      expect(result.data[0].symbol).toBeUndefined() // klines don't include symbol
    })
  })

  describe('User API', () => {
    it('should get user assets', async () => {
      const mockAssets = [
        {
          asset: 'BTC',
          free: '1.5',
          locked: '0.2',
          freeze: '0',
          withdrawing: '0',
          btcValue: '1.7',
          usdtValue: '85000.00'
        },
        {
          asset: 'USDT',
          free: '10000.00',
          locked: '500.00',
          freeze: '0',
          withdrawing: '0',
          btcValue: '0.2',
          usdtValue: '10500.00'
        }
      ]

      mockRequest.get.mockResolvedValue({ data: mockAssets })

      const result = await userApi.getAssets()

      expect(mockRequest.get).toHaveBeenCalledWith('/api/user/assets', undefined)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].asset).toBe('BTC')
    })

    it('should update user profile', async () => {
      const mockUpdatedProfile = {
        id: '1',
        username: 'newusername',
        email: 'test@example.com',
        avatar: 'new-avatar.jpg'
      }

      mockRequest.put.mockResolvedValue({ data: mockUpdatedProfile })

      const updateData = {
        username: 'newusername',
        avatar: 'new-avatar.jpg'
      }

      const result = await userApi.updateProfile(updateData)

      expect(mockRequest.put).toHaveBeenCalledWith('/api/user/profile', updateData)
      expect(result.data.username).toBe('newusername')
    })
  })

  describe('API Error Handling', () => {
    it('should handle network errors', () => {
      const networkError = {
        statusCode: 0,
        message: 'Network Error'
      }

      const result = apiUtils.handleError(networkError)

      expect(result.status).toBe(500) // fallback status
      expect(result.message).toBe('Network Error')
    })

    it('should handle HTTP status codes', () => {
      const errors = [
        { statusCode: 400, expected: '请求参数错误' },
        { statusCode: 401, expected: '未授权访问' },
        { statusCode: 403, expected: '禁止访问' },
        { statusCode: 404, expected: '请求资源不存在' },
        { statusCode: 500, expected: '服务器内部错误' }
      ]

      errors.forEach(({ statusCode, expected }) => {
        const error = { statusCode }
        const result = apiUtils.handleError(error)
        expect(result.message).toBe(expected)
      })
    })

    it('should retry failed requests', async () => {
      let attempt = 0
      const mockRequest = jest.fn(() => {
        attempt++
        if (attempt < 3) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve('success')
      })

      const result = await apiUtils.retryRequest(mockRequest, 3, 100)

      expect(result).toBe('success')
      expect(attempt).toBe(3)
    })

    it('should handle batch requests', async () => {
      const requests = [
        () => Promise.resolve('result1'),
        () => Promise.reject(new Error('error2')),
        () => Promise.resolve('result3')
      ]

      const results = await apiUtils.batchRequest(requests)

      expect(results).toHaveLength(3)
      expect(results[0]).toBe('result1')
      expect(results[1]).toBeInstanceOf(Error)
      expect(results[2]).toBe('result3')
    })

    it('should implement polling requests', async () => {
      let callCount = 0
      const mockRequest = jest.fn(() => {
        callCount++
        return Promise.resolve({ status: callCount < 3 ? 'pending' : 'complete' })
      })

      const result = await apiUtils.pollRequest(
        mockRequest,
        (data) => data.status === 'complete',
        10, // 10ms interval
        5   // max 5 attempts
      )

      expect(result.status).toBe('complete')
      expect(callCount).toBe(3)
    })
  })
})

describe('API Request Flow', () => {
  it('should handle complete user journey', async () => {
    // 1. Login
    const loginResponse = {
      data: {
        token: 'jwt-token-123',
        userInfo: { id: '1', username: 'testuser' }
      }
    }
    mockRequest.post.mockResolvedValueOnce(loginResponse)

    const loginResult = await authApi.login({
      phone: '13812345678',
      password: 'password123'
    })

    expect(loginResult.data.token).toBeDefined()

    // 2. Fetch user profile
    const profileResponse = {
      data: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        kycStatus: 'verified'
      }
    }
    mockRequest.get.mockResolvedValueOnce(profileResponse)

    const profileResult = await userApi.getProfile()
    expect(profileResult.data.kycStatus).toBe('verified')

    // 3. Fetch market data
    const marketResponse = {
      data: [{
        symbol: 'BTCUSDT',
        price: '50000.00'
      }]
    }
    mockRequest.get.mockResolvedValueOnce(marketResponse)

    const marketResult = await marketApi.getAllTickers()
    expect(marketResult.data[0].symbol).toBe('BTCUSDT')

    // 4. Logout
    mockRequest.post.mockResolvedValueOnce({ data: {} })

    await expect(authApi.logout()).resolves.not.toThrow()
  })
})
