<template>
	<view class="market-container">
		<!-- Status Bar Spacer -->
		<view class="status-bar-spacer" :style="getTopStyle(0)"></view>

		<!-- Sticky Top Menu -->
		<scroll-view class="top-menu" scroll-x="true" scroll-with-animation :sticky="true" :sticky-offset-top="0">
			<view class="menu-scroll">
				<view v-for="(item, idx) in navTabs" :key="idx" class="menu-item" :class="{ active: idx === activeNav }"
					@click="handleNavChange(idx)">
					{{ item }}
				</view>
			</view>
		</scroll-view>

		<!-- Content based on active navigation tab with proper scroll area -->
		<scroll-view class="content-scroll-view" scroll-y="true">
			<!-- 跟单 Tab -->
			<view id="content-start" v-if="activeNav === 0" class="follow-content">
				<!-- Profile Section -->
				<view class="profile-section">
					<view class="profile-row">
						<image class="avatar" src="/static/icons/testAvatar.png" />

						<view class="profile-info">
							<view class="name-row">
								<text class="name">{{ traderPerformanceDetail?.traderName }}</text>
							</view>
							<view class="desc-container">
								<text class="desc" :class="{ expanded: expandDesc }">
									{{ $t('market.traderDesc') }}
								</text>
								<image class="desc-arrow" :class="{ rotate: expandDesc }"
									@click="expandDesc = !expandDesc" src="/static/icons/arrow-bottom.png"
									mode="aspectFit" />
							</view>
						</view>

						<view class="actions">
							<view class="more-btn">···</view>
							<view class="follow-btn" :class="{ 'followed-btn': topFollowed }" @click="toggleTopFollow">
								{{ topFollowed ? $t('market.followed') : $t('market.addFollow') }}
							</view>
						</view>
					</view>

					<!-- Stats Row -->
					<view class="stats-row">
						<view class="stat-item">
							<text class="stat-number">{{ traderPerformanceDetail?.watching ?? 0 }}</text>
							<text class="stat-label">{{ $t('market.follow') }}</text>
						</view>
						<view class="stat-item">
							<text class="stat-number">{{ traderPerformanceDetail?.followers ?? 0 }}</text>
							<text class="stat-label">{{ $t('market.followers') }}</text>
						</view>
						<view class="stat-item">
							<text class="stat-number">{{ traderPerformanceDetail?.likes ?? 0 }}</text>
							<text class="stat-label">{{ $t('market.likes') }}</text>
						</view>
						<view class="contact-box">
							<view class="stat-item contact-item">
								<image class="contact-icon" src="/static/icons/chatImg.png" />
								<text class="stat-label1">{{ $t('market.chatRoom') }}</text>
							</view>
							<view class="stat-item contact-item">
								<text class="stat-label">{{ $t('market.viewDetails') }}</text>
							</view>
						</view>
					</view>

					<!-- Profit Share Badge -->
					<view class="badge-row">
						<view class="badge">
							<image class="DividendsIcon" src="/static/icons/DividendsIcon.png" />
							Profit share {{ traderPerformanceDetail?.profitShare
								?? 0 }}
						</view>
					</view>
				</view>

				<!-- Content Tabs (Auto Follow / Personal Views) -->
				<view class="content-tabs">
					<view class="tab-item" :class="{ active: activeContentTab === 'auto' }"
						@click="activeContentTab = 'auto'">
						{{ $t('market.autoFollow') }}
					</view>
					<view class="tab-item" :class="{ active: activeContentTab === 'views' }"
						@click="activeContentTab = 'views'">
						{{ $t('market.personalViews') }}
					</view>
				</view>

				<!-- Auto Follow Content -->
				<view v-if="activeContentTab === 'auto'" class="auto-follow-content">
					<!-- Trader Info Card -->
					<view class="trader-card">
						<view class="trader-info">
							<image class="trader-avatar" src="https://picsum.photos/id/64/120/120" />
							<view class="trader-details">
								<text class="trader-name">{{ traderPerformanceDetail?.traderName ?? '' }}</text>
								<text class="trader-rank">
									<image class="humanIcon" src="/static/icons/humanIcon.png" /><text
										class="rankTitle">{{ traderPerformanceDetail?.followers ?? 0 }}</text>/
									{{ traderPerformanceDetail?.maxFollowers ?? 0 }}
								</text>
							</view>
							<view class="recommend-badge">{{ $t('market.recommend') }}</view>
						</view>

						<!-- Stats Overview -->
						<view class="trader-stats-overview">
							<view class="stat-item">
								<text class="stat-label">{{ $t('market.profitRate30d') }}</text>
								<text class="stat-value green">{{ traderPerformanceDetail?.yield ?? 0 }}%</text>
							</view>
							<view class="stat-item">
								<text class="stat-label">{{ $t('market.winRate') }}</text>
								<text class="stat-value">{{ traderPerformanceDetail?.winRate ?? 0 }}%</text>
							</view>
							<view class="stat-item">
								<text class="stat-label">{{ $t('market.sharpeRatio') }}</text>
								<text class="stat-value">{{ formatSharpe(traderPerformanceDetail?.sharpeRatio) }}</text>
							</view>
						</view>
					</view>

					<!-- Follow Amount Selection -->
					<view class="FollowAmountBox">
						<!-- <view class="follow-amount-section"> -->
						<!-- <view class="section-header">
								<text class="section-title">{{ $t('market.followAmount') }}</text>
								<text class="available-balance">{{ $t('market.available') }}:
									{{ traderPerformanceDetail?.balance ?? 0 }} USDT</text>
							</view> -->

						<!-- Dropdown Menu -->
						<!-- <view class="amount-dropdown">
								<view class="dropdown-header" @click="toggleDropdown = !toggleDropdown">
									<template v-if="selectedAmount === 'custom'">
										<view class="custom-input-wrapper">
											<input class="custom-amount-input" v-model.number="customAmountInput"
												type="number" :placeholder="$t('market.inputAmount')"
												inputmode="decimal" @click.stop @input="validateCustomAmount($event)"
												min="0" step="0.01" />
										</view>
									</template>
<text v-else class="selected-amount">{{
	selectedAmount
	}}</text>
<image class="dropdown-arrow" :class="{ rotate: toggleDropdown }" src="/static/icons/arrow-bottom.png"
	mode="aspectFit" />
</view>
<view class="dropdown-options" v-if="toggleDropdown">
	<view v-for="amount in amountOptions" :key="amount" class="dropdown-option"
		:class="{ active: selectedAmount === amount }" @click="selectAmount(amount)">
		<text class="amount-text">{{ amount }}</text>
		<image class="check-mark" v-if="selectedAmount === amount" src="/static/icons/checkIcon.png" mode="aspectFit" />
	</view>

	<view class="dropdown-option custom-option" @click="selectAmount('custom')">
		<text class="amount-text">自定义</text>
	</view>
