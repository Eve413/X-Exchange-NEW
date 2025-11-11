<!--
  基础图表组件
  提供K线图、深度图、资产分布图等交易图表的统一基础
-->
<template>
  <view class="base-chart" :class="{ loading: isLoading }">
    <!-- 图表标题栏 -->
    <view class="chart-header" v-if="title || $slots.header">
      <slot name="header">
        <view class="chart-title">
          <text class="title-text">{{ title }}</text>
          <text class="title-subtitle" v-if="subtitle">{{ subtitle }}</text>
        </view>
        <view class="chart-controls" v-if="showControls">
          <view 
            class="control-btn" 
            :class="{ active: currentInterval === interval.value }"
            v-for="interval in intervals"
            :key="interval.value"
            @tap="changeInterval(interval.value)"
          >
            {{ interval.label }}
          </view>
        </view>
      </slot>
    </view>

    <!-- 图表容器 -->
    <view class="chart-container" :style="containerStyle">
      <canvas 
        class="chart-canvas"
        :canvas-id="canvasId"
        :id="canvasId"
        :style="canvasStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @longtap="onLongTap"
      ></canvas>
      
      <!-- 加载状态 -->
      <view class="chart-loading" v-if="isLoading">
        <Loading />
        <text class="loading-text">{{ $t('common.loading') }}...</text>
      </view>
      
      <!-- 空数据状态 -->
      <view class="chart-empty" v-if="!isLoading && isEmpty">
        <Empty :title="$t('charts.noData')" />
      </view>
      
      <!-- 十字线信息显示 -->
      <view class="crosshair-info" v-if="crosshairData" :style="crosshairInfoStyle">
        <text class="info-time">{{ formatTime(crosshairData.time) }}</text>
        <text class="info-price">{{ formatPrice(crosshairData.price) }}</text>
        <text class="info-volume" v-if="crosshairData.volume">
          {{ $t('charts.volume') }}: {{ formatVolume(crosshairData.volume) }}
        </text>
      </view>
    </view>

    <!-- 图表底部工具栏 -->
    <view class="chart-toolbar" v-if="showToolbar">
      <slot name="toolbar">
        <view class="toolbar-group">
          <view 
            class="tool-btn"
            :class="{ active: currentTool === 'crosshair' }"
            @tap="toggleTool('crosshair')"
          >
            <Icon name="add" size="sm" />
            <text>{{ $t('charts.crosshair') }}</text>
          </view>
          
          <view 
            class="tool-btn"
            :class="{ active: currentTool === 'zoom' }"
            @tap="toggleTool('zoom')"
          >
            <Icon name="zoom-in" size="sm" />
            <text>{{ $t('charts.zoom') }}</text>
          </view>
          
          <view class="tool-btn" @tap="resetChart">
            <Icon name="refresh" size="sm" />
            <text>{{ $t('charts.reset') }}</text>
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NumberFormat, DateFormat } from '@/utils/format'
import Loading from '@/components/common/Loading.vue'
import Empty from '@/components/common/Empty.vue'
import Icon from '@/components/ui/Icon.vue'

export interface ChartInterval {
  value: string
  label: string
}

export interface ChartData {
  time: number
  value: number | number[]
  volume?: number
  [key: string]: any
}

export interface CrosshairData {
  time: number
  price: number
  volume?: number
  [key: string]: any
}

interface Props {
  title?: string
  subtitle?: string
  data?: ChartData[]
  width?: number
  height?: number
  intervals?: ChartInterval[]
  defaultInterval?: string
  showControls?: boolean
  showToolbar?: boolean
  autoUpdate?: boolean
  theme?: 'light' | 'dark'
}

interface Emits {
  (e: 'intervalChange', interval: string): void
  (e: 'dataRequest', params: any): void
  (e: 'chartClick', data: any): void
  (e: 'crosshairMove', data: CrosshairData | null): void
}

