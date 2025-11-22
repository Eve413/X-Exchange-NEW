<template>
	<view class="discover-page">
		<!-- 页面内容 -->
		<view class="page-content">
			<!-- 顶部安全区：参照市场页使用 getTopStyle -->
			<view class="status-bar-spacer" :style="getTopStyle(0)"></view>
			<view class="header">
				<!-- Avatar -->
				<image class="avatar" src="/static/icons/ic_avatar.png" mode="aspectFill" />

				<!-- Search Bar -->
				<view class="search-bar">
					<image class="search-icon" src="/static/icons/searchImg.png" mode="aspectFit" />
					<text class="search-text">{{ t('discover.search_select') }}</text>
				</view>
				<view class="notification-wrapper" @click="goToCustomerService">
					<image class="header-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" />
				</view>
				<view class="notification-wrapper" @click="goToNotification">
					<image class="header-icon" src="/static/icons/ic_bell.png" mode="aspectFit" />
					<view class="notification-badge"></view>
				</view>
			</view>

			<!-- Banner区域 -->
			<!-- <scroll-view class="banner-section" scroll-x>
        <view class="banner-list">
          <view class="banner-item" @click="goToBannerDetail(1)">
            <view class="banner-gradient">
              <text class="banner-text">{{ t('discover.banner_text_1') }}</text>
            </view>
          </view>
          <view class="banner-item" @click="goToBannerDetail(2)">
            <view class="banner-gradient">
              <text class="banner-text">{{ t('discover.banner_text_2') }}</text>
            </view>
          </view>
          <view class="banner-item" @click="goToBannerDetail(3)">
            <view class="banner-gradient">
              <text class="banner-text">{{ $t('discover.banner_text_3') }}</text>
            </view>
          </view>
        </view>
      </scroll-view> -->

			<Banner :banners="bannerList.length > 0 ? bannerList : bannerListDummy" @click="handleBannerClick" />

			<!-- 身份认证提示 -->
			<view class="verification-tip" @click="goToVerification">
				<image class="tip-icon" src="/static/icons/warnIcon.png" mode="aspectFit" />
				<text class="tip-text">{{ t('discover.verification_tip') }}</text>
				<text class="arrow">›</text>
			</view>

			<!-- Menu 1 -->
			<view class="menu1">
				<view v-for="item in menuItems" :key="item.text" class="menu1-item" @click="selectItem(item.text)">
					<image :src="item.icon" class="menu1-icon" mode="aspectFit" />
					<text class="menu1-label">
						{{ item.text }}
					</text>
				</view>
			</view>

			<!-- 公告栏 -->
			<view class="announcement" @click="goToAnnouncement">
				<image class="announcement-icon" src="/static/icons/announcement.png" mode="aspectFit" />
				<text class="announcement-text">{{ t('discover.announcement_text') }}</text>
				<text class="arrow">›</text>
			</view>

			<!-- 交易员列表 -->
			<view class="traders-section">
				<!-- <view class="section-header">
          <text class="section-title">热门交易员</text>
          <view class="section-more">
            <text class="more-text">查看更多</text>
            <text class="arrow">›</text>
          </view>
        </view> -->

				<!-- <view class="trader-list">
					<view class="trader-card" v-for="trader in traderList" :key="trader.id">
						<view class="trader-header">
							<image class="trader-avatar" :src="trader.avatar" mode="aspectFit" />
							<view class="trader-info">
								<text class="trader-name">{{ trader.name }}</text>
								<view class="trader-score">
									<image class="humanIcon" src="/static/icons/humanIcon.png" mode="aspectFit" />
									<text class="score1">{{ trader.score }}</text>/{{ trader.maxScore }}
								</view>
							</view>
							<view class="trader-actions">
								<text class="detail-btn"
									@click="goToTraderDetail(trader.id)">{{ t('discover.trader_detail') }}</text>
								<text class="follow-btn"
									@click="followTrader(trader.id)">{{ t('discover.follow_trade') }}</text>
							</view>
						</view>
						<view class="trader-stats">
							<view class="stat-item">
								<text class="stat-label">{{ t('discover.thirty_day_profit') }}</text>
								<text class="stat-value">{{ trader.profit }}</text>
							</view>
							<view class="stat-item">
								<text class="stat-label">{{ t('discover.thirty_day_returns') }}</text>
								<text class="stat-value">{{ trader.returns }}%</text>
							</view>
							<view class="stat-item">
								<text class="stat-label">{{ t('discover.asset_management_scale') }}</text>
								<text class="stat-value1">{{
                  trader.assets.toLocaleString()
                }}</text>
							</view>
							<view class="stat-item">
								<text class="stat-label">{{ t('discover.sharpe_ratio') }}</text>
								<text class="stat-value1">{{ trader.sharpe }}</text>
							</view>
						</view>
					</view>
				</view> -->

			</view>

			<TradeCard v-for="(trader, index) in traderList" :key="index" :avatar="trader.photo || ''"
				:username="trader.code || 'Unknown'" :followers="trader.followers || 0"
				:maxFollowers="trader.maxFollowers || 0" :profitLoss="trader.profitLoss || 0"
				:returnRate="trader.returnRate || 0" :aum="trader.aum || 0" :sharpeRatio="trader.sharpeRatio || 0"
				@detail="handleShowDetail(trader.traderId)" @follow="handleFollow(trader.traderId)" />

			<!-- 年化收益产品 -->
			<view class="products-section">
				<!-- <view class="section-header">
          <text class="section-title">年化收益</text>
          <view class="section-more">
            <text class="more-text">查看更多</text>
            <text class="arrow">›</text>
          </view>
        </view> -->

				<scroll-view class="products-scroll" scroll-x>
					<view class="product-card" v-for="product in listMarketData" :key="product.id">
						<view class="product-header">
							<image class="product-icon" :src="product.icon" mode="aspectFit" />
							<view class="product-info">
								<text class="product-name">{{ product.baseAsset }} / {{ product.quoteAsset }}</text>
								<text class="product-price">{{ t('discover.product_price') }}</text>
							</view>
						</view>
						<image class="product-chart" :src="product.sparkline" mode="aspectFit" />
						<view class="product-stats">
							<text class="rate-label">{{ t('discover.annual_rate') }}</text>
							<view class="rate-container">
								<view class="up-arrow"></view>
								<text class="product-rate">{{ formatSharpe(product.percentChange24h) }}%</text>
								<!-- <image class="" src="/static/icons/arrow_up.png" mode="aspectFit" /> -->
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 空投活动 -->
			<view class="airdrop-section">
				<!-- <view class="section-header">
          <text class="section-title">热门空投</text>
          <view class="section-more">
            <text class="more-text">查看更多</text>
            <text class="arrow">›</text>
          </view>
        </view> -->

				<view class="airdrop-list">
					<view class="airdrop-card" v-for="airdrop in listAirdrops" :key="airdrop.id">
						<view class="airdrop-header">
							<view class="left-box">
								<image class="airdrop-icon" :src="airdrop.icon" mode="aspectFit" />
								<view class="airdrop-right"><text class="airdrop-name">{{ airdrop.name }}</text>
									<text class="airdrop-reward">{{ airdrop.reward }} {{ airdrop.token }}</text>
								</view>
							</view>
							<text class="airdrop-status">{{ t('discover.in_progress') }}</text>
						</view>

						<view class="airdrop-meta">
							<text class="airdrop-participants">{{ t('discover.participants') }}:
								{{ airdrop.participants }}</text>
							<text class="airdrop-countdown">{{ airdrop.countdown }}</text>
						</view>
						<text class="join-btn">{{ t('discover.join_airdrop') }}</text>
					</view>
					<!-- <view class="air-drop-container">
						<AirdropCard v-for="card in listAirdrops" :key="card.id" :icon="card.icon"
							:iconBgColor="card.iconBgColor" :tokenName="card.name"
							:tokenAmount="card.total_airdrop_usdt" :status="card.airdrop_status"
							:participants="card.participants" :countdown="card.countdown" :buttonText="card.buttonText"
							@join="handleJoinAirdrop" />
					</view> -->
				</view>
			</view>
		</view>

		<!-- 底部导航栏 -->
		<BottomTabBar :currentPath="currentRoute" @change="handleTabChange" />
	</view>
