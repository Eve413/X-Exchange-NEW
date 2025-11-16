<template>
  <view class="page" :key="locale">
    <!-- 顶部安全区占位 -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>
    <!-- 顶部：返回 / 语言 -->
    <view class="hdr">
      <text class="back" @tap="goBack">
        <image :src="backBtn" class="backBtn" />
      </text>
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
      <text class="ttl">{{ t("auth.loginTitle") }}</text>
      <text class="sub">{{ t("auth.subtitle") }}</text>
    </view>

    <!-- 表单 -->
    <view class="form">
      <FloatingInput
        v-model="mobile"
        :label="t('auth.phoneNumberPlaceholder')"
        :placeholder="t('auth.phoneNumberPlaceholder')"
        type="number"
        :isPhone="true"
        :country="selectedCountry"
        @selectCountry="onOpenSelectCountry"
      />

      <FloatingInput
        v-model="password"
        :label="t('auth.passwordPlaceholder')"
        :placeholder="t('auth.passwordPlaceholder')"
        :isPassword="true"
      />

      <FloatingInput
        ref="verifyInput"
        :label="t('auth.inviteCode')"
        :placeholder="t('auth.captchaPlaceholder')"
        v-model="imgCodeInput"
        :isVerification="true"
        @codeChange="serverCode = $event"
      />

      <view class="bar">
        <view class="remember" @tap="remember = !remember">
          <view class="ckbox" :class="{ checked: remember }"></view>
          <text class="txt">{{ t("auth.rememberPassword") }}</text>
        </view>
        <text class="forgot" @tap="goForgot">{{
          t("auth.forgotPassword")
        }}</text>
      </view>

      <button class="btn-submit" :disabled="submitting" @tap="onLogin">
        {{ t("auth.login") }}
      </button>

      <view class="login-tip">
        <text>{{ t("auth.noAccount") }}</text>
        <text class="link" @tap="goRegister">{{ t("auth.registerNow") }}</text>
      </view>
    </view>
    <view class="other">
      <view class="divider"
        ><text>{{ t("auth.otherLoginWays") }}</text></view
      >
      <view class="oauth">
        <view class="oauth-item">
          <image class="oauth-ic" :src="qqIcon" mode="widthFix" />
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
    <CountryPicker v-model:show="showPicker" @select="onSelectCountry" />
  </view>

  <Alert
    :show="showAlert"
    :title="t('error.unauthorized')"
    :description="messageAlert"
    :cancelText="''"
    :confirmText="t('common.confirm')"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import LanguageSheet from "@/components/LanguageSheet.vue";