</view>
</view> -->
						<!-- </view> -->

						<!-- Auto Follow Switch -->
						<view class="auto-follow-switch">
							<view class="switch-content">
								<text class="switch-title">{{ $t('market.autoFollow') }}</text>
								<text class="switch-desc">{{ $t('market.autoFollowDesc') }}</text>
							</view>
							<label class="switch" @click="handleAutoFollowToggle">
								<input type="checkbox" :checked="autoFollowEnabled" @click.stop />
								<view class="slider" :class="{ active: autoFollowEnabled }"></view>
							</label>
						</view>
					</view>
					<!-- Trading Stats -->
					<view class="trading-stats-section">
						<text class="section-title1">{{ $t('market.tradeStats') }}</text>

						<view class="trading-stats-grid">
							<view class="trading-stat-item">
								<text class="trading-stat-label">{{ $t('market.tradeCount30d') }}</text>
								<text class="trading-stat-value">{{ traderPerformanceDetail?.totalTrade ?? 0 }}</text>
							</view>
							<view class="trading-stat-item">
								<text class="trading-stat-label">{{ $t('market.avgHoldingTime') }}</text>
								<text class="trading-stat-value">{{ traderPerformanceDetail?.avarageHoldingTime ?? 0
								}}</text>
							</view>
							<view class="trading-stat-item">
								<text class="trading-stat-label">{{ $t('market.maxDrawdown') }}</text>
								<text class="trading-stat-value redLebal">{{ traderPerformanceDetail?.mdd ?? 0 }}
									%</text>
							</view>
							<view class="trading-stat-item">
								<text class="trading-stat-label">{{ $t('market.managedAssets') }}</text>
								<text class="trading-stat-value">{{ traderPerformanceDetail?.aum ?? 0 }}</text>
							</view>
						</view>
					</view>

					<!-- Risk Warning -->
					<view class="risk-warning">
						<view class="risk-title">
							<text class="risk-icon">
								<image class="warnWhite" src="/static/icons/warnWhite.png" mode="aspectFit" />
							</text>
							<text class="risk-text">{{ $t('market.riskWarning') }}</text>
						</view>
						<text class="risk-content">{{ $t('market.riskWarningDesc') }}</text>
					</view>

					<!-- Profit Preview -->
					<view class="profit-preview">
						<view class="preview-box">
							<view class="preview-left">
								<view class="profit-header">
									<text>{{ $t('market.expectedReturn') }}</text>
								</view>
								<text class="profit-amount green">+ {{ traderPerformanceDetail?.expectedProfit ?? 0 }}
									USDT</text>
								<text class="profit-calculation">{{ $t('market.expectedReturnDesc') }}</text>
							</view>
							<view class="profit-right">
								<image class="timeIcon" src="/static/icons/timeIcon.png" mode="aspectFit" />
							</view>
						</view>
					</view>

					<!-- Confirm Button -->
					<view class="confirm-btn" @click="handleConfirmFollow">
						<text>{{ $t('market.confirmFollow') }}</text>
					</view>
				</view>

				<!-- Personal Views Content -->
				<view v-else-if="activeContentTab === 'views'" class="personal-views-content">
					<!-- 使用v-for渲染view-item -->
					<view class="view-item" v-for="item in viewItems" :key="item.id">
						<view class="view-header">
							<image class="user-avatar" :src="item.avatar" />
							<view class="user-info">
								<view class="user-name">
									<view class="name">{{ item.username }}</view>
									<view class="time">{{ item.time }}</view>
								</view>
								<view class="follow-btn-mini" :class="{ 'followed-btn-mini': item.followed }"
									@click="toggleItemFollow(item.id)">
									{{ item.followed ? $t('market.followed') : $t('market.addFollow') }}
								</view>
							</view>
						</view>
						<text class="view-content">{{ item.content }}</text>
						<!-- 图片渲染区域 -->
						<view class="view-images" v-if="item.images && item.images.length > 0">
							<image v-for="(img, index) in item.images.slice(0, 2)" :key="index" :src="img"
								class="view-image" />
						</view>
						<view class="actions-box">
							<view class="view-actions">
								<view class="action-item">
									<image src="/static/icons/LikeBtn.png" class="commentIcon" />
									<text class="action-count">{{ item.likes }}</text>
								</view>
								<view class="action-item">
									<image src="/static/icons/CommentIcon.png" class="commentIcon" />
									<text class="action-count">{{ item.comments }}</text>
								</view>
								<view class="action-item">
									<image src="/static/icons/shareIcon.png" class="commentIcon" />
									<text class="action-count">{{ item.shares }}</text>
								</view>
							</view>
							<text class="view-time">{{ item.footer }}</text>
						</view>

						<!-- 评论区域 -->
						<view class="comments-section" v-if="item.commentsList && item.commentsList.length > 0">
							<view class="comment-item" v-for="comment in item.commentsList" :key="comment.id">
								<view class="comment-header">
									<text class="comment-username">{{ comment.username }}:</text>
									<text class="comment-content">{{ comment.content }}</text>
								</view>

								<!-- <view class="comment-footer">
                  <view class="comment-like">
                    <image src="/static/icons/LikeBtn.png" class="comment-like-icon" />
                    <text class="comment-like-count">{{ comment.likes }}</text>
                  </view>
                </view> -->
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 港股 Tab -->
			<view v-else-if="activeNav === 1" id="content-start" class="market-data-tab">
				<view class="page-stock">
					<!-- List - 港股数据 -->
					<view class="results-list">
						<view v-for="(item, index) in getMarketData('hk')" :key="index" class="result-item"
							@click="handleMarketItemClick(item)">
							<view class="item-left">
								<image :src="item.icon ||
									`/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'
									}.png`
									" class="item-icon" mode="aspectFit" />
								<view class="item-info">
									<!-- <text class="item-name">{{ item.name }}</text> -->
									<text class="item-name">{{ item.name }}</text>
									<text class="item-code">{{
										item.quoteAsset || item.code
									}}</text>
								</view>
								<image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock"
									mode="aspectFit" />
							</view>
							<view class="item-right">
								<text class="item-price">{{
									formatPrice(item.lastPrice)
								}}</text>
								<text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
									{{ item.percentChange24h > 0 ? "+" : ""
									}}{{ Math.round(item.percentChange24h * 100) / 100 }}%
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 现货 Tab -->
			<view v-else-if="activeNav === 2" id="content-start" class="market-data-tab">
				<view class="page-stock">
					<!-- List - 现货数据 -->
					<view class="results-list">
						<view v-for="(item, index) in getMarketData('spot')" :key="index" class="result-item"
							@click="handleMarketItemClick(item)">
							<view class="item-left">
								<image :src="item.icon ||
									`/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'
									}.png`
									" class="item-icon" mode="aspectFit" />
								<view class="item-info">
									<text class="item-name">{{ item.name }}</text>
									<text class="item-code">{{
										item.quoteAsset || item.code
									}}</text>
								</view>
								<image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock"
									mode="aspectFit" />
							</view>
							<view class="item-right">
								<text class="item-price">{{
									formatPrice(item.lastPrice)
								}}</text>
								<text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
									{{ item.percentChange24h > 0 ? "+" : ""
									}}{{ Math.round(item.percentChange24h * 100) / 100 }}%
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 合约 Tab -->
			<view v-else-if="activeNav === 3" id="content-start" class="market-data-tab">
				<view class="page-stock">
					<!-- List - 合约数据 -->
					<view class="results-list">
						<view v-for="(item, index) in getMarketData('contract')" :key="index" class="result-item"
							@click="handleMarketItemClick(item)">
							<view class="item-left">
								<image :src="item.icon ||
									`/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'
									}.png`
									" class="item-icon" mode="aspectFit" />
								<view class="item-info">
									<text class="item-name">{{ item.name }}</text>
									<text class="item-code">{{
										item.quoteAsset || item.code
									}}</text>
								</view>
								<image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock"
									mode="aspectFit" />
							</view>
							<view class="item-right">
								<text class="item-price">{{
									formatPrice(item.lastPrice)
								}}</text>
								<text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
									{{ item.percentChange24h > 0 ? "+" : ""
									}}{{ Math.round(item.percentChange24h * 100) / 100 }}%
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Xcoin专区 Tab -->
			<view v-else-if="activeNav === 5" id="content-start" class="market-data-tab">
				<view class="page-stock">
					<!-- List - Xcoin专区数据 -->
					<view class="results-list">
						<view v-for="(item, index) in getMarketData('xcoin')" :key="index" class="result-item"
							@click="handleMarketItemClick(item)">
							<view class="item-left">
								<image :src="item.icon ||
									`/static/logo/logos_${item.code?.toLowerCase() || 'bitcoin'
									}.png`
									" class="item-icon" mode="aspectFit" />
								<view class="item-info">
									<text class="item-name">{{ item.name }}</text>
									<text class="item-code">{{
										item.quoteAsset || item.code
									}}</text>
								</view>
								<image :src="item.sparkline || '/static/icons/line_chart.png'" class="graph-img-stock"
									mode="aspectFit" />
							</view>
							<view class="item-right">
								<text class="item-price">{{
									formatPrice(item.lastPrice)
								}}</text>
								<text class="item-percent" :class="item.percentChange24h > 0 ? 'up' : 'down'">
									{{ item.percentChange24h > 0 ? "+" : ""
									}}{{ Math.round(item.percentChange24h * 100) / 100 }}%
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 闪兑 Tab -->
			<view v-else-if="activeNav === 4" id="content-start" class="swap-tab">
				<view class="swap-wrapper">
					<!-- From 部分 -->
					<view class="swap-box swap-box1">
						<view class="swap-header">
							<text class="swap-label">{{ $t('market.from') }}</text>
							<view class="max-half-buttons">
								<view class="max-btn">{{ $t('market.max') }}</view>
								<view class="half-btn">{{ $t('market.half') }}</view>
							</view>
						</view>
						<view class="contentbox">
							<view class="coin-selector">
								<image :src="selectedFromCoin.icon" class="coin-icon" mode="aspectFit" />
								<view class="right-box">
									<view class="coin-code">{{ selectedFromCoin.code }}
										<image class="dropdown-arrow" src="/static/icons/arrow-bottom.png"
											mode="aspectFit" />
									</view>
									<text class="coin-name">{{ selectedFromCoin.name }}</text>
								</view>
							</view>
							<view class="content-right">
								<view class="amount-display">
									<text class="amount-value">{{ selectedAmountValue }}</text>
								</view>
								<view class="estimated-value">≈${{ estimatedValue }}</view>
							</view>
						</view>
						<!-- 切换按钮 -->
						<view class="swap-toggle-container">
							<view class="swap-toggle" @click="swapCoins">
								<image src="/static/icons/switingIcon.png" mode="aspectFit" />
							</view>
						</view>
					</view>

					<!-- To 部分 -->
					<view class="swap-box">
						<view class="swap-header">
							<text class="swap-label">{{ $t('market.to') }}</text>
						</view>
						<view class="contentbox">
							<view class="coin-selector">
								<image :src="selectedToCoin.icon" class="coin-icon" mode="aspectFit" />
								<view class="right-box">
									<view class="coin-code">{{ selectedToCoin.code }}
										<image class="dropdown-arrow" src="/static/icons/arrow-bottom.png"
											mode="aspectFit" />
									</view>
									<text class="coin-name">{{ selectedToCoin.name }}</text>
								</view>
							</view>
							<view class="content-right">
								<!-- <view class="amount-display"> -->
								<!-- <text class="amount-value">{{ swapAmountValue }}</text> -->
								<!-- </view> -->
								<view class="estimated-value1">≈${{ estimatedValue }}</view>
							</view>
						</view>
					</view>

					<!-- 汇率信息 -->
					<view class="rate-info-section">
						<view class="rate-item">
							<text class="rate-label">{{ $t('market.rate') }}</text>
							<view class="item-right">
								<text class="rate-value">{{ $t('market.exchangeRateExample1') }}</text>
								<text class="rate-value-secondary">{{ $t('market.exchangeRateExample2') }}</text>
							</view>
						</view>
						<view class="rate-item">
							<text class="rate-label">{{ $t('market.swapFee') }}</text>
							<view class="item-right">
								<text class="rate-value">{{ swapFee }}%</text>
								<text class="rate-value-secondary">~$0</text>
							</view>
						</view>
						<view class="rate-item">
							<text class="rate-label">{{ $t('market.slippage') }}</text>
							<view class="item-right">
								<text class="rate-value">{{ slippage }}%</text>
							</view>
						</view>
					</view>

					<!-- 兑换按钮 -->
					<view class="swap-button-container">
						<button class="swap-button" @click="handleSwap">{{ $t('market.buy') }}</button>
					</view>
				</view>
			</view>

			<!-- 默认情况 -->
			<view v-else id="content-start" class="empty-state">
				<text class="empty-text">{{ $t('market.emptyContent') }}</text>
			</view>
		</scroll-view>

		<!-- Bottom Navigation -->
		<BottomTabBar currentPath="/pages/market/index" @change="handleTabChange" />
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { onLoad } from '@dcloudio/uni-app';
import { BottomTabBar } from "@/components";
import { storage } from "@/utils/storage";
import { useUserStore, TickersParams } from "@/store/modules/user";
import { useSafeArea } from "@/utils/composables/useSafeArea";
import { useI18n } from "vue-i18n";
import { useTradingStore } from '@/store/modules/trading';
import { redirectTo } from "@/utils";

