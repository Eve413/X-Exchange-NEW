<!--
  图片懒加载组件
  支持占位图、加载状态、错误处理等功能，优化图片加载性能
-->
<template>
    <view class="lazy-image" :class="[
      `lazy-image-${shape}`,
      { loading: isLoading, error: hasError, loaded: isLoaded }
    ]" :style="containerStyle">
        <!-- 实际图片 -->
        <image v-if="shouldLoad" class="lazy-image__img" :src="currentSrc" :mode="mode" :webp="enableWebp"
            :lazy-load="false" :fade-show="fadeShow" :style="imageStyle" @load="onLoad" @error="onError" />

        <!-- 占位图 -->
        <view class="lazy-image__placeholder" :class="{ hidden: isLoaded }" v-if="showPlaceholder"
            :style="placeholderStyle">
            <image v-if="placeholder" class="placeholder-img" :src="placeholder" :mode="mode" :style="imageStyle" />
            <view v-else class="placeholder-default">
                <Icon v-if="placeholderIcon" :name="placeholderIcon" :size="iconSize" color="neutral" />
                <text v-if="placeholderText" class="placeholder-text">{{ placeholderText }}</text>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="lazy-image__loading" v-if="isLoading && showLoading">
            <Loading :size="loadingSize" />
        </view>

        <!-- 错误状态 -->
        <view class="lazy-image__error" v-if="hasError && showError" @tap="retry">
            <Icon :name="errorIcon" :size="iconSize" color="error" />
            <text class="error-text">{{ errorText }}</text>
            <text class="error-retry" v-if="allowRetry">{{ $t('common.retry') }}</text>
        </view>

        <!-- 蒙层内容 -->
        <view class="lazy-image__overlay" v-if="$slots.overlay">
            <slot name="overlay"></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '../ui/Icon.vue'
import Loading from './Loading.vue'

interface Props {
  // 图片地址
  src: string
  
  // 备用图片地址（数组按优先级排序）
  fallbackSrc?: string | string[]
  
  // 占位图
  placeholder?: string
  placeholderIcon?: string
  placeholderText?: string
  
  // 尺寸
  width?: number | string
  height?: number | string
  
  // 形状
  shape?: 'rectangle' | 'circle' | 'rounded'
  
  // 图片模式
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  
  // 懒加载配置
  lazy?: boolean
  threshold?: number  // 距离视口多少像素开始加载
  
  // 显示配置
  showPlaceholder?: boolean
  showLoading?: boolean
  showError?: boolean
  fadeShow?: boolean
  
  // WebP支持
  enableWebp?: boolean
  
  // 错误处理
  allowRetry?: boolean
  maxRetries?: number
  errorIcon?: string
  errorText?: string
  
  // 加载指示器大小
  loadingSize?: 'sm' | 'md' | 'lg'
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

interface Emits {
  (e: 'load', event: any): void
  (e: 'error', event: any): void
  (e: 'retry', attempt: number): void
}

const props = withDefaults(defineProps<Props>(), {
  shape: 'rectangle',
  mode: 'aspectFill',
  lazy: true,
  threshold: 100,
  showPlaceholder: true,
  showLoading: true,
  showError: true,
  fadeShow: true,
  enableWebp: true,
  allowRetry: true,
  maxRetries: 3,
  errorIcon: 'image',
  errorText: '图片加载失败',
  loadingSize: 'md',
  iconSize: 'lg'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// 状态
const isLoading = ref(false)
const hasError = ref(false)
const isLoaded = ref(false)
const shouldLoad = ref(!props.lazy)
const retryCount = ref(0)
const currentSrc = ref(props.src)
const intersectionObserver = ref<any>(null)
const imageElement = ref<any>(null)

// 计算属性
const containerStyle = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.width !== undefined) {
    style.width = typeof props.width === 'number' ? props.width + 'px' : props.width
  }
  
  if (props.height !== undefined) {
    style.height = typeof props.height === 'number' ? props.height + 'px' : props.height
  }
  
  return style
})

const imageStyle = computed(() => ({
  width: '100%',
  height: '100%'
}))

const placeholderStyle = computed(() => ({
  ...imageStyle.value,
  opacity: isLoaded.value ? 0 : 1,
  transition: props.fadeShow ? 'opacity 0.3s ease' : 'none'
}))

// 方法
const startLoading = () => {
  if (shouldLoad.value && !isLoading.value && !isLoaded.value && !hasError.value) {
    isLoading.value = true
    hasError.value = false
  }
}

const onLoad = (event: any) => {
  isLoading.value = false
  hasError.value = false
  isLoaded.value = true
  retryCount.value = 0
  
  emit('load', event)
}

const onError = (event: any) => {
  isLoading.value = false
  isLoaded.value = false
  
  // 尝试使用备用图片
  if (tryFallback()) {
    return
  }
  
  hasError.value = true
  emit('error', event)
}

