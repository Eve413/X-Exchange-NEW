# AntiIifePlugin 修复说明

## 🔧 问题描述

App 端运行时出现白屏错误：
```
Uncaught SyntaxError: Cannot use import statement outside a module
```

编译日志显示：
```
[AntiIifePlugin] 检测到 iife/umd 格式，自动改为 es
```

## 🎯 根本原因

`AntiIifePlugin` 在**所有平台**都生效，把 App 端原本应该输出的 IIFE/单文件包强行改成了 ES 模块。

结果：
- **Weex 启动时**加载到带 `import` 的 ES 代码 → 直接报错
- **H5 正常**，因为浏览器支持 ES 模块

## ✅ 解决方案

### 1. 限制 AntiIifePlugin 只在 H5 端生效

```typescript
// AntiIifePlugin: 强制使用 ES 格式，防止 iife/umd 导致的问题（仅H5端）
function AntiIifePlugin(): Plugin {
  return {
    name: 'anti-iife',
    enforce: 'post',
    configResolved(r: any) {
      if (!isH5) return // ❗非 H5 平台不要改输出格式
      
      const out = r.build?.rollupOptions?.output
      const fix = (o: any) => {
        if (!o) return
        if (o.format === 'iife' || o.format === 'umd') {
          console.warn('[AntiIifePlugin] 检测到 iife/umd 格式，自动改为 es')
          o.format = 'es'
        }
        if (o.inlineDynamicImports) {
          console.warn('[AntiIifePlugin] 移除 inlineDynamicImports 以支持代码分割')
          delete o.inlineDynamicImports
        }
      }
      Array.isArray(out) ? out.forEach(fix) : fix(out as any)
    }
  }
}
```

### 2. 平台分支配置

```typescript
// 平台检测
const UNI = process.env.UNI_PLATFORM || ''       // 'h5' | 'app'/'app-plus' | 'mp-*'
const isH5  = UNI === 'h5'
const isApp = UNI.startsWith('app')              // app-plus 等
const isMp  = UNI.startsWith('mp')
```

## 🚀 修复效果

- ✅ **App 端**：保持 IIFE 格式，Weex 可以正常加载
- ✅ **H5 端**：保持 ES 模块格式，支持代码分割
- ✅ **小程序端**：保持默认格式，避免兼容性问题

## 📋 平台分支准则

### 1. manualChunks 配置
- **H5 端**：可以配置代码分割
- **App/小程序端**：禁用或排除核心包（vue/@dcloudio/pinia/vue-i18n）

### 2. 输出格式
- **H5 端**：ES 模块格式，支持动态导入
- **App/小程序端**：IIFE 格式，单文件包

### 3. 动态导入
- **所有平台**：统一使用 `import.meta.glob`
- **避免**：运行时拉取 .vue 或 .js 源文件

## 🔄 验证步骤

1. **清理缓存**：
   ```bash
   rmdir /s /q node_modules\.vite 2>nul
   rmdir /s /q unpackage\.vite 2>nul
   del /f /q vite.config.*.timestamp-*.mjs 2>nul
   ```

2. **重新运行到 App-Plus**

3. **检查日志**：
   - ❌ 不应该再看到：`[AntiIifePlugin] 检测到 iife/umd 格式，自动改为 es`
   - ✅ 应该看到：`[GuardManualChunks] 清除非H5平台的manualChunks配置`

4. **验证功能**：
   - App 端不再出现白屏
   - 不再出现 `Cannot use import statement outside a module` 错误

## 🎉 结果

现在 App 端编译和运行都应该正常了！

- **App 端**：使用 IIFE 格式，Weex 兼容
- **H5 端**：使用 ES 模块格式，性能优化
- **小程序端**：使用默认格式，稳定运行
