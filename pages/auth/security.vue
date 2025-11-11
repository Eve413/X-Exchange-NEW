<template>
  <view class="security-page">
    <!-- 页面头部 -->
    <view class="security-header">
      <Icon name="arrow-left" size="lg" color="primary" class="back-btn" @click="goBack" />
      <view class="header-content">
        <text class="page-title">{{ $t('auth.securitySettings') }}</text>
        <text class="page-subtitle">{{ $t('auth.securitySettingsDesc') }}</text>
      </view>
    </view>

    <!-- 可滚动内容区域 -->
    <view class="security-content">
      <!-- 安全状态卡片 -->
      <GlassCard variant="primary" class="security-status-card">
        <view class="status-header">
          <Icon name="shield-check" size="lg" color="primary" />
          <view class="status-info">
            <text class="status-title">{{ $t('auth.securityStatus') }}</text>
            <text class="status-desc" :class="securityLevelClass">
              {{ $t(`auth.securityLevel${securityLevel}`) }}
            </text>
          </view>
          <view class="status-score">
            <text class="score-text">{{ securityScore }}/100</text>
          </view>
        </view>

        <view class="status-progress">
          <view class="progress-bar">
            <view class="progress-fill" :class="securityLevelClass" :style="{ width: `${securityScore}%` }" />
          </view>
        </view>
      </GlassCard>

      <!-- 安全功能列表 -->
      <view class="security-list">
        <!-- 资金密码重置 -->
        <GlassCard class="security-item-card" hoverable @click="showFundPasswordReset = true">
          <view class="security-item">
            <view class="item-left">
              <view class="item-icon fund-password-icon">
                <Icon name="wallet" size="lg" color="white" />
              </view>
              <view class="item-info">
                <text class="item-title">{{ $t('auth.fundPassword') }}</text>
                <text class="item-desc">{{ $t('auth.fundPasswordDesc') }}</text>
                <text class="item-status">{{ $t('auth.fundPasswordStatus') }}</text>
              </view>
            </view>
            <view class="item-right">
              <Icon name="arrow-right" size="md" color="neutral" />
            </view>
          </view>
        </GlassCard>

        <!-- 2FA管理 -->
        <GlassCard class="security-item-card" hoverable @click="show2FAManage = true">
          <view class="security-item">
            <view class="item-left">
              <view class="item-icon twofa-icon" :class="{ active: user2FAStatus }">
                <Icon name="shield-check" size="lg" color="white" />
              </view>
              <view class="item-info">
                <text class="item-title">{{ $t('auth.twoFactorAuth') }}</text>
                <text class="item-desc">{{ $t('auth.twoFactorAuthDesc') }}</text>
                <text class="item-status" :class="user2FAStatus ? 'enabled' : 'disabled'">
                  {{ user2FAStatus ? $t('auth.enabled') : $t('auth.disabled') }}
                </text>
              </view>
            </view>
            <view class="item-right">
              <view class="status-badge" :class="user2FAStatus ? 'enabled' : 'disabled'">
                <Icon :name="user2FAStatus ? 'check-circle' : 'x-circle'" size="sm" color="white" />
              </view>
              <Icon name="arrow-right" size="md" color="neutral" />
            </view>
          </view>
        </GlassCard>

        <!-- 退出所有设备 -->
        <GlassCard class="security-item-card" hoverable @click="showLogoutAllConfirm = true">
          <view class="security-item">
            <view class="item-left">
              <view class="item-icon logout-icon">
                <Icon name="log-out" size="lg" color="white" />
              </view>
              <view class="item-info">
                <text class="item-title">{{ $t('auth.logoutAllDevices') }}</text>
                <text class="item-desc">{{ $t('auth.logoutAllDevicesDesc') }}</text>
                <text class="item-status danger">{{ $t('auth.logoutAllWarning') }}</text>
              </view>
            </view>
            <view class="item-right">
              <Icon name="arrow-right" size="md" color="neutral" />
            </view>
          </view>
        </GlassCard>
      </view>

      <!-- 安全提示 -->
      <view class="security-tips">
        <view class="tips-header">
          <Icon name="lightbulb" size="md" color="warning" />
          <text class="tips-title">{{ $t('auth.securityTips') }}</text>
        </view>
        <view class="tips-list">
          <view class="tip-item">
            <Icon name="check-circle" size="sm" color="success" />
            <text class="tip-text">{{ $t('auth.securityTip1') }}</text>
          </view>
          <view class="tip-item">
            <Icon name="check-circle" size="sm" color="success" />
            <text class="tip-text">{{ $t('auth.securityTip2') }}</text>
          </view>
          <view class="tip-item">
            <Icon name="check-circle" size="sm" color="success" />
            <text class="tip-text">{{ $t('auth.securityTip3') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 资金密码重置弹窗 -->
    <view v-if="showFundPasswordReset" class="modal-overlay" @click="closeFundPasswordReset">
      <view class="modal-content fund-password-modal" @click.stop>
        <view class="modal-header">
          <Icon name="wallet" size="lg" color="primary" />
          <text class="modal-title">{{ $t('auth.resetFundPassword') }}</text>
          <Icon name="x" size="lg" color="neutral" class="close-btn" @click="closeFundPasswordReset" />
        </view>

        <view class="modal-form">
          <!-- 手机号 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.phoneNumber') }}</text>
              <text class="required">*</text>
            </view>
            <view class="input-wrapper">
              <input v-model="fundPasswordForm.phone" class="form-input"
                :placeholder="$t('auth.phoneNumberPlaceholder')" type="number" maxlength="11"
                :class="{ error: fundPhoneError }" />
            </view>
            <text v-if="fundPhoneError" class="error-msg">{{ fundPhoneError }}</text>
          </view>

          <!-- 图形验证码 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.captcha') }}</text>
              <text class="required">*</text>
            </view>
            <view class="captcha-group">
              <view class="input-wrapper captcha-input-wrapper">
                <input v-model="fundPasswordForm.captchaCode" class="form-input"
                  :placeholder="$t('auth.captchaPlaceholder')" type="text" maxlength="4" />
              </view>
              <view class="captcha-container" @click="refreshCaptcha">
                <image v-if="captchaImage" :src="captchaImage" class="captcha-image" mode="aspectFit" />
                <view v-else class="captcha-placeholder">
                  <Icon name="refresh-circle" size="md" color="neutral" />
                </view>
              </view>
            </view>
          </view>

          <!-- 短信验证码 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.smsCode') }}</text>
              <text class="required">*</text>
            </view>
            <view class="sms-group">
              <view class="input-wrapper sms-input-wrapper">
                <input v-model="fundPasswordForm.smsCode" class="form-input"
                  :placeholder="$t('auth.smsCodePlaceholder')" type="number" maxlength="6" />
              </view>
              <GlassButton variant="primary" size="sm" :disabled="!canSendFundSms || fundSmsCountdown > 0"
                :loading="fundSmsSending" @click="sendFundSmsCode">
                {{ fundSmsCountdown > 0 ? `${fundSmsCountdown}s` : $t('auth.sendCode') }}
              </GlassButton>
            </view>
          </view>

          <!-- 新资金密码 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.newFundPassword') }}</text>
              <text class="required">*</text>
            </view>
            <view class="input-wrapper password-wrapper">
              <input v-model="fundPasswordForm.newFundPassword" class="form-input"
                :placeholder="$t('auth.newFundPasswordPlaceholder')" :type="showNewFundPassword ? 'text' : 'password'"
                maxlength="20" />
              <Icon :name="showNewFundPassword ? 'eye-off' : 'eye'" size="sm" color="neutral" class="password-toggle"
                @click="showNewFundPassword = !showNewFundPassword" />
            </view>
          </view>

          <!-- 确认资金密码 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.confirmFundPassword') }}</text>
              <text class="required">*</text>
            </view>
            <view class="input-wrapper password-wrapper">
              <input v-model="fundPasswordForm.confirmFundPassword" class="form-input"
                :placeholder="$t('auth.confirmFundPasswordPlaceholder')"
                :type="showConfirmFundPassword ? 'text' : 'password'" maxlength="20" />
              <Icon :name="showConfirmFundPassword ? 'eye-off' : 'eye'" size="sm" color="neutral"
                class="password-toggle" @click="showConfirmFundPassword = !showConfirmFundPassword" />
            </view>
          </view>

          <GlassButton variant="primary" size="lg" class="submit-btn" :disabled="!canResetFundPassword"
            :loading="fundPasswordLoading" @click="handleFundPasswordReset">
            <Icon name="check-circle" size="sm" color="white" />
            {{ $t('auth.confirmReset') }}
          </GlassButton>
        </view>
      </view>
    </view>

    <!-- 2FA管理弹窗 -->
    <view v-if="show2FAManage" class="modal-overlay" @click="close2FAManage">
      <view class="modal-content twofa-modal" @click.stop>
        <view class="modal-header">
          <Icon name="shield-check" size="lg" color="primary" />
          <text class="modal-title">
            {{ user2FAStatus ? $t('auth.manage2FA') : $t('auth.enable2FA') }}
          </text>
          <Icon name="x" size="lg" color="neutral" class="close-btn" @click="close2FAManage" />
        </view>

        <!-- 开启2FA -->
        <view v-if="!user2FAStatus" class="modal-form">
          <view class="qr-section">
            <text class="qr-title">{{ $t('auth.scanQRCode') }}</text>
            <view class="qr-code">
              <image v-if="qrCodeImage" :src="qrCodeImage" class="qr-image" mode="aspectFit" />
              <view v-else class="qr-placeholder">
                <Icon name="qr-code" size="xl" color="neutral" />
                <text class="loading-text">{{ $t('auth.generatingQR') }}</text>
              </view>
            </view>
            <text class="qr-desc">{{ $t('auth.qrCodeDesc') }}</text>
          </view>

          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.verificationCode') }}</text>
              <text class="required">*</text>
            </view>
            <view class="input-wrapper">
              <input v-model="twoFAForm.otp" class="form-input" :placeholder="$t('auth.enter6DigitCode')" type="number"
                maxlength="6" />
            </view>
          </view>

          <GlassButton variant="primary" size="lg" class="submit-btn" :disabled="twoFAForm.otp.length !== 6"
            :loading="twoFALoading" @click="handleBind2FA">
            <Icon name="link" size="sm" color="white" />
            {{ $t('auth.enable2FA') }}
          </GlassButton>
        </view>

        <!-- 解绑2FA -->
        <view v-else class="modal-form">
          <view class="unbind-warning">
            <Icon name="alert-triangle" size="lg" color="error" />
            <view class="warning-content">
              <text class="warning-title">{{ $t('auth.disable2FATitle') }}</text>
              <text class="warning-desc">{{ $t('auth.disable2FADesc') }}</text>
            </view>
          </view>

          <view class="form-group">
            <view class="input-label">
              <text class="label">{{ $t('auth.current2FACode') }}</text>
              <text class="required">*</text>
            </view>
            <view class="input-wrapper">
              <input v-model="twoFAForm.otp" class="form-input" :placeholder="$t('auth.enterCurrent6DigitCode')"
                type="number" maxlength="6" />
            </view>
          </view>

          <GlassButton variant="error" size="lg" class="submit-btn danger" :disabled="twoFAForm.otp.length !== 6"
            :loading="twoFALoading" @click="handleUnbind2FA">
            <Icon name="unlink" size="sm" color="white" />
            {{ $t('auth.disable2FA') }}
          </GlassButton>
        </view>
      </view>
    </view>

    <!-- 退出所有设备确认弹窗 -->
    <view v-if="showLogoutAllConfirm" class="modal-overlay" @click="showLogoutAllConfirm = false">
      <view class="modal-content confirm-modal" @click.stop>
        <view class="confirm-header">
          <Icon name="alert-triangle" size="xl" color="error" />
          <text class="confirm-title">{{ $t('auth.logoutAllDevicesConfirm') }}</text>
        </view>

        <text class="confirm-desc">{{ $t('auth.logoutAllDevicesConfirmDesc') }}</text>

        <view class="confirm-actions">
          <GlassButton variant="secondary" size="md" class="cancel-btn" @click="showLogoutAllConfirm = false">
            {{ $t('common.cancel') }}
          </GlassButton>

          <GlassButton variant="error" size="md" class="confirm-btn" :loading="logoutAllLoading"
            @click="handleLogoutAll">
            <Icon name="log-out" size="sm" color="white" />
            {{ $t('auth.confirmLogout') }}
          </GlassButton>
        </view>
      </view>
    </view>

    <!-- 全局提示 -->
    <AppToast :show="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" />
  </view>
</template>

<script setup lang="ts">
import AuthAPI from '@/api/modules/auth'
import AppToast from '@/components/common/AppToast.vue'
import { GlassButton, GlassCard, Icon } from '@/components/ui'
import { useUserStore } from '@/store/modules/user'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()

// 响应式数据
const showFundPasswordReset = ref(false)
const show2FAManage = ref(false)
const showLogoutAllConfirm = ref(false)
const showNewFundPassword = ref(false)
const showConfirmFundPassword = ref(false)

const fundPasswordLoading = ref(false)
const fundSmsSending = ref(false)
const twoFALoading = ref(false)
const logoutAllLoading = ref(false)

const fundSmsCountdown = ref(0)
const captchaImage = ref('')
const captchaId = ref('')
const qrCodeImage = ref('')
const user2FAStatus = ref(false)

// 表单数据
const fundPasswordForm = ref({
  phone: '',
  captchaCode: '',
  smsCode: '',
  newFundPassword: '',
  confirmFundPassword: ''
})

const twoFAForm = ref({
  otp: ''
})

// 错误状态
const fundPhoneError = ref('')

// 全局提示
const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

// 计算属性
const securityScore = computed(() => {
  let score = 30 // 基础分数
  
  if (user2FAStatus.value) score += 40 // 2FA
  if (fundPasswordForm.value.phone) score += 30 // 手机验证
  
  return Math.min(score, 100)
})

const securityLevel = computed(() => {
  if (securityScore.value >= 80) return 'High'
  if (securityScore.value >= 50) return 'Medium'
  return 'Low'
})

const securityLevelClass = computed(() => {
  const level = securityLevel.value.toLowerCase()
  return {
    high: 'success',
    medium: 'warning',
    low: 'error'
  }[level] || 'error'
})

const canSendFundSms = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(fundPasswordForm.value.phone) && 
         fundPasswordForm.value.captchaCode.length >= 4
})

