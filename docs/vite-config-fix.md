# Vite 配置修复说明

## 🔧 问题描述

App 端编译时出现错误：
```
"vue" cannot be included in manualChunks because it is resolved as an external module by the "external" option or plugins.
```

## 🎯 根本原因

在 App-Plus 打包里，`@dcloudio/vite-plugin-uni` 会把 `vue` 等核心依赖标记为 `external`。
在 `rollupOptions.output.manualChunks` 里又试图把 `vue` 拆分进 vendor，这两者冲突，导致报错。

H5 正常，是因为 H5 平台没有把 `vue` external 掉。

## ✅ 解决方案

### 1. 平台分支配置

```typescript
// 平台检测
const UNI = process.env.UNI_PLATFORM || ''       // 'h5' | 'app'/'app-plus' | 'mp-*'
const isH5  = UNI === 'h5'
const isApp = UNI.startsWith('app')              // app-plus 等
const isMp  = UNI.startsWith('mp')
```

### 2. 按平台设置 manualChunks

```typescript
rollupOptions: {
  // ✅ 只在 H5 做 vendor 拆分；App/小程序下完全不要设置 manualChunks
  output: isH5 ? {
    manualChunks(id: string) {
      if (!id.includes('node_modules')) return
      // ❗排除会被插件 external 的核心包，避免再次触发冲突
      if (/[\\/]node_modules[\\/](vue|@vue|pinia|vue-i18n|@dcloudio)[\\/]/.test(id)) return
      
      // 第三方库分包
      if (id.includes('@vueuse')) return 'ui-vendor'
      if (id.includes('dayjs')) return 'ui-vendor'
      if (id.includes('lodash')) return 'utils-vendor'
      
      return 'vendor'
    }
  } : undefined
}
```

### 3. 保险丝插件

```typescript
// GuardManualChunks: 防止非H5平台设置manualChunks导致冲突
function GuardManualChunks(): Plugin {
  return {
    name: 'guard-manual-chunks',
    enforce: 'post',
    configResolved(r: any) {
      const UNI = process.env.UNI_PLATFORM || ''
      if (UNI !== 'h5') {
        const out = r.build?.rollupOptions?.output
        const wipe = (o: any) => { 
          if (o && 'manualChunks' in o) {
            console.log('[GuardManualChunks] 清除非H5平台的manualChunks配置')
            delete o.manualChunks
          }
        }
        Array.isArray(out) ? out.forEach(wipe) : wipe(out)
      }
    }
  }
}
```

## 🚀 修复效果

- ✅ **App 端**：不再出现 `manualChunks` 冲突错误
- ✅ **H5 端**：保持代码分割优化
- ✅ **小程序端**：避免不必要的分包配置
- ✅ **未来防护**：保险丝插件防止误配置

## 📋 关键要点

1. **App-Plus/小程序**：不要设置 `manualChunks`（或至少不要碰 `vue/@vue/pinia/@dcloudio/vue-i18n` 等核心）

2. **H5**：可以做 vendor 拆分，但记得排除这些核心包，否则未来插件策略变化也容易再冲突

3. **缓存清理**：修复后需要清理缓存避免旧配置干扰

## 🔄 验证步骤

1. 清理缓存：
   ```bash
   rmdir /s /q node_modules\.vite 2>nul
   rmdir /s /q unpackage\.vite 2>nul
   del /f /q vite.config.*.timestamp-*.mjs 2>nul
   ```

2. 重新运行到 App-Plus

3. 检查日志中不再出现：
   ```
   "vue" cannot be included in manualChunks...
   ```

## 🎉 结果

现在 App 端编译应该不会再出现 `manualChunks` 冲突错误，同时保持了 H5 端的性能优化！
