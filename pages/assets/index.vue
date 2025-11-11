<template>
  <view class="assets-page">
    <SafeTop :extraPadding="0" />
    <view class="page-content">
      <GlassCard variant="primary" size="lg">
        <template #header>
          <Icon name="rocket" size="xl" color="error" />
          <text class="page-title">我的资产</text>
        </template>

        <view class="coming-soon">
          <Icon name="wallet" size="2xl" color="error" />
          <text class="title">资产页面开发中...</text>
          <text class="desc">资金管理、充提功能即将完善</text>
        </view>
      </GlassCard>
    </view>

    <!-- 资产页不显示自定义底栏 -->
  </view>
</template>

<script setup lang="ts">
import { GlassCard, Icon, SafeTop } from "@/components";

// 顶部安全区由 SafeTop 统一处理

// 无底栏，不需要 Tab 切换处理
</script>

<style lang="scss" scoped>
.assets-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #2d1020 0%, #3d1828 100%);
  padding-bottom: 240upx; // 为底部导航栏留出空间
}

.page-content {
  padding: 60upx 32upx 40upx;
}

.page-title {
  font: $font-heading-medium;
  color: #ff6b9d;
  margin-left: 16upx;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24upx;
  padding: 80upx 40upx;
  text-align: center;
}

.title {
  font: $font-heading-medium;
  color: $text-color-primary;
}

.desc {
  font: $font-caption-medium;
  color: $text-color-secondary;
  line-height: 1.6;
}
</style>