const { t, locale } = useI18n();
const { statusBarHeight, getTopStyle: safeAreaGetTopStyle } = useSafeArea();
const getTopStyle = safeAreaGetTopStyle;
const tradingStore = useTradingStore()

// 使用计算属性确保语言切换时能自动更新
const navTabs = computed(() => [
	'market.follow',
	'market.hkStock',
	'market.spot',
	'market.contract',
	'market.swap',
	'market.xcoinZone'
].map(key => t(key)));

// 监听语言变化，确保页面文本能正确更新
const currentLanguage = computed(() => locale.value);

// 监听语言变化，确保所有文本能正确更新
watch(() => locale.value, (newLang) => {
	console.log('语言已切换至:', newLang);

	// 强制刷新页面内容以确保所有文本更新
	// 通过临时切换activeNav来触发重新渲染
	const tempNav = activeNav.value;
	activeNav.value = -1;

	nextTick(() => {
		activeNav.value = tempNav;
		console.log('页面文本已强制更新');

		// 对于使用$t()的文本，确保Vue组件系统能检测到变化
		// 这会触发整个组件树的更新检查
		uni.$forceUpdate?.();
	});
});
const activeNav = ref(0);
const activeContentTab = ref("auto");
const selectedAmount = ref(1000);
const amountOptions = ref([500, 1000, 2000, 5000]);
const toggleDropdown = ref(false);
const customAmountInput = ref(null);
const autoFollowEnabled = ref(true);
const expandDesc = ref(false);

// 闪兑功能相关
const selectedFromCoin = ref({
	name: "Tron",
	code: "BCT",
	icon: "/static/logo/logos_bitcoin.png",
});
const selectedToCoin = ref({
	name: "Tron",
	code: "TRX",
	icon: "/static/logo/logos_bitcoin.png",
});
const selectedAmountValue = ref(15);
const estimatedValue = ref("150.3");
const swapAmountValue = ref(1);
const exchangeRate = ref("10.1");
const swapFee = ref(0);
const slippage = ref("<0.001");


// format helpers
function formatSharpe(val: any): string {
	const n = Number(val)
	if (!isFinite(n)) return '0.00'
	return n.toFixed(2)
}

// 交换货币
function swapCoins() {
	const temp = selectedFromCoin.value;
	selectedFromCoin.value = selectedToCoin.value;
	selectedToCoin.value = temp;

	const tempAmount = selectedAmountValue.value;
	selectedAmountValue.value = swapAmountValue.value;
	swapAmountValue.value = tempAmount;
}

// 处理兑换按钮点击
function handleSwap() {
	console.log("执行兑换操作:", {
		fromCoin: selectedFromCoin.value,
		toCoin: selectedToCoin.value,
		amount: selectedAmountValue.value,
		rate: exchangeRate.value,
	});
	// 这里可以添加实际的兑换逻辑，调用相应的API
	uni.showToast({
		title: "兑换成功",
		icon: "success",
	});
}

