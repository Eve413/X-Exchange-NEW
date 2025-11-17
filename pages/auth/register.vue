<template>
  <view class="page" :key="locale">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部右侧：语言/地球图标 -->
    <view class="hdr">
      <image
        class="ic-lang"
        :src="switchIcon"
        mode="widthFix"
        @tap="langOpen = true"
      />
    </view>

    <!-- 语言抽屉 -->
    <LanguageSheet
      :open="langOpen"
      @close="langOpen = false"
      @changed="onLangChanged"
    />

    <!-- 标题 -->
    <view class="title-wrap">
      <text class="ttl">{{ t("auth.registerTitle") }}</text>
      <text class="sub">{{ t("auth.subtitle") }}</text>
    </view>

    <!-- 表单 -->
    <view class="form">
      <!-- 手机号 + 发送验证码 -->

      <FloatingInput
        v-model="form.mobile"
        :label="t('auth.phoneNumber')"
        :placeholder="t('auth.phoneNumberPlaceholder')"
        :isPhone="true"
        type="number"
        :isSend="true"
        :sendDisabled="!mobileOk"
        :country="selectedCountry"
        @sendTap="onSendSms"
        @selectCountry="onOpenSelectCountry"
      />

      <!-- 短信验证码 -->
      <FloatingInput
        v-model="form.smsCode"
        :label="t('auth.smsCodePlaceholder')"
        :placeholder="t('auth.smsCodePlaceholder')"
        type="text"
      />

      <!-- 登录密码 -->
      <FloatingInput
        v-model="form.password"
        :label="t('auth.password')"
        :placeholder="t('auth.registerPasswordPlaceholder')"
        :isPassword="true"
      />

      <!-- 再次确认密码 -->

      <FloatingInput
        v-model="form.password2"
        :label="t('auth.confirmPassword')"
        :placeholder="t('auth.confirmPasswordPlaceholder')"
        :isPassword="true"
      />

      <FloatingInput
        v-model="form.referralCode"
        :label="t('auth.invitationCode')"
        :placeholder="t('auth.invitationCode')"
        type="text"
      />

      <!-- 邀请码 -->
      <FloatingInput
        ref="verifyInput"
        :label="t('auth.inviteCode')"
        :placeholder="t('auth.inviteCodePlaceholder')"
        v-model="form.imgCodeInput"
        :isVerification="true"
        @codeChange="serverCode = $event"
      />

      <!-- 提交 -->
      <button class="btn-submit" @tap="onSubmit" :disabled="submitting">
        {{ t("auth.register") }}
      </button>

      <!-- 底部登录引导 -->
      <view class="login-tip">
        <text>{{ t("auth.alreadyHaveAccount") }}</text>
        <text class="link" @tap="goLogin">{{ t("auth.loginNow") }}</text>
      </view>

      <!-- 其他登录方式 -->
      <view class="other">
        <view class="divider"
          ><text>{{ t("auth.otherLoginWays") }}</text></view
        >
        <view class="oauth">
          <view class="oauth-item">
            <image
              class="oauth-ic"
              :src="qqIcon"
              mode="widthFix"
            />
            <text class="oauth-txt">QQ</text>
          </view>
          <view class="oauth-item" @click="loginWithGoogle">
            <image
              class="oauth-ic"
              :src="googleIcon"
              mode="widthFix"
            />
            <text class="oauth-txt">Google</text>
          </view>
          <view class="oauth-item">
            <image
              class="oauth-ic"
              :src="facebookIcon"
              mode="widthFix"
            />
            <text class="oauth-txt">Facebook</text>
          </view>
        </view>
      </view>
    </view>

    <CountryPicker v-model:show="showPicker" @select="onSelectCountry" />
  </view>

  <!-- <Alert
    :show="showAlert"
    :title="t('auth.verifySms')"
    :description="messageAlert"
    :cancelText="''"
    :confirmText="t('common.confirm')"
    @confirm="handleConfirm"
  /> -->
</template>

<script setup lang="ts">
import LanguageSheet from "@/components/LanguageSheet.vue";
import { computed, onMounted, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  RegisterParams,
  useUserStore,
  VerifyPhoneParams,
  LoginGoogleParams
} from "@/store/modules/user";
import FloatingInput from "@/components/FloatingInput.vue";
import CountryPicker from "@/components/CountryPicker.vue";
import Alert from "@/components/ui/Alert.vue";
import { navigateTo, reLaunch } from "@/utils/navigation";
import switchIcon from "@/static/icons/switch.png";
import qqIcon from "@/static/icons/qq.png";
import googleIcon from "@/static/icons/google.png";
import facebookIcon from "@/static/icons/facebook.png";

const showAlert = ref(false);
const messageAlert = ref("");
const verifyInput = ref(null);
const { t, locale } = useI18n();
  const userStore = useUserStore();