const props = withDefaults(defineProps<Props>(), {
  width: 375,
  height: 250,
  intervals: () => [
    { value: '1m', label: '1分' },
    { value: '5m', label: '5分' },
    { value: '15m', label: '15分' },
    { value: '1h', label: '1时' },
    { value: '4h', label: '4时' },
    { value: '1d', label: '日线' }
  ],
  defaultInterval: '1h',
  showControls: true,
  showToolbar: true,
  autoUpdate: true,
  theme: 'light'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// 状态
const canvasId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
const isLoading = ref(false)
const isEmpty = ref(false)
const currentInterval = ref(props.defaultInterval)
const currentTool = ref<string | null>(null)
const crosshairData = ref<CrosshairData | null>(null)
const canvasContext = ref<any>(null)

// 触摸相关状态
const isTouch = ref(false)
const touchStart = ref({ x: 0, y: 0 })
const lastTouchPoint = ref({ x: 0, y: 0 })

// 计算属性
const containerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))

const canvasStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))

const crosshairInfoStyle = computed(() => {
  if (!crosshairData.value) return { display: 'none' }
  
  return {
    left: lastTouchPoint.value.x + 10 + 'px',
    top: lastTouchPoint.value.y - 60 + 'px'
  }
})

// 生命周期
onMounted(() => {
  initCanvas()
  if (props.data && props.data.length > 0) {
    renderChart()
  }
})

onUnmounted(() => {
  // 清理资源
  if (canvasContext.value) {
    canvasContext.value = null
  }
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    isEmpty.value = false
    renderChart()
  } else {
    isEmpty.value = true
  }
}, { deep: true })

// 方法
const initCanvas = async () => {
  try {
    const query = uni.createSelectorQuery()
    query.select(`#${canvasId}`).context().exec((res) => {
      if (res[0] && res[0].context) {
        canvasContext.value = res[0].context
        setupCanvas()
      }
    })
  } catch (error) {
    console.error('初始化画布失败:', error)
  }
}

const setupCanvas = () => {
  if (!canvasContext.value) return
  
  const ctx = canvasContext.value
  const dpr = uni.getSystemInfoSync().pixelRatio || 1
  
  // 设置画布分辨率
  ctx.scale(dpr, dpr)
  
  // 设置默认样式
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.lineWidth = 1
  ctx.strokeStyle = props.theme === 'dark' ? '#333' : '#ddd'
  ctx.fillStyle = props.theme === 'dark' ? '#fff' : '#333'
}

const renderChart = () => {
  if (!canvasContext.value || !props.data || props.data.length === 0) {
    return
  }
  
  const ctx = canvasContext.value
  
  // 清空画布
  ctx.clearRect(0, 0, props.width, props.height)
  
  // 绘制网格
  drawGrid(ctx)
  
  // 绘制数据
  drawData(ctx)
  
  // 绘制坐标轴
  drawAxis(ctx)
  
  // 更新画布
  ctx.draw()
}

