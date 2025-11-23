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
		<view class="button-row">
			<view class="modify-btn" @click="handleModifyFollow">
				<text>{{ $t('discover.success.modify') }}</text>
			</view>
			<view class="stop-btn" @click="handleStopFollow">
				<text>{{ $t('discover.success.stop') }}</text>
			</view>
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
	const expertID = ref(0);
	
    onLoad((options) => {
        if (options?.expertId) {
			      expertID.value = parseInt(options.expertId)
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
    uni.reLaunch({ url: '/pages/discover/index' })
    }
	const handleTabChange = (tab: any, index: number) => {
	  console.log('Tab切换:', tab.label, index)
	  currentRoute.value = tab.path
	}
	
	const handleStopFollow = () => {
		uni.showModal({
			title: t('discover.success.stop'),
			content: t('market.confirmStopFollow'),
			confirmText: t('market.stop'),
			cancelText: t('market.cancel'),
			success: async (res) => {
				if (res.confirm) {
					try {
						// Prepare subscription parameters
						console.log("Expert ID", expertID.value);
						// Call the subscribe API
						const response = await tradingStore.unSubscribeCopyTrader(expertID.value)
						console.log('✅ Un Subscription successful:', response)
						if (response?.status == 1) {
							// Navigate to success page after successful subscription
							uni.navigateTo({
								url: `/pages/discover/index`,
								success: () => console.log('✅ Navigated to success page'),
								fail: (err) => console.error('❌ Navigation failed:', err)
							})
						} else {
							uni.showToast({
								title: t('market.operationFailed'),
								icon: "none",
								duration: 2000
							});
						}
		
					} catch (e) {
						console.error('❌ Error during subscription:', e)
						uni.showToast({
							title: t('market.operationFailed'),
							icon: "none",
							duration: 2000
						});
					}
		
					// 临时：显示成功提示
					uni.showToast({
						title: t('market.followSuccess'),
						icon: "success",
						duration: 2000
					});
		
					// 保险：定时关闭，防止特定环境下Toast不自动消失
					setTimeout(() => {
						try { uni.hideToast(); } catch (e) { /* noop */ }
					}, 2100);
		
					console.log("✅ 跟单成功");
		
					// 可以在这里跳转到跟单详情页面或返回上一页
					// setTimeout(() => {
					//   uni.navigateBack();
					// }, 1500);
				}
			},
		});
	}
	
	const handleModifyFollow = () => {
		
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

.button-row {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
  padding: 10rpx;
}

.stop-btn {
	background: linear-gradient(175deg, #5246a3, #d75b99);
	padding: 20rpx;
	text-align: center;
	border-radius: 20rpx;
	font-size: 28rpx;
	font-weight: 500;
	flex: 1;
}

.modify-btn {
  border: 2rpx solid #666;
  color: #ccc;
  background-color: transparent;
  font-size: 28rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  text-align: center;
  flex: 1;
}
</style>