const canResetFundPassword = computed(() => {
  return canSendFundSms.value && 
         fundPasswordForm.value.smsCode.length === 6 &&
         fundPasswordForm.value.newFundPassword.length >= 8 &&
         fundPasswordForm.value.newFundPassword === fundPasswordForm.value.confirmFundPassword &&
         fundPasswordForm.value.newFundPassword !== '' // 确保不与登录密码相同的逻辑
})

// 获取图形验证码
const getCaptcha = async () => {
  try {
    const response = await AuthAPI.getCaptcha()
    captchaImage.value = response.captchaImage
    captchaId.value = response.captchaId
  } catch (error: any) {
    console.log('开发环境：API服务器未启动，跳过验证码获取')
    captchaId.value = 'mock-captcha-id'
  }
}

// 刷新图形验证码
const refreshCaptcha = () => {
  fundPasswordForm.value.captchaCode = ''
  getCaptcha()
}

// 发送短信验证码
const sendFundSmsCode = async () => {
  if (!canSendFundSms.value) return
  
  // 简单验证手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(fundPasswordForm.value.phone)) {
    fundPhoneError.value = t('auth.phoneInvalid')
    return
  }
  
  fundSmsSending.value = true
  
  try {
    await AuthAPI.sendSmsCode({
      phone: fundPasswordForm.value.phone,
      scene: 'reset_fund_password',
      captchaId: captchaId.value,
      captchaCode: fundPasswordForm.value.captchaCode
    })
    
    toastType.value = 'success'
    toastMessage.value = t('auth.smsCodeSent')
    showToast.value = true
    
    // 开始倒计时
    fundSmsCountdown.value = 60
    const timer = setInterval(() => {
      fundSmsCountdown.value--
      if (fundSmsCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    refreshCaptcha()
  } catch (error: any) {
    toastType.value = 'error'
    toastMessage.value = error.message || t('auth.smsCodeSendFailed')
    showToast.value = true
    refreshCaptcha()
  } finally {
    fundSmsSending.value = false
  }
}

// 处理资金密码重置
const handleFundPasswordReset = async () => {
  if (!canResetFundPassword.value) return
  
  fundPasswordLoading.value = true
  
  try {
    await AuthAPI.resetFundPassword({
      phone: fundPasswordForm.value.phone,
      smsCode: fundPasswordForm.value.smsCode,
      captchaId: captchaId.value,
      captchaCode: fundPasswordForm.value.captchaCode,
      newFundPassword: fundPasswordForm.value.newFundPassword
    })
    
    toastType.value = 'success'
    toastMessage.value = t('auth.fundPasswordResetSuccess')
    showToast.value = true
    
    closeFundPasswordReset()
  } catch (error: any) {
    toastType.value = 'error'
    toastMessage.value = error.message || t('auth.fundPasswordResetFailed')
    showToast.value = true
  } finally {
    fundPasswordLoading.value = false
  }
}

// 获取2FA二维码
const get2FAQRCode = async () => {
  try {
    const response = await AuthAPI.get2FAQRCode()
    qrCodeImage.value = response.qrCode
  } catch (error: any) {
    console.log('开发环境：API服务器未启动，跳过2FA二维码获取')
    // 生成模拟二维码
    qrCodeImage.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TW9jayBRUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K'
  }
}

// 绑定2FA
const handleBind2FA = async () => {
  if (twoFAForm.value.otp.length !== 6) return
  
  twoFALoading.value = true
  
  try {
    await AuthAPI.bind2FA({
      otp: twoFAForm.value.otp
    })
    
    toastType.value = 'success'
    toastMessage.value = t('auth.2FABindSuccess')
    showToast.value = true
    
    user2FAStatus.value = true
    close2FAManage()
  } catch (error: any) {
    toastType.value = 'error'
    toastMessage.value = error.message || t('auth.2FABindFailed')
    showToast.value = true
  } finally {
    twoFALoading.value = false
  }
}

// 解绑2FA
const handleUnbind2FA = async () => {
  if (twoFAForm.value.otp.length !== 6) return
  
  twoFALoading.value = true
  
  try {
    await AuthAPI.unbind2FA({
      otp: twoFAForm.value.otp
    })
    
    toastType.value = 'success'
    toastMessage.value = t('auth.2FAUnbindSuccess')
    showToast.value = true
    
    user2FAStatus.value = false
    close2FAManage()
  } catch (error: any) {
    toastType.value = 'error'
    toastMessage.value = error.message || t('auth.2FAUnbindFailed')
    showToast.value = true
  } finally {
    twoFALoading.value = false
  }
}

// 退出所有设备
const handleLogoutAll = async () => {
  logoutAllLoading.value = true
  
  try {
    await AuthAPI.terminateAllSessions()
    
    toastType.value = 'success'
    toastMessage.value = t('auth.logoutAllSuccess')
    showToast.value = true
    
    showLogoutAllConfirm.value = false
    
    // 当前设备也会被退出，跳转到登录页
    setTimeout(() => {
      userStore.logout()
      uni.reLaunch({
        url: '/pages/auth/login'
      })
    }, 2000)
  } catch (error: any) {
    toastType.value = 'error'
    toastMessage.value = error.message || t('auth.logoutAllFailed')
    showToast.value = true
  } finally {
    logoutAllLoading.value = false
  }
}

// 弹窗控制
const closeFundPasswordReset = () => {
  showFundPasswordReset.value = false
  // 重置表单
  fundPasswordForm.value = {
    phone: '',
    captchaCode: '',
    smsCode: '',
    newFundPassword: '',
    confirmFundPassword: ''
  }
  fundPhoneError.value = ''
}

const close2FAManage = () => {
  show2FAManage.value = false
  twoFAForm.value.otp = ''
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 监听弹窗显示
watch(() => showFundPasswordReset.value, (newVal) => {
  if (newVal) {
    getCaptcha()
  }
})

watch(() => show2FAManage.value, (newVal) => {
  if (newVal && !user2FAStatus.value) {
    get2FAQRCode()
  }
})

// 页面加载时获取用户安全状态
onMounted(async () => {
  try {
    const userInfo = await userStore.getUserInfo()
    user2FAStatus.value = userInfo.has2FA || false
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.security-page {
  height: 100vh;
  background: $neutral-50;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.security-header {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx 24rpx;
  flex-shrink: 0;

  .back-btn {
    margin-right: 24rpx;
    cursor: pointer;
  }

  .header-content {
    flex: 1;

    .page-title {
      display: block;
      font: $font-heading-bold;
      color: $neutral-900;
      margin-bottom: 8rpx;
    }

    .page-subtitle {
      display: block;
      font: $font-body-medium;
      color: $neutral-600;
    }
  }
}

.security-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 32rpx 40rpx;
}

.security-status-card {
  margin-bottom: 32rpx;
  padding: 32rpx;
  border-radius: $border-radius-xl;
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;

  .status-info {
    flex: 1;
    margin-left: 16rpx;

    .status-title {
      display: block;
      font: $font-body-bold;
      color: $neutral-900;
      margin-bottom: 4rpx;
    }

    .status-desc {
      display: block;
      font: $font-body-medium;

      &.success {
        color: $success-500;
      }

      &.warning {
        color: $warning-500;
      }

      &.error {
        color: $error-500;
      }
    }
  }

  .status-score {
    .score-text {
      font: $font-heading-medium;
      color: $primary-500;
    }
  }
}

.status-progress {
  .progress-bar {
    height: 8rpx;
    background: $neutral-200;
    border-radius: 4rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      transition: all 0.3s ease;

      &.success {
        background: linear-gradient(90deg, $success-500, lighten($success-500, 20%));
      }

      &.warning {
        background: linear-gradient(90deg, $warning-500, lighten($warning-500, 20%));
      }

      &.error {
        background: linear-gradient(90deg, $error-500, lighten($error-500, 20%));
      }
    }
  }
}

.security-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 40rpx;
}

.security-item-card {
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2rpx);
    box-shadow: $shadow-glass;
  }
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;

  .item-icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;

    &.fund-password-icon {
      background: linear-gradient(135deg, $primary-500, darken($primary-500, 10%));
    }

    &.twofa-icon {
      background: linear-gradient(135deg, $neutral-400, darken($neutral-400, 10%));

      &.active {
        background: linear-gradient(135deg, $success-500, darken($success-500, 10%));
      }
    }

    &.logout-icon {
      background: linear-gradient(135deg, $error-500, darken($error-500, 10%));
    }
  }

  .item-info {
    flex: 1;

    .item-title {
      display: block;
      font: $font-body-bold;
      color: $neutral-900;
      margin-bottom: 8rpx;
    }

    .item-desc {
      display: block;
      font: $font-body-medium;
      color: $neutral-600;
      margin-bottom: 8rpx;
    }

    .item-status {
      display: block;
      font: $font-caption-medium;

      &.enabled {
        color: $success-500;
      }

      &.disabled {
        color: $neutral-400;
      }

      &.danger {
        color: $error-500;
      }
    }
  }
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .status-badge {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.enabled {
      background: $success-500;
    }

    &.disabled {
      background: $neutral-400;
    }
  }
}

.security-tips {
  background: rgba($warning-500, 0.05);
  border: 2rpx solid rgba($warning-500, 0.2);
  border-radius: $border-radius-lg;
  padding: 32rpx;

  .tips-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 24rpx;

    .tips-title {
      font: $font-body-bold;
      color: $warning-500;
    }
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;

    .tip-text {
      flex: 1;
      font: $font-body-medium;
      color: $neutral-700;
      line-height: 1.5;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 32rpx;
}

.modal-content {
  background: white;
  border-radius: $border-radius-xl;
  max-width: 640rpx;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;

  &.fund-password-modal,
  &.twofa-modal {
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 32rpx 0;
      margin-bottom: 32rpx;

      .modal-title {
        flex: 1;
        font: $font-heading-medium;
        color: $neutral-900;
        margin-left: 16rpx;
      }

      .close-btn {
        cursor: pointer;
      }
    }
  }

  &.confirm-modal {
    text-align: center;
    padding: 48rpx 32rpx 32rpx;

    .confirm-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24rpx;
      margin-bottom: 24rpx;

      .confirm-title {
        font: $font-heading-medium;
        color: $error-500;
      }
    }

    .confirm-desc {
      font: $font-body-medium;
      color: $neutral-700;
      line-height: 1.6;
      margin-bottom: 40rpx;
    }

    .confirm-actions {
      display: flex;
      gap: 16rpx;

      .cancel-btn,
      .confirm-btn {
        flex: 1;
        height: 88rpx;
      }
    }
  }
}

