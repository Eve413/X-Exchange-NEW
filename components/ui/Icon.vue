<template>
  <view 
    class="iconoir-icon"
    :class="[
      `size-${size}`,
      `color-${color}`,
      { clickable: clickable }
    ]"
    :style="iconStyle"
    @tap="handleClick"
  >
    <text 
      v-if="!svgContent" 
      class="icon-text"
      :style="{ fontSize: iconSize + 'upx' }"
    >
      {{ iconFallback }}
    </text>
    <view 
      v-else 
      class="icon-svg"
      v-html="svgContent"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  name: string // iconoir图标名称
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'neutral' | 'inverse' | string
  clickable?: boolean
  customSize?: number // 自定义尺寸 (upx)
}

interface Emits {
  (e: 'click', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'neutral',
  clickable: false
})

const emit = defineEmits<Emits>()

const svgContent = ref<string>('')
const isLoading = ref(false)

// 图标尺寸映射
const sizeMap = {
  'xs': 32,
  'sm': 40,
  'md': 48,
  'lg': 56,
  'xl': 64,
  '2xl': 80
}

// 计算图标尺寸
const iconSize = computed(() => {
  return props.customSize || sizeMap[props.size]
})

// 图标样式
const iconStyle = computed(() => {
  const styles: Record<string, any> = {
    width: iconSize.value + 'upx',
    height: iconSize.value + 'upx',
  }
  
  // 如果是自定义颜色（hex值）
  if (props.color.startsWith('#')) {
    styles.color = props.color
  }
  
  return styles
})

// 图标后备显示（当SVG加载失败时）
const iconFallback = computed(() => {
  // 根据图标名称提供简单的后备图标
  const fallbackMap: Record<string, string> = {
    'home': '🏠',
    'user': '👤',
    'settings': '⚙️',
    'search': '🔍',
    'heart': '❤️',
    'star': '⭐',
    'bell': '🔔',
    'mail': '📧',
    'phone': '📞',
    'camera': '📷',
    'image': '🖼️',
    'play': '▶️',
    'pause': '⏸️',
    'stop': '⏹️',
    'arrow-up': '↑',
    'arrow-down': '↓',
    'arrow-left': '←',
    'arrow-right': '→',
    'check': '✓',
    'close': '✕',
    'plus': '+',
    'minus': '-',
    'edit': '✏️',
    'delete': '🗑️',
    'download': '⬇️',
    'upload': '⬆️',
    'share': '📤',
    'link': '🔗',
    'lock': '🔒',
    'unlock': '🔓',
    'eye': '👁️',
    'eye-off': '🙈',
    'calendar': '📅',
    'clock': '⏰',
    'location': '📍',
    'globe': '🌐',
    'wifi': '📶',
    'bluetooth': '📶',
    'battery': '🔋',
    'flash': '⚡',
    'sun': '☀️',
    'moon': '🌙',
    'cloud': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'fire': '🔥',
    'tree': '🌳',
    'flower': '🌸',
    'car': '🚗',
    'plane': '✈️',
    'train': '🚄',
    'ship': '🚢',
    'bike': '🚴',
    'walk': '🚶',
    'run': '🏃',
    'music': '🎵',
    'video': '🎬',
    'game': '🎮',
    'book': '📚',
    'newspaper': '📰',
    'shopping-cart': '🛒',
    'gift': '🎁',
    'trophy': '🏆',
    'medal': '🏅',
    'flag': '🚩'
  }
  
  return fallbackMap[props.name] || '◯'
})

// 加载iconoir图标
const loadIconoir = async (iconName: string) => {
  try {
    isLoading.value = true
    
    // 从iconoir CDN或本地加载SVG
    // 由于uniapp环境限制，这里使用简化的方式
    // 在实际项目中，建议预先下载常用图标到本地
    
    const iconUrl = `https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@main/icons/${iconName}.svg`
    
    // 在H5环境下可以使用fetch
    // #ifdef H5
    const response = await fetch(iconUrl)
    if (response.ok) {
      const svg = await response.text()
      // 调整SVG样式以适应当前主题
      const styledSvg = svg
        .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)
        .replace(/fill="[^"]*"/g, `fill="currentColor"`)
        .replace(/width="[^"]*"/g, `width="${iconSize.value}upx"`)
        .replace(/height="[^"]*"/g, `height="${iconSize.value}upx"`)
      
      svgContent.value = styledSvg
    }
    // #endif

    // 在 App 端使用 uni.request 拉取 SVG 文本
    // #ifndef H5
    await new Promise<void>((resolve) => {
      uni.request({
        url: iconUrl,
        method: 'GET',
        timeout: 5000,
        responseType: 'text',
        success: (res) => {
          const svg = (res.data || '') as string
          if (svg && typeof svg === 'string') {
            const styledSvg = svg
              .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)
              .replace(/fill="[^"]*"/g, `fill="currentColor"`)
              .replace(/width="[^"]*"/g, `width="${iconSize.value}upx"`)
              .replace(/height="[^"]*"/g, `height="${iconSize.value}upx"`)
            svgContent.value = styledSvg
          }
          resolve()
        },
        fail: (err) => {
          console.warn(`Failed to load iconoir icon (App): ${iconName}`, err)
          resolve()
        }
      })
    })
    // #endif
  } catch (error) {
    console.warn(`Failed to load iconoir icon: ${iconName}`, error)
    // 使用后备图标
  } finally {
    isLoading.value = false
  }
}

const handleClick = (event: Event) => {
  if (props.clickable) {
    emit('click', event)
  }
}

onMounted(() => {
  if (props.name) {
    loadIconoir(props.name)
  }
})
</script>

<style lang="scss" scoped>
.iconoir-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &.clickable {
    cursor: pointer;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.icon-text {
  line-height: 1;
  display: block;
  text-align: center;
}

.icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  
  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// 颜色样式
.color-primary {
  color: $primary-500;
}

.color-success {
  color: $success-500;
}

.color-error {
  color: $error-500;
}

.color-warning {
  color: $warning-500;
}

.color-neutral {
  color: $neutral-600;
}

.color-inverse {
  color: #ffffff;
}

// 尺寸样式已通过内联样式处理
</style>
