<template>
  <view class="page" :key="locale">
    <!-- 顶部安全区：参照市场页使用 getTopStyle -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>

    <!-- 顶部：返回/语言 -->
    <view class="hdr">
      <text class="back" @tap="goBack">
        <image :src="backBtn" class="backBtn" />
      </text>
      <image class="ic-lang" :src="switchIcon" mode="widthFix" @tap="langOpen = true" />
    </view>

    <!-- 语言抽屉 -->
    <LanguageSheet :open="langOpen" @close="langOpen=false" @changed="onLangChanged" />

    <!-- 标题 -->
    <view class="title-wrap">
      <text class="ttl">{{ t('auth.forgotPasswordTitle') }}</text>
      <text class="sub">{{ t('auth.subtitle') }}</text>
    </view>

    <!-- 表单 -->
    <view class="form">
      <!-- 手机号 + 发送验证码 -->

       <FloatingInput
        v-model="mobile"
        :label="t('auth.phoneNumber')"
        :placeholder="t('auth.phoneNumberPlaceholder')"
        type="number" 
        :isPhone="true"
        :isSend="true"
        :sendDisabled="!mobileOk" 
        :country="selectedCountry"
        @sendTap="onSendSms"
        @selectCountry="onOpenSelectCountry"
      />


      <!-- 短信验证码 -->

      <FloatingInput
          v-model="smsCode"
          :label="t('auth.smsCode')"
          :placeholder="t('auth.smsCodePlaceholder')"
          type="text"
        />

      <!-- 新密码 -->
        <FloatingInput
          v-model="password"
          :label="t('auth.newPassword')"
          :placeholder="t('auth.newPasswordPlaceholder')"
          :isPassword="true"
        />

      <!-- 确认新密码 -->
        <FloatingInput
          v-model="password2"
          :label="t('auth.confirmNewPassword')"
          :placeholder="t('auth.confirmNewPasswordPlaceholder')"
          :isPassword="true"
        />

      <!-- 提交 -->
      <button class="btn-submit" :disabled="submitting" @tap="onSubmit">{{ t('auth.confirmModify') }}</button>

      <!-- 安全提示 -->
      <view class="tips">
        <view class="tips-hd">
          <!-- 保留原路径，改为 aspectFit -->
          <image class="tips-ic" :src="safetyIcon" mode="aspectFit" />
          <text class="tips-title">{{ t('auth.securityTips') }}</text>
        </view>
        <view class="tips-list">
          <text class="dot">•</text><text class="item">{{ t('auth.passwordTip1') }}</text>
        </view>
        <view class="tips-list">
          <text class="dot">•</text><text class="item">{{ t('auth.passwordTip2') }}</text>
        </view>
        <view class="tips-list">
          <text class="dot">•</text><text class="item">{{ t('auth.passwordTip3') }}</text>
        </view>
      </view>
    </view>

     <CountryPicker
      v-model:show="showPicker"
      @select="onSelectCountry"
    />

  </view>

  <Alert
      :show="showAlert"
      :title="titleAlert"
      :description="messageAlert"
      :cancelText="''" 
      :confirmText="t('common.confirm')"
      @confirm="handleConfirm"
    />

</template>

