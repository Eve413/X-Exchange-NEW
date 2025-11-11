<!--
  虚拟滚动列表组件
  用于大量数据的高性能渲染，适用于交易记录、行情列表等场景
-->
<template>
    <scroll-view class="virtual-list" :class="{ horizontal: direction === 'horizontal' }"
        :scroll-y="direction === 'vertical'" :scroll-x="direction === 'horizontal'" :scroll-top="scrollTop"
        :scroll-left="scrollLeft" :style="containerStyle" @scroll="onScroll" @scrolltoupper="onScrollToUpper"
        @scrolltolower="onScrollToLower">
        <!-- 前置占位 -->
        <view class="virtual-placeholder" :style="beforePlaceholderStyle"></view>

        <!-- 可视区域内容 -->
        <view class="virtual-content">
            <view class="virtual-item" :class="[`virtual-item-${index + startIndex}`, itemClass]"
                :style="[getItemStyle(item, index), itemStyle]" v-for="(item, index) in visibleItems"
                :key="getItemKey(item, index + startIndex)" @tap="onItemClick(item, index + startIndex, $event)">
                <slot :item="item" :index="index + startIndex" :isVisible="true">
                    <view class="default-item">
                        {{ item }}
                    </view>
                </slot>
            </view>
        </view>

        <!-- 后置占位 -->
        <view class="virtual-placeholder" :style="afterPlaceholderStyle"></view>

        <!-- 加载更多指示器 -->
        <view class="virtual-loading" v-if="loading && visibleItems.length > 0">
            <Loading />
            <text class="loading-text">{{ $t('common.loadMore') }}</text>
        </view>

        <!-- 空数据状态 -->
        <view class="virtual-empty" v-if="!loading && items.length === 0">
            <Empty :title="emptyText" />
        </view>
    </scroll-view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Empty from './Empty.vue'
import Loading from './Loading.vue'

interface Props {
  // 数据源
  items: any[]
  
  // 每个item的高度/宽度
  itemSize: number | ((item: any, index: number) => number)
  
  // 滚动方向
  direction?: 'vertical' | 'horizontal'
  
  // 容器尺寸
  height?: number
  width?: number
  
  // 缓冲区大小（在可视区域外预渲染的item数量）
  buffer?: number
  
  // 是否启用
  enabled?: boolean
  
  // 加载状态
  loading?: boolean
  
  // 自定义样式类名
  itemClass?: string
  itemStyle?: Record<string, any>
  
  // 空数据文本
  emptyText?: string
  
  // 唯一键获取函数
  keyField?: string | ((item: any, index: number) => string | number)
  
  // 预估总高度（用于优化滚动条）
  estimatedTotalSize?: number
}