let oauth;
var showPicker: Ref<boolean, boolean> = ref(false);
const selectedCountry = ref({
  flag: "/static/flags/cn.png",
  dial: 86,
  code: "CN",
  name: "中国大陆(CN)",
});

// 状态栏高度
const statusBarHeight = ref(0);

// 语言切换
const langOpen = ref(false);
function onLangChanged(code: string) {
  uni.showToast({
    title: t("lang.switchedTo", { name: t(`lang.names.${code}`) }),
    icon: "none",
  });
}

const form = ref({
  mobile: "",
  smsCode: "",
  password: "",
  password2: "",
  referralCode: "",
  payPwd: "",
  invite: "",
  imgCodeInput: "",
});

const submitting = ref(false);
const showPwd = ref(false);
const showPwd2 = ref(false);
const showPayPwd = ref(false);

const cd = ref(0); // 短信倒计时
let timer: number | undefined;

// 显示/隐藏图标路径
const eyeOpen = "/static/icons/status/icon.png"; // 显示（明文）
const eyeClose = "/static/icons/status/icon-1.png"; // 隐藏（密文）

// 简单图形验证码（本地生成 6 位，后端接入后替换）
const captcha = ref(makeCaptcha());
function makeCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function refreshCaptcha() {
  captcha.value = makeCaptcha();
  uni.showToast({ title: t("common.refreshed"), icon: "none" });
}

const mobileOk = computed(() => /^\d{10,12}$/.test(form.value.mobile));
const pwdOk = computed(() =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#\$%\^&\*\.]{8,32}$/.test(
    form.value.password
  )
);
const payPwdOk = computed(() => /^\d{6}$/.test(form.value.payPwd));
const inviteOk = computed(() => form.value.invite.trim().length > 0);
const imgOk = computed(
  () =>
    form.value.imgCodeInput.trim().toUpperCase() ===
    verifyInput.value.code.toUpperCase()
);

onMounted(() => {
    const cache = uni.getStorageSync("login_cache");
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;

  if (!cache) return;
  try {
    const obj = JSON.parse(cache);
    mobile.value = obj.mobile || "";
    if (obj.remember && obj.pwd) {
      password.value = decodeURIComponent(escape(atob(obj.pwd)));
      remember.value = true;
    }
  } catch {}
});

async function onSendSms() {
  if (!mobileOk.value) {
    uni.showToast({ title: t("auth.phoneRequired"), icon: "none" });
    return;
  }



  const params: VerifyPhoneParams = {
    phone_code: "+" + selectedCountry.value.dial,
    username: form.value.mobile,
    lang: "zh",
    passkey: userStore.pasKeyAuth,
    device: userStore.deviceAuth,
    appversion: userStore.appversionAuth,
  };

  const result = await userStore.verifyPhone(params);

  messageAlert.value = result.data.msg;
  showAlert.value = true;
   uni.showModal({
              title: t('auth.verifySms'),
              content: result.data.msg,
              showCancel: false,
              confirmText: t('common.confirm')
            })
  // TODO: 接入后端短信接口
  // uni.showToast({ title: t('auth.smsCodeSent'), icon: 'none' })
  cd.value = 60;
  clearInterval(timer as number);
  timer = setInterval(() => {
    cd.value--;
    if (cd.value <= 0) clearInterval(timer as number);
  }, 1000) as unknown as number;
}

function goLogin() {
  navigateTo({ url: "/pages/auth/login" });
}

async function onSubmit() {
  if (!mobileOk.value) return tip(t("auth.phoneRequired"));
  if (!form.value.smsCode || form.value.smsCode.length < 4)
    return tip(t("auth.smsCodeInvalid"));
  if (!pwdOk.value) return tip(t("auth.passwordComplexity"));
  if (form.value.password !== form.value.password2)
    return tip(t("auth.passwordMismatch"));
  // if (!payPwdOk.value) return tip(t('auth.fundPasswordRequired'))
  // if (!inviteOk.value) return tip(t('auth.inviteCodeInvalid'))
  if (!imgOk.value) return tip(t("auth.captchaInvalid"));

  submitting.value = true;
  try {
    const params: RegisterParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      phone_code: "+" + selectedCountry.value.dial,
      username: form.value.mobile,
      password: form.value.password,
      referral_code: form.value.referralCode,
      verification_code: form.value.smsCode,
      lang: "zh",
    };

    const result = await userStore.register(params);

    // 检查注册是否成功
    if (result && result.data && result.data.status === "success") {
      // 注册成功，保存用户注册状态
      const userInfo = {
        mobile: form.value.mobile,
        registerTime: new Date().toISOString(),
      };

      // 保存用户信息到本地存储
      uni.setStorageSync("userInfo", userInfo);
      uni.setStorageSync("isRegistered", true);

      console.log("✅ 注册成功，已设置 isRegistered 标志");
    }

    const message = encodeURIComponent(result.data.msg);
    const status = encodeURIComponent(result.data.status);
    // uni.showToast({ title: t('common.operationSuccess'), icon: 'success' })
    setTimeout(
      () =>
        reLaunch({
          url: "./status",
          params: { status, message },
        }),
      600
    );
  } catch (e) {
    uni.showToast({ title: t("auth.registerFailed"), icon: "none" });
  } finally {
    submitting.value = false;
  }
}