const drawGrid = (ctx: any) => {
  const { width, height } = props
  const gridColor = props.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'
  
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 0.5
  
  // 水平网格线
  for (let i = 1; i < 5; i++) {
    const y = (height / 5) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  // 垂直网格线
  for (let i = 1; i < 5; i++) {
    const x = (width / 5) * i
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
}

const drawData = (ctx: any) => {
  // 这里是基础实现，具体图表类型需要在子组件中重写
  if (!props.data || props.data.length === 0) return
  
  const { width, height } = props
  const padding = 20
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  // 计算数据范围
  const values = props.data.map(d => typeof d.value === 'number' ? d.value : d.value[0])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue
  
  // 绘制折线图（示例）
  ctx.strokeStyle = props.theme === 'dark' ? '#6f4bfd' : '#4CAF50'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  props.data.forEach((point, index) => {
    const x = padding + (chartWidth / (props.data!.length - 1)) * index
    const value = typeof point.value === 'number' ? point.value : point.value[0]
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
}

const drawAxis = (ctx: any) => {
  // 绘制坐标轴标签
  const { width, height } = props
  const textColor = props.theme === 'dark' ? '#ccc' : '#666'
  
  ctx.fillStyle = textColor
  ctx.font = '12px sans-serif'
  
  // 这里可以添加具体的坐标轴绘制逻辑
}

// 事件处理
const changeInterval = (interval: string) => {
  if (interval === currentInterval.value) return
  
  currentInterval.value = interval
  emit('intervalChange', interval)
  
  // 触发数据请求
  isLoading.value = true
  emit('dataRequest', { interval })
}

const toggleTool = (tool: string) => {
  currentTool.value = currentTool.value === tool ? null : tool
}

const resetChart = () => {
  currentTool.value = null
  crosshairData.value = null
  renderChart()
}

const onTouchStart = (e: any) => {
  isTouch.value = true
  touchStart.value = { x: e.touches[0].x, y: e.touches[0].y }
  lastTouchPoint.value = { x: e.touches[0].x, y: e.touches[0].y }
}

const onTouchMove = (e: any) => {
  if (!isTouch.value) return
  
  lastTouchPoint.value = { x: e.touches[0].x, y: e.touches[0].y }
  
  // 如果启用了十字线工具
  if (currentTool.value === 'crosshair') {
    updateCrosshair(e.touches[0])
  }
}

const onTouchEnd = () => {
  isTouch.value = false
}

const onLongTap = (e: any) => {
  // 长按显示详细信息
  updateCrosshair(e.touches[0])
  currentTool.value = 'crosshair'
}

const updateCrosshair = (touch: any) => {
  // 根据触摸位置计算对应的数据点
  if (!props.data || props.data.length === 0) return
  
  const { x, y } = touch
  const dataIndex = Math.floor((x - 20) / ((props.width - 40) / props.data.length))
  const clampedIndex = Math.max(0, Math.min(dataIndex, props.data.length - 1))
  const dataPoint = props.data[clampedIndex]
  
  if (dataPoint) {
    crosshairData.value = {
      time: dataPoint.time,
      price: typeof dataPoint.value === 'number' ? dataPoint.value : dataPoint.value[0],
      volume: dataPoint.volume
    }
    
    emit('crosshairMove', crosshairData.value)
  }
}

// 格式化方法
const formatTime = (timestamp: number): string => {
  return DateFormat.format(timestamp, 'MM-DD HH:mm')
}

const formatPrice = (price: number): string => {
  return NumberFormat.formatNumber(price, 4)
}

const formatVolume = (volume: number): string => {
  return NumberFormat.formatLargeNumber(volume)
}

// 暴露方法给父组件
defineExpose({
  renderChart,
  resetChart,
  canvasId,
  canvasContext
})
</script>

<style lang="scss" scoped>
.base-chart {
  position: relative;
  background: $bg-color-container;
  border-radius: $border-radius-lg;
  overflow: hidden;
  
  &.loading {
    pointer-events: none;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24upx 32upx;
  border-bottom: 1upx solid $border-color-light;
}

.chart-title {
  display: flex;
  flex-direction: column;
  gap: 8upx;
  
  .title-text {
    font: $font-body-bold;
    color: $text-color-primary;
  }
  
  .title-subtitle {
    font: $font-caption-medium;
    color: $text-color-secondary;
  }
}

.chart-controls {
  display: flex;
  gap: 8upx;
}

.control-btn {
  padding: 12upx 24upx;
  border-radius: $border-radius-base;
  background: $neutral-100;
  font: $font-caption-medium;
  color: $text-color-secondary;
  transition: all 0.2s ease;
  
  &.active {
    background: $primary-500;
    color: #ffffff;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.chart-container {
  position: relative;
  margin: 24upx;
}

.chart-canvas {
  display: block;
  border-radius: $border-radius-base;
  background: $bg-color-container;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16upx;
  
  .loading-text {
    font: $font-caption-medium;
    color: $text-color-secondary;
  }
}

.chart-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair-info {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 16upx 20upx;
  border-radius: $border-radius-base;
  font: $font-caption-medium;
  z-index: 10;
  pointer-events: none;
  
  .info-time,
  .info-price,
  .info-volume {
    display: block;
    line-height: 1.4;
  }
  
  .info-price {
    font-weight: 600;
    margin: 4upx 0;
  }
}

.chart-toolbar {
  padding: 16upx 32upx;
  border-top: 1upx solid $border-color-light;
  background: $neutral-50;
}

.toolbar-group {
  display: flex;
  gap: 32upx;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8upx;
  padding: 12upx;
  border-radius: $border-radius-base;
  font: $font-caption-medium;
  color: $text-color-secondary;
  transition: all 0.2s ease;
  
  &.active {
    color: $primary-500;
    background: rgba($primary-500, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
}
</style>