// 市场数据相关
const marketData = ref<any[]>([]);
const isRefreshing = ref(false);
const scrollHeight = ref(0);
const scrollToView = ref("content-start");
const userStore = useUserStore();

// 获取模拟市场数据
function getMockMarketData() {
	return [
		{
			id: 1,
			name: "Bitcoin",
			code: "BTC",
			pair: "BTC/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_bitcoin.png",
			lastPrice: 2509.75,
			percentChange24h: 9.7,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 2,
			name: "Ethereum",
			code: "ETH",
			pair: "ETH/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_eth.png",
			lastPrice: 2509.75,
			percentChange24h: -21.0,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 3,
			name: "Binance Coin",
			code: "BNB",
			pair: "BNB/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 305.67,
			percentChange24h: 5.32,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 4,
			name: "Solana",
			code: "SOL",
			pair: "SOL/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_solana.png",
			lastPrice: 105.06,
			percentChange24h: 16.31,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 5,
			name: "Cardano",
			code: "ADA",
			pair: "ADA/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_cardano.png",
			lastPrice: 0.529,
			percentChange24h: -3.58,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 6,
			name: "Polkadot",
			code: "DOT",
			pair: "DOT/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 7.85,
			percentChange24h: 2.14,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 7,
			name: "Chainlink",
			code: "LINK",
			pair: "LINK/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 14.32,
			percentChange24h: -5.67,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 8,
			name: "Litecoin",
			code: "LTC",
			pair: "LTC/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_bitcoin.png",
			lastPrice: 98.76,
			percentChange24h: 3.45,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 9,
			name: "Dogecoin",
			code: "DOGE",
			pair: "DOGE/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 0.12,
			percentChange24h: -8.21,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 10,
			name: "Uniswap",
			code: "UNI",
			pair: "UNI/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_eth.png",
			lastPrice: 6.78,
			percentChange24h: 1.92,
			sparkline: "/static/icons/line_chart.png",
		},
		// 港股相关数据
		{
			id: 11,
			name: "香港交易所",
			code: "HKEX",
			pair: "HKEX/USD",
			quoteAsset: "USD",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 425.8,
			percentChange24h: 2.35,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 12,
			name: "腾讯控股",
			code: "0700.HK",
			pair: "0700.HK/HKD",
			quoteAsset: "HKD",
			icon: "/static/logo/logos_eth.png",
			lastPrice: 324.6,
			percentChange24h: -1.23,
			sparkline: "/static/icons/line_chart.png",
		},
		// Xcoin专区数据
		{
			id: 20,
			name: "Xcoin Token",
			code: "XCT",
			pair: "XCT/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_bitcoin.png",
			lastPrice: 0.85,
			percentChange24h: 12.5,
			sparkline: "/static/icons/line_chart.png",
		},
		{
			id: 21,
			name: "Xcoin Finance",
			code: "XFI",
			pair: "XFI/USDT",
			quoteAsset: "USDT",
			icon: "/static/logo/logos_binance.png",
			lastPrice: 2.35,
			percentChange24h: -3.45,
			sparkline: "/static/icons/line_chart.png",
		},
	];
}

const subCopyTradingCopyTrading = ref(true)
const subCopyTradingPersonalOpinion = ref(false)
const traderPerformanceDetail = ref<any>(null);

// 加载市场数据
async function loadData(options?: any) {
	console.log("Type : " + options?.type)
	console.log("Trader ID : " + options?.traderId)
	const type = options?.type || "follow";
	try {
		const tickersParams: TickersParams = {
			passkey: userStore.pasKeyAuth,
			type,
			limit: 100,
      		lang: userStore.language
		};
		const resultAuth = await userStore.getTickers(tickersParams);
		marketData.value = resultAuth.data || [];
		console.log("✅ Loaded market data:", marketData.value.length, "items");

		// 如果API返回的数据为空，使用模拟数据
		if (!marketData.value || marketData.value.length === 0) {
			console.log("⚠️  API returned empty data, using mock data");
			marketData.value = getMockMarketData();
		}
	} catch (e) {
		console.error("❌ Failed to load market data:", e);
		// 如果加载失败，使用模拟数据
		marketData.value = getMockMarketData();
		console.log("⚠️  Using mock data due to API error");
	}

	try {
		if (options?.traderId) {
			const traderId = parseInt(options.traderId)
			console.log('Received traderId:', traderId)

			// Fetch trader performance details by ID
			const result = await tradingStore.fetchTraderPerformaByUserId(traderId);
			console.log('Fetch result (raw):', result)

			// The API shape may be nested. Normalize to a single object.
			// Possible shapes:
			// 1) { data: { data: [ {...} ] } }
			// 2) { data: {...} }
			// 3) direct object
			const payload = result?.data?.data ?? result?.data ?? result
			let detail: any = null
			if (Array.isArray(payload)) {
				detail = payload[0] ?? payload
			} else {
				detail = payload
			}

			// Set the ref (use an empty object as fallback so template bindings are safe)
			traderPerformanceDetail.value = detail ?? {}

			console.log('Normalized trader detail:', traderPerformanceDetail.value)
			// Use traderPerformanceDetail to populate your confirm page
		}
	} catch (e) {
		console.error("failed to load trader", e)
	}
}

// 下拉刷新
async function onRefresh() {
	isRefreshing.value = true;
	await loadData();
	setTimeout(() => {
		isRefreshing.value = false;
	}, 800);
}

// 根据类型获取市场数据
function getMarketData(type: string) {
	// 获取基础数据 - 确保数据已加载
	const baseData =
		marketData.value.length > 0
			? marketData.value.map((item, index) => ({
				...item,
				id: item.id || index + 1,
				icon:
					item.icon ||
					`/static/logo/logos_${item.code?.toLowerCase() || "bitcoin"}.png`,
				sparkline: item.sparkline || "/static/icons/line_chart.png",
			}))
			: getMockMarketData();
	console.log(baseData, '??????????')
	// 根据类型过滤数据
	switch (type) {
		case "hk": // 港股
			return baseData.filter(
				(item) =>
					item.code?.includes("HK") ||
					item.code?.includes(".HK") ||
					item.name?.includes("香港") ||
					(item.id && item.id % 3 === 0) // 随机选择一些数据作为港股示例
			);
		case "spot": // 现货
			return baseData.filter(
				(item) => item.pair?.includes("/") || (item.id && item.id % 3 === 1) // 随机选择一些数据作为现货示例
			);
		case "contract": // 合约
			// 模拟合约数据 - 使用部分现货数据并添加合约标识
			return baseData.slice(0, 8).map((item) => ({
				...item,
				name: item.name + " 永续",
				pair: item.pair ? item.pair.replace("/USDT", "/USDT:PERP") : item.pair,
			}));
		case "xcoin": // Xcoin专区
			return baseData.filter(
				(item) =>
					item.code?.includes("X") ||
					item.name?.includes("X") ||
					(item.id && item.id % 3 === 2) // 随机选择一些数据作为Xcoin示例
			);
		default:
			return baseData;
	}
}

// 格式化价格
function formatPrice(price: number) {
	if (price >= 1000) {
		return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
	}
	return price;
}

// 处理市场项点击
function handleMarketItemClick(item: any) {
	// 跳转到详情页面
	uni.navigateTo({
		url:
			"/pages/detiltrade/index?data=" +
			encodeURIComponent(JSON.stringify(item)),
		success: () => console.log("✅ Navigated to detail page"),
		fail: (err) => console.error("❌ Navigation failed:", err),
	});
}

// 模拟个人观点数据
// 顶部用户关注状态
const topFollowed = ref(true);

