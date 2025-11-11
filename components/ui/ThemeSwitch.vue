<!--
  主题切换组件
  支持浅色/深色/自动三种模式
-->
<template>
    <view class="theme-switch" :class="themeClasses">
        <view class="switch-container" @tap="handleToggle">
            <!-- 图标显示 -->
            <view class="theme-icon" :class="`icon-${currentMode}`">
                <Icon v-if="currentMode === 'light'" name="sun" :size="iconSize" color="warning" />
                <Icon v-else-if="currentMode === 'dark'" name="moon" :size="iconSize" color="info" />
                <Icon v-else name="smartphone" :size="iconSize" color="neutral" />
            </view>

            <!-- 文字说明（可选） -->
            <view class="theme-text" v-if="showText">
                <text class="mode-name">{{ getModeText(currentMode) }}</text>
                <text class="mode-desc" v-if="showDescription">{{ getModeDescription(currentMode) }}</text>
            </view>

            <!-- 指示器 -->
            <view class="theme-indicator" v-if="showIndicator">
                <view class="indicator-dot" :class="{ active: index === currentModeIndex }"
                    v-for="(mode, index) in availableModes" :key="mode"></view>
            </view>
        </view>

        <!-- 详细选项（展开状态） -->
        <view class="theme-options" v-if="expanded">
            <view class="option-item" :class="{ active: mode === currentMode }" v-for="mode in availableModes"
                :key="mode" @tap="selectMode(mode)">
                <view class="option-icon">
                    <Icon v-if="mode === 'light'" name="sun" size="sm" />
                    <Icon v-else-if="mode === 'dark'" name="moon" size="sm" />
                    <Icon v-else name="smartphone" size="sm" />
                </view>
                <view class="option-content">
                    <text class="option-name">{{ getModeText(mode) }}</text>
                    <text class="option-desc">{{ getModeDescription(mode) }}</text>
                </view>
                <view class="option-check" v-if="mode === currentMode">
                    <Icon name="check" size="sm" color="success" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useTheme, type ThemeMode } from '@/utils/theme'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from './Icon.vue'

interface Props {
  // 显示模式
  variant?: 'compact' | 'detailed' | 'list'
  
  // 图标尺寸
  iconSize?: 'xs' | 'sm' | 'md' | 'lg'
  
  // 是否显示文字
  showText?: boolean
  
  // 是否显示描述
  showDescription?: boolean
  
  // 是否显示指示器
  showIndicator?: boolean
  
  // 可用的主题模式
  availableModes?: ThemeMode[]
  
  // 是否自动展开选项
  autoExpand?: boolean
}

interface Emits {
  (e: 'change', mode: ThemeMode): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'compact',
  iconSize: 'md',
  showText: true,
  showDescription: false,
  showIndicator: false,
  availableModes: () => ['light', 'dark', 'auto'],
  autoExpand: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const { theme, themeMode, setThemeMode, toggleTheme, getThemeClasses } = useTheme()

// 状态
const expanded = ref(props.autoExpand)

// 计算属性
const currentMode = computed(() => themeMode.value)

const currentModeIndex = computed(() => {
  return props.availableModes.indexOf(currentMode.value)
})

const themeClasses = computed(() => {
  const classes = getThemeClasses()
  classes.push(`variant-${props.variant}`)
  if (expanded.value) classes.push('expanded')
  return classes
})

// 方法
const handleToggle = () => {
  if (props.variant === 'list' || props.autoExpand) {
    expanded.value = !expanded.value
  } else {
    toggleTheme()
    emit('change', themeMode.value)
  }
}

const selectMode = (mode: ThemeMode) => {
  setThemeMode(mode)
  emit('change', mode)
  
  if (!props.autoExpand) {
    expanded.value = false
  }
}

const getModeText = (mode: ThemeMode): string => {
  const textMap = {
    light: t('theme.light'),
    dark: t('theme.dark'),
    auto: t('theme.auto')
  }
  return textMap[mode] || mode
}

const getModeDescription = (mode: ThemeMode): string => {
  const descMap = {
    light: t('theme.lightDesc'),
    dark: t('theme.darkDesc'),
    auto: t('theme.autoDesc')
  }
  return descMap[mode] || ''
}
</script>

<style lang="scss" scoped>
.theme-switch {
    position: relative;
    user-select: none;
}

.switch-container {
    display: flex;
    align-items: center;
    gap: 16upx;
    padding: 16upx 20upx;
    border-radius: $border-radius-lg;
    background: var(--theme-bg-secondary, $neutral-100);
    border: 1upx solid var(--theme-border, $border-color-light);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--theme-bg-tertiary, $neutral-200);
    }

    &:active {
        transform: scale(0.98);
    }
}

.theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48upx;
    height: 48upx;
    border-radius: 50%;
    background: var(--theme-bg-primary, #ffffff);
    transition: all 0.3s ease;

    &.icon-light {
        background: linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%);
    }

    &.icon-dark {
        background: linear-gradient(135deg, #424242 0%, #212121 100%);
    }

    &.icon-auto {
        background: linear-gradient(135deg, #f5f5f5 0%, #424242 100%);
    }
}

.theme-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4upx;
}

.mode-name {
    font: $font-body-medium;
    color: var(--theme-text-primary, $text-color-primary);
}

.mode-desc {
    font: $font-caption-medium;
    color: var(--theme-text-secondary, $text-color-secondary);
}

.theme-indicator {
    display: flex;
    gap: 8upx;
}

.indicator-dot {
    width: 12upx;
    height: 12upx;
    border-radius: 50%;
    background: var(--theme-border, $border-color-base);
    transition: all 0.3s ease;

    &.active {
        background: var(--theme-brand-primary, $primary-500);
        transform: scale(1.2);
    }
}

.theme-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8upx;
    background: var(--theme-bg-primary, #ffffff);
    border: 1upx solid var(--theme-border, $border-color-light);
    border-radius: $border-radius-lg;
    box-shadow: 0 8upx 24upx var(--theme-shadow, rgba(0, 0, 0, 0.1));
    z-index: 10;
    overflow: hidden;
}

.option-item {
    display: flex;
    align-items: center;
    gap: 16upx;
    padding: 20upx 24upx;
    cursor: pointer;
    transition: all 0.2s ease;

    &:not(:last-child) {
        border-bottom: 1upx solid var(--theme-border-secondary, $border-color-light);
    }

    &:hover {
        background: var(--theme-bg-secondary, $neutral-50);
    }

    &.active {
        background: var(--theme-bg-tertiary, $neutral-100);
    }

    &:active {
        transform: scale(0.98);
    }
}

.option-icon {
    width: 40upx;
    height: 40upx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--theme-bg-secondary, $neutral-100);
}

.option-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4upx;
}

.option-name {
    font: $font-body-medium;
    color: var(--theme-text-primary, $text-color-primary);
}

.option-desc {
    font: $font-caption-medium;
    color: var(--theme-text-secondary, $text-color-secondary);
    line-height: 1.4;
}

.option-check {
    opacity: 0;
    transition: opacity 0.2s ease;

    .option-item.active & {
        opacity: 1;
    }
}

// 变体样式
.variant-compact {
    .switch-container {
        padding: 12upx 16upx;
        gap: 12upx;
    }

    .theme-icon {
        width: 36upx;
        height: 36upx;
    }

    .mode-name {
        font-size: 26upx;
    }
}

.variant-detailed {
    .switch-container {
        padding: 24upx 28upx;
        gap: 20upx;
    }

    .theme-icon {
        width: 56upx;
        height: 56upx;
    }

    .mode-name {
        font-size: 32upx;
        font-weight: 600;
    }

    .mode-desc {
        font-size: 26upx;
    }
}

.variant-list {
    .switch-container {
        justify-content: space-between;

        &::after {
            content: '';
            width: 16upx;
            height: 16upx;
            border-right: 2upx solid var(--theme-text-secondary, $text-color-secondary);
            border-bottom: 2upx solid var(--theme-text-secondary, $text-color-secondary);
            transform: rotate(-45deg);
            transition: transform 0.3s ease;
        }
    }

    &.expanded .switch-container::after {
        transform: rotate(135deg);
    }
}

// 主题适配
.theme-dark {
    .theme-icon {
        box-shadow: 0 2upx 8upx rgba(255, 255, 255, 0.1);

        &.icon-light {
            background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
        }

        &.icon-dark {
            background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
        }

        &.icon-auto {
            background: linear-gradient(135deg, #90a4ae 0%, #607d8b 100%);
        }
    }

    .theme-options {
        box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.5);
    }
}
</style>