.modal-form {
  padding: 0 32rpx 32rpx;

  .form-group {
    margin-bottom: 32rpx;
  }

  .input-label {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 16rpx;

    .label {
      font: $font-body-bold;
      color: $neutral-900;
      flex: 1;
    }

    .required {
      color: $error-500;
      font-weight: bold;
    }
  }

  .input-wrapper {
    position: relative;

    .form-input {
      width: 100%;
      height: 88rpx;
      padding: 0 24rpx;
      border: 2rpx solid #444;
      border-radius: $border-radius-lg;
      font: $font-body-medium;
      color: #ffffff;
      background: transparent;

      &:focus {
        border-color: $primary-500;
        box-shadow: 0 0 0 4rpx rgba($primary-500, 0.1);
      }

      &::placeholder {
        color: #9AA4AE;
      }

      &.error {
        border-color: $error-500;
        background: rgba($error-500, 0.05);
      }

      &::placeholder {
        color: $neutral-400;
      }
    }

    .password-toggle {
      position: absolute;
      right: 24rpx;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      padding: 8rpx;
    }
  }

  .captcha-group {
    display: flex;
    gap: 16rpx;

    .captcha-input-wrapper {
      flex: 1;
    }

    .captcha-container {
      width: 160rpx;
      height: 88rpx;
      border: 2rpx solid $neutral-200;
      border-radius: $border-radius-lg;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        border-color: $primary-500;
      }

      .captcha-image {
        width: 100%;
        height: 100%;
        border-radius: $border-radius-md;
      }

      .captcha-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
      }
    }
  }

  .sms-group {
    display: flex;
    gap: 16rpx;
    align-items: flex-end;

    .sms-input-wrapper {
      flex: 1;
    }
  }

  .error-msg {
    display: block;
    margin-top: 8rpx;
    font: $font-caption-medium;
    color: $error-500;
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    margin-top: 24rpx;

    &.danger {
      background: linear-gradient(135deg, $error-500, darken($error-500, 10%));
    }
  }
}