interface Emits {
  (e: 'scroll', event: any): void
  (e: 'itemClick', item: any, index: number, event: any): void
  (e: 'reachTop'): void
  (e: 'reachBottom'): void
  (e: 'visibleRangeChange', startIndex: number, endIndex: number): void
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  height: 600,
  width: 375,
  buffer: 5,
  enabled: true,
  loading: false,
  itemClass: '',
  emptyText: '',
  keyField: 'id'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// 状态
const scrollTop = ref(0)
const scrollLeft = ref(0)
const startIndex = ref(0)
const endIndex = ref(0)
const scrollDirection = ref<'up' | 'down' | 'left' | 'right' | null>(null)
const lastScrollPosition = ref(0)

// 缓存已计算的item尺寸
const itemSizeCache = ref<Map<number, number>>(new Map())

// 计算属性
const containerStyle = computed(() => {
  const isHorizontal = props.direction === 'horizontal'
  return {
    height: isHorizontal ? 'auto' : props.height + 'px',
    width: isHorizontal ? props.width + 'px' : 'auto',
    maxHeight: isHorizontal ? 'none' : props.height + 'px',
    maxWidth: isHorizontal ? props.width + 'px' : 'none'
  }
})

const visibleItems = computed(() => {
  if (!props.enabled || props.items.length === 0) {
    return props.items
  }
  
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

const beforePlaceholderStyle = computed(() => {
  if (!props.enabled) return {}
  
  const size = getOffsetSize(startIndex.value)
  const isHorizontal = props.direction === 'horizontal'
  
  return {
    [isHorizontal ? 'width' : 'height']: size + 'px',
    [isHorizontal ? 'height' : 'width']: '100%',
    flexShrink: 0
  }
})

const afterPlaceholderStyle = computed(() => {
  if (!props.enabled) return {}
  
  const remainingSize = getTotalSize() - getOffsetSize(endIndex.value + 1)
  const isHorizontal = props.direction === 'horizontal'
  
  return {
    [isHorizontal ? 'width' : 'height']: Math.max(0, remainingSize) + 'px',
    [isHorizontal ? 'height' : 'width']: '100%',
    flexShrink: 0
  }
})

// 方法
const getItemSize = (index: number): number => {
  if (itemSizeCache.value.has(index)) {
    return itemSizeCache.value.get(index)!
  }
  
  const item = props.items[index]
  let size: number
  
  if (typeof props.itemSize === 'function') {
    size = props.itemSize(item, index)
  } else {
    size = props.itemSize
  }
  
  itemSizeCache.value.set(index, size)
  return size
}

const getOffsetSize = (index: number): number => {
  let offset = 0
  for (let i = 0; i < index && i < props.items.length; i++) {
    offset += getItemSize(i)
  }
  return offset
}

const getTotalSize = (): number => {
  if (props.estimatedTotalSize) {
    return props.estimatedTotalSize
  }
  
  let totalSize = 0
  for (let i = 0; i < props.items.length; i++) {
    totalSize += getItemSize(i)
  }
  return totalSize
}

const getItemStyle = (item: any, index: number) => {
  const actualIndex = index + startIndex.value
  const size = getItemSize(actualIndex)
  const isHorizontal = props.direction === 'horizontal'
  
  return {
    [isHorizontal ? 'width' : 'height']: size + 'px',
    [isHorizontal ? 'height' : 'width']: '100%',
    flexShrink: 0
  }
}

const getItemKey = (item: any, index: number): string | number => {
  if (typeof props.keyField === 'function') {
    return props.keyField(item, index)
  }
  
  if (typeof props.keyField === 'string' && item[props.keyField] !== undefined) {
    return item[props.keyField]
  }
  
  return index
}

const updateVisibleRange = () => {
  if (!props.enabled || props.items.length === 0) {
    startIndex.value = 0
    endIndex.value = props.items.length - 1
    return
  }
  
  const isHorizontal = props.direction === 'horizontal'
  const scrollPosition = isHorizontal ? scrollLeft.value : scrollTop.value
  const containerSize = isHorizontal ? props.width : props.height
  
  // 找到第一个可见的item
  let start = 0
  let offset = 0
  
  for (let i = 0; i < props.items.length; i++) {
    const itemSize = getItemSize(i)
    if (offset + itemSize > scrollPosition) {
      start = i
      break
    }
    offset += itemSize
  }
  
  // 找到最后一个可见的item
  let end = start
  let visibleSize = 0
  
  for (let i = start; i < props.items.length; i++) {
    const itemSize = getItemSize(i)
    visibleSize += itemSize
    end = i
    
    if (visibleSize >= containerSize) {
      break
    }
  }
  
  // 添加缓冲区
  const bufferedStart = Math.max(0, start - props.buffer)
  const bufferedEnd = Math.min(props.items.length - 1, end + props.buffer)
  
  if (startIndex.value !== bufferedStart || endIndex.value !== bufferedEnd) {
    startIndex.value = bufferedStart
    endIndex.value = bufferedEnd
    
    emit('visibleRangeChange', bufferedStart, bufferedEnd)
  }
}

const onScroll = (event: any) => {
  const { scrollTop: newScrollTop, scrollLeft: newScrollLeft } = event.detail
  
  // 更新滚动位置
  scrollTop.value = newScrollTop
  scrollLeft.value = newScrollLeft
  
  // 判断滚动方向
  const isHorizontal = props.direction === 'horizontal'
  const currentPosition = isHorizontal ? newScrollLeft : newScrollTop
  const lastPosition = lastScrollPosition.value
  
  if (currentPosition > lastPosition) {
    scrollDirection.value = isHorizontal ? 'right' : 'down'
  } else if (currentPosition < lastPosition) {
    scrollDirection.value = isHorizontal ? 'left' : 'up'
  }
  
  lastScrollPosition.value = currentPosition
  
  // 更新可视范围
  updateVisibleRange()
  
  emit('scroll', event)
}

const onScrollToUpper = () => {
  emit('reachTop')
}

const onScrollToLower = () => {
  emit('reachBottom')
}

const onItemClick = (item: any, index: number, event: any) => {
  emit('itemClick', item, index, event)
}

// 公开方法
const scrollToIndex = async (index: number, align: 'top' | 'bottom' | 'center' = 'top') => {
  if (index < 0 || index >= props.items.length) return
  
  const isHorizontal = props.direction === 'horizontal'
  const containerSize = isHorizontal ? props.width : props.height
  const offset = getOffsetSize(index)
  const itemSize = getItemSize(index)
  
  let scrollPosition = offset
  
  if (align === 'center') {
    scrollPosition = offset - (containerSize - itemSize) / 2
  } else if (align === 'bottom') {
    scrollPosition = offset - containerSize + itemSize
  }
  
  scrollPosition = Math.max(0, Math.min(scrollPosition, getTotalSize() - containerSize))
  
  if (isHorizontal) {
    scrollLeft.value = scrollPosition
  } else {
    scrollTop.value = scrollPosition
  }
  
  await nextTick()
  updateVisibleRange()
}

const scrollToTop = () => {
  scrollToIndex(0, 'top')
}

const scrollToBottom = () => {
  scrollToIndex(props.items.length - 1, 'bottom')
}

const refresh = () => {
  itemSizeCache.value.clear()
  updateVisibleRange()
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    updateVisibleRange()
  })
})

