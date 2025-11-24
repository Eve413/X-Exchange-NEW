<template>
  <view class="toolbar">
    <!-- Left section: dropdown selectors -->
    <view class="selectors">
      <!-- Period combobox -->
        <view class="selector period" @click.stop="togglePeriod">
          <text>{{ selectedPeriod }}</text>
          <text class="arrow">▼</text>
          <!-- inline dropdown anchored under the selector -->
          <transition name="combo-slide">
            <view v-show="openPeriod" class="dropdown">
              <view
                v-for="(opt, idx) in periodOptions"
                :key="idx"
                class="dropdown-item"
                @click.stop="selectPeriod(opt)"
              >
                <text>{{ opt }}</text>
                <text v-if="opt === selectedPeriod" class="check">✔</text>
              </view>
            </view>
          </transition>
        </view>
      <!-- Metric combobox -->
        <view class="selector metric" @click.stop="toggleMetric">
          <text>{{ selectedMetric }}</text>
          <text class="arrow">▼</text>
          <transition name="combo-slide">
            <view v-show="openMetric" class="dropdown">
              <view
                v-for="(m, midx) in metricOptions"
                :key="midx"
                class="dropdown-item"
                @click.stop="selectMetric(m)"
              >
                <text>{{ m }}</text>
                <text v-if="m === selectedMetric" class="check">✔</text>
              </view>
            </view>
          </transition>
        </view>
    </view>

    <!-- Right section: icons -->
    <view class="icons">
      <view class="icon" @click="onSearchClick">
         <image class="image" src="/static/icons/trade/ic_search.png" mode="aspectFit" />
      </view>
      <view class="icon" @click="onFilterClick">
         <image  class="image" src="/static/icons/trade/ic_filter.png" mode="aspectFit" />
      </view>
      <view class="icon" @click="onHistoryClick">
         <image class="image" src="/static/icons/trade/ic_history.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, withDefaults, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'

/**
 * Props untuk konfigurasi awal dan daftar opsi combobox periode.
 * - period: nilai awal combobox (tersinkron dari parent)
 * - periodOptions: daftar opsi yang ditampilkan
 * - metric: nilai awal combobox metric
 * - metricOptions: daftar opsi metric
 */
const props = withDefaults(defineProps<{
  period?: string
  periodOptions?: string[]
  metric?: string
  metricOptions?: string[]
}>(), {
  period: '30D',
  periodOptions: () => ['24H', '7D', '30D'],
  metric: 'P&L',
  metricOptions: () => ['P&L', 'Sharpe', 'Yield'],
})

/**
 * Emit event ke parent agar bisa handle aksi dan 2-way binding periode.
 * - update:period: untuk v-model:period
 * - periodChange: notifikasi perubahan periode
 * - update:metric: untuk v-model:metric
 * - metricChange: notifikasi perubahan metric
 */
const emit = defineEmits<{
  (e: 'periodClick'): void
  (e: 'metricClick'): void
  (e: 'searchClick'): void
  (e: 'filterClick'): void
  (e: 'historyClick'): void
  (e: 'update:period', value: string): void
  (e: 'periodChange', value: string): void
  (e: 'update:metric', value: string): void
  (e: 'metricChange', value: string): void
}>()

// State internal untuk tampilan combobox periode & metric, disinkronisasi dari props
const selectedPeriod = ref<string>(props.period)
const selectedMetric = ref<string>(props.metric)
const openPeriod = ref(false)
const openMetric = ref(false)
watch(() => props.period, (val: string) => { selectedPeriod.value = val })
watch(() => props.metric, (val: string) => { selectedMetric.value = val })

// Toggle inline dropdown
const togglePeriod = () => {
  // close metric if open
  if (openMetric.value) openMetric.value = false
  openPeriod.value = !openPeriod.value
  emit('periodClick') // optional analytics hook
}
const toggleMetric = () => {
  if (openPeriod.value) openPeriod.value = false
  openMetric.value = !openMetric.value
  emit('metricClick')
}

// Select a period and sync to parent
const selectPeriod = (opt: string) => {
  if (selectedPeriod.value === opt) { openPeriod.value = false; return }
  selectedPeriod.value = opt
  emit('update:period', opt)
  emit('periodChange', opt)
  openPeriod.value = false
}

// Select a metric and sync to parent
const selectMetric = (m: string) => {
  if (selectedMetric.value === m) { openMetric.value = false; return }
  selectedMetric.value = m
  emit('update:metric', m)
  emit('metricChange', m)
  openMetric.value = false
}

// Close dropdown on outside click (H5 only)
const onOutside = (e: any) => {
  if (!openPeriod.value && !openMetric.value) return
  const path = e?.composedPath ? e.composedPath() : []
  const hitPeriod = path.some((el: any) => el?.classList && el.classList.contains('selector') && el.classList.contains('period'))
  const hitMetric = path.some((el: any) => el?.classList && el.classList.contains('selector') && el.classList.contains('metric'))
  if (!hitPeriod) openPeriod.value = false
  if (!hitMetric) openMetric.value = false
}

onMounted(() => {
  // capture to run before other handlers
  if (typeof document !== 'undefined') {
    document.addEventListener('click', onOutside, true)
    document.addEventListener('touchstart', onOutside, true)
  }
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onOutside, true)
    document.removeEventListener('touchstart', onOutside, true)
  }
})
// keep legacy metricClick emit for analytics when toggled
const onMetricClick = () => emit('metricClick')
const onSearchClick = () => emit('searchClick')
const onFilterClick = () => emit('filterClick')
const onHistoryClick = () => emit('historyClick')
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #1c1c1e;
  border-radius: 12rpx;
  color: #ccc;
  height: 75rpx;
}

.selectors {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.selector {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #b0b0b0;
  position: relative;
}
.arrow {
  margin-left: 6rpx;
  font-size: 22rpx;
  color: #888;
}

/* Inline dropdown under Period selector */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #141517;
  border-radius: 12rpx;
  padding: 8rpx 0;
  min-width: 180rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.35);
  z-index: 20;
}
.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  color: #fff;
  font-size: 26rpx;
}
.dropdown-item:active { background: rgba(255,255,255,0.06); }
.check { color: #23c15a; font-size: 26rpx; margin-left: 12rpx; }

/* Transition */
.combo-slide-enter-active,
.combo-slide-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.combo-slide-enter-from,
.combo-slide-leave-to { opacity: 0; transform: translateY(-6rpx); }
.combo-slide-enter-to,
.combo-slide-leave-from { opacity: 1; transform: translateY(0); }

.icons {
  display: flex;
  align-items: center;
  gap: 30rpx;
}
.icon {
  font-size: 34rpx;
  color: #e5e5e5;
}
.icon:active {
  opacity: 0.6;
}

.image {
  width: 30rpx;
  height: 30rpx;
}
</style>
