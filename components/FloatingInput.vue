<template>
  <view class="field">
    <view class="input-wrapper">
      <!-- 🔹 Bagian kiri (bendera + kode negara) -->
      <view
        v-if="isPhone"
        class="country-select"
        @tap="$emit('selectCountry')"
      >
        <image class="flag" :src="country.flag" mode="aspectFit" />
        <text class="code">+{{ country.dial }}</text>
        <text class="arrow">▼</text>
        <view class="divider"></view>
      </view>

      <!-- floating label -->
      <text
        v-if="modelValue || isFocused"
        class="floating-label active"
      >
        {{ label }}
      </text>

      <!-- input utama -->
      <input
        class="ipt"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.detail.value)"
        :placeholder="isFocused || modelValue ? '' : placeholder"
        :password="isPassword && !showPassword"
        :type="inputType"
        @focus="isFocused = true"
        @blur="isFocused = !!modelValue"
      />

      <!-- eye toggle untuk password -->
      <view
        v-if="isPassword"
        class="eye-wrapper"
        @tap="togglePassword"
      >
        <image
          class="eye-icon"
          :src="showPassword ? eyeOpenSrc : eyeCloseSrc"
          mode="aspectFit"
        />
      </view>

      <!-- verification code -->
      <view
        v-if="isVerification"
        class="verify-btn"
        @tap="refreshCode"
      >
        <text class="verify-text">{{ code }}</text>
      </view>

      <!-- send button -->
      <view
        v-if="isSend"
        class="send-btn"
        :class="{ disabled: sendDisabled }"
        @tap="!sendDisabled && $emit('sendTap')"
      >
        <text class="send-text" :class="{ disabledText: sendDisabled }">{{ sendLabel }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import eyeOpenSrc from "@/static/icons/ic_eye.png";
import eyeCloseSrc from "@/static/icons/ic_eye_close.png";

const props = defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
  isPassword: { type: Boolean, default: false },
  isVerification: { type: Boolean, default: false },
  isSend: { type: Boolean, default: false },
  isPhone: { type: Boolean, default: false },
  sendDisabled: { type: Boolean, default: false },
  country: {
    type: Object,
    default: () => ({
      flag: "/static/flags/cn.png",
      dial: 86,
      code: "CN",
    }),
  },
});

defineEmits(["update:modelValue", "sendTap", "selectCountry"]);

const isFocused = ref(false);
const showPassword = ref(false);
const code = ref("WW6ERX");
const { t } = useI18n();
const sendLabel = computed(() => t('auth.sendCode'))

const inputType = computed(() => {
  if (props.isPassword) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function refreshCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let newCode = "";
  for (let i = 0; i < 6; i++) {
    newCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code.value = newCode;
}

defineExpose({
  code,
  refreshCode,
});
</script>

<style scoped>
.field {
  position: relative;
  height: 96rpx;
  border-radius: 20rpx;
  background: #2a2a2a;
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* 🔹 bagian kode negara */
.country-select {
  display: flex;
  /* padding-top: 10rpx; */
  align-items: center;
  margin-right: 16rpx;
}

.flag {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.code {
  color: #fff;
  font-size: 28rpx;
}

.arrow {
  color: #a0a0a0;
  font-size: 22rpx;
  margin-left: 4rpx;
}

.divider {
  width: 2rpx;
  height: 40rpx;
  background: #444;
  margin-left: 16rpx;
}

.ipt {
  flex: 1;
  height: 70rpx;
  color: #fff;
  font-size: 28rpx;
  /* padding-top: 10rpx; */
  background: transparent;
}

.floating-label {
  position: absolute;
  top: -26rpx;
  left: 28rpx;
  color: #9AA4AE;
  font-size: 24rpx;
  transition: all 0.2s ease;
  pointer-events: none;
  opacity: 0;
}

.floating-label.active {
  opacity: 1;
}

.eye-wrapper {
  margin-left: 16rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-placeholder{
  color: #9AA4AE !important;
}

.eye-icon {
  width: 48rpx;
  height: 48rpx;
}

.verify-btn {
  margin-left: 12rpx;
  padding: 0 20rpx;
  height: 60rpx;
  border-radius: 12rpx;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}

/* 🔹 Tombol Kirim */
.send-btn {
  margin-left: 12rpx;
  padding: 0 28rpx;
  height: 60rpx;
  border-radius: 12rpx;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn.disabled {
  background: #444;
}

.send-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
}

.send-text.disabledText {
  color: #999;
}
</style>