onUnmounted(() => {
  itemSizeCache.value.clear()
})

// 监听数据变化
watch(() => props.items, () => {
  itemSizeCache.value.clear()
  nextTick(() => {
    updateVisibleRange()
  })
}, { deep: false })

watch(() => [props.height, props.width], () => {
  nextTick(() => {
    updateVisibleRange()
  })
})

// 暴露方法给父组件
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  refresh,
  getVisibleRange: () => ({ startIndex: startIndex.value, endIndex: endIndex.value })
})
</script>

<style lang="scss" scoped>
.virtual-list {
    position: relative;
    overflow: hidden;

    &.horizontal {
        display: flex;
        flex-direction: row;

        .virtual-content {
            display: flex;
            flex-direction: row;
        }

        .virtual-placeholder {
            flex-shrink: 0;
        }
    }
}

.virtual-content {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.virtual-item {
    flex-shrink: 0;

    &:hover {
        background-color: var(--theme-bg-secondary, $neutral-50);
    }
}

.virtual-placeholder {
    flex-shrink: 0;
    background: transparent;
}

.virtual-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32upx;
    gap: 16upx;

    .loading-text {
        font: $font-caption-medium;
        color: var(--theme-text-secondary, $text-color-secondary);
    }
}

.virtual-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200upx;
}

.default-item {
    padding: 24upx 32upx;
    border-bottom: 1upx solid var(--theme-border, $border-color-light);
    font: $font-body-medium;
    color: var(--theme-text-primary, $text-color-primary);
}

// 优化滚动性能
.virtual-list {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}

// 适配深色主题
.theme-dark .virtual-item:hover {
    background-color: var(--theme-bg-tertiary, #2a2a2a);
}
</style>
