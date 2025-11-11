/**
 * Intl polyfill for environments that don't support it (like some mini-programs)
 * 为不支持Intl的环境提供polyfill（如某些小程序环境）
 */

// 检查是否已存在Intl对象
if (typeof globalThis.Intl === 'undefined') {
  // 创建一个简单的Intl polyfill
  globalThis.Intl = {
    // 数字格式化polyfill
    NumberFormat: class NumberFormat {
      constructor(locales?: string | string[], options?: any) {
        this.locales = locales
        this.options = options || {}
      }
      
      format(number: number): string {
        if (typeof number !== 'number' || isNaN(number)) {
          return String(number)
        }
        
        // 简单的数字格式化
        if (this.options.style === 'currency') {
          const symbol = this.options.currency === 'USD' ? '$' : '¥'
          return `${symbol}${number.toFixed(2)}`
        }
        
        if (this.options.style === 'percent') {
          return `${(number * 100).toFixed(2)}%`
        }
        
        // 默认数字格式
        const minimumFractionDigits = this.options.minimumFractionDigits || 0
        const maximumFractionDigits = this.options.maximumFractionDigits || 3
        
        return number.toFixed(Math.max(minimumFractionDigits, 
          Math.min(maximumFractionDigits, 
            String(number).split('.')[1]?.length || 0)))
      }
      
      formatToParts(number: number): any[] {
        return [{ type: 'literal', value: this.format(number) }]
      }
    },
    
    // 日期时间格式化polyfill
    DateTimeFormat: class DateTimeFormat {
      constructor(locales?: string | string[], options?: any) {
        this.locales = locales
        this.options = options || {}
      }
      
      format(date: Date): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return String(date)
        }
        
        // 简单的日期格式化
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hour = String(date.getHours()).padStart(2, '0')
        const minute = String(date.getMinutes()).padStart(2, '0')
        const second = String(date.getSeconds()).padStart(2, '0')
        
        // 根据选项返回不同格式
        if (this.options.dateStyle === 'short' || this.options.timeStyle === undefined) {
          return `${year}-${month}-${day}`
        }
        
        if (this.options.timeStyle === 'short' || this.options.dateStyle === undefined) {
          return `${hour}:${minute}`
        }
        
        // 默认日期时间格式
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
      }
      
      formatToParts(date: Date): any[] {
        return [{ type: 'literal', value: this.format(date) }]
      }
    }
  } as any
}

// 导出类型声明
declare global {
  namespace globalThis {
    var Intl: typeof Intl
  }
}

export { }

