<template>
    <view class="page">
    <!-- Header -->
         <!-- Header (tetap di atas) -->
    <view class="header">
      <image
        class="back"
        src="/static/icons/ic_arrow_left.png"
        mode="aspectFit"
        @click="goBack"
      />
      <text class="title">{{ $t('discover.success.copy-title') }}</text>
    </view>
        <!-- card -->
    <view class="success-card">
      <!-- ikon lingkaran -->
        <view class="circle-wrap">
            <view class="circle c1"></view>
            <view class="circle c2"></view>
            <view class="circle c3"></view>
            <view class="circle center-circle">
            <text class="check">✓</text>
            </view>
         </view>

        <text class="success-text"> {{ $t('discover.success.copy-success') }}</text>
        <text class="desc">
            {{ $t('discover.success.copy-success-desc') }} {{ copyTradeSummary?.data?.expertCode ?? '' }}
        </text>
    </view>
        <view class="card-margin">
                <CopyTradeSummaryCard
                    :copyAmount="`${copyTradeSummary?.data?.copyAmount ?? 0}USDT`"
                    :stopLoss="`${copyTradeSummary?.data?.stopLossRatio ?? 0}%`"
                    :takeProfit="`${copyTradeSummary?.data?.takeProfitRatio ?? 0}%`"
            />
        </view>

        <!-- RealTimeStatus --> 
          <view class="card-margin">
            <RealTimeStatus
                :followingTrades="copyTradeSummary?.data?.followingTrades ?? 0"
                :progress="copyTradeSummary?.data?.progress ?? 70"
                :currentPnl="`${copyTradeSummary?.data?.currentPnl ?? 0}USDT`"
                :returnRate="`${copyTradeSummary?.data?.returnRate ?? 0}%`"
                :todaysCopyTrades="copyTradeSummary?.data?.todaysCopyTrades ?? 0"
                :winRate="`${copyTradeSummary?.data?.winRate ?? 0}%`"
            />
          </view>
         
        <!-- Trader Information Success -->
        <view class="card-margin">
            <TraderInformationSuccess
                avatar="https://via.placeholder.com/80"
                :name="copyTradeSummary?.data?.fullName ?? ''"
                :followers="copyTradeSummary?.data?.totalFollower ?? 0"
                status="Active"
                :returnRate="String(copyTradeSummary?.data?.returnRate ?? 0)"
                :aum="String(copyTradeSummary?.data?.aum ?? 0)"
            />
        
        <!-- Recent Orders -->
        <view class="card-margin">
            <RecentOrders
                :orders="recentOrder"
            />  
        </view> 
        </view>
        <BottomTabBar :currentPath="currentRoute" @change="handleTabChange" />
    </view>
</template>

<script setup lang="ts">
    import { CopyTradeSummaryCard, RealTimeStatus, TraderInformationSuccess, RecentOrders, BottomTabBar } from '@/components';
    import { onLoad } from '@dcloudio/uni-app'
    import { ref, computed } from 'vue'
    import { useUserStore } from '@/store/modules/user'
	  import { useI18n } from 'vue-i18n'
	 import { useTradingStore } from '@/store/modules/trading';

    const expertId = ref<number | null>(null)
    const currentRoute = ref('/pages/discover/index')
    const userStore = useUserStore()
    const tradingStore = useTradingStore()
    const copyTradeSummary = ref<any>(null)
    const recentOrdersData = ref<any[]>([])

    const { t } = useI18n()
    
    // Map recent orders data to the format expected by RecentOrders component
    const recentOrder = computed(() => {
        return recentOrdersData.value.map((order: any) => ({
            type: order.side, // 'buy' or 'sell' maps to 'long' or 'short'
            symbol: order.symbol,
            time: `${order.minutesAgo}`,
            pnl: order.pnl
        }))
    })
    
    // Read expertId from URL parameters
    onLoad((options) => {
        if (options?.expertId) {
            expertId.value = parseInt(options.expertId)
            console.log('Received expertId:', expertId.value)

            // Fetch copy trade summary using expertId
            tradingStore.getCopyTradeSummary(expertId.value).then((summary) => {
                copyTradeSummary.value = summary
                console.log('Copy Trade Summary:', copyTradeSummary.value)
            }).catch((error) => {
                console.error('Error fetching copy trade summary:', error)
            })  

            // Fetch recent orders using expertId
            tradingStore.getRecentOrders(expertId.value, 5).then((orders) => {
                recentOrdersData.value = orders.data
                console.log('Recent Orders:', recentOrdersData.value)
            }).catch((error) => {
                console.error('Error fetching recent orders:', error)
            })
        }
    })
    
    // Navigasi
    const goBack = () => {
    // Ensure we always land on Discover regardless of tabBar usage
    uni.reLaunch({ url: '/pages/follow/index' })
    }
	const handleTabChange = (tab: any, index: number) => {
	  console.log('Tab切换:', tab.label, index)
	  currentRoute.value = tab.path
	}
</script>
    
<style lang="scss" scoped>
    .page {
    background-color: #121212;
    color: #fff;
    height: 210vh;
    overflow: hidden;
    position: relative;
        /* Push content below the fixed header (adjusted after reducing header height by 50rpx) */
        padding-top: 90rpx;
    }

    .card-margin{
        margin: 10rpx;
    }

/* Header dan Progress tetap di atas */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #121212;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120rpx;
  padding-top: 10rpx;
}
.back {
  position: absolute;
  left: 40rpx;
  width: 48rpx;
  height: 48rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 600;
}

.success-card {
  /* Reduced top margin since page has padding-top */
  margin: 26rpx 26rpx 0;
  background: #1a1c1f;
  border-radius: 20rpx;
  border-width: 3rpx;
  border-style: solid;
  border-color: #2b6ff7;
  padding: 80rpx 20rpx 60rpx;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.circle-wrap {
  width: 200rpx;
  height: 200rpx;
  position: relative;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-bottom: 20rpx;
}

.circle {
  position: absolute;
  border-radius: 999rpx;
  background: rgba(43, 111, 247, 0.25);
}

.c1 {
  width: 200rpx;
  height: 200rpx;
}
.c2 {
  width: 150rpx;
  height: 150rpx;
  background: rgba(43, 111, 247, 0.3);
}
.c3 {
  width: 110rpx;
  height: 110rpx;
  background: rgba(43, 111, 247, 0.5);
}

.center-circle {
  width: 80rpx;
  height: 80rpx;
  background: #2b6ff7;
  justify-content: center;
  align-items: center;
  display: flex;
}

.check {
  color: #ffffff;
  font-size: 44rpx;
  line-height: 44rpx;
}

.success-text {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
}

.desc {
  color: #9fa8b7;
  font-size: 24rpx;
  text-align: center;
}
</style>