// import dayjs from 'dayjs' // 临时注释，待安装依赖后启用

/**
 * 数字格式化工具类
 */
export class NumberFormat {
  /**
   * 格式化价格显示
   * @param price 价格
   * @param precision 精度，默认2位小数
   * @param currency 货币符号
   */
  static formatPrice(price: number | string, precision: number = 2, currency: string = '¥'): string {
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return `${currency}0.00`
    
    return `${currency}${num.toFixed(precision)}`
  }

  /**
   * 格式化数量显示（加千分位分隔符）
   * @param num 数字
   * @param precision 精度
   */
  static formatNumber(num: number | string, precision?: number): string {
    const number = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(number)) return '0'
    
    const fixed = precision !== undefined ? number.toFixed(precision) : number.toString()
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /**
   * 格式化百分比
   * @param value 数值
   * @param precision 精度，默认2位小数
   */
  static formatPercent(value: number | string, precision: number = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0.00%'
    
    return `${(num * 100).toFixed(precision)}%`
  }

  /**
   * 格式化涨跌幅
   * @param change 涨跌幅
   * @param precision 精度
   */
  static formatChange(change: number | string, precision: number = 2): string {
    const num = typeof change === 'string' ? parseFloat(change) : change
    if (isNaN(num)) return '0.00%'
    
    const sign = num > 0 ? '+' : ''
    return `${sign}${this.formatPercent(num, precision)}`
  }

  /**
   * 格式化大数字（K, M, B）
   * @param num 数字
   * @param precision 精度
   */
  static formatLargeNumber(num: number | string, precision: number = 2): string {
    const number = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(number)) return '0'
    
    const abs = Math.abs(number)
    const sign = number < 0 ? '-' : ''
    
    if (abs >= 1e9) {
      return `${sign}${(abs / 1e9).toFixed(precision)}B`
    } else if (abs >= 1e6) {
      return `${sign}${(abs / 1e6).toFixed(precision)}M`
    } else if (abs >= 1e3) {
      return `${sign}${(abs / 1e3).toFixed(precision)}K`
    }
    
    return this.formatNumber(number, precision)
  }

  /**
   * 格式化交易量
   * @param volume 交易量
   * @param precision 精度
   */
  static formatVolume(volume: number | string, precision: number = 2): string {
    return this.formatLargeNumber(volume, precision)
  }
}

/**
 * 时间格式化工具类
 */
export class DateFormat {
  /**
   * 格式化日期
   * @param date 日期
   * @param format 格式字符串
   */
  static format(date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    // 临时使用原生 Date 替代 dayjs
    const d = new Date(date)
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-')
  }

  /**
   * 格式化相对时间
   * @param date 日期
   */
  static fromNow(date: Date | string | number): string {
    const now = new Date()
    const target = new Date(date)
    const diff = Math.floor((now.getTime() - target.getTime()) / 1000)

    if (diff < 60) {
      return '刚刚'
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}分钟前`
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}小时前`
    } else if (diff < 604800) {
      return `${Math.floor(diff / 86400)}天前`
    } else {
      return target.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    }
  }

  /**
   * 获取时间戳
   * @param date 日期
   */
  static getTimestamp(date?: Date | string | number): number {
    return new Date(date || Date.now()).getTime()
  }

  /**
   * 格式化交易时间
   * @param timestamp 时间戳
   */
  static formatTradeTime(timestamp: number | string): string {
    const date = new Date(timestamp)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + 
             date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('zh-CN') + ' ' + 
             date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }
}

/**
 * 字符串格式化工具类
 */
export class StringFormat {
  /**
   * 手机号脱敏
   * @param phone 手机号
   */
  static maskPhone(phone: string): string {
    if (!phone || phone.length < 11) return phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  /**
   * 邮箱脱敏
   * @param email 邮箱
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email
    const [username, domain] = email.split('@')
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '***'
      : username
    return `${maskedUsername}@${domain}`
  }

  /**
   * 银行卡号脱敏
   * @param cardNo 银行卡号
   */
  static maskCardNo(cardNo: string): string {
    if (!cardNo || cardNo.length < 8) return cardNo
    return cardNo.replace(/(\d{4})\d+(\d{4})/, '$1****$2')
  }

  /**
   * 截断字符串
   * @param str 字符串
   * @param length 最大长度
   * @param suffix 后缀
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str
    return str.substring(0, length - suffix.length) + suffix
  }

  /**
   * 首字母大写
   * @param str 字符串
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * 驼峰转短横线
   * @param str 驼峰字符串
   */
  static camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  }

  /**
   * 短横线转驼峰
   * @param str 短横线字符串
   */
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  }
}

/**
 * 验证工具类
 */
export class ValidationUtils {
  /**
   * 手机号验证
   * @param phone 手机号
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  /**
   * 邮箱验证
   * @param email 邮箱
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 身份证验证
   * @param idCard 身份证号
   */
  static isValidIdCard(idCard: string): boolean {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return idCardRegex.test(idCard)
  }

  /**
   * 密码强度验证
   * @param password 密码
   */
  static isStrongPassword(password: string): boolean {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongRegex.test(password)
  }

  /**
   * URL验证
   * @param url URL地址
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// ValidationUtils 已在类定义处导出，无需重复导出
