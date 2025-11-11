// import { jwtDecode } from 'jwt-decode' // 临时注释，待安装依赖后启用
import { storage, STORAGE_KEYS } from './storage'

export interface TokenPayload {
  userId: string
  username: string
  exp: number
  iat: number
}

export class AuthUtils {
  /**
   * 检查token是否有效
   * @param token JWT token
   */
  static isTokenValid(token?: string): boolean {
    try {
      if (!token) return false
      
      // const payload = jwtDecode<TokenPayload>(token) // 临时注释
      const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload // 临时解决方案
      const currentTime = Date.now() / 1000
      
      return payload.exp > currentTime
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  /**
   * 获取token载荷信息
   * @param token JWT token
   */
  static getTokenPayload(token: string): TokenPayload | null {
    try {
      // return jwtDecode<TokenPayload>(token) // 临时注释
      return JSON.parse(atob(token.split('.')[1])) as TokenPayload // 临时解决方案
    } catch (error) {
      console.error('Token decode error:', error)
      return null
    }
  }

  /**
   * 检查用户是否已登录
   */
  static isLoggedIn(): boolean {
    const token = storage.getSync<string>(STORAGE_KEYS.TOKEN)
    return this.isTokenValid(token)
  }

  /**
   * 获取当前用户token
   */
  static getToken(): string | undefined {
    return storage.getSync<string>(STORAGE_KEYS.TOKEN)
  }

    static getUserInfo(): string | undefined {
    return storage.getSync<string>(STORAGE_KEYS.USER_INFO)
  }

  /**
   * 保存用户token
   * @param token JWT token
   */
  static saveToken(token: string): boolean {
    return storage.setSync(STORAGE_KEYS.TOKEN, token)
  }

   static saveTokenLogin(token: string): boolean {
    return storage.setSync(STORAGE_KEYS.TOKEN_LOGIN, token)
  }

  /**
   * 清除用户token
   */
  static clearToken(): boolean {
    return storage.removeSync(STORAGE_KEYS.TOKEN)
  }

  /**
   * 获取token剩余有效时间（秒）
   * @param token JWT token
   */
  static getTokenRemainingTime(token?: string): number {
    try {
      const currentToken = token || this.getToken()
      if (!currentToken) return 0
      
      const payload = this.getTokenPayload(currentToken)
      if (!payload) return 0
      
      const currentTime = Date.now() / 1000
      return Math.max(0, payload.exp - currentTime)
    } catch (error) {
      return 0
    }
  }

  /**
   * 检查是否需要刷新token（剩余时间少于30分钟）
   * @param token JWT token
   */
  static shouldRefreshToken(token?: string): boolean {
    const remainingTime = this.getTokenRemainingTime(token)
    return remainingTime > 0 && remainingTime < 30 * 60 // 30分钟
  }

  /**
   * 权限检查
   * @param requiredPermissions 需要的权限列表
   * @param userPermissions 用户拥有的权限列表
   */
  static hasPermission(
    requiredPermissions: string[],
    userPermissions: string[]
  ): boolean {
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
  }

  /**
   * 检查用户角色
   * @param requiredRoles 需要的角色列表
   * @param userRoles 用户拥有的角色列表
   */
  static hasRole(
    requiredRoles: string[],
    userRoles: string[]
  ): boolean {
    return requiredRoles.some(role => userRoles.includes(role))
  }

  /**
   * 生成随机字符串（用于state参数等）
   * @param length 字符串长度
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * 密码强度检查
   * @param password 密码
   */
  static checkPasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('密码至少需要8位字符')
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('需要包含小写字母')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('需要包含大写字母')
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('需要包含数字')
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('需要包含特殊字符')
    }

    return { score, feedback }
  }
}

export default AuthUtils 