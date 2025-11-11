/**
 * 格式化工具类测试
 */
import { NumberFormat, DateFormat, StringFormat, ValidationUtils } from '@/utils/format'

describe('NumberFormat', () => {
  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(NumberFormat.formatPrice(123.456)).toBe('¥123.46')
      expect(NumberFormat.formatPrice('123.456')).toBe('¥123.46')
      expect(NumberFormat.formatPrice(0)).toBe('¥0.00')
    })

    it('should format price with custom currency', () => {
      expect(NumberFormat.formatPrice(123.456, 2, '$')).toBe('$123.46')
      expect(NumberFormat.formatPrice(123.456, 4, 'USDT')).toBe('USDT123.4560')
    })

    it('should handle invalid input', () => {
      expect(NumberFormat.formatPrice('invalid')).toBe('¥0.00')
      expect(NumberFormat.formatPrice(NaN)).toBe('¥0.00')
    })
  })

  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      expect(NumberFormat.formatNumber(1234567)).toBe('1,234,567')
      expect(NumberFormat.formatNumber(1234567.89, 2)).toBe('1,234,567.89')
      expect(NumberFormat.formatNumber(123)).toBe('123')
    })

    it('should handle string input', () => {
      expect(NumberFormat.formatNumber('1234567')).toBe('1,234,567')
      expect(NumberFormat.formatNumber('invalid')).toBe('0')
    })
  })

  describe('formatPercent', () => {
    it('should format percentage', () => {
      expect(NumberFormat.formatPercent(0.1234)).toBe('12.34%')
      expect(NumberFormat.formatPercent(0.1234, 4)).toBe('12.3400%')
      expect(NumberFormat.formatPercent(1.5)).toBe('150.00%')
    })

    it('should handle string input', () => {
      expect(NumberFormat.formatPercent('0.1234')).toBe('12.34%')
      expect(NumberFormat.formatPercent('invalid')).toBe('0.00%')
    })
  })

  describe('formatChange', () => {
    it('should format change with sign', () => {
      expect(NumberFormat.formatChange(0.0567)).toBe('+5.67%')
      expect(NumberFormat.formatChange(-0.0234)).toBe('-2.34%')
      expect(NumberFormat.formatChange(0)).toBe('0.00%')
    })
  })

  describe('formatLargeNumber', () => {
    it('should format large numbers with units', () => {
      expect(NumberFormat.formatLargeNumber(1234567890)).toBe('1.23B')
      expect(NumberFormat.formatLargeNumber(1234567)).toBe('1.23M')
      expect(NumberFormat.formatLargeNumber(1234)).toBe('1.23K')
      expect(NumberFormat.formatLargeNumber(123)).toBe('123')
    })

    it('should handle negative numbers', () => {
      expect(NumberFormat.formatLargeNumber(-1234567890)).toBe('-1.23B')
    })
  })
})

describe('StringFormat', () => {
  describe('maskPhone', () => {
    it('should mask phone number', () => {
      expect(StringFormat.maskPhone('13812345678')).toBe('138****5678')
      expect(StringFormat.maskPhone('123')).toBe('123') // too short
    })
  })

  describe('maskEmail', () => {
    it('should mask email address', () => {
      expect(StringFormat.maskEmail('test@example.com')).toBe('te***@example.com')
      expect(StringFormat.maskEmail('a@b.com')).toBe('a@b.com') // too short
    })

    it('should handle invalid email', () => {
      expect(StringFormat.maskEmail('invalid')).toBe('invalid')
    })
  })

  describe('maskCardNo', () => {
    it('should mask card number', () => {
      expect(StringFormat.maskCardNo('1234567890123456')).toBe('1234****3456')
      expect(StringFormat.maskCardNo('123')).toBe('123') // too short
    })
  })

  describe('truncate', () => {
    it('should truncate string', () => {
      expect(StringFormat.truncate('Hello World', 8)).toBe('Hello...')
      expect(StringFormat.truncate('Hello', 10)).toBe('Hello')
      expect(StringFormat.truncate('Hello World', 8, '***')).toBe('Hello***')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(StringFormat.capitalize('hello')).toBe('Hello')
      expect(StringFormat.capitalize('HELLO')).toBe('HELLO')
      expect(StringFormat.capitalize('')).toBe('')
    })
  })

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(StringFormat.camelToKebab('helloWorld')).toBe('hello-world')
      expect(StringFormat.camelToKebab('XMLParser')).toBe('x-m-l-parser')
    })
  })

  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(StringFormat.kebabToCamel('hello-world')).toBe('helloWorld')
      expect(StringFormat.kebabToCamel('api-key-list')).toBe('apiKeyList')
    })
  })
})

