<template>
	<view class="trader-page">
		<!-- Top Menu -->
		<view class="header">
			<!-- <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" /> -->
			<text class="title"></text>
			<text class="title">{{ $t('trade-page.title') }}</text>
			<view>
				<image class="icon-small" src="/static/tubiao/bangzhu/kefu.png" mode="aspectFit" />
				<image class="icon-small" src="/static/tubiao/xiaoxi.png" mode="aspectFit" />
			</view>
		</view>

		<ApplyCard :title="t('trade-page.apply.title')" :linkText="t('trade-page.apply.view')" @tap="goToApply" />

		<view class="navbar-sub">
			<view class="menu">
				<text v-for="(item, index) in menus" :key="index" class="menu-item"
					:class="{ active: activeMenu === item }" @tap="setActive(item)">
					{{ item.name }}
				</text>
			</view>
		</view>

		<view v-if="allProject">
			<ToolbarFilter :period="period" :metric="metric" :periodOptions="['24H','7D','30D','90D']"
				:metricOptions="['P&L','Sharpe','Yield']" @update:period="period = $event"
				@periodChange="onPeriodChange" @update:metric="metric = $event" @metricChange="onMetricChange"
				@searchClick="openSearch" @filterClick="openFilter" @historyClick="openHistory" />
			<TraderWithGraphicCard v-for="(tr, idx) in traderList" :key="tr.traderId || idx"
				:avatar="tr.photo || '/static/avatar.png'" :username="tr.traderName || 'Unknown'"
				:followers="Number(tr.activeFollower || 0)" :maxFollowers="Number(tr.totalFollowers || 0)"
				:profitLoss="Number(tr.pnl30Days || 0)"
				:returnRate="Number((tr.yield30Days ?? '0').toString().replace('%',''))" :aum="Number(tr.aum || 0)"
				:sharpeRatio="Number(tr.sharpeRatio || 0)" :mdd="Number(tr.mdd || 0)" :day="perioded"
				@detail="onDetail(tr)" @follow="onFollow(tr)" />
		</view>

		<view v-if="favorite">

		</view>

		<!-- Bottom Navigation -->
		<BottomTabBar currentPath="/pages/market/index" @change="handleTabChange" />
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { BottomTabBar, TraderWithGraphicCard } from '@/components'
	import { useI18n } from 'vue-i18n'
	import { ToolbarFilter, TraderCard, ApplyCard } from '@/components'
	const { t } = useI18n()

	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useUserStore } from '@/store/modules/user'
	import { useTradingStore } from '@/store/modules/trading';

	const tradingStore = useTradingStore()

	// Trader list from API
	const traderList = ref<any[]>([])

	const navTabs = ['跟单', '港股', '现货', '合约', '闪兑', 'Xcoin专区']
	const activeNav = ref(0)
	const activeTab = ref('auto')

	const setTab = (tab) => {
		activeTab.value = tab
	}


	const goToApply = () => {
		uni.showToast({ title: '跳转到交易员申请页面', icon: 'none' })
	}

	const menus = ref([
		{ id: 0, name: t('trade-page.tab-one.one'), type: 'all' },
		{ id: 1, name: t('trade-page.tab-one.two'), type: 'favorite' },
	])
	const activeMenu = ref(menus.value[0])
	const allProject = ref(true)
	const favorite = ref(false)

	const perioded = ref(30)

	function setActive(item : any) {
		activeMenu.value = item
		allProject.value = false
		favorite.value = false
		if (item.id == 0) {
			allProject.value = true
		} else if (item.id == 1) {
			favorite.value = true
		}
	}

	// Period state for inline dropdown inside ToolbarFilter
	const period = ref('30D')
	const onPeriodChange = (val : string) => {
		period.value = val
		if (val === '24H') {
			perioded.value = 1
		} else if (val === '7D') {
			perioded.value = 7
		} else if (val === '30D') {
			perioded.value = 30
		} else if (val === '90D') {
			perioded.value = 90
		}
		console.log('Selected period:', val)
	}

	// Metric state for inline dropdown inside ToolbarFilter
	const metric = ref('P&L')
	const onMetricChange = (val : string) => {
		metric.value = val
		console.log('Selected metric:', val)
	}

	onLoad(async (options) => {
		console.log('options:', options)
		await onLoadData(perioded.value)
	})

	const onLoadData = async (day : number) => {
		try {

			const resultAuth = await tradingStore.fetchTraderHistoryPerformance(day);

			//Populate traderList with API data
			if (resultAuth?.data) {
				traderList.value = resultAuth.data;
			}

		} catch (e) {
			console.error('❌ Failed to load discover:', e)
		}
	}

	const openSearch = () => uni.showToast({ title: 'Search clicked', icon: 'none' })
	const openFilter = () => uni.showToast({ title: 'Filter clicked', icon: 'none' })
	const openHistory = () => {
		uni.navigateTo({ url: '/pages/market/history' })
	}

	// Demo trader data for the list UI
	const traders = ref([
		{
			avatar: '/static/avatar.png',
			name: 'TUYJHJUI',
			followers: '70/550',
			pnl30d: '24.11',
			roi30d: '101.86%',
			aum: '2,113,255.27',
			maxDrawdown: '63.74%',
			sharpe: '3.45'
		},
		{
			avatar: '/static/avatar.png',
			name: 'TUYJHJUI',
			followers: '70/550',
			pnl30d: '24.11',
			roi30d: '101.86%',
			aum: '2,113,255.27',
			maxDrawdown: '63.74%',
			sharpe: '3.45'
		}
	])

	const onDetail = (t : any) => {
		onsole.log('跟单成功', t)

		// Pass only traderId instead of the entire object
		const traderId = t?.traderId || t?.id

		try {
			console.log("准备跳转到跟单页面...", traderId);
			uni.navigateTo({
				url: `/pages/discover/confirm?traderId=${traderId}&type=follow`,
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
	}

	const onFollow = (t : any) => {
		console.log('跟单成功', t)

		// Pass only traderId instead of the entire object
		const traderId = t?.traderId || t?.id

		try {
			console.log("准备跳转到跟单页面...", traderId);
			uni.navigateTo({
				url: `/pages/discover/confirm?traderId=${traderId}&type=follow`,
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
	}

	const handleTabChange = (tab: any, index: number) => {
		console.log('Tab changed:', tab, index)
	}
</script>

<style scoped>
	.trader-page {
		display: flex;
		flex-direction: column;
		height: 250vh;
		background-color: #121212;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		background-color: #121212;
		z-index: 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
		padding: 10rpx 40rpx 0 40rpx;
		box-sizing: border-box;
	}

	.back {
		width: 30rpx;
		height: 30rpx;
		flex-shrink: 0;
	}

	.title {
		font-size: 34rpx;
		font-weight: 600;
	}

	.icon {
		width: 35rpx;
		height: 35rpx;
		opacity: 1;
		margin-left: 15rpx;
	}

	.icon-small {
		width: 30rpx;
		height: 30rpx;
		opacity: 1;
		margin-right: 8rpx;
	}



	/* Toolbar */
	.trader-toolbar {
		margin-top: 20rpx;
		padding: 0 6rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.toolbar-left {
		display: flex;
		gap: 14rpx;
		align-items: center;
	}

	.toolbar-right {
		display: flex;
		gap: 18rpx;
		align-items: center;
	}

	.toolbar-chip {
		color: #cfcfcf;
		background: #1e2126;
		border: 1rpx solid #2a2d33;
		border-radius: 999rpx;
		padding: 8rpx 16rpx;
		font-size: 22rpx;
	}

	.tool-icon {
		width: 28rpx;
		height: 28rpx;
		opacity: .9;
	}

	/* Trader List */
	.trader-list {
		margin-top: 16rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.trader-card {
		background: #17181b;
		border-radius: 18rpx;
		border: 1rpx solid #2a2d33;
		padding: 20rpx;
	}

	.tc-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tc-user {
		display: flex;
		gap: 14rpx;
		align-items: center;
	}

	.tc-avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background: #2a2d33;
	}

	.tc-meta {
		display: flex;
		flex-direction: column;
	}

	.tc-name {
		color: #fff;
		font-size: 28rpx;
		font-weight: 700;
	}

	.tc-followers {
		color: #9aa3ad;
		font-size: 22rpx;
	}

	.tc-actions {
		display: flex;
		gap: 12rpx;
	}

	.btn {
		padding: 10rpx 20rpx;
		border-radius: 12rpx;
		font-size: 24rpx;
	}

	.btn-outline {
		color: #cfd6e4;
		border: 1rpx solid #3a4049;
		background: transparent;
	}

	.btn-gradient {
		color: #fff;
		background: linear-gradient(90deg, #6c5ce7 0%, #ff4d91 100%);
	}

	.tc-body {
		display: flex;
		gap: 20rpx;
		margin-top: 18rpx;
		padding-top: 18rpx;
		border-top: 1rpx solid #2a2d33;
	}

	.tc-left {
		width: 36%;
	}

	.metric-title {
		color: #9aa3ad;
		font-size: 22rpx;
	}

	.metric-pnl {
		font-size: 36rpx;
		font-weight: 800;
		margin-top: 8rpx;
		display: block;
	}

	.green {
		color: #2dcc70;
	}

	.sparkline {
		margin-top: 12rpx;
		height: 60rpx;
		background:
			linear-gradient(180deg, rgba(45, 204, 112, 0.15), rgba(45, 204, 112, 0));
		border-bottom: 2rpx solid #2dcc70;
		border-radius: 8rpx;
	}

	.tc-grid {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}

	.grid-item {
		min-height: 40rpx;
	}

	.grid-label {
		color: #9aa3ad;
		font-size: 22rpx;
	}

	.grid-value {
		color: #e5e7eb;
		font-size: 26rpx;
		margin-top: 4rpx;
		display: block;
	}

	/* ✅ Navbar fixed at the top */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #1e1e1e;
		padding: 0 24rpx;
		height: 100rpx;
		border-bottom: 1rpx solid #2a2a2a;
		flex-shrink: 0;
		/* Prevent navbar from shrinking */
	}

	/* ✅ Navbar fixed at the top */
	.navbar-sub {
		position: sticky;
		top: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: left;
		padding: 0 24rpx;
		height: 100rpx;
		border-bottom: 1rpx solid #2a2a2a;
		flex-shrink: 0;
		/* Prevent navbar from shrinking */
	}

	.page-content {
		flex: 1;
		/* Take remaining space */
		/* avoid clipping absolutely-positioned dropdowns */
		overflow: visible;
		position: relative;
		padding: 24rpx;
	}

	/* removed global mask in favor of document-level outside click handler */

	.menu {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;
	}

	.menu-item {
		color: #999;
		font-size: 25rpx;
		padding: 8rpx 16rpx;
		cursor: pointer;
		text-align: center;
		transition: all 0.3s ease;
	}

	.menu-item.active {
		color: #fff;
		font-weight: bold;
	}

	/* Konten scrollable di bawah navbar */
	.scroll-area {
		flex: 1;
		height: calc(100vh - 100rpx);
	}
</style>