// 切换顶部用户关注状态
function toggleTopFollow() {
	try {
		topFollowed.value = !topFollowed.value;
		// uni.showToast({
		//   title: topFollowed.value ? t('market.followSuccess') : t('market.unfollowSuccess'),
		//   icon: 'none',
		//   duration: 2000
		// });
		console.log('顶部用户关注状态已切换为:', topFollowed.value);
		// 这里可以添加调用API的逻辑来保存关注状态
	} catch (error) {
		console.error('切换顶部用户关注状态失败:', error);
		uni.showToast({
			title: t('market.operationFailed'),
			icon: 'none',
			duration: 2000
		});
	}
}

// 切换观点卡片关注状态
function toggleItemFollow(itemId) {
	try {
		const item = viewItems.value.find(item => item.id === itemId);
		if (item) {
			item.followed = !item.followed;
			// uni.showToast({
			//   title: item.followed ? t('market.followSuccess') : t('market.unfollowSuccess'),
			//   icon: 'none',
			//   duration: 2000
			// });
			console.log('用户ID', itemId, '关注状态已切换为:', item.followed);
			// 这里可以添加调用API的逻辑来保存关注状态
		}
	} catch (error) {
		console.error('切换用户关注状态失败:', error);
		// uni.showToast({
		//   title: t('market.operationFailed'),
		//   icon: 'none',
		//   duration: 2000
		// });
	}
}

const viewItems = ref([
	{
		id: 1,
		avatar: "/static/icons/testAvatar.png",
		username: "SOOIN1126",
		time: "3小时前",
		content:
			"BTC现在处于关键阻力位，建议密切关注突破情况。如果能有效突破58000美元，可能会继续上涨至60000美元关口。",
		images: ["/static/icons/dynamicTest.png", "/static/icons/dynamicTest.png"],
		likes: 238,
		comments: 45,
		shares: 12,
		footer: "1.2万浏览",
		followed: false,
		commentsList: [
			{
				id: 1,
				username: "交易小白",
				content: "分析得很到位，已经按照你的建议操作了",
				likes: 23,
			},
		],
	},
	{
		id: 2,
		avatar: "/static/icons/testAvatar.png",
		username: "CryptoMaster",
		time: "5小时前",
		content:
			"ETH今日表现强势，已经突破前期高点。技术面来看，MACD指标形成金叉，短期可能还有上涨空间。",
		images: ["/static/icons/dynamicTest.png"],
		likes: 156,
		comments: 28,
		shares: 8,
		footer: "8.5千浏览",
		followed: false,
		commentsList: [
			{
				id: 1,
				username: "DeFi爱好者",
				content: "Layer2解决方案也在不断发展，未来潜力很大",
				likes: 12,
			},
		],
	},
	{
		id: 3,
		avatar: "/static/icons/testAvatar.png",
		username: "交易达人",
		time: "昨天",
		content:
			"最近山寨币表现活跃，建议关注一些基本面良好的小市值币种，可能会有不错的涨幅。",
		images: [],
		likes: 342,
		comments: 76,
		shares: 23,
		footer: "2.3万浏览",
		followed: true,
		commentsList: [],
	},
	{
		id: 4,
		avatar: "/static/icons/testAvatar.png",
		username: "币圈小王子",
		time: "2天前",
		content:
			"因为评论法没放图片，所以新发一个推文说我现在手的这个仓位。才第四层仓，早得很，我这个系统大概承受大饼到130,000，所以突破前高前都不需要担心",
		images: ["/static/icons/dynamicTest.png", "/static/icons/dynamicTest.png"],
		likes: 138,
		comments: 92,
		shares: 45,
		footer: "11.6万浏览",
		followed: false,
		commentsList: [
			{
				id: 1,
				username: "阿星哥",
				content: "十五倍杠杆都能爆",
				likes: 70,
			},
		],
	},
]);

// 处理自动跟单开关切换
function handleAutoFollowToggle() {
	autoFollowEnabled.value = !autoFollowEnabled.value;
	console.log("自动跟单功能已" + (autoFollowEnabled.value ? "启用" : "禁用"));
	// 这里可以添加调用API的逻辑来保存设置
}

