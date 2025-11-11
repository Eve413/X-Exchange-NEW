<template>
  <view class="announcement-detail">
    <view class="page-content">
      <!-- 公告详情头部 -->
      <view class="announcement-header">
        <text class="announcement-title">{{ announcement.title || '公告详情' }}</text>
        <text class="announcement-date">{{ announcement.date || '2024-01-01' }}</text>
      </view>

      <!-- 公告内容 -->
      <view class="announcement-content">
        <text class="content-text">{{ announcement.content || '公告内容加载中...' }}</text>
      </view>

      <!-- 返回按钮 -->
      <view class="actions">
        <GlassButton variant="ghost" size="md" @click="goBack">
          <Icon name="arrow-left" size="sm" />
          返回列表
        </GlassButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { GlassButton, Icon } from '@/components'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 公告详情数据
const announcement = ref({
  id: '',
  title: '',
  content: '',
  date: '',
})

// 页面加载
onLoad((option) => {
  if (option.id) {
    loadAnnouncementDetail(option.id)
  }
})


// 加载公告详情
const loadAnnouncementDetail = async (id: string) => {
  try {
    // TODO: 接入后端API
    // const response = await api.getAnnouncementDetail(id)
    // announcement.value = response.data
    
    // 模拟数据
    announcement.value = {
      id,
      title: '重要公告：系统维护通知',
      content: `为了提供更好的服务体验，我们将于近期对系统进行升级维护。
      
维护时间：2024年1月15日 02:00 - 06:00
影响范围：交易功能暂停，其他功能正常

维护期间您可能无法进行以下操作：
• 买卖交易
• 充值提现
• 转账功能

其他功能如查看行情、账户余额等将正常运行。

我们将在维护完成后第一时间恢复所有功能，由此造成的不便敬请谅解。

如有任何问题，请联系客服。

感谢您的理解与支持！

X交易所团队`,
      date: '2024-01-01 10:30'
    }
  } catch (error) {
    console.error('加载公告详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

// 返回列表
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.announcement-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 60upx 32upx 40upx;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 32upx;
}

.announcement-header {
  display: flex;
  flex-direction: column;
  gap: 16upx;
  padding: 32upx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24upx;
  border: 1upx solid rgba(255, 255, 255, 0.1);
}

.announcement-title {
  font: $font-heading-medium;
  color: $text-color-primary;
  line-height: 1.4;
}

.announcement-date {
  font: $font-caption-medium;
  color: $text-color-secondary;
}

.announcement-content {
  padding: 32upx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24upx;
  border: 1upx solid rgba(255, 255, 255, 0.1);
}

.content-text {
  font: $font-body-medium;
  color: $text-color-primary;
  line-height: 1.6;
  white-space: pre-wrap;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 32upx;
}
</style>
