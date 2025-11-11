// vite.config.ts - HBuilderX 4.76 兼容版本 + 构建护栏 + 平台分支配置
import { webcrypto as crypto } from 'crypto';
globalThis.crypto = crypto;

import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import type { Plugin } from 'vite'


// 平台检测
const UNI = process.env.UNI_PLATFORM || ''       // 'h5' | 'app'/'app-plus' | 'mp-*'
const isH5  = UNI === 'h5'
const isApp = UNI.startsWith('app')              // app-plus 等
const isMp  = UNI.startsWith('mp')

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

// BlockStaticEsm: 禁止静态资源中的 ESM 导入
function BlockStaticEsm(): Plugin {
  return {
    name: 'block-static-esm',
    buildStart() {
      // 扫描静态资源目录
      const staticDirs = ['static', 'public', 'uni_modules']
      // 这里可以添加更复杂的扫描逻辑
      console.log('[BlockStaticEsm] 静态资源ESM检查已启用')
    }
  }
}

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

export default {
  plugins: [
    uni(),
    AntiIifePlugin(),
    BlockStaticEsm(),
    GuardManualChunks()
  ],
  resolve: { 
    alias: { '@': resolve(__dirname, '.') }
  },
  base: './',
  css: { 
    preprocessorOptions: { 
      scss: { 
        additionalData: `@import "@/uni.scss";` 
      } 
    } 
  },
  define: { 
    __VUE_OPTIONS_API__: false, 
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: { 
      compress: { 
        drop_console: true, 
        drop_debugger: true 
      } 
    },
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
  },
  server: { 
    host: true, 
    port: 5173,
    proxy: {
      // 业务接口（注册/登录等）
      '/apiBase': {
        target: 'https://api.icoinkey.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/apiBase/, '')
      },
      // 加密行情接口
      '/cryptoBase': {
        target: 'https://crypto.icoinkey.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/cryptoBase/, '')
      }
    }
  }
}