<script setup lang="ts">
import LanguageSheet from '@/components/LanguageSheet.vue'
import { computed, onMounted, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FloatingInput from '@/components/FloatingInput.vue'
import CountryPicker from "@/components/CountryPicker.vue";
import {ResetPasswordParams, useUserStore, VerifyPhoneParams} from '@/store/modules/user'
import Alert from '@/components/ui/Alert.vue'
import { useSafeArea } from '@/utils/composables/useSafeArea'
import backBtn from "@/static/icons/backBtn.png"
import switchIcon from "@/static/icons/switch.png"
import safetyIcon from "@/static/icons/status/safety.png"

const { t, locale } = useI18n()
const { getTopStyle } = useSafeArea()
var showPicker: Ref<boolean, boolean> = ref(false)
const selectedCountry = ref({
  flag: "/static/flags/cn.png",
  dial: 86,
  code: "CN",
  name: "中国大陆(CN)",
})

// 语言切换
const langOpen = ref(false)
function onLangChanged(code: string) {
  uni.showToast({ title: t('lang.switchedTo', { name: t(`lang.names.${code}`) }), icon: 'none' })
}

const mobile = ref('')
const smsCode = ref('')
const password = ref('')
const password2 = ref('')
const showPwd = ref(false)
const showPwd2 = ref(false)
const submitting = ref(false)

const sesionId = ref('')
const titleAlert = ref('')
const showAlert = ref(false)
const messageAlert = ref('')

const cd = ref(0) // 短信倒计时
let timer: number | undefined
const mobileOk = computed(() => /^\d{10,12}$/.test(mobile.value))
const pwdOk = computed(() => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#\$%\^&\*\.]{8,32}$/.test(password.value))

// 状态栏高度已由 useSafeArea 处理，无需手动获取

function goBack() { uni.navigateBack() }


async function onSendSms() {
  // if (!mobileOk.value) {
  //   return uni.showToast({ title: t('auth.phoneRequired'), icon: 'none' })
  // }

  const userStore = useUserStore()

     
      const params: VerifyPhoneParams = {
              phone_code: "+"+selectedCountry.value.dial,
              username: mobile.value,
              lang: "zh",
              otp: smsCode.value,
              passkey: userStore.pasKeyAuth,
              device: userStore.deviceAuth,
              appversion: userStore.appversionAuth,
          };

          const result = await userStore.sendOTPForgot(params)

          sesionId.value = result.data.session_id
          titleAlert.value = t('auth.verifySms')
          messageAlert.value =  result.data.msg
          showAlert.value = true

  // TODO: 接后端短信发送
  // await api.sendSms({ mobile: mobile.value, scene: 'reset' })
  uni.showToast({ title: t('auth.smsCodeSent'), icon: 'none' })
  cd.value = 60
  clearInterval(timer as number)
  timer = setInterval(() => {
    cd.value--
    if (cd.value <= 0) clearInterval(timer as number)
  }, 1000) as unknown as number
}

async function onSubmit() {
  const userStore = useUserStore()
  // if (!mobileOk.value) return toast(t('auth.phoneRequired'))
  // if (!smsCode.value || smsCode.value.length < 4) return toast(t('auth.smsCodeInvalid'))
  // if (!pwdOk.value) return toast(t('auth.passwordComplexity'))
  // if (password.value !== password2.value) return toast(t('auth.passwordMismatch'))

  submitting.value = true
  try {

     const params: ResetPasswordParams = {

      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      phone_code: "+"+selectedCountry.value.dial,
      username: mobile.value,
      session_id: sesionId.value,
      password: password.value,
      new_password: password2.value,
      lang: "zh"
    };

    const result = await userStore.resetPassword(params)
    

    if (result.data.status == 1) {
         // TODO: 接后端重置密码接口
    // await api.resetPwd({ mobile: mobile.value, code: smsCode.value, password: password.value })
    
    // 重置密码成功后，清除登录状态，让用户重新登录
    uni.removeStorageSync('isLoggedIn')
    uni.removeStorageSync('login_cache')
    
    uni.showToast({ title: t('auth.passwordResetSuccess'), icon: 'success' })
    setTimeout(() => uni.reLaunch({ url: '/pages/auth/login' }), 600)
    } else {
      messageAlert.value =  result.data.msg
      showAlert.value = true
      titleAlert.value = t('auth.forgotPasswordTitle')
    }

   
  } catch (e) {
    toast(t('auth.resetPasswordFailed'))
    console.log(e)
  } finally {
    submitting.value = false
  }
}

function onOpenSelectCountry() {
  showPicker.value = !showPicker.value
  console.log("MMMM")
}

function onSelectCountry(item) {
  selectedCountry.value = item
}

function handleConfirm() {
  showAlert.value = false
}

function toast(title: string) { uni.showToast({ title, icon: 'none' }) }
</script>

<style lang="scss" scoped>
$page-pad: 32rpx;
/* 主题：主文字 #FFFFFF，副文字 #9AA4AE */
$bg: #202020;
$muted: #9AA4AE;
$white: #FFFFFF;
$brand: #6F4BFD;

.page {
  min-height: 100vh;
  background: $bg;
  color: $white;
  padding: 40rpx $page-pad 60rpx;
  box-sizing: border-box;
}

.status-bar {
  background: $bg;
}

.hdr {
  position: relative;
  padding-top: 8px;

  .back {
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 56rpx;
    line-height: 56rpx;
    color: $white;
    z-index: 10;
  }
  .backBtn{
    width: 18rpx;
    height: 32rpx;
  }

  .ic-lang {
    position: absolute;
    right: 0;
    top: 8px;
    width: 64rpx;
    height: 64rpx;
    z-index: 10;
  }
}

.title-wrap {
  text-align: center;
  padding: 80rpx 0 48rpx;

  .ttl {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    line-height: 1.2;
    color: $white;
  }

  .sub {
    display: block;
    margin-top: 12rpx;
    font-size: 26rpx;
    color: $muted;
  }
}

/* 表单纵向间距 */
.form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 输入框 */
.field {
  background: #2a2a2a;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  border: 1rpx solid #333333;
  margin-bottom: 12rpx;
  transition: all 0.3s ease;
  position: relative;

  &:focus-within {
    border-color: $brand;
    box-shadow: 0 0 0 2rpx rgba(111, 75, 253, 0.2);
    background: #2d2d2d;
  }

  &:hover {
    border-color: #444444;
  }

  .ipt {
    flex: 1;
    color: $white;
    font-size: 28rpx;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
  }

  .ipt::placeholder {
    color: $muted;
    font-size: 28rpx;
  }
}

.field.with-ic {
  position: relative;

  .ic-eye {
    position: absolute;
    right: 24rpx;
    width: 32rpx;
    height: 32rpx;
    z-index: 5;
  }
}

/* 行内按钮规范 */
.row {
  display: flex;
  gap: 12rpx;

  .ipt {
    flex: 1;
  }
}

.field.row {
  padding-right: 12rpx;
}

/* 发送短信按钮 */
.btn-sms {
  width: 160rpx;
  height: 68rpx;
  border-radius: 12rpx;
  background: $brand;
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10rpx 0;
  flex: 0 0 160rpx;
  border: none;
  transition: all 0.3s ease;

  &:active {
    background: darken($brand, 10%);
    transform: scale(0.98);
  }
}

.btn-sms:disabled {
  background: #666;
  opacity: 0.6;
}

/* 主按钮 */
.btn-submit {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  color: #fff;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin: 32rpx 0 24rpx;
  border: none;
  transition: all 0.3s ease;

  &:active {
    background: darken($brand, 10%);
    transform: scale(0.98);
  }

  &:disabled {
    background: #666;
    opacity: 0.6;
  }
}

/* 提示卡片 */
.tips {
  margin-top: 16rpx;
  background: rgba(111, 75, 253, 0.12);
  border-radius: 16rpx;
  padding: 24rpx;
  color: $white;
  // border: 1rpx solid rgba(111, 75, 253, 0.2);
}

.tips-hd {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .tips-ic {
    width: 28rpx;
    height: 28rpx;
    display: inline-block;
  }

  .tips-title {
    font-size: 26rpx;
    color: #6F4BFD;
    font-weight: 600;
  }
}

.tips-list {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-top: 12rpx;
  line-height: 1.5;
  padding-left: 30rpx;
}

.dot {
  color: #6F4BFD;
  font-size: 24rpx;
  line-height: 36rpx;
  flex-shrink: 0;
}

.item {
  color: #6F4BFD;
  opacity: 0.92;
  font-size: 26rpx;
  flex: 1;
}
</style>
