<template>
  <view class="page">
    <!-- 顶部安全区：参照市场页使用 getTopStyle -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">资产</text>
    </view>

    <!-- 导航栏 -->
    <view class="nav-tabs">
      <view v-for="(tab, i) in tabs" :key="i" :class="['tab-item', { active: i === activeTab }]"
        @click="setActiveTab(i)">
        {{ tab }}
      </view>
    </view>

    <!-- 资产概览 -->
    <scroll-view class="scroll-content" scroll-y>
      <view class="overview">
        <view class="asset-row">
          <view class="left">
            <image class="eye-icon" src="/static/icons/ic_eye.png" mode="aspectFit" />
            <text class="label">资产总估值</text>
          </view>
          <view class="right">
            <image class="chart-icon" src="/static/icons/ic_chart.png" mode="aspectFit" />
            <image class="record-icon" src="/static/icons/ic_record.png" mode="aspectFit" />
          </view>
        </view>

        <view class="balance-row">
          <text class="balance">{{ ballance.total }}</text>
          <text class="unit">{{ ballance.baseAsset }}</text>
          <image class="arrow-down" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
        </view>

        <text class="sub-balance">{{ ballance.approximately }}</text>
        <br />

        <text class="profit">{{ $t('transaction.today_pnl') }} {{ ballance.approximately }} {{ ballance.baseAsset }} ({{
          ballance.pnl_percent }})</text>

        <!-- 按钮组 -->
        <view class="action-row">
          <view class="btn add-fund">{{ $t('transaction.add_funds') }}</view>
          <view class="btn normal" @click="goToWithdraw">{{ $t('transaction.transfer_out') }}</view>
          <view class="btn normal" @click="goToTransfer">{{ $t('transaction.transfer') }}</view>
        </view>
      </view>

      <!-- 底部筛选 -->
      <view class="footer" v-if="activeTab < 3">
        <!-- <view class="footer-left">
              <text class="label active">币种</text>
              <text class="label">账户</text>
            </view> -->

        <!-- Tab -->
        <view class="tab-dialog">
          <text v-for="(tab, index) in tabs2" :key="index"
            :class="['tab-item-dialog', { active: activeTabs2 === index }]" @click="activeTabs2 = index">
            {{ tab }}
          </text>
        </view>
        <view class="footer-right">
          <image class="search-icon " src="/static/icons/ic_search.png" mode="aspectFit" />
          <image class="icon" src="/static/icons/ic_record.png" mode="aspectFit" />
        </view>
      </view>

      <view class="reward-card" v-if="activeTab == 0 && activeTabs2">
        <view class="header">
          <view class="left">
            <view class="icon-box">
              <image class="icon" src="/static/icons/ic_gift.png" mode="aspectFit" />
            </view>
            <text class="title1">{{ $t('transaction.rewards_center') }}</text>
          </view>
          <image class="arrow" src="/static/icons/ic_arrow_right.png" mode="aspectFit" />
        </view>

        <view class="content">
          <view class="item">
            <text class="label">{{ $t('transaction.promotion_commission') }}</text>
            <text class="value">{{ rewards.TotalReward.total }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t('transaction.pending_rewards') }}</text>
            <text class="value green">{{ rewards.Unclaim.Amount.total }}</text>
          </view>
        </view>

        <view class="item">
          <text class="label">{{ $t('transaction.airdrop_tokens') }}</text>
          <text class="count">{{ rewards.Unclaim.Token.total }}个</text>
        </view>

        <view class="btn-reword">
          {{ $t('transaction.claim_rewards') }}
        </view>
      </view>

      <view class="asset-list-dialog">
        <view v-for="(item, index) in assets" :key="index" class="asset-item-dialog" v-if="activeTab <= 2">
          <!-- Kiri: icon dan nama -->
          <view class="asset-left-dialog">
            <image :src="item.icon" class="asset-icon-dialog" mode="aspectFit" />
            <view class="asset-info-dialog">
              <text class="asset-name-dialog">{{ item.symbol }}</text>
              <text class="asset-subname-dialog">{{ item.name }}</text>
            </view>
          </view>

          <!-- Kanan: saldo dan tombol -->
          <view class="asset-right-dialog">
            <text class="asset-balance-dialog">{{ item.balance }}</text>
            <view class="asset-buttons-dialog">
              <view class="btn-dialog">{{ $t('transaction.financial') }}</view>
              <view class="btn-dialog">{{ $t('transaction.trade') }}</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="activeTab == 4">
        <!-- 理财tab底部区域 -->
        <view class="earn-empty-container">
          <!-- 图标区域 -->
          <view class="earn-icon-box">
            <image src="/static/icons/ic_empty_record.png" class="earn-icon" mode="aspectFit" />
          </view>

          <!-- 提示文本 -->
          <!-- <text class="earn-empty-title">自动申购</text> -->
          <text class="earn-empty-subtitle">利用闲置资产赚取收益</text>
          <text class="earn-no-data">没有数据</text>

          <!-- 申购按钮 -->
          <view class="earn-purchase-btn">立即申购</view>
        </view>
      </view>

      <view class="page-dialog1" v-if="activeTab == 3">
        <!-- Atas: Switch -->
        <view class="switch-section-dialog">
          <view class="switch-item-dialog">
            <text class="label-dialog">{{ $t('transaction.bnb_discount') }}</text>
            <switch class="switch-dialog" color="#007AFF" />
          </view>
          <view class="switch-item-dialog">
            <text class="label-dialog">{{ $t('transaction.ldusdt_earnings') }}</text>
            <text class="apr-dialog">APR 4.50%</text>
            <image src="/static/icons/ic_arrow_right.png" class="arrow-dialog" mode="aspectFit" />
          </view>
        </view>



        <!-- Konten -->

        <view v-for="(items, type) in contractAsset" :key="type">
          <view class="asset-card-dialog" v-if="activeTab == 3">
            <view class="asset-header-dialog">
              <view class="left-dialog">
                <view class="buy-tag-dialog">{{ $t('transaction.buy') }}</view>
                <text class="pair-dialog">{{ items.symbol }}</text>
              </view>
              <image src="/static/icons/ic_share.png" class="share-icon-dialog" mode="aspectFit" />
            </view>

            <view class="asset-stats-dialog">
              <view class="col-dialog">
                <text class="label-dialog">{{ $t('transaction.unrealized_pnl') }}(USDT)</text>
                <text class="value-green-dialog-big">{{ items.unrealized_pnl }}</text>
              </view>
              <view class="col-dialog">
                <text class="label-dialog">{{ $t('transaction.return_on_investment') }}</text>
                <text class="value-green-dialog-big">{{ items.roi_percent }}</text>
              </view>
            </view>

            <view class="asset-details-dialog">
              <view class="detail-item-dialog">
                <text class="label-dialog">{{ $t('transaction.position_quantity') }}(USDT)</text>
                <text class="value-dialog">{{ items.position_value }}</text>
              </view>
              <view class="detail-item-dialog">
                <text class="label-dialog">{{ $t('transaction.margin') }}(USDT)</text>
                <text class="value-dialog">{{ items.margin }}</text>
              </view>
              <view class="detail-item-dialog">
                <text class="label-dialog-right">{{ $t('transaction.margin_ratio') }}</text>
                <text class="value-green-dialog-right">{{ items.margin_ratio }}</text>
              </view>
            </view>

            <view class="asset-details-dialog">
              <view class="detail-item-dialog">
                <text class="label-dialog">{{ $t('transaction.open_position_price') }}(USDT)</text>
                <text class="value-dialog">{{ items.entry_price }}</text>
              </view>
              <view class="detail-item-dialog">
                <text class="label-dialog">{{ $t('transaction.mark_price') }}(USDT)</text>
                <text class="value-dialog">{{ items.mark_price }}</text>
              </view>
              <view class="detail-item-dialog">
                <text class="label-dialog-right">{{ $t('transaction.liquidation_price') }}(USDT)</text>
                <text class="value-green-dialog-right">{{ items.liquidation_price }}</text>
              </view>
            </view>
          </view>
        </view>


      </view>
      <view class="wallet-page" v-if="activeTab == 5 && useWallet.length == 0">
        <!-- 紫色圆形图标 -->
        <view class="wallet-icon-container">
          <image src="/static/icons/ic_empty_record.png" class="wallet-icon" mode="aspectFit" />
        </view>

        <!-- 标题 -->
        <text class="wallet-title">开通链上钱包</text>

        <!-- 描述文字 -->
        <text class="wallet-description">开通钱包后可以管理多链资产、参与空投和DeFi项目</text>

        <!-- 按钮区域 -->
        <view class="wallet-button-container">
          <view class="wallet-btn-create">创建新钱包</view>
          <view class="wallet-btn-import">导入已有钱包</view>
        </view>
      </view>

      <view class="asset-list" v-if="activeTab == 5">
        <view class="asset-item" v-for="(asset, index) in useWallet" :key="index">
          <!-- Icon -->
          <image class="asset-icon" :src="asset.Balance.icon" mode="aspectFill" />

          <!-- Symbol dan Nama -->
          <view class="asset-info">
            <text class="asset-symbol">{{ asset.baseAsset }}</text>
            <text class="asset-name">{{ asset.Network.desc }}</text>
          </view>

          <!-- Balance -->
          <text class="asset-balance">{{ asset.Balance.balance }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore, WalletsParams } from '@/store/modules/user'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { useSafeArea } from '@/utils/composables/useSafeArea'
