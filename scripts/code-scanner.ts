/**
 * 代码扫描脚本
 * 用于检测项目中的潜在问题
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface ScanResult {
  file: string
  line: number
  content: string
  type: 'addEventListener' | 'dynamicImport' | 'staticEsm' | 'windowUsage' | 'documentUsage'
}

export class CodeScanner {
  private results: ScanResult[] = []
  
  /**
   * 扫描指定目录
   */
  scanDirectory(dir: string, extensions: string[] = ['.ts', '.js', '.vue']): ScanResult[] {
    this.results = []
    this.scanRecursive(dir, extensions)
    return this.results
  }
  
  private scanRecursive(dir: string, extensions: string[]) {
    try {
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        
        if (stat.isDirectory()) {
          // 跳过 node_modules 和 .git 等目录
          if (!['node_modules', '.git', 'dist', 'unpackage'].includes(item)) {
            this.scanRecursive(fullPath, extensions)
          }
        } else if (stat.isFile()) {
          const ext = item.substring(item.lastIndexOf('.'))
          if (extensions.includes(ext)) {
            this.scanFile(fullPath)
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录 ${dir} 失败:`, error)
    }
  }
  
  private scanFile(filePath: string) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1
        const trimmedLine = line.trim()
        
        // 检查 addEventListener 使用
        if (this.containsAddEventListener(trimmedLine)) {
          this.results.push({
            file: filePath,
            line: lineNumber,
            content: trimmedLine,
            type: 'addEventListener'
          })
        }
        
        // 检查动态导入
        if (this.containsDynamicImport(trimmedLine)) {
          this.results.push({
            file: filePath,
            line: lineNumber,
            content: trimmedLine,
            type: 'dynamicImport'
          })
        }
        
        // 检查 window 使用
        if (this.containsWindowUsage(trimmedLine)) {
          this.results.push({
            file: filePath,
            line: lineNumber,
            content: trimmedLine,
            type: 'windowUsage'
          })
        }
        
        // 检查 document 使用
        if (this.containsDocumentUsage(trimmedLine)) {
          this.results.push({
            file: filePath,
            line: lineNumber,
            content: trimmedLine,
            type: 'documentUsage'
          })
        }
      })
    } catch (error) {
      console.error(`扫描文件 ${filePath} 失败:`, error)
    }
  }
  
  private containsAddEventListener(line: string): boolean {
    return /addEventListener\s*\(/.test(line) && 
           !line.includes('#ifdef') && 
           !line.includes('src/platform/')
  }
  
  private containsDynamicImport(line: string): boolean {
    return /import\(\s*["\'][^"\']+\.vue["\']\s*\)/.test(line)
  }
  
  private containsWindowUsage(line: string): boolean {
    return /window\./.test(line) && 
           !line.includes('#ifdef') && 
           !line.includes('src/platform/')
  }
  
  private containsDocumentUsage(line: string): boolean {
    return /document\./.test(line) && 
           !line.includes('#ifdef') && 
           !line.includes('src/platform/')
  }
  
  /**
   * 生成扫描报告
   */
  generateReport(): string {
    const report: string[] = []
    
    report.push('# 代码扫描报告')
    report.push('')
    
    const groupedResults = this.groupByType()
    
    for (const [type, results] of Object.entries(groupedResults)) {
      report.push(`## ${this.getTypeDescription(type)}`)
      report.push('')
      
      if (results.length === 0) {
        report.push('✅ 未发现问题')
      } else {
        report.push(`❌ 发现 ${results.length} 个问题:`)
        report.push('')
        
        results.forEach(result => {
          report.push(`- **${result.file}:${result.line}**`)
          report.push(`  \`${result.content}\``)
          report.push('')
        })
      }
      
      report.push('')
    }
    
    return report.join('\n')
  }
  
  private groupByType(): Record<string, ScanResult[]> {
    const grouped: Record<string, ScanResult[]> = {
      addEventListener: [],
      dynamicImport: [],
      staticEsm: [],
      windowUsage: [],
      documentUsage: []
    }
    
    this.results.forEach(result => {
      grouped[result.type].push(result)
    })
    
    return grouped
  }
  
  private getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      addEventListener: 'addEventListener 使用检查',
      dynamicImport: '动态导入检查',
      staticEsm: '静态资源 ESM 检查',
      windowUsage: 'window 对象使用检查',
      documentUsage: 'document 对象使用检查'
    }
    
    return descriptions[type] || type
  }
}

// 使用示例
if (require.main === module) {
  const scanner = new CodeScanner()
  const results = scanner.scanDirectory('.')
  const report = scanner.generateReport()
  
  console.log(report)
}