</template>

<script setup lang="ts">
	import { BottomTabBar, Banner, TradeCard } from "@/components";
	import { onMounted, ref, computed } from "vue";
	import { tl } from "@/utils/i18n";
	import { onLoad } from '@dcloudio/uni-app'
	import { useSafeArea } from "@/utils/composables/useSafeArea";
	import { useTradingStore } from '@/store/modules/trading';
	import { useUserStore, TickersParams } from "@/store/modules/user";


	const { getTopStyle } = useSafeArea();
	const t = tl;
	const tradingStore = useTradingStore();

	const currentRoute = ref("/pages/discover/index");

	// 菜单数据
	const menuItems = computed(() => [
		{ text: t('discover.menu_wealth'), icon: "/static/icons/finanIcon.png" },
		{ text: t('discover.menu_airdrop'), icon: "/static/icons/sellingIcon.png" },
		{ text: t('discover.menu_new_listing'), icon: "/static/icons/subscriptionIcon.png" },
		{ text: t('discover.menu_activity'), icon: "/static/icons/activeintoIcon.png" },
	]);

	// Banner data
	const bannerListDummy = ref([
		{
			id: 1,
			title: '新手福利',
			banner_url: 'https://api.icoinkey.com/img/view/general/2025/10/f/1D3FE1B497856E5C9F7D16BE3B462B3B_0x0.webp'
		},
		{
			id: 2,
			title: '交易大赛',
			banner_url: 'https://api.icoinkey.com/img/view/general/2025/10/f/1D3FE1B497856E5C9F7D16BE3B462B3B_0x0.webp'
		},
	])

	const activeItem = ref(t('discover.menu_wealth'));

	// 菜单选中状态保持

	// 选择菜单项
	const selectItem = (text : string) => {
		activeItem.value = text;
		// 点击理财按钮跳转到理财页面
		if (text === t('discover.menu_wealth')) {
			try {
				uni.navigateTo({
					url: "/pages/wealth/index",
					success: () => console.log("✅ 跳转到理财页面成功"),
					fail: (err) => console.error("❌ 跳转到理财页面失败:", err),
				});
			} catch (error) {
				console.error("跳转到理财页面函数执行出错:", error);
			}
		}
		// 点击空投按钮跳转到空投页面
		else if (text === t('discover.menu_airdrop')) {
			try {
				uni.navigateTo({
					url: "/pages/airdrop/index",
					success: () => console.log("✅ 跳转到空投页面成功"),
					fail: (err) => console.error("❌ 跳转到空投页面失败:", err),
				});
			} catch (error) {
				console.error("跳转到空投页面函数执行出错:", error);
			}
		}
		// 点击打新按钮跳转到打新页面
		else if (text === t('discover.menu_new_listing')) {
			try {
				uni.navigateTo({
					url: "/pages/wealth/newlisting",
					success: () => console.log("✅ 跳转到打新页面成功"),
					fail: (err) => console.error("❌ 跳转到打新页面失败:", err),
				});
			} catch (error) {
				console.error("跳转到打新页面函数执行出错:", error);
			}
		}
		// 点击活动按钮跳转到活动页面
		else if (text === t('discover.menu_activity')) {
			try {
				uni.navigateTo({
					url: "/pages/activity/index",
					success: () => console.log("✅ 跳转到活动页面成功"),
					fail: (err) => console.error("❌ 跳转到活动页面失败:", err),
				});
			} catch (error) {
				console.error("跳转到活动页面函数执行出错:", error);
			}
		}
	};

	// 交易员数据
	const traderListDummy = [
		{
			id: 1,
			name: "TUYJHJUI",
			avatar: "/static/icons/testAvatar.png",
			score: 70,
			maxScore: 550,
			profit: "+24.11",
			returns: "101.86",
			assets: 2113255.27,
			sharpe: 3.45,
		},
		{
			id: 2,
			name: "TUYJHJUI",
			avatar: "/static/icons/testAvatar.png",
			score: 70,
			maxScore: 550,
			profit: "+24.11",
			returns: "101.86",
			assets: 2113255.27,
			sharpe: 3.45,
		},
	];

	// 年化收益产品数据
	const productList = [
		{
			id: 1,
			name: "BTC",
			icon: "/static/logo/logos_bitcoin.png",
			chart: "/static/icons/line_chart.png",
			annualRate: "18.58",
		},
		{
			id: 2,
			name: "BTC",
			icon: "/static/logo/logos_bitcoin.png",
			chart: "/static/icons/line_chart.png",
			annualRate: "18.58",
		},
		{
			id: 3,
			name: "BTC",
			icon: "/static/logo/logos_bitcoin.png",
			chart: "/static/icons/line_chart.png",
			annualRate: "18.58",
		},
	];

	// 空投活动数据
	const airdropListDummy = [
		{
			id: 1,
			name: "PAWS",
			icon: "/static/icons/giftDark.png",
			reward: "500,000",
			token: "PROMPT",
			participants: 8421,
			countdown: "4d 15:23:11",
		},
		{
			id: 2,
			name: "PAWS",
			icon: "/static/icons/giftDark.png",
			reward: "500,000",
			token: "PROMPT",
			participants: 8421,
			countdown: "4d 15:23:11",
		},
	];

	// Banner list from API
	const bannerList = ref<any[]>([])

	// Trader list from API
	const traderList = ref<any[]>([])

	 const listAirdrops = ref<any[]>([])
	 const userStore = useUserStore();
	 const listMarketData = ref<any[]>([])

	onLoad(async (option) => {
		try {
			const bannersResponse = await tradingStore.getBanner();
			console.log('Banners raw response:', bannersResponse);

			// Extract the array from the response
			if (bannersResponse?.data?.data) {
				bannerList.value = bannersResponse.data.data;
			} else if (Array.isArray(bannersResponse?.data)) {
				bannerList.value = bannersResponse.data;
			} else {
				bannerList.value = [];
			}

			console.log('Banners loaded:', bannerList.value);
		} catch (e) {
			console.error('❌ Failed to load banners:', e)
		}

		try {
			const tickersParams : TickersParams = {
				passkey: userStore.pasKeyAuth,
				limit: 10,
				type: "",
			};
			const resultAuth = await userStore.getTickers(tickersParams);
			listMarketData.value = resultAuth.data || [];
			console.log("✅ Loaded market data:", listMarketData.value);

			// 如果API返回的数据为空，使用模拟数据
			if (!listMarketData.value || listMarketData.value.length === 0) {
				console.log("⚠️  API returned empty data, using mock data");
				listMarketData.value = productList;
			}
		} catch (e) {
			console.error("❌ Failed to load market data:", e);
			// 如果加载失败，使用模拟数据
			listMarketData.value = productList;
			console.log("⚠️  Using mock data due to API error");
		}

		try {

			const resultAuth = await tradingStore.fetchTraderPerforma();

			//Populate traderList with API data
			if (resultAuth?.data) {
				traderList.value = resultAuth.data;
			}

			console.log('Trading loaded:', traderList.value);

		} catch (e) {
			console.error('❌ Failed to load discover:', e)
		}

		try {
			const airdropsResponse = await tradingStore.getAirdrops();
			console.log('Airdrops raw response:', airdropsResponse);

			// Extract the array from the response
			if (airdropsResponse?.data?.data) {
				listAirdrops.value = airdropsResponse.data.data;
			} else if (Array.isArray(airdropsResponse?.data)) {
				listAirdrops.value = airdropsResponse.data;
			} else {
				listAirdrops.value = [];
			}

			console.log('Airdrops loaded:', listAirdrops.value);
		} catch (e) {
			console.error('❌ Failed to load airdrops:', e)
		}
	})

	onMounted(() => {
		// 获取当前路由
		const pages = getCurrentPages();
		if (pages.length > 0) {
			const currentPage = pages[pages.length - 1];
			currentRoute.value = `/${currentPage.route}`;
		}
	});
	
	// Handle airdrop join
	const handleJoinAirdrop = () => {
	  uni.showToast({
	    title: '已加入空投',
	    icon: 'success'
	  })
	}
	
	const handleBannerClick = () => {
		console.log("Banner")
	}

	// 处理Tab切换
	const handleTabChange = (tab : any, index : number) => {
		// 仅记录日志，实际导航由 BottomTabBar 处理
		// 不提前更新 currentRoute，避免与导航状态不一致
		console.log("Tab切换:", tab.label, index);
	};

	// 跳转到身份认证页面
	const goToVerification = () => {
		// setTimeout(() => {
		uni.navigateTo({
			url: "/pages/createkyc/intro",
			success: () => console.log("✅ Navigated"),
			fail: (err) => console.error("❌ Navigation failed:", err),
		});
		// }, 500);
	};

	// 跳转到公告页面
	const goToAnnouncement = () => {
		setTimeout(() => {
			uni.navigateTo({
				url: "/pages/notification/index",
				success: () => console.log("✅ Navigated"),
				fail: (err) => console.error("❌ Navigation failed:", err),
			});
		}, 500);
	};

	// 跳转到Banner详情页面
	const goToBannerDetail = (id : number) => {
		console.log("tiaozhuan");
	};

	// 跳转到消息通知页面
	const goToNotification = () => {
		try {
			console.log("准备跳转到消息通知页面...");
			uni.navigateTo({
				url: "/pages/notification/index",
				success: (res) => {
					console.log("跳转到消息通知页面成功:", res);
				},
				fail: (err) => {
					console.error("跳转到消息通知页面失败:", err);
				},
			});
		} catch (error) {
			console.error("跳转到消息通知页面函数执行出错:", error);
		}
	};

	// 跳转到客服页面
	const goToCustomerService = () => {
		try {
			console.log("准备跳转到客服页面...");
			uni.navigateTo({
				url: "/pages/customerservice/index",
				success: (res) => {
					console.log("跳转到客服页面成功:", res);
				},
				fail: (err) => {
					console.error("跳转到客服页面失败:", err);
				},
			});
		} catch (error) {
			console.error("跳转到客服页面函数执行出错:", error);
		}
	};

	// 跳转到交易员详情页面
	const handleShowDetail = (traderId : number) => {
		try {
			console.log("准备跳转到交易员详情页面...", traderId);
			uni.navigateTo({
				url: `/pages/market/index?traderId=${traderId}&type=detail`,
				success: (res) => {
					console.log("跳转到交易员详情页面成功:", res);
				},
				fail: (err) => {
					console.error("跳转到交易员详情页面失败:", err);
				},
			});
		} catch (error) {
			console.error("跳转到交易员详情页面函数执行出错:", error);
		}
	};

	// 跳转到跟单页面
	const handleFollow = (traderId : number) => {
		try {
			console.log("准备跳转到跟单页面...", traderId);
			uni.navigateTo({
				url: `/pages/market/index?traderId=${traderId}&type=follow`,
				success: (res) => {
					console.log("跳转到跟单页面成功:", res);
				},
				fail: (err) => {
					console.error("跳转到跟单页面失败:", err);
				},
			});
		} catch (error) {
			console.error("跳转到跟单页面函数执行出错:", error);
		}
	};

		// format helpers
	function formatSharpe(val : any) : string {
		const n = Number(val)
		if (!isFinite(n)) return '0.00'
		return n.toFixed(2)
	}
