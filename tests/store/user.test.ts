/**
 * 用户状态管理测试
 */
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { authApi } from '@/api'
import { mockUniResponse, mockUniError } from '../setup'

// Mock API
jest.mock('@/api', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  }
}))

// Mock utils
jest.mock('@/utils/auth', () => ({
  AuthUtils: {
    isTokenValid: jest.fn(() => true),
    saveToken: jest.fn(),
    clearToken: jest.fn(),
    getToken: jest.fn(() => 'mock-token')
  }
}))

jest.mock('@/utils/storage', () => ({
  storage: {
    setSync: jest.fn(),
    getSync: jest.fn(() => null),
    removeSync: jest.fn()
  },
  STORAGE_KEYS: {
    USER_INFO: 'user_info',
    TOKEN: 'user_token'
  }
}))

describe('useUserStore', () => {
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.isLoggedIn).toBe(false)
      expect(userStore.loginLoading).toBe(false)
      expect(userStore.registerLoading).toBe(false)
    })
  })

  describe('computed properties', () => {
    it('should compute isKycApproved correctly', () => {
      expect(userStore.isKycApproved).toBe(false)

      userStore.setUserInfo({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        kycStatus: 'approved',
        level: 1,
        vipLevel: 0,
        balance: { available: 1000, frozen: 0, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })

      expect(userStore.isKycApproved).toBe(true)
    })

    it('should compute isVip correctly', () => {
      expect(userStore.isVip).toBe(false)

      userStore.setUserInfo({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        kycStatus: 'none',
        level: 1,
        vipLevel: 1,
        balance: { available: 1000, frozen: 0, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })

      expect(userStore.isVip).toBe(true)
    })

    it('should compute balance properties correctly', () => {
      expect(userStore.totalBalance).toBe(0)
      expect(userStore.availableBalance).toBe(0)

      userStore.setUserInfo({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        kycStatus: 'none',
        level: 1,
        vipLevel: 0,
        balance: { available: 800, frozen: 200, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })

      expect(userStore.totalBalance).toBe(1000)
      expect(userStore.availableBalance).toBe(800)
    })

    it('should compute displayName correctly', () => {
      expect(userStore.displayName).toBe('')

      userStore.setUserInfo({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        realName: 'Test User',
        kycStatus: 'none',
        level: 1,
        vipLevel: 0,
        balance: { available: 1000, frozen: 0, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })

      expect(userStore.displayName).toBe('Test User')

      // Test fallback to username
      userStore.setUserInfo({
        ...userStore.userInfo!,
        realName: undefined
      })

      expect(userStore.displayName).toBe('testuser')
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const mockLoginData = {
        token: 'new-token',
        userInfo: {
          id: '1',
          username: 'test',
          email: 'test@example.com',
          phone: '13812345678',
          avatar: ''
        }
      }

      ;(authApi.login as jest.Mock).mockResolvedValue({
        data: mockLoginData
      })

      const result = await userStore.login({
        phone: '13812345678',
        password: 'password123'
      })

      expect(result.success).toBe(true)
      expect(userStore.token).toBe('new-token')
      expect(userStore.userInfo).toEqual(mockLoginData.userInfo)
      expect(userStore.loginLoading).toBe(false)
    })

    it('should handle login failure', async () => {
      ;(authApi.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'))

      const result = await userStore.login({
        phone: '13812345678',
        password: 'wrong-password'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.loginLoading).toBe(false)
    })

    it('should handle invalid response format', async () => {
      ;(authApi.login as jest.Mock).mockResolvedValue({
        data: { token: null } // Invalid format
      })

      const result = await userStore.login({
        phone: '13812345678',
        password: 'password123'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('登录数据格式错误')
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      ;(authApi.register as jest.Mock).mockResolvedValue({
        data: { success: true }
      })

      const result = await userStore.register({
        phone: '13812345678',
        smsCode: '123456',
        loginPassword: 'password123',
        confirmPassword: 'password123',
        fundPassword: 'fundpass123',
        captchaId: 'captcha-id',
        captchaCode: 'ABCD'
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('注册成功')
      expect(userStore.registerLoading).toBe(false)
    })

    it('should handle password mismatch', async () => {
      const result = await userStore.register({
        phone: '13812345678',
        smsCode: '123456',
        loginPassword: 'password123',
        confirmPassword: 'different-password',
        fundPassword: 'fundpass123',
        captchaId: 'captcha-id',
        captchaCode: 'ABCD'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('两次输入的密码不一致')
      expect(authApi.register).not.toHaveBeenCalled()
    })

    it('should handle register failure', async () => {
      ;(authApi.register as jest.Mock).mockRejectedValue(new Error('Phone number already exists'))

      const result = await userStore.register({
        phone: '13812345678',
        smsCode: '123456',
        loginPassword: 'password123',
        confirmPassword: 'password123',
        fundPassword: 'fundpass123',
        captchaId: 'captcha-id',
        captchaCode: 'ABCD'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Phone number already exists')
      expect(userStore.registerLoading).toBe(false)
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      // Set up logged in state
      userStore.setToken('test-token')
      userStore.setUserInfo({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        kycStatus: 'none',
        level: 1,
        vipLevel: 0,
        balance: { available: 1000, frozen: 0, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })
    })

    it('should logout successfully', async () => {
      ;(authApi.logout as jest.Mock).mockResolvedValue({})

      await userStore.logout()

      expect(authApi.logout).toHaveBeenCalled()
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.isLoggedIn).toBe(false)
      expect(uni.reLaunch).toHaveBeenCalledWith({ url: '/pages/auth/login' })
    })

    it('should clear local data even if API fails', async () => {
      ;(authApi.logout as jest.Mock).mockRejectedValue(new Error('Network error'))

      await userStore.logout()

      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.isLoggedIn).toBe(false)
      expect(uni.reLaunch).toHaveBeenCalledWith({ url: '/pages/auth/login' })
    })
  })

  describe('updateProfile', () => {
    beforeEach(() => {
      userStore.setUserInfo({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        phone: '13812345678',
        avatar: '',
        kycStatus: 'none',
        level: 1,
        vipLevel: 0,
        balance: { available: 1000, frozen: 0, total: 1000 },
        permissions: [],
        roles: [],
        createTime: '2024-01-01',
        lastLoginTime: '2024-01-01'
      })
    })

    it('should update profile successfully', async () => {
      const updatedData = {
        username: 'newname',
        avatar: 'new-avatar.jpg'
      }

      const mockUserApi = {
        updateProfile: jest.fn().mockResolvedValue({
          data: { ...userStore.userInfo, ...updatedData }
        })
      }

      // Mock the user API for this test
      jest.doMock('@/api', () => ({
        authApi: {
          login: jest.fn(),
          register: jest.fn(),
          logout: jest.fn()
        },
        userApi: mockUserApi
      }))

      const result = await userStore.updateProfile(updatedData)

      expect(result.success).toBe(true)
      expect(userStore.userInfo!.username).toBe('newname')
      expect(userStore.userInfo!.avatar).toBe('new-avatar.jpg')
    })
  })
})
