# 一劳永逸的多端兼容解决方案

## 🎯 解决方案概述

本方案通过**平台适配层**、**构建护栏**和**代码扫描**三个层面，彻底解决 UniApp 多端兼容性问题。

## 📁 项目结构

```
src/
├── platform/           # 平台适配层
│   ├── index.ts       # 统一导出
│   ├── viewport.ts    # 视口适配
│   ├── visibility.ts  # 页面可见性适配
│   ├── theme.ts       # 主题适配
│   └── example.ts     # 使用示例
├── utils/
│   └── polyfill.ts    # Polyfill 兜底
└── scripts/
    └── code-scanner.ts # 代码扫描工具
```

## 🚀 快速开始

### 1. 平台适配层使用

```typescript
// ✅ 正确：使用适配层
import { onResize, getSystemTheme, onVisible } from '@/platform'

// 视口适配
const unsubscribeResize = onResize(() => {
  console.log('窗口尺寸变化')
})

// 主题适配
const systemTheme = getSystemTheme()
const unsubscribeTheme = onThemeChange((theme) => {
  console.log('主题变化:', theme)
})

// 页面可见性适配
const unsubscribeVisible = onVisible({
  show: () => console.log('页面显示'),
  hide: () => console.log('页面隐藏')
})
```

### 2. 避免直接使用浏览器API

```typescript
// ❌ 错误：直接使用浏览器API
window.addEventListener('resize', callback)
document.addEventListener('visibilitychange', callback)
window.matchMedia('(prefers-color-scheme: dark)')

// ✅ 正确：使用适配层
import { onResize, onVisible, getSystemTheme } from '@/platform'
onResize(callback)
onVisible({ show: callback })
getSystemTheme()
```

## 🛡️ 构建护栏

### AntiIifePlugin
- 自动检测并修复 `iife/umd` 格式问题
- 强制使用 ES 模块格式

### BlockStaticEsm
- 检测静态资源中的 ESM 导入
- 防止 Weex 白屏问题

## 🔍 代码扫描

### 扫描命令

```bash
# 扫描 addEventListener 使用
npx ts-node scripts/code-scanner.ts

# 或使用 PowerShell（Windows）
Get-ChildItem -Recurse -Include *.ts,*.js,*.vue |
  Select-String -Pattern 'addEventListener\s*\(' |
  ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }
```

### 扫描结果处理

1. **addEventListener 使用**
   - 检查是否在条件编译块中
   - 检查是否使用了适配层

2. **动态导入问题**
   - 查找 `import('/path/to/file.vue')` 模式
   - 建议改为 `import.meta.glob`

3. **静态资源 ESM**
   - 检查 `/static`、`/public`、`/uni_modules` 下的 JS 文件
   - 确保没有顶层 `import` 语句

## 📋 常见问题对照表

| 症状 | 根因 | 正确做法 |
|------|------|----------|
| App 白屏：addEventListener of undefined | weex 无 window/document/matchMedia | 用 `src/platform/viewport.ts`、`src/platform/theme.ts`；或加 `#ifdef H5`；临时 polyfill 防炸 |
| H5 白屏：Failed to fetch dynamically imported module ... .vue | 变量路径/URL 直接 import .vue | 改 `import.meta.glob` |
| App 白屏：Cannot use import statement outside a module | /static 里的 .js 带 import 被原样拷贝 | 移进源码走打包；或换 UMD 版本；有 BlockStaticEsm 护栏 |
| 构建错：iife/umd 不支持 code-splitting | 输出 format 被设成 iife/umd | AntiIifePlugin 自动矫正 |
| i18n 日志刷屏 | 把整句当 key，或 messages 未加载 | 用短 key（hero.cta）；import.meta.glob 组织 /locales/*.json |

## 🔧 实施步骤

### 第一步：止血（立即生效）
```typescript
// main.ts 最顶端
import './utils/polyfill'
```

### 第二步：迁移现有代码
1. 查找项目中的 `addEventListener` 使用
2. 替换为适配层 API
3. 添加条件编译 `#ifdef H5` 保护

### 第三步：构建护栏
```typescript
// vite.config.ts
export default {
  plugins: [
    uni(),
    AntiIifePlugin(),
    BlockStaticEsm()
  ]
}
```

### 第四步：代码扫描
```bash
# 运行扫描脚本
npx ts-node scripts/code-scanner.ts

# 根据报告修复问题
```

## 📚 API 参考

### 视口适配 (viewport.ts)
- `onResize(callback)` - 监听窗口尺寸变化
- `getViewportSize()` - 获取窗口尺寸
- `getDevicePixelRatio()` - 获取设备像素比

### 页面可见性 (visibility.ts)
- `onVisible(callbacks)` - 监听页面显隐
- `isPageVisible()` - 检查页面是否可见
- `onFocus(callback)` - 监听页面焦点
- `onBlur(callback)` - 监听页面失焦

### 主题适配 (theme.ts)
- `getSystemTheme()` - 获取系统主题
- `onSystemThemeChange(callback)` - 监听系统主题变化
- `getAppTheme()` - 获取应用主题
- `setAppTheme(theme)` - 设置应用主题
- `getEffectiveTheme()` - 获取生效主题
- `onThemeChange(callback)` - 监听主题变化

### 平台检测
- `getPlatform()` - 获取当前平台
- `isH5()` - 是否为H5平台
- `isApp()` - 是否为App平台
- `isMiniProgram()` - 是否为小程序平台

## 🎉 效果

- ✅ **App 端不再白屏** - Polyfill 兜底 + 适配层保护
- ✅ **H5 端动态导入正常** - 构建护栏 + 代码扫描
- ✅ **多端 API 统一** - 适配层抽象
- ✅ **构建错误预防** - 自动检测和修复
- ✅ **代码质量提升** - 扫描工具持续监控

## 🔄 持续维护

1. **新功能开发**：优先使用适配层 API
2. **代码审查**：检查是否直接使用浏览器 API
3. **定期扫描**：运行扫描脚本检查问题
4. **适配层扩展**：根据需要添加新的适配 API

---

通过这套方案，您的 UniApp 项目将获得**一劳永逸**的多端兼容性保障！