</script>

<style lang="scss" scoped>
	.discover-page {
		min-height: 100vh;
		background: #202020;
		padding-bottom: 300upx; // 为底部导航栏留出空间
	}

	.page-content {
		padding: 80upx 32upx 40upx;
	}

	/* Banner样式 */
	.banner-section {
		margin-bottom: 32rpx;
		white-space: nowrap;
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
	}

	.banner-list {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
	}

	.banner-item {
		border-radius: 40rpx;
		overflow: hidden;
		margin-right: 20rpx;
		width: 580rpx;
		flex-shrink: 0;
	}

	.banner-gradient {
		height: 200rpx;
		background: linear-gradient(135deg, #6a5acd, #ff69b4);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.banner-text {
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
	}

	/* 头部样式 */
	.header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	.search-bar {
		flex: 1;
		height: 72rpx;
		background-color: #434343;
		border-radius: 999rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}

	.search-icon {
		width: 38rpx;
		height: 38rpx;
		// opacity: 0.7;
	}

	.search-text {
		color: #cccccc;
		font-size: 28rpx;
		margin-left: 8rpx;
	}

	.header-icon {
		width: 46rpx;
		height: 46rpx;
		margin-left: 24rpx;
	}

	.notification-wrapper {
		position: relative;
	}

	.notification-badge {
		position: absolute;
		top: 0;
		right: 15rpx;
		width: 20rpx;
		height: 20rpx;
		background-color: #ef4444;
		border-radius: 50%;
	}

	/* 身份认证提示样式 */
	.verification-tip {
		display: flex;
		align-items: center;
		// background: #2A2A2A;
		border-radius: 20rpx;
		// padding: 24rpx 0rpx;
		margin-bottom: 32rpx;
	}

	.tip-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 12rpx;
	}

	.tip-text {
		flex: 1;
		color: #fff;
		font-size: 24rpx;
	}

	.arrow {
		color: #fff;
		font-size: 34rpx;
	}

	/* Menu 1样式 */
	.menu1 {
		display: flex;
		// background: #2A2A2A;
		// border-radius: 20rpx;
		padding: 0rpx 48rpx;
		margin-bottom: 32rpx;
		justify-content: space-between;
		// border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
	}

	.menu1-item {
		// flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16rpx 0;
	}

	.menu1-icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 12rpx;
	}

	.menu1-label {
		font-size: 24rpx;
		color: #999;
	}

	.menu1-active {
		color: #8b5cf6 !important;
	}

	/* 公告栏样式 */
	.announcement {
		display: flex;
		align-items: center;
		// background: linear-gradient(90deg, #4C5EF3, #667eea);
		// border-radius: 20rpx;
		// padding: 24rpx 32rpx;
		margin-bottom: 32rpx;
	}

	.announcement-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	.announcement-text {
		flex: 1;
		color: #fff;
		font-size: 24rpx;
		font-weight: 500;
	}

	/* 通用区块标题样式 */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.section-title {
		color: #ffffff;
		font-size: 34rpx;
		font-weight: 700;
	}

	.section-more {
		display: flex;
		align-items: center;
	}

	.more-text {
		color: #a0a0a0;
		font-size: 28rpx;
		margin-right: 6rpx;
	}

	/* 交易员列表样式 */
	.traders-section {
		margin-bottom: 32rpx;
	}

	.trader-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.trader-card {
		background: #2a2a2a;
		border-radius: 20rpx;
		padding: 32rpx;
	}

	.trader-header {
		display: flex;
		align-items: center;
		// margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		// border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.trader-avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.trader-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.trader-name {
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 4rpx;
	}

	.trader-score {
		color: #9aa4ae;
		font-size: 24rpx;
		display: flex;
		align-items: center;
	}

	.humanIcon {
		width: 20rpx;
		height: 22rpx;
		margin-right: 2rpx;
	}

	.score1 {
		color: #fff;
	}

	.trader-actions {
		display: flex;
		gap: 16rpx;
	}

	.detail-btn {
		color: #9aa4ae;
		font-size: 24rpx;
		padding: 10rpx 24rpx;
		border-radius: 16rpx;
		border: 1rpx solid #9aa4ae;
		background: transparent;
	}

	.follow-btn {
		color: #fff;
		font-size: 24rpx;
		padding: 10rpx 24rpx;
		border-radius: 16rpx;
		background: linear-gradient(160deg, #6a5acd, #ff69b4);
	}

	.trader-stats {
		display: flex;
		flex-wrap: wrap;
	}

	.stat-item {
		width: 50%;
		margin-bottom: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.stat-label {
		color: #9ca3af;
		font-size: 22rpx;
		margin-bottom: 4rpx;
	}

	.stat-value {
		color: #22c55e;
		font-size: 26rpx;
		// font-weight: 600;
	}

	.stat-value1 {
		color: #fff;
		font-size: 26rpx;
		// font-weight: 600;
	}

	/* 年化收益产品样式 */
	.products-section {
		margin-bottom: 32rpx;
	}

	.products-scroll {
		white-space: nowrap;
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
	}

	.product-card {
		display: inline-flex;
		flex-direction: column;
		background: #2a2a2a;
		border-radius: 20rpx;
		padding: 12rpx 38rpx;
		width: 330rpx;
		margin-right: 20rpx;
		color: #fff;
	}

	.product-header {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		// margin-bottom: 16rpx;
	}

	.product-icon {
		width: 54rpx;
		height: 54rpx;
		margin-right: 12rpx;
	}

	.product-info {
		display: flex;
		flex-direction: column;
	}

	.product-name {
		color: #fff;
		font-size: 24rpx;
		font-weight: 500;
		margin-bottom: 4rpx;
	}

	.product-price {
		color: #fff;
		font-size: 24rpx;
		// opacity: 0.8;
	}

	.product-chart {
		width: 100%;
		height: 80rpx;
		// margin-bottom: 16rpx;
	}

	.product-stats {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.rate-container {
		display: flex;
		align-items: center;
		// justify-content: space-between;
		// width: 100%;
		// box-sizing: border-box;
		// position: relative;
	}

	.product-rate {
		color: #7bffb2;
		font-size: 24rpx;
		// font-weight: 500;
	}

	.up-arrow {
		// width: 24rpx;
		margin-left: 8rpx;
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-bottom: 8px solid #7bffb2;
		/* 120 * 0.866 */
		// margin: 20px auto;
	}

	.rate-label {
		color: #fff;
		font-size: 22rpx;
		white-space: nowrap;
	}

	/* 空投活动样式 */
	.airdrop-section {
		margin-bottom: 32rpx;
	}

	.airdrop-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.airdrop-card {
		background: #2a2a2a;
		border-radius: 20rpx;
		padding: 32rpx;
		position: relative;
	}

	.airdrop-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.left-box {
		display: flex;
		align-items: center;
	}

	.airdrop-right {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-start;
	}

	.airdrop-icon {
		width: 80rpx;
		height: 80rpx;
		margin-right: 16rpx;
	}

	.airdrop-name {
		color: #fff;
		font-size: 30rpx;
		font-weight: 600;
		margin-right: auto;
	}

	.airdrop-status {
		color: #19af00;
		font-size: 22rpx;
		background: rgba(25, 175, 0, 0.12);
		padding: 4rpx 16rpx;
		border-radius: 12rpx;
	}

	.airdrop-reward {
		color: #6f4bfd;
		font-size: 28rpx;
		font-weight: 500;
		// margin-bottom: 20rpx;
		display: block;
	}

	.airdrop-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.airdrop-participants {
		color: #9aa4ae;
		font-size: 24rpx;
		// opacity: 0.8;
	}

	.airdrop-countdown {
		color: #ee3c4a;
		font-size: 24rpx;
		font-weight: 500;
	}

	.join-btn {
		display: block;
		background: linear-gradient(175deg, #5346a4, #df5b9d);
		color: #fff;
		font-size: 26rpx;
		font-weight: 500;
		text-align: center;
		padding: 20rpx;
		border-radius: 16rpx;
		width: 100%;
		box-sizing: border-box;
	}
</style>