const { t } = useI18n()
const { getTopStyle } = useSafeArea()
const userInfo = uni.getStorageSync('userData')

const userStore = useUserStore()

const tabs = [t('transaction.overview'), t('transaction.hong_kong_stocks'), t('transaction.spot'), t('transaction.futures'), t('transaction.earn'), t('transaction.wallet')]
const masterAssets = ref([])
const ballance = ref({
  total: '0.00',
  baseAsset: 'USDT',
  approximately: '≈ $0.00',
  pnl_percent: '+0.00%'
})
const contractAsset = ref([])
const useWallet = ref([])

const rewards = ref({
  TotalReward: { total: '0.00' },
  Unclaim: {
    Amount: { total: '0.00' },
    Token: { total: 0 }
  }
})
const assets = ref([])
const activeTab = ref(0)

const tabs2 = ref([t('transaction.currency'), t('transaction.account')])
const activeTabs2 = ref(0)

// 模拟数据定义
const mockData = {
  balance: {
    total: '12,345.67',
    baseAsset: 'USDT',
    approximately: '≈ $12,345.67',
    pnl_percent: '+2.35%'
  },
  rewards: {
    TotalReward: { total: '123.45' },
    Unclaim: {
      Amount: { total: '45.67' },
      Token: { total: 3 }
    }
  },
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '/static/icons/ic_gmail.png',
      balance: '0.5',
      type: 'spot'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/static/icons/ic_gmail.png',
      balance: '5.2',
      type: 'spot'
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      icon: '/static/icons/ic_gmail.png',
      balance: '10',
      type: 'stock'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      icon: '/static/icons/ic_gmail.png',
      balance: '5',
      type: 'stock'
    }
  ],
  contractAsset: [
    {
      symbol: 'BTCUSDT',
      unrealized_pnl: '123.45',
      roi_percent: '+4.5%',
      position_value: '5,000.00',
      margin: '1,000.00',
      margin_ratio: '20%',
      entry_price: '45,678.90',
      mark_price: '47,890.12',
      liquidation_price: '40,000.00'
    }
  ],
  useWallet: []
}