// 处理确认跟单
function handleConfirmFollow() {
	try {
		// 获取跟单金额
		const amount =
			selectedAmount.value === "custom"
				? customAmountInput.value || 0
				: selectedAmount.value;

		// 验证金额
		if (!amount || amount <= 0) {
			uni.showToast({
				title: t('market.enterValidAmount'),
				icon: "none",
				duration: 2000
			});
			return;
		}

		// 验证可用余额（如果有）
		// const availableBalance = 10000; // 这里应该从API获取
		// if (amount > availableBalance) {
		//   uni.showToast({
		//     title: "跟单金额超过可用余额",
		//     icon: "none",
		//     duration: 2000,
		//   });
		//   return;
		// }

		console.log("🔄 确认跟单，参数:", {
			amount,
			autoFollow: autoFollowEnabled.value,
			traderId: "current_trader", // 这里应该从当前上下文获取交易员ID
		});

		// 显示确认对话框
		uni.showModal({
			title: t('market.confirmFollow'),
			content: t('market.confirmFollowAmount', { amount: amount, autoFollow: autoFollowEnabled.value ? '\n' + t('market.autoFollowEnabled') : '' }),
			confirmText: t('market.confirm'),
			cancelText: t('market.cancel'),
			success: async (res) => {
				if (res.confirm) {
					console.log('跟单成功', traderPerformanceDetail?.value);
					console.log('Expert Id', traderId.value);
					console.log('Amount', amount);
					console.log('Copy Trading Enabled:', autoFollowEnabled.value);
					try {
						// Prepare subscription parameters

						const expertId = traderId.value;
						const copyAllTrade = autoFollowEnabled.value;
						// Call the subscribe API
						const response = await tradingStore.subscribeToTrader(amount, expertId, copyAllTrade)
						console.log('✅ Subscription successful:', response)
						if (response?.status == 1) {
							// Navigate to success page after successful subscription
							uni.navigateTo({
								url: `/pages/discover/success?expertId=${expertId}`,
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
	} catch (error) {
		console.error("❌ 确认跟单失败:", error);
		uni.showToast({
			title: t('market.operationFailed'),
			icon: "none",
			duration: 2000
		});
		// 保险：定时关闭失败提示
		setTimeout(() => {
			try { uni.hideToast(); } catch (e) { /* noop */ }
		}, 2100);
	}
}

// 计算可滚动区域高度
function calculateScrollHeight() {
	const systemInfo = uni.getSystemInfoSync();
	const windowHeight = systemInfo.windowHeight;

	// 使用固定的rpx值来定义各个固定元素的高度
	const topNavHeight = 120; // 顶部导航栏高度 (rpx)
	const navTabsHeight = 90; // Tab栏高度 (rpx)
	const bottomTabBarHeight = 120; // 底部TabBar高度 (rpx)

	// 计算总固定高度
	const totalFixedHeight = topNavHeight + navTabsHeight + bottomTabBarHeight;

	// 转换为px并计算可滚动区域高度
	const rpxToPx = windowHeight / 750; // 假设设计稿为750rpx宽
	scrollHeight.value = windowHeight - totalFixedHeight * rpxToPx;

	// 添加日志以便调试
	console.log(
		`✅ 滚动高度计算: 窗口高度=${windowHeight}px, 顶部导航=${topNavHeight}rpx, Tab栏=${navTabsHeight}rpx, 底部导航=${bottomTabBarHeight}rpx, 总固定高度=${totalFixedHeight}rpx, 滚动区域=${scrollHeight.value}px`
	);
}

// 监听tab切换，重置滚动位置
const handleNavChange = (index) => {
	activeNav.value = index;
	nextTick(() => {
		scrollToView.value = "content-start";
	});
};

const handleTabChange = (path) => {
	// Handle bottom tab bar change
	console.log("Tab changed to:", path);
};

function selectAmount(amount) {
	// 当从自定义切换到预设金额时，保存当前自定义输入值
	const previousAmount = selectedAmount.value;

	selectedAmount.value = amount;
	toggleDropdown.value = false;

	// Handle custom amount logic
	if (amount === "custom") {
		// 设置默认值或保持当前输入
		if (!customAmountInput.value) {
			customAmountInput.value = 0;
		}
		// 输入框获得焦点
		nextTick(() => {
			const input = document.querySelector(".custom-amount-input");
			if (input) {
				input.focus();
			}
		});
	} else if (previousAmount === "custom") {
		// 从自定义切换到预设金额时，不需要做特殊处理
		// 但可以在这里添加相关逻辑如果需要
	}
}

// 验证自定义输入金额
function validateCustomAmount(event) {
	// 获取输入值
	let value = event.target.value;

	// 只允许数字和小数点
	value = value.replace(/[^0-9.]/g, "");

	// 确保只有一个小数点
	const parts = value.split(".");
	if (parts.length > 2) {
		value = parts[0] + "." + parts.slice(1).join("");
	}

	// 限制小数位数为2位
	if (parts.length === 2 && parts[1].length > 2) {
		value = parts[0] + "." + parts[1].substring(0, 2);
	}

	// 更新输入框显示值
	event.target.value = value;

	// 更新响应式变量
	const numValue = value === "" ? 0 : parseFloat(value);
	customAmountInput.value = isNaN(numValue) ? 0 : numValue;
}

const traderId = ref("")
// uni-app页面加载时接收参数
onLoad(async (options) => {
	console.log("📥 Page loaded with options:", options);
	console.log("Type:", options?.type);
	console.log("Trader ID:", options?.traderId);
	traderId.value = options?.traderId
	console.log("Trader id yang dikirim : ", traderId.value);
	// 加载市场数据，传递options参数
	await loadData(options);
});

// 页面挂载时计算高度并加载数据
onMounted(async () => {
	calculateScrollHeight();
	// 监听窗口大小变化，重新计算高度
	uni.onWindowResize(calculateScrollHeight);

	// 从storage获取跳转参数
	const jumpParams = storage.getSync("traderJumpParams");
	if (jumpParams) {
		console.log("从follow页面跳转而来，参数:", jumpParams);
		const { traderId, source } = jumpParams;
		// 这里可以根据traderId和source进行相应的业务逻辑处理
		// 例如：加载特定带单员的数据、显示特定内容等

		// 处理完参数后可以清除，避免下次进入页面时重复使用
		// storage.removeSync('traderJumpParams')
	}
});

// 页面卸载时移除监听
onUnmounted(() => {
	uni.offWindowResize(calculateScrollHeight);
});
</script>

<style scoped lang="scss">
.market-container {
	background-color: #202020;
	color: #ffffff;
	min-height: 100vh;
	position: relative;
	padding-bottom: 240rpx; // 为自定义底栏预留空间，避免App端遮挡
}

/* 市场数据相关样式 */
.market-data-tab {
	padding-bottom: 20rpx;
}

.page-stock {
	background-color: #202020;
	color: #fff;
	min-height: 100vh;
	padding: 20rpx 30rpx;
	padding-bottom: 0rpx;
}

.results-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	/* 现代端优先使用gap，旧端使用下面的margin方案兜底 */
	// gap: 20rpx; 
}

.result-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	background-color: #2a2a2a;
	border-radius: 20rpx;
	padding: 20rpx;
	/* 兜底：当gap不生效（部分小程序端）时，以margin-bottom制造间距 */
	margin-top: 30rpx;
	// border-bottom: 1rpx solid #333;
}

/* 兜底规则：列表最后一项不需要额外底部间距 */
.results-list .result-item:last-child {
	margin-bottom: 0;
}

.page-stock {
	/* 保持页面底部留白，避免最后一项贴边 */
	padding-bottom: 30rpx;
}

.item-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.item-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
}

.item-info {
	display: flex;
	flex-direction: column;
	margin-right: 20rpx;
}

.item-name {
	font-size: 30rpx;
	font-weight: 500;
	color: #fff;
	margin-bottom: 4rpx;
}

.item-code {
	font-size: 24rpx;
	color: #9aa4ae;
}

.graph-img-stock {
	width: 160rpx;
	height: 50rpx;
}

.item-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.item-price {
	font-size: 30rpx;
	font-weight: 500;
	color: #fff;
	margin-bottom: 4rpx;
}

.item-percent {
	font-size: 24rpx;
}

.item-percent.up {
	color: #16c784;
}

.item-percent.down {
	color: #ff4d4d;
}

/* Content Scroll View */
.content-scroll-view {
	width: 100%;
	box-sizing: border-box;
	position: relative;
}

/* #ifdef APP-PLUS */
/* APP 端专属适配：增大列表卡片间距以匹配 H5 视觉 */
.results-list {
	gap: 30rpx;
}

.result-item {
	margin-bottom: 30rpx;
}

/* #endif */

/* Status Bar Spacer - 为状态栏预留空间 */
.status-bar-spacer {
	width: 100%;
	/* 状态栏高度通过内联样式动态设置 */
	/* 不再使用 CSS 安全区变量，避免与内联样式重复叠加 */
	background-color: #202020;
	flex-shrink: 0;
}

/* Top Tabs - Sticky positioned */
.top-menu {
	white-space: nowrap;
	width: 100%;
	padding: 20rpx 30rpx 20rpx;
	box-sizing: border-box;
	position: sticky;
	top: 0;
	background-color: #202020;
	z-index: 100;
	padding-top: 80rpx;
	/* border-bottom: 1rpx solid #333; */
}

.menu-scroll {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	gap: 40rpx;
	padding-bottom: 10rpx;
}

.menu-item {
	font-size: 28rpx;
	color: #9aa4ae;
}

.menu-item.active {
	opacity: 1;
	font-weight: 600;
	font-size: 30rpx;
	color: #fff;
}

/* Profile Section */
.profile-section {
	padding: 0 30rpx 0rpx;
	/* border-bottom: 1rpx solid #333; */
}

.profile-row {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 30rpx;
	width: 100%;
	padding-top: 20rpx;
}

.avatar {
	width: 110rpx;
	height: 110rpx;
	border-radius: 50%;
	margin-right: 12rpx;
	background-color: #f0f0f0;
	margin-top: 14rpx;
}

.profile-info {
	/* flex: 1; */
	display: flex;
	width: 360rpx;
	flex-direction: column;
	padding-right: 40rpx;
}

.name-row {
	display: flex;
	align-items: center;
	margin-bottom: 4rpx;
}

.name {
	font-size: 32rpx;
	font-weight: 700;
}

.stats-row+.desc {
	font-size: 24rpx;
	/* opacity: 0.7; */
	margin-bottom: 8rpx;
	line-height: 1.4;
	color: #9aa4ae;
}

/* Stats Row */
.stats-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-number {
	font-size: 30rpx;
	/* font-weight: bold; */
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 24rpx;
	/* opacity: 0.6; */
	color: #9aa4ae;
}

.stat-label1 {
	color: #fff;
	font-size: 26rpx;
}

.contact-box {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
}

.contact-item {
	flex-direction: row;
	align-items: center;
	gap: 8rpx;
}

.contact-icon {
	width: 36rpx;
	height: 36rpx;
}

.actions {
	display: flex;
	/* flex-direction: column; */
	align-items: center;
	gap: 12rpx;
	margin-top: 20rpx;
}

.more-btn {
	font-size: 30rpx;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	border-radius: 50rpx;
	background-color: #2a2a2d;
	display: flex;
	align-items: center;
	justify-content: center;
	/* padding: 6rpx 0; */
}

.follow-btn {
	background-color: #2a2a2d;
	padding: 12rpx 28rpx;
	font-size: 24rpx;
	border-radius: 40rpx;
}

.followed-btn {
	background: linear-gradient(160deg, #6a5acd, #ff69b4);
	color: white;
}

.badge-row {
	white-space: nowrap;
	/* margin-bottom: 20rpx; */
}

.DividendsIcon {
	width: 22rpx;
	height: 22rpx;
	margin-right: 10rpx;
}

.badge {
	background-color: #333f59;
	padding: 4rpx 16rpx;
	border-radius: 16rpx;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	width: 190rpx;
}

/* Content Tabs */
.content-tabs {
	width: 686rpx;
	margin: 0 auto;
	display: flex;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #333;
}

.tab-item {
	font-size: 28rpx;
	padding-bottom: 10rpx;
	color: #aaa;
	margin-right: 40rpx;
}

.tab-item.active {
	color: #fff;
	/* border-bottom: 2rpx solid #4f6fff; */
	font-weight: bold;
}

/* Auto Follow Content */
.auto-follow-content {
	padding: 30rpx;
}

/* Trader Card */
.trader-card {
	/* border: 2rpx solid #4f6fff; */
	background: #2a2a2a;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 30rpx;
}

.trader-info {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.trader-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 16rpx;
}

.trader-details {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.rankTitle {
	color: #fff;
}

.humanIcon {
	width: 22rpx;
	height: 24rpx;
	margin-right: 6rpx;
}

.trader-name {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 4rpx;
}

.trader-rank {
	font-size: 24rpx;
	color: #9aa4ae;
	/* opacity: 0.7; */
}

.recommend-badge {
	background-color: rgba(25, 175, 0, 0.12);
	padding: 4rpx 16rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	color: #19af00;
}

.trader-stats-overview {
	display: flex;
	justify-content: space-between;
}

.trader-stats-overview .stat-item {
	/* flex: 1; */
	text-align: center;
	background-color: transparent;
	padding: 0;
	margin-right: 0;
}

.trader-stats-overview .stat-label {
	font-size: 24rpx;
	/* opacity: 0.7; */
	margin-bottom: 8rpx;
}

.trader-stats-overview .stat-value {
	font-size: 30rpx;
	font-weight: 500;
}

/* Follow Amount Section */
.follow-amount-section {
	/* margin-bottom: 30rpx;y */
	/* background-color: #2a2a2d; */
	border-radius: 20rpx;
	padding: 24rpx;
}

.FollowAmountBox {
	background-color: #2a2a2a;
	border-radius: 20rpx;
	padding: 30rpx 0;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
}

.section-title1 {
	font-size: 30rpx;
	font-weight: bold;
	/* padding-bottom: 30rpx; */
}

.available-balance {
	font-size: 24rpx;
	color: #9aa4ae;
	/* opacity: 0.7; */
}

/* Dropdown Styles */
.amount-dropdown {
	position: relative;
	width: 100%;
}

.dropdown-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 20rpx;
	background-color: #3b3b3b;
	border-radius: 20rpx;
	font-size: 30rpx;
	font-weight: 500;
}

.selected-amount {
	color: #fff;
	font-size: 30rpx;
	font-weight: 500;
}

.custom-input-wrapper {
	display: flex;
	align-items: center;
	flex: 1;
}

.custom-amount-input {
	flex: 1;
	background: transparent;
	border: none;
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	padding: 0;
	outline: none;
	text-align: left;
}

.custom-amount-input::placeholder {
	color: rgba(255, 255, 255, 0.5);
}

.amount-suffix {
	color: rgba(255, 255, 255, 0.7);
	font-size: 28rpx;
	margin-left: 8rpx;
}

.amount-dropdown .dropdown-arrow {
	width: 36rpx;
	height: 36rpx;
	display: inline-block;
	transition: transform 0.3s ease-in-out;
	transform: rotate(0deg) !important;
}

.amount-dropdown .dropdown-arrow.rotate {
	transform: rotate(180deg) !important;
}

.dropdown-options {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background-color: rgba(32, 32, 32, 1);
	border-radius: 16rpx;
	margin-top: 4rpx;
	z-index: 10;
	overflow: hidden;
}

.dropdown-option {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	font-size: 28rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.dropdown-option:last-child {
	border-bottom: none;
}

.dropdown-option.active {
	/* background-color: #2f3a6b;  */
}

.check-mark {
	width: 28rpx;
	height: 28rpx;
}

.custom-option {
	/* color: #4f6fff; */
}

/* Auto Follow Switch */
.auto-follow-switch {
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* margin-bottom: 30rpx; */
	background-color: #3b3b3b;
	border-radius: 20rpx;
	padding: 10rpx 20rpx;
	width: 650rpx;
	box-sizing: border-box;
	margin: 0 auto;
}

.switch-content {
	flex: 1;
}

.switch-title {
	font-size: 24rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	display: block;
}

.switch-desc {
	font-size: 24rpx;
	opacity: 0.7;
}

/* Auto Follow Switch Styles */

.switch-content {
	flex: 1;
}

/* .switch-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
} */

/* .switch-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
} */

/* Switch Styles */
.switch {
	position: relative;
	display: inline-block;
	width: 90rpx;
	height: 44rpx;
	cursor: pointer;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.3s;
	border-radius: 60rpx;
}

.slider:before {
	position: absolute;
	content: "";
	height: 40rpx;
	width: 40rpx;
	left: 5rpx;
	bottom: 2rpx;
	background-color: #3b3b3b;
	transition: 0.3s;
	border-radius: 50%;
}

.slider.active {
	background-color: #325df4;
	/* right: 3rpx; */
}

.slider.active:before {
	background-color: #3b3b3b;
}

.slider.active:before {
	transform: translateX(40rpx);
}

/* Trading Stats */
.trading-stats-section {
	margin-top: 30rpx;
	margin-bottom: 30rpx;
	background-color: #2a2a2a;
	border-radius: 20rpx;
	padding: 20rpx 30rpx;
}

.trading-stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	/* gap: 16rpx; */
	padding-top: 20rpx;
}

.trading-stat-item {
	padding-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	/* background-color: #2a2a2d; */
	/* border-radius: 16rpx; */
}

.trading-stat-label {
	font-size: 24rpx;
	opacity: 0.7;
	margin-bottom: 8rpx;
}

.trading-stat-value {
	font-size: 30rpx;
	font-weight: 600;
}

.redLebal {
	color: #ee3c4a;
}

/* Risk Warning */
.risk-warning {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	padding: 20rpx;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 16rpx;
	margin-bottom: 30rpx;
	width: 100%;
	box-sizing: border-box;
}

.risk-title {
	display: flex;
	align-items: center;
}

.risk-icon {
	font-size: 24rpx;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	/* background-color: rgba(255, 255, 255, 0.2); */
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;
	flex-shrink: 0;
}

.risk-text {
	font-size: 26rpx;
	font-weight: 600;
	margin-right: 10rpx;
	flex-shrink: 0;
}

.risk-content {
	flex: 1;
	font-size: 24rpx;
	line-height: 36rpx;
	/* opacity: 0.8; */
	color: #9aa4ae;
	padding-left: 40rpx;
	padding-top: 10rpx;
}

.warnWhite {
	width: 28rpx;
	height: 24rpx;
}

/* Profit Preview */
.profit-preview {
	padding: 20rpx 20rpx;
	background-color: #2a2a2a;
	border-radius: 16rpx;
	margin-bottom: 30rpx;
}

.profit-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
	font-size: 24rpx;
	color: #9aa4ae;
}

.preview-box {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.preview-left {
	display: flex;
	flex-direction: column;
}

.profit-right {
	display: flex;
	align-items: center;
}

.timeIcon {
	width: 56rpx;
	height: 56rpx;
}

.chart-icon {
	width: 40rpx;
	height: 40rpx;
}

.profit-amount {
	font-size: 26rpx;
	font-weight: 500;
	/* margin-bottom: 8rpx; */
}

.profit-calculation {
	font-size: 24rpx;
	color: #9aa4ae;
	/* opacity: 0.7; */
}

/* Confirm Button */
.confirm-btn {
	background: linear-gradient(175deg, #5246a3, #d75b99);
	padding: 20rpx;
	text-align: center;
	border-radius: 20rpx;
	font-size: 28rpx;
	font-weight: 500;
}

/* Personal Views Content */
.personal-views-content {
	padding: 0 30rpx;
}

.view-item {
	/* background-color: #2a2a2d; */
	/* border-radius: 20rpx; */
	padding: 24rpx 0 0;
	margin-bottom: 24rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.view-header {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.user-avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	margin-right: 10rpx;
}

.user-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.user-name {
	font-size: 28rpx;

	.name {
		font-weight: 500;
	}

	/* font-weight: bold; */
}

.name {
	font-size: 28rpx;
}

.follow-btn-mini {
	background-color: #2a2a2d;
	padding: 8rpx 22rpx;
	border-radius: 40rpx;
	font-size: 20rpx;
}

.followed-btn-mini {
	background: linear-gradient(160deg, #6a5acd, #ff69b4);
	color: white;
}

.view-content {
	font-size: 26rpx;
	line-height: 1.5;
	/* padding-bottom: 16rpx; */
}

.view-images {
	padding-top: 16rpx;
	display: flex;
	margin-bottom: 14rpx;
	gap: 12rpx;
}

.view-image {
	width: 270rpx;
	height: 196rpx;
	border-radius: 16rpx;
	object-fit: cover;
}

.view-actions {
	display: flex;
	flex-wrap: nowrap;
	gap: 32rpx;
	margin-bottom: 12rpx;
}

.action-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.commentIcon {
	width: 36rpx;
	height: 36rpx;
}

.action-icon {
	font-size: 24rpx;
}

.action-count {
	font-size: 24rpx;
	/* opacity: 0.7; */
}

.view-time {
	font-size: 22rpx;
	color: #9aa4ae;
	/* opacity: 0.6; */
}

.actions-box {
	padding-top: 20rpx;
	display: flex;
	justify-content: space-between;
}

/* 评论区域样式 */
.comments-section {
	margin-top: 10rpx;
	/* padding-top: 24rpx; */
	/* border-top: 1rpx solid rgba(255, 255, 255, 0.08); */
}

.comment-item {
	margin-bottom: 24rpx;
}

.comment-header {
	margin-bottom: 8rpx;
}

.comment-username {
	font-size: 22rpx;
	color: #fff;
	font-weight: 500;
}

.comment-content {
	font-size: 22rpx;
	color: #9aa4ae;
	line-height: 1.5;
	margin-left: 6rpx;
	margin-bottom: 12rpx;
}

.comment-footer {
	display: flex;
	align-items: center;
}

.comment-like {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.comment-like-icon {
	width: 24rpx;
	height: 24rpx;
}

.comment-like-count {
	font-size: 22rpx;
	color: #6e7683;
}

/* Empty State */
.empty-state {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 500rpx;
	color: #999;
}

.empty-text {
	font-size: 32rpx;
}

/* 闪兑功能样式 */
.swap-tab {
	padding: 30rpx;
}

.swap-wrapper {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.swap-box {
	background-color: #2a2a2a;
	border-radius: 20rpx;
	padding: 30rpx;
}

.swap-box1 {
	position: relative;
}

.swap-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.content-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
}

.contentbox {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.swap-label {
	font-size: 26rpx;
	color: #9aa4ae;
}

.max-half-buttons {
	display: flex;
	gap: 16rpx;
}

.max-btn,
.half-btn {
	padding: 5rpx 14rpx;
	border-radius: 10rpx;
	font-size: 20rpx;
	background-color: #333f59;
	color: #fff;
	border: none;
}

.coin-selector {
	display: flex;
	align-items: center;
	gap: 16rpx;
	// margin-bottom: 20rpx;
}

.right-box {
	display: flex;
	flex-direction: column;
}

.coin-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
}

.coin-code {
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
	display: flex;
	align-items: center;
}

.coin-name {
	font-size: 24rpx;
	color: #9aa4ae;
	/* margin-left: 12rpx; */
}

.dropdown-arrow {
	width: 28rpx;
	height: 28rpx;
	margin-left: 10rpx;
	/* margin-left: auto; */
}

.amount-display {
	// margin-bottom: 10rpx;
}

.amount-value {
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
}

.estimated-value {
	font-size: 26rpx;
	color: #9aa4ae;
}

.estimated-value1 {
	font-size: 28rpx;
	color: #fff;
}

.swap-toggle-container {
	display: flex;
	justify-content: center;
	// position: relative;
	// margin-top: -20rpx;
	// margin-bottom: -20rpx;
	position: absolute;
	bottom: -70rpx;
	left: 310rpx;
}

.swap-toggle {
	width: 84rpx;
	height: 84rpx;
	border-radius: 50%;
	background-color: #3b3b3b;
	display: flex;
	align-items: center;
	justify-content: center;

	// box-shadow: 0 4rpx 12rpx rgba(25, 137, 250, 0.3);
}

.swap-toggle image {
	width: 48rpx;
	height: 48rpx;
}

.rate-info-section {
	background-color: #2a2a2a;
	border-radius: 20rpx;
	padding: 30rpx;
}

.rate-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 6rpx 0;
}

.rate-label {
	font-size: 30rpx;
	color: #fff;
}

.rate-value {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.rate-value-secondary {
	font-size: 24rpx;
	color: #888;
	margin-left: 20rpx;
}

.swap-button-container {
	// margin-top: 20rpx;
	position: fixed;
	bottom: 260rpx;
}

.swap-button {
	width: 678rpx;
	// padding: 32rpx;
	height: 84rpx;
	border-radius: 20rpx;
	background: linear-gradient(175deg, #5565b9, #cd5890);
	color: white;
	font-size: 30rpx;
	font-weight: 500;
	border: none;
}

.swap-toggle image {
	transform: none !important;
}

/* 补充缺失的图标样式 */
.swap-icon {
	width: 36rpx;
	height: 36rpx;
}

/* Description Expandable Styles */
.desc-container {
	position: relative;
	display: flex;
	flex-direction: column;
}

.desc {
	color: #9aa4ae;
	font-size: 24rpx;
	line-height: 40rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: all 0.3s ease;
	position: relative;
}

.time {
	color: #9aa4ae;
	font-size: 24rpx;
}

.desc.expanded {
	-webkit-line-clamp: unset;
	overflow: visible;
}

.desc-arrow {
	width: 24rpx;
	height: 24rpx;
	margin-top: 8rpx;
	margin-left: auto;
	cursor: pointer;
	position: absolute;
	/* opacity: 0.6; */
	transform-origin: center center;
	transition: transform 0.3s ease-in-out;
	transform: rotate(0deg) !important;
	right: -14rpx;
	bottom: 4rpx;
}

.desc-arrow.rotate {
	transform: rotate(180deg) !important;
}

/* Common Styles */
.green {
	color: #4caf50;
}

/* Responsive adjustments */
@media screen and (max-width: 375px) {
	.amount-options {
		justify-content: space-between;
	}

	.amount-option {
		flex: 1;
		text-align: center;
		margin-right: 8rpx;
	}

	.amount-option:last-child {
		margin-right: 0;
	}
}
</style>