describe('ValidationUtils', () => {
  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(ValidationUtils.isValidPhone('13812345678')).toBe(true)
      expect(ValidationUtils.isValidPhone('15987654321')).toBe(true)
      expect(ValidationUtils.isValidPhone('12345678901')).toBe(false) // starts with 1 but invalid second digit
      expect(ValidationUtils.isValidPhone('1381234567')).toBe(false) // too short
      expect(ValidationUtils.isValidPhone('138123456789')).toBe(false) // too long
    })
  })

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true)
      expect(ValidationUtils.isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
      expect(ValidationUtils.isValidEmail('invalid.email')).toBe(false)
      expect(ValidationUtils.isValidEmail('@example.com')).toBe(false)
      expect(ValidationUtils.isValidEmail('test@')).toBe(false)
    })
  })

  describe('isValidIdCard', () => {
    it('should validate ID card numbers', () => {
      expect(ValidationUtils.isValidIdCard('123456789012345678')).toBe(true) // 18 digits
      expect(ValidationUtils.isValidIdCard('12345678901234567X')).toBe(true) // 17 digits + X
      expect(ValidationUtils.isValidIdCard('123456789012345')).toBe(true) // 15 digits
      expect(ValidationUtils.isValidIdCard('1234567890')).toBe(false) // too short
      expect(ValidationUtils.isValidIdCard('12345678901234567890')).toBe(false) // too long
    })
  })

  describe('isStrongPassword', () => {
    it('should validate password strength', () => {
      expect(ValidationUtils.isStrongPassword('StrongP@ss1')).toBe(true)
      expect(ValidationUtils.isStrongPassword('Aa1@1234')).toBe(true)
      expect(ValidationUtils.isStrongPassword('password')).toBe(false) // no uppercase, digit, special char
      expect(ValidationUtils.isStrongPassword('Password1')).toBe(false) // no special char
      expect(ValidationUtils.isStrongPassword('Pass@1')).toBe(false) // too short
    })
  })

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(ValidationUtils.isValidUrl('https://example.com')).toBe(true)
      expect(ValidationUtils.isValidUrl('http://localhost:3000')).toBe(true)
      expect(ValidationUtils.isValidUrl('ftp://files.example.com')).toBe(true)
      expect(ValidationUtils.isValidUrl('invalid-url')).toBe(false)
      expect(ValidationUtils.isValidUrl('')).toBe(false)
    })
  })
})

describe('DateFormat', () => {
  beforeAll(() => {
    // 固定时间以便测试
    jest.setSystemTime(new Date('2024-01-15 12:30:45'))
  })

  describe('format', () => {
    it('should format date', () => {
      const date = new Date('2024-01-15 12:30:45')
      const formatted = DateFormat.format(date)
      expect(formatted).toMatch(/2024-01-15/)
    })
  })

  describe('fromNow', () => {
    it('should format relative time', () => {
      const now = Date.now()
      expect(DateFormat.fromNow(now - 30000)).toBe('刚刚') // 30 seconds ago
      expect(DateFormat.fromNow(now - 120000)).toBe('2分钟前') // 2 minutes ago
      expect(DateFormat.fromNow(now - 7200000)).toBe('2小时前') // 2 hours ago
      expect(DateFormat.fromNow(now - 172800000)).toBe('2天前') // 2 days ago
    })
  })

  describe('getTimestamp', () => {
    it('should get timestamp', () => {
      expect(typeof DateFormat.getTimestamp()).toBe('number')
      expect(DateFormat.getTimestamp(new Date('2024-01-15'))).toBe(1705276800000)
    })
  })
})