onLoad(async (options) => {
  console.log('options:', options)

  try {
    const wallletsParams: WalletsParams = {
      passkey: userStore.pasKeyAuth || '',
      device: userStore.deviceAuth || '',
      appversion: userStore.appversionAuth || '',
      token: userInfo?.data?.token || '',
      lang: "en"
    }

    // 尝试从API获取数据
    const resultWallets = await userStore.getWallets(wallletsParams)

    // 移除失败时的退出登录逻辑，无论如何都使用数据或模拟数据
    // 检查API返回的数据是否有效，如果有效则使用，否则使用模拟数据
    if (resultWallets.data?.data) {
      ballance.value = resultWallets.data.data.Balance || mockData.balance
      contractAsset.value = resultWallets.data.data.Contract?.Asset || mockData.contractAsset
      masterAssets.value = resultWallets.data.data.Asset?.Currency || mockData.assets
      assets.value = resultWallets.data.data.Asset?.Currency || mockData.assets
      rewards.value = resultWallets.data.data.Reward || mockData.rewards
      useWallet.value = resultWallets.data.data.UserWallet || mockData.useWallet
    } else {
      // 使用模拟数据
      console.log('使用模拟数据')
      ballance.value = mockData.balance
      contractAsset.value = mockData.contractAsset
      masterAssets.value = mockData.assets
      assets.value = mockData.assets
      rewards.value = mockData.rewards
      useWallet.value = mockData.useWallet
    }

    console.log("✅ API Result or Mock Data Loaded")
  } catch (e) {
    console.error('❌ Failed to load data, using mock data:', e)
    // 发生错误时直接使用模拟数据构建静态页面，不再调用退出登录
    ballance.value = mockData.balance
    contractAsset.value = mockData.contractAsset
    masterAssets.value = mockData.assets
    assets.value = mockData.assets
    rewards.value = mockData.rewards
    useWallet.value = mockData.useWallet
  }
})

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除所有用户相关数据
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isRegistered')
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('login_cache')

        // 显示退出成功提示
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })

        // 跳转到启动页
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/startup' })
        }, 1000)
      }
    }
  })
}