const tryFallback = (): boolean => {
  if (!props.fallbackSrc) return false
  
  const fallbacks = Array.isArray(props.fallbackSrc) ? props.fallbackSrc : [props.fallbackSrc]
  const currentIndex = fallbacks.indexOf(currentSrc.value)
  const nextIndex = currentIndex + 1
  
  if (nextIndex < fallbacks.length) {
    currentSrc.value = fallbacks[nextIndex]
    startLoading()
    return true
  }
  
  return false
}

const retry = () => {
  if (!props.allowRetry || retryCount.value >= props.maxRetries) {
    return
  }
  
  retryCount.value++
  hasError.value = false
  currentSrc.value = props.src
  
  startLoading()
  emit('retry', retryCount.value)
}

const setupIntersectionObserver = () => {
  if (!props.lazy) return
  
  try {
    intersectionObserver.value = uni.createIntersectionObserver(getCurrentInstance())
    
    intersectionObserver.value
      .rootMargin(`${props.threshold}px`)
      .observe('.lazy-image', (res: any) => {
        if (res.intersectionRatio > 0 && !shouldLoad.value) {
          shouldLoad.value = true
          startLoading()
          
          // 开始加载后就不再需要观察
          if (intersectionObserver.value) {
            intersectionObserver.value.disconnect()
          }
        }
      })
  } catch (error) {
    console.warn('Intersection Observer 不支持，回退到立即加载', error)
    shouldLoad.value = true
    startLoading()
  }
}

const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef H5
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
    // #endif
    
    // #ifndef H5
    uni.getImageInfo({
      src,
      success: () => resolve(true),
      fail: () => resolve(false)
    })
    // #endif
  })
}

// 生命周期
onMounted(() => {
  if (props.lazy) {
    setupIntersectionObserver()
  } else {
    startLoading()
  }
})

onUnmounted(() => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect()
  }
})

// 监听src变化
watch(() => props.src, (newSrc) => {
  if (newSrc !== currentSrc.value) {
    currentSrc.value = newSrc
    isLoaded.value = false
    hasError.value = false
    retryCount.value = 0
    
    if (shouldLoad.value) {
      startLoading()
    }
  }
})

// 暴露方法给父组件
defineExpose({
  retry,
  reload: () => {
    isLoaded.value = false
    hasError.value = false
    retryCount.value = 0
    currentSrc.value = props.src
    startLoading()
  },
  preload: () => preloadImage(currentSrc.value)
})
</script>

<style lang="scss" scoped>
.lazy-image {
    position: relative;
    display: inline-block;
    overflow: hidden;
    background: var(--theme-bg-secondary, $neutral-100);

    &.lazy-image-circle {
        border-radius: 50%;
    }

    &.lazy-image-rounded {
        border-radius: $border-radius-lg;
    }

    &.loading {
        .lazy-image__img {
            opacity: 0;
        }
    }

    &.loaded {
        .lazy-image__placeholder {
            opacity: 0;
            pointer-events: none;
        }
    }

    &.error {
        .lazy-image__img {
            display: none;
        }
    }
}

.lazy-image__img {
    position: relative;
    z-index: 2;
    transition: opacity 0.3s ease;
    opacity: 1;
}

.lazy-image__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transition: opacity 0.3s ease;

    &.hidden {
        opacity: 0;
        pointer-events: none;
    }
}

.placeholder-img {
    width: 100%;
    height: 100%;
    opacity: 0.8;
    filter: blur(2px);
}

.placeholder-default {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--theme-bg-tertiary, $neutral-200);

    .placeholder-text {
        margin-top: 16upx;
        font: $font-caption-medium;
        color: var(--theme-text-tertiary, $text-color-placeholder);
        text-align: center;
    }
}

.lazy-image__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}

.lazy-image__error {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--theme-bg-secondary, $neutral-100);
    cursor: pointer;

    .error-text {
        margin-top: 16upx;
        font: $font-caption-medium;
        color: var(--theme-error, $error-500);
        text-align: center;
    }

    .error-retry {
        margin-top: 8upx;
        font: $font-caption-medium;
        color: var(--theme-brand-primary, $primary-500);
        text-decoration: underline;
    }

    &:active {
        transform: scale(0.98);
    }
}

.lazy-image__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 4;
    pointer-events: none;

    >* {
        pointer-events: auto;
    }
}

// 深色主题适配
.theme-dark {
    .lazy-image {
        background: var(--theme-bg-tertiary, #2a2a2a);
    }

    .placeholder-default {
        background: var(--theme-bg-secondary, #1e1e1e);
    }

    .lazy-image__error {
        background: var(--theme-bg-secondary, #1e1e1e);
    }
}

// 骨架屏动画效果
@keyframes skeleton-loading {
    0% {
        background-position: -200px 0;
    }

    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.lazy-image.loading .placeholder-default {
    background: linear-gradient(90deg, var(--theme-bg-secondary, $neutral-200) 25%, var(--theme-bg-tertiary, $neutral-300) 50%, var(--theme-bg-secondary, $neutral-200) 75%);
    background-size: 200px 100%;
    animation: skeleton-loading 1.2s ease-in-out infinite;
}
</style>