import { onMounted, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import backBtn from "@/static/icons/backBtn.png";
import switchIcon from "@/static/icons/switch.png";
import qqIcon from "@/static/icons/qq.png";
import googleIcon from "@/static/icons/google.png";
import facebookIcon from "@/static/icons/facebook.png";
// 语言图标使用模板静态路径，避免 '@/static' 别名在模板中使用
import FloatingInput from "@/components/FloatingInput.vue";
import { useUserStore, LoginParams, LoginGoogleParams } from "@/store/modules/user";
import CountryPicker from "@/components/CountryPicker.vue";
import Alert from "@/components/ui/Alert.vue";
import { error } from "console";
import { goHome } from "@/utils/navigation";
import { useSafeArea } from "@/utils/composables/useSafeArea";

const serverCode = ref("");
const userStore = useUserStore();

const showAlert = ref(false);
var showPicker: Ref<boolean, boolean> = ref(false);
const selectedCountry = ref({
  flag: "/static/flags/cn.png",
  dial: 86,
  code: "CN",
  name: "中国大陆(CN)",
});
const verifyInput = ref(null);
const { t, locale } = useI18n();
const { getTopStyle } = useSafeArea();

/** 语言抽屉 */
const langOpen = ref(false);
function onLangChanged(code: string) {
  uni.showToast({
    title: t("lang.switchedTo", { name: t(`lang.names.${code}`) }),
    icon: "none",
  });
}

/** 登录表单 */
const mobile = ref("");
const password = ref("");
const imgCodeInput = ref("");
const showPwd = ref(false);
const submitting = ref(false);
const remember = ref(true);
const messageAlert = ref("");
let oauth;

onMounted(() => {
  const cache = uni.getStorageSync("login_cache");

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

function goBack() {
  uni.navigateBack();
}
function goRegister() {
  uni.navigateTo({ url: "/pages/auth/register" });
}
function goForgot() {
  uni.navigateTo({ url: "/pages/auth/forgot" });
}

function validMobile(v: string) {
  return /^\d{10,12}$/.test(v);
} // 海外规则自行替换

async function onLogin() {

  if (!validMobile(mobile.value)) return toast(t("auth.phoneInvalid"));
  if (!mobile.value) return toast(t("auth.phoneInvalid"));
  if (!password.value) return toast(t("auth.passwordRequired"));
  if (
    imgCodeInput.value.trim().toUpperCase() !==
    verifyInput.value.code.toUpperCase()
  ) {
    return toast(t("auth.captchaInvalid"));
  }

  submitting.value = true;
  try {
    const paramsLogin: LoginParams = {
      phone_code: "+" + selectedCountry.value.dial, // "+62",
      username: mobile.value, //"812323312324",
      password: password.value, //"Test123456$",
      lang: "zh",
      passkey: "68de05da-f258-46a4-805d-f0e365ca98e3-android-api",
      device: "android",
      appversion: "1.0",
    };

    const resultAuth = await userStore.authenticateds(paramsLogin);

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
    }
  } catch (e) {
    toast(t("auth.loginFail"));
  } finally {
    submitting.value = false;
  }
}

function onOpenSelectCountry() {
  showPicker.value = !showPicker.value;
  console.log("MMMM");
}

function onSelectCountry(item) {
  selectedCountry.value = item;
}

function handleConfirm() {
  showAlert.value = false;
}

function toast(title: string) {
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
    }
  } catch (e) {
    toast(t("auth.loginFail"));
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
$page-pad: 32rpx;
$bg: #202020;
$muted: #9aa4ae;
$white: #ffffff;
$brand: #6f4bfd;

.page {
  min-height: 100vh;
  background: $bg;
  color: $white;
  padding: 50rpx $page-pad 60rpx;
  box-sizing: border-box;
  position: relative;
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
  }

  .ic-lang {
    position: absolute;
    right: 0;
    top: 8px;
    width: 64rpx;
    height: 64rpx;
  }
}

.title-wrap {
  text-align: center;
  margin: 80rpx 0 48rpx;

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
  }
}

.row {
  display: flex;
  gap: 6rpx;

  .ipt {
    flex: 1;
  }
}

.backBtn {
  width: 18rpx;
  height: 32rpx;
}

.field.row {
  padding-right: 6rpx;
}

.btn-captcha {
  width: 160rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: $brand;
  color: #fff;
  font-size: 28rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 6rpx 6rpx 6rpx 0;
  flex: 0 0 160rpx;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8rpx;

  .remember {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .txt,
  .forgot {
    color: $muted;
    font-size: 26rpx;
  }
}

.ckbox {
  width: 28rpx;
  height: 28rpx;
  border-radius: 6rpx;
  border: 2rpx solid #6f4bfd;
  box-sizing: border-box;
  position: relative;
}

.ckbox.checked {
  background: #6f4bfd;
  border-color: #6f4bfd;
}

.ckbox.checked::after {
  content: "";
  position: absolute;
  left: 7rpx;
  top: 4rpx;
  width: 7rpx;
  height: 9rpx;
  border: 3rpx solid #ffffff;
  border-top: 0;
  border-left: 0;
  transform: rotate(45deg);
  border-radius: 2rpx;
}

.btn-submit {
  width: 686rpx;
  height: 84rpx;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  color: #fff;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 600;
  align-self: center;
  margin: 32rpx auto 0;
}

.login-tip {
  text-align: center;
  margin-top: -8rpx;
  font-size: 24rpx;
  color: $muted;

  .link {
    color: $brand;
    margin-left: 8rpx;
  }
}

.other {
  margin: 0 auto;
  position: absolute;
  bottom: 50rpx;
  left: 0;
  width: 100%;
  box-sizing: border-box;
}

.divider {
  text-align: center;
  color: $muted;
  font-size: 24rpx;
  position: relative;
  margin: 16rpx 0 24rpx;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 26%;
    height: 2rpx;
    background: #2e2e2e;
  }

  &::before {
    left: $page-pad;
  }

  &::after {
    right: $page-pad;
  }
}

.oauth {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .oauth-item {
    width: 140rpx;
    height: 140rpx;
    border-radius: 20rpx;
    border: none;
    background: transparent;
    box-shadow: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .oauth-ic {
      width: 84rpx;
      height: 84rpx;
      margin-bottom: 12rpx;
    }

    .oauth-txt {
      font-size: 24rpx;
      color: $muted;
    }
  }
}
</style>