function setActiveTab(index) {
  console.log(index, '????????????')
  activeTab.value = index

  tabs2.value = [t('transaction.currency'), t('transaction.account')]
  if (index == 0) {
    assets.value = masterAssets.value
  } else if (index == 1) {
    assets.value = masterAssets.value.filter(item => item.type === 'stock')
  } else if (index == 2) {
    tabs2.value = [t('transaction.assets')]
    assets.value = masterAssets.value.filter(item => item.type === 'spot')
  }
}

function goBack() {
  uni.navigateBack()
}

const goToTransfer = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/transfer/index',
      success: () => console.log('✅ Navigated'),
      fail: (err) => console.error('❌ Navigation failed:', err)
    })
  }, 500)

}

const goToWithdraw = () => {
  // Arahkan ke halaman verifikasi

  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/withdraw/index',
      success: () => console.log('✅ Navigated'),
      fail: (err) => console.error('❌ Navigation failed:', err)
    })
  }, 500)

}


</script>

<style scoped>
.page {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.header {
  position: sticky;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.05); */
}

/* 顶部安全区由 status-bar-spacer + getTopStyle 提供，无需额外样式 */

.back-btn {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 22px;
  height: 22px;
}

.header-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 40px;
}

/* 导航栏 */
.nav-tabs {
  position: sticky;
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.05); */
}

.tab-item {
  color: #aaa;
  font-size: 14px;
  padding-bottom: 6px;
}

.tab-item.active {
  color: #fff;
  font-weight: 600;
  border-bottom: 2px solid #fff;
}

/* 资产概览 */
.overview {
  padding: 16px;
}

.asset-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eye-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}

.search-icon {
  width: 50px;
  height: 50px;
}

.left {
  display: flex;
  align-items: center;
}

.label {
  color: #aaa;
  font-size: 14px;
}

.right {
  display: flex;
  align-items: center;
}

.chart-icon,
.record-icon {
  width: 20px;
  height: 20px;
  margin-left: 12px;
}

.balance-row {
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
}

.balance {
  font-size: 34px;
  font-weight: bold;
}

.unit {
  font-size: 16px;
  margin-left: 6px;
  color: #aaa;
}

.arrow-down {
  width: 16px;
  height: 16px;
  margin-left: 4px;
}

.sub-balance {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}

.profit {
  color: #19AF00;
  font-size: 13px;
  margin-top: 4px;
}

/* 按钮组 */
.action-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  flex: 1;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 10px;
  font-size: 14px;
  margin: 0 4px;
}

.add-fund {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #fff;
}

.normal {
  border: 1px solid #444;
  color: #fff;
}

/* 底部筛选 */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 6px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-left {
  display: flex;
  align-items: center;
}

.footer-left .label {
  font-size: 14px;
  color: #999;
  margin-right: 20px;
}

.footer-left .label.active {
  color: #fff;
}

.footer-right {
  display: flex;
  align-items: center;
}

.footer-right .icon {
  width: 18px;
  height: 18px;
  margin-left: 16px;
  opacity: 0.9;
}

