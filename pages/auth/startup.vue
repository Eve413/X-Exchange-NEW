<template>
  <view class="launch">
    <!-- 顶部：品牌 + 语言按钮（同一行，垂直居中） -->
    <view class="topbar">
      <view class="brand">
        <text class="app">{{ $tl("brand.name|FinX 1.5") }}</text>
        <text class="team">by {{ $tl("brand.by|by Henry's Team") }}</text>
      </view>

      <!-- 语言按钮：64×64rpx，无底圆 -->
      <image
        class="lang-fab"
        src="/static/icons/switch-1.png"
        mode="widthFix"
        @tap="langOpen = true"
      />
    </view>

    <LanguageSheet
      :open="langOpen"
      @close="langOpen = false"
      @changed="onLangChanged"
    />

    <!-- 主标题 -->
    <view class="hero">
      <text class="line1">{{ $tl("hero.feature1|Zero fee payment") }}</text>
      <text class="line2">
        {{ $tl("hero.feature2.prefix|on ")
        }}<text class="brand-em">{{ $tl("hero.feature2.brand|XTrade") }}</text>
      </text>
      <text class="sub">{{
        $tl(
          "hero.description|No 1 design for E-bank, e-wallet, personal financial mobileapplication."
        )
      }}</text>
    </view>

    <!-- 装饰图形 -->
    <view class="candles">
      <view class="c c1"></view>
      <view class="c c2"></view>
      <view class="c c3"></view>
      <view class="c c4"></view>
      <view class="c c5"></view>
      <view class="c c6"></view>
      <view class="c c7"></view>
    </view>

    <!-- CTA -->
    <button class="cta" @tap="goStart">
      {{ $tl("launch.cta|Get Started") }}
    </button>
  </view>
</template>

<script setup lang="ts">
import LanguageSheet from "@/components/LanguageSheet.vue";
// 语言图标使用模板静态路径，避免 '@/static' 别名在模板中使用
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { goHome, goLogin, goRegister } from "@/utils/navigation";

const { t } = useI18n();
const langOpen = ref(false);
function onLangChanged(code: string) {
  uni.showToast({
    title: t("lang.switchedTo", { name: t(`lang.names.${code}`) }),
    icon: "none",
  });
}
function goStart() {
  // 检查用户是否已注册
  checkUserStatus();
}

// 检查用户注册状态
function checkUserStatus() {
  try {
    // 检查用户登录状态
    const isLoggedIn = uni.getStorageSync("isLoggedIn");

    // 如果已登录，直接跳转到首页
    if (isLoggedIn) {
      console.log("✅ 用户已登录，跳转到首页");
      goHome();
      return;
    }

    // 检查本地存储中是否有用户信息（判断是否已注册）
    const userInfo = uni.getStorageSync("userInfo");
    const userData = uni.getStorageSync("userData");
    const isRegistered = uni.getStorageSync("isRegistered");

    // 判断用户是否已注册
    const hasRegistered = isRegistered || userInfo || userData;

    if (hasRegistered) {
      // 已注册用户，跳转到登录页面
      console.log("✅ 用户已注册，跳转到登录页");
      goLogin();
    } else {
      // 未注册用户，跳转到注册页面
      console.log("✅ 用户未注册，跳转到注册页");
      goRegister();
    }
  } catch (error) {
    console.error("❌ 检查用户状态失败:", error);
    // 出错时默认跳转到注册页面
    goRegister();
  }
}
</script>

<style lang="scss" scoped>
$page-pad: 32rpx;
$bg: #121212;
$muted: #9aa4ae;
$white: #ffffff;
$brand: #6f4bfd;

.launch {
  position: relative;
  min-height: 100vh;
  padding: 120rpx $page-pad 60rpx;
  color: $white;
  background: linear-gradient(
    180deg,
    #6675df 0%,
    #8a63d2 35%,
    #c45f9a 70%,
    #e06c66 100%
  );
  box-sizing: border-box;
  overflow: hidden;
}

/* 新增：顶部一行，让语言按钮与两行文字垂直居中 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 关键：纵向居中到品牌块的中线 */
}

/* 品牌/版本 */
.brand {
  .app {
    display: block;
    font-size: 48rpx;
    font-weight: 800;
    letter-spacing: 1rpx;
  }

  .team {
    display: block;
    margin-top: 0rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

/* 语言按钮：64×64rpx，无圆形底、无阴影 */
.lang-fab {
  width: 64rpx;
  height: 64rpx;
  padding: 0;
  background: none;
  border-radius: 0;
  backdrop-filter: none;
  box-shadow: none;
}

/* 主标题区 */
.hero {
  margin-top: 80rpx;

  .line1 {
    display: block;
    font-size: 64rpx;
    font-weight: 800;
    line-height: 1.2;
    text-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.15);
  }

  .line2 {
    display: block;
    margin-top: 16rpx;
    font-size: 96rpx;
    font-weight: 800;
    line-height: 1.2;
  }

  .brand-em {
    color: #b9c8ff;
    font-size: 96rpx;
  }

  .sub {
    display: block;
    margin-top: 24rpx;
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.8);
    max-width: 640rpx;
  }
}

/* 装饰烛台与 CTA（原样） */
.candles {
  position: absolute;
  left: $page-pad;
  right: $page-pad;
  bottom: 220rpx;
  height: 320rpx;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  opacity: 0.85;

  .c {
    margin: 0 12rpx;
    width: 40rpx;
    border-radius: 20rpx;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.25)
    );
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15) inset;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 100%;
      width: 4rpx;
      height: 140rpx;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 2rpx;
    }
  }

  .c1 {
    height: 210rpx;
  }

  .c2 {
    height: 140rpx;
  }

  .c3 {
    height: 260rpx;
  }

  .c4 {
    height: 320rpx;
    width: 48rpx;
  }

  .c5 {
    height: 120rpx;
  }

  .c6 {
    height: 220rpx;
  }

  .c7 {
    height: 160rpx;
  }
}

.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 72rpx;
  width: 686rpx;
  height: 84rpx;
  border-radius: 20rpx;
  background: $brand;
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.cta:active {
  opacity: 0.85;
}

.cta:disabled {
  opacity: 0.5;
}
</style>