.qr-section {
  text-align: center;
  margin-bottom: 32rpx;

  .qr-title {
    display: block;
    font: $font-body-bold;
    color: $neutral-900;
    margin-bottom: 24rpx;
  }

  .qr-code {
    width: 320rpx;
    height: 320rpx;
    margin: 0 auto 24rpx;
    border: 2rpx solid $neutral-200;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    .qr-image {
      width: 100%;
      height: 100%;
      border-radius: $border-radius-md;
    }

    .qr-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16rpx;

      .loading-text {
        font: $font-caption-medium;
        color: $neutral-600;
      }
    }
  }

  .qr-desc {
    display: block;
    font: $font-body-medium;
    color: $neutral-600;
    line-height: 1.5;
  }
}

.unbind-warning {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx;
  background: rgba($error-500, 0.05);
  border: 2rpx solid rgba($error-500, 0.2);
  border-radius: $border-radius-lg;
  margin-bottom: 32rpx;

  .warning-content {
    flex: 1;

    .warning-title {
      display: block;
      font: $font-body-bold;
      color: $error-500;
      margin-bottom: 8rpx;
    }

    .warning-desc {
      display: block;
      font: $font-body-medium;
      color: $neutral-700;
      line-height: 1.5;
    }
  }
}

// 响应式适配
@media (max-width: 768rpx) {
  .security-page {
    padding: 0 16rpx 24rpx;
  }

  .security-header {
    padding: 40rpx 0 24rpx;
  }

  .security-item {
    padding: 24rpx;
  }

  .item-left .item-icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 16rpx;
  }

  .modal-overlay {
    padding: 16rpx;
  }

  .modal-form {
    padding: 0 24rpx 24rpx;
  }

  .qr-code {
    width: 280rpx;
    height: 280rpx;
  }
}
</style>