.filter {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter .label {
  color: #ccc;
  font-size: 14px;
}

.filter .arrow {
  width: 14px;
  height: 14px;
  margin-left: 4px;
}

.reward-card {
  background-color: #2A2A2A;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 16px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-top: 80rpx;
}

.left {
  display: flex;
  align-items: center;
}

.icon-box {
  background-color: #6a5af9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 16px;
  color: #fff;
  margin-left: 8px;
  font-weight: 500;
}

.arrow {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.content {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.item {
  display: flex;
  flex-direction: column;
}

.label {
  color: #999;
  font-size: 13px;
}

.value {
  color: #fff;
  font-size: 15px;
  margin-top: 4px;
}

.value.green {
  color: #4CAF50;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 10px;
}

.count {
  color: #fff;
}

.btn-reword {
  text-align: center;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 10px;
  color: #fff;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 500;
  margin-top: 20rpx;
}

.asset-list-dialog {
  /* background-color: #1e1e1e;  */
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.asset-item-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #333;
}

.asset-item-dialog:last-child {
  border-bottom: none;
}

.asset-left-dialog {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.asset-icon-dialog {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
}

.asset-info-dialog {
  display: flex;
  flex-direction: column;
}

.asset-name-dialog {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.asset-subname-dialog {
  color: #999;
  font-size: 24rpx;
}

.asset-right-dialog {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12rpx;
}

.asset-balance-dialog {
  color: #fff;
  font-size: 28rpx;
}

.asset-buttons-dialog {
  display: flex;
  gap: 16rpx;
}

.btn-dialog {
  background-color: #2e2e2e;
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 12rpx;
}

.scroll-content {
  flex: 1;
  overflow-y: scroll;
  padding-bottom: 40rpx;
}

.page-dialog {
  /* background-color: #111; */
  color: #fff;
  min-height: 100vh;
  padding: 16rpx;
}

.page-dialog1 {
  /* background-color: #111; */
  color: #fff;
  /* min-height: 100vh; */
  padding: 16rpx;
}

/* Switch Section */
.switch-section-dialog {
  background-color: #2A2A2A;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.switch-item-dialog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 0;
}

.label-dialog {
  color: #9AA4AE;
  font-size: 26rpx;
}

.label-dialog-right {
  color: #9AA4AE;
  font-size: 26rpx;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}


.apr-dialog {
  color: #9fa3af;
  font-size: 26rpx;
  margin-right: 10rpx;
}

.arrow-dialog {
  width: 20rpx;
  height: 20rpx;
}

/* Tab */
.tab-dialog {
  display: flex;
  /* border-bottom: 1rpx solid #2a2a2a; */
  margin-top: 10rpx;
}

.tab-item-dialog {
  color: #9fa3af;
  font-size: 28rpx;
  margin-right: 40rpx;
  padding: 10rpx 0;
}

.tab-item-dialog.active {
  color: #fff;
  font-weight: 600;
}

/* Asset Card */
.asset-card-dialog {
  /* background-color: #1c1c1c; */
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}

.asset-header-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-dialog {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.buy-tag-dialog {
  background-color: #00c183;
  color: #fff;
  font-size: 24rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}

.pair-dialog {
  font-size: 30rpx;
  font-weight: 600;
}

.share-icon-dialog {
  width: 28rpx;
  height: 28rpx;
}

.asset-stats-dialog {
  display: flex;
  justify-content: space-between;
  margin-top: 16rpx;
}

.col-dialog {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.value-green-dialog {
  color: #19AF00;
  font-weight: 600;
  font-size: 28rpx;
  margin-top: 4rpx;
}

.value-green-dialog-big {
  color: #19AF00;
  font-weight: 700;
  font-size: 40rpx;
  margin-top: 4rpx;
}

.value-green-dialog-right {
  color: #19AF00;
  font-weight: 600;
  font-size: 28rpx;
  margin-top: 4rpx;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}

.asset-details-dialog {
  display: flex;
  justify-content: space-between;
  margin-top: 16rpx;
}

.detail-item-dialog {
  display: flex;
  flex-direction: column;
  width: 33%;
}

.value-dialog {
  font-size: 26rpx;
  color: #fff;
  margin-top: 4rpx;
}

.wallet-page {
  /* background-color: #141414; */
  /* min-height: 80vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 40rpx;
}

.wallet-icon-container {
  /* background-color: #6a5af9; */
  width: 200rpx;
  height: 200rpx;
  /* border-radius: 80rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.wallet-icon {
  width: 200rpx;
  height: 200rpx;
  color: #fff;
}

.wallet-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20rpx;
}

.wallet-description {
  font-size: 28rpx;
  color: #999999;
  text-align: center;
  width: 550rpx;
  line-height: 40rpx;
  margin-bottom: 60rpx;
}

.wallet-button-container {
  width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.wallet-btn-create {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.wallet-btn-import {
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #9c88ff;
  border: 2rpx solid;
  border-image: #5565B9;
}

.asset-list {
  /* background-color: #1b1b1b; */
}

.asset-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #2a2a2a;
}

.asset-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.asset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.asset-symbol {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.asset-name {
  font-size: 24rpx;
  color: #9e9e9e;
  margin-top: 4rpx;
}

.asset-balance {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

/* 理财tab样式 */
.earn-empty-container {
  /* background-color: #141414; */
  /* min-height: 80vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.earn-icon-box {
  width: 200rpx;
  height: 200rpx;
  /* background-color: #1e1e1e; */
  /* border-radius: 40rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  position: relative;
  overflow: hidden;
}
/* 
.earn-icon-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50% 50% 0 0 / 20rpx;
} */

.earn-icon {
  width: 200rpx;
  height: 200rpx;
  z-index: 1;
}

.earn-empty-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.earn-empty-subtitle {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 60rpx;
}

.earn-no-data {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 60rpx;
}

.earn-purchase-btn {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  width: 200rpx;
  height: 60rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  /* font-weight: 600; */
  color: #ffffff;
}
</style>