function onOpenSelectCountry() {
  showPicker.value = !showPicker.value;
}

function onSelectCountry(item) {
  selectedCountry.value = item;
}

function handleConfirm() {
  showAlert.value = false;
}

function goToLogin() {
  console.log("Tombol diklik — arahkan ke halaman login!");
  // contoh:
  // router.push('/login')
}

function tip(title: string) {
  uni.showToast({ title, icon: "none" });
}

function loginWithGoogle() {
  uni.login({
      provider: 'google',
      success: function (res) {
          console.log('Google Login Result:', res);
          handleGoogleResponse(res?.authResult?.openid)
      },
      fail: function (err) {
          console.error('Login Error:', err);
      }
  });
}

async function handleGoogleResponse(id_token) {
  console.log("Google Access Token:", id_token);

 try {
    const paramsLogin: LoginGoogleParams = {
      id_token: id_token,
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      lang: 'en',
    };

    const resultAuth = await userStore.loginGoogle(paramsLogin);

    if (resultAuth.data.status == 1) {
      // TODO: 调用后端登录
      if (remember.value) {
        const encoded = btoa(unescape(encodeURIComponent(password.value)));
        uni.setStorageSync("login_cache", JSON.stringify(resultAuth));
      } else {
        uni.removeStorageSync("login_cache");
      }

      // 保存用户登录状态
      const userInfo = {
        mobile: mobile.value,
        loginTime: new Date().toISOString(),
      };
      uni.setStorageSync("userInfo", userInfo);
      uni.setStorageSync("isRegistered", true);
      uni.setStorageSync("isLoggedIn", true);
      uni.setStorage({
        key: "userData",
        data: resultAuth,
        success: () => {
          console.log("Data saved to local storage");
        },
      });

      setTimeout(() => goHome(), 500);
    } else {
      messageAlert.value = resultAuth.data.msg;
      showAlert.value = true;
       uni.showModal({
              title: t('auth.verifySms'),
              content: resultAuth.data.msg,
              showCancel: false,
              confirmText: t('common.confirm')
            })
    }
  } catch (e) {
    toast(t("auth.loginFail"));
  } finally {
    submitting.value = false;
  }
}

function toast(title: string) {
  uni.showToast({ title, icon: "none" });
}
</script>

<style lang="scss" scoped>
$page-pad: 32rpx;
/* 主题色：主文字 #FFFFFF，副文字 #9AA4AE */
$bg: #202020;
$muted: #9aa4ae;
$white: #ffffff;
$brand: #6f4bfd;

.page {
  min-height: 100vh;
  background: $bg;
  color: $white;
  padding: 0 $page-pad 60rpx;
  box-sizing: border-box;
}

.status-bar {
  background: $bg;
}

.hdr {
  position: relative;
  padding: 40rpx 0 10rpx;
  text-align: right;

  .ic-lang {
    width: 64rpx;
    height: 64rpx;
  }
}

.title-wrap {
  text-align: center;
  margin: 60rpx 0 48rpx;

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

.form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

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

/* 行内有按钮的行 */
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

/* 发送 / 图形验证码按钮 */
.btn-sms,
.btn-captcha {
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
  margin: 12rpx 0 0rpx;
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

.login-tip {
  text-align: center;
  // margin: 16rpx 0;
  font-size: 24rpx;
  color: $muted;

  .link {
    color: $brand;
    margin-left: 8rpx;
  }
}

.other {
  // margin-top: 32rpx;
}

.divider {
  text-align: center;
  color: $muted;
  font-size: 22rpx;
  position: relative;
  margin: 24rpx 0 32rpx;
  color: #666666;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1rpx;
    background: #999999;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

/* 第三方登录 */
.oauth {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 24rpx;

  .oauth-item {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
    // border: 1rpx solid #2e2e2e;
    background: transparent;
    box-shadow: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:active {
      background: rgba(111, 75, 253, 0.1);
      border-color: $brand;
    }

    .oauth-ic {
      width: 84rpx;
      height: 84rpx;
      margin-bottom: 8rpx;
    }

    .oauth-txt {
      font-size: 22rpx;
      color: $muted;
    }
  }
}
</style>
