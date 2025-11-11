/**
 * Vue 全局类型补充
 */

import type { GlobalProperties } from '@/utils/global'

declare module 'vue' {
  interface ComponentCustomProperties extends GlobalProperties {
    // 这里可以添加其他全局属性的类型定义
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends GlobalProperties {
    // Vue 3 的全局属性类型扩展
  }
}

// 确保这个文件被当作模块处理
export { }

