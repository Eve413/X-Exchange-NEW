<template>
  <view class="page-transfer">

    <!-- ✅ Header tetap (fixed) -->
    <view class="header-transfer">
      <view class="back-area" @click="goBack">
        <image src="/static/icons/ic_arrow_left.png" class="back-icon" mode="aspectFit" />
      </view>
      <text class="header-title">转出</text>
    </view>

    <!-- ✅ Konten bisa discroll -->
    <scroll-view scroll-y class="content-transfer">
      <!-- Pilih Aset -->
      <view class="form-item">
        <text class="label">{{ $t('transaction.select_asset') }}</text>

        <!-- Picker -->
        <picker mode="selector" :range="baseAsset" range-key="symbol" @change="onAssetChange">
          <view class="asset-box">
            <image v-if="selectedAsset?.icon" :src="selectedAsset.icon" class="asset-icon" mode="aspectFill" />
            <view class="asset-info">
              <text class="asset-symbol">
                {{ selectedAsset ? selectedAsset.symbol : $t('transaction.please_select_asset') }}
              </text>
              <text class="asset-name">
                {{ selectedAsset ? selectedAsset.name : '' }}
              </text>
            </view>
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>


      <!-- Pilih Network -->
      <view class="form-item">
        <text class="label">{{ $t('transaction.network') }}</text>

        <picker mode="selector" :range="baseNetwork" range-key="network" @change="onNetworkChange">
          <view class="select-box">
            <view class="select-top">
              <view>
                {{ selectedNetwork ? selectedNetwork.network : $t('transaction.please_select_network') }}
              </view>
              <view class="network-fee">
                {{ $t('transaction.network_fee') }}:
                {{ selectedNetwork ? selectedNetwork.withdraw_fee_amount + ' TRX' : '-' }}
              </view>
            </view>
            <text class="arrow">›</text>
          </view>
        </picker>


      </view>

      <!-- Alamat Tujuan -->
      <view class="form-item">
        <text class="label">{{ $t('transaction.withdraw_address') }}</text>
        <input class="input" type="text" v-model="address" :placeholder="$t('transaction.enter_or_paste_address')"
          confirm-type="done" cursor-spacing="80" />
        <view class="tip">⚠ {{ $t('transaction.address_warning') }}</view>
      </view>

      <!-- Jumlah Transfer -->
      <view class="form-item">
        <text class="label">{{ $t('transaction.withdraw_amount') }}</text>
        <view class="amount-box">
          <input class="input" type="number" v-model="amount" placeholder="0.00" />
          <view class="all-btn" @click="setAll">{{ $t('transaction.all') }}</view>
        </view>
      </view>

      <!-- Info tambahan -->
      <view class="info-list">
        <!-- <view class="info-row">
          <text>{{ $t('transaction.max_withdraw') }}</text>
          <text>10,000 USDT</text>
        </view> -->
        <view class="info-row">
          <text>最大转出</text>
          <text>{{ selectedNetwork ? selectedNetwork.deposit_max_amount : '-' }}</text>
        </view>
        <view class="info-row">
          <text>最小转出</text>
          <text>{{ selectedNetwork ? selectedNetwork.deposit_min_amount : '-' }}</text>
        </view>
        <view class="info-row">
          <text>Gas 费用</text>
          <text>{{ selectedNetwork ? selectedNetwork.withdraw_fee_amount : '-' }}</text>
        </view>
      </view>

      <!-- Tombol Submit -->
      <button class="btn-submit" @click="submitWithdraw">
        确认转出
      </button>

      <!-- Warning Text -->
      <view class="warning-box">
        <text class="warning-title">ℹ {{ $t('transaction.notice') }}</text>
        <text class="warning-item">• {{ $t('transaction.tip_1') }}</text>
        <text class="warning-item">• {{ $t('transaction.tip_2') }}</text>
        <text class="warning-item">• {{ $t('transaction.tip_3') }}</text>
        <text class="warning-item">• {{ $t('transaction.tip_4') }}</text>
      </view>
    </scroll-view>
  </view>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore, WalletsParams, WithdrawParams } from '@/store/modules/user'

const { t } = useI18n()
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()

const networks = ref([
  { id: 'TRC20', name: 'TRX (TRC20)', fee: '0.0005 TRX' },
  { id: 'ERC20', name: 'USDT (ERC20)', fee: '5 USDT' },
  { id: 'BEP20', name: 'USDT (BEP20)', fee: '0.3 USDT' },
])
const assets = ref([
  { symbol: 'USDT', name: 'Tether', balance: '1500' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.054' },
  { symbol: 'ETH', name: 'Ethereum', balance: '1.2' }
])

const selectedAsset = ref<any>(null)
const selectedNetwork = ref<any>(null)
const baseAsset = ref([])
const baseNetwork = ref([])
const address = ref('')
const amount = ref('')

// 模拟数据定义
const mockData = {
  assets: [
    {
      symbol: 'USDT',
      name: 'Tether',
      balance: '1500.00',
      type: 'spot',
      icon: '/static/icons/tether.png',
      Network: [
        {
          id: 'TRC20',
          network: 'TRC20 (TRX)',
          withdraw_fee_amount: '1.00',
          deposit_min_amount: '10.00'
        },
        {
          id: 'ERC20',
          network: 'ERC20 (ETH)',
          withdraw_fee_amount: '3.00',
          deposit_min_amount: '5.00'
        },
        {
          id: 'BEP20',
          network: 'BEP20 (BNB)',
          withdraw_fee_amount: '0.50',
          deposit_min_amount: '1.00'
        }
      ]
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: '0.054',
      type: 'spot',
      icon: '/static/icons/bitcoin.png',
      Network: [
        {
          id: 'BTC',
          network: 'Bitcoin Network',
          withdraw_fee_amount: '0.0005',
          deposit_min_amount: '0.001'
        }
      ]
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '1.2',
      type: 'spot',
      icon: '/static/icons/ethereum.png',
      Network: [
        {
          id: 'ERC20',
          network: 'ERC20 (ETH)',
          withdraw_fee_amount: '0.005',
          deposit_min_amount: '0.1'
        }
      ]
    }
  ]
}

onLoad(async (options) => {

  try {
    const wallletsParams: WalletsParams = {
      passkey: userStore.pasKeyAuth || '',
      device: userStore.deviceAuth || '',
      appversion: userStore.appversionAuth || '',
      token: userInfo?.data?.token || '',
      lang: userStore.language
    }

    // 尝试从API获取数据
    const resultWallets = await userStore.getWallets(wallletsParams)

    // 移除失败时的退出登录逻辑，无论如何都使用数据或模拟数据
    // 检查API返回的数据是否有效，如果有效则使用，否则使用模拟数据
    if (resultWallets.data?.data?.Asset?.Currency) {
      baseAsset.value = resultWallets.data.data.Asset.Currency.filter(item => item.type === 'spot')
    } else {
      // 使用模拟数据
      console.log('使用模拟数据')
      baseAsset.value = mockData.assets
    }

    console.log("✅ API Result or Mock Data Loaded")
  } catch (e) {
    console.error('❌ Failed to load data, using mock data:', e)
    // 发生错误时直接使用模拟数据构建静态页面，不再调用退出登录
    baseAsset.value = mockData.assets
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

// ✅ Functions on click
const goBack = () => {
  uni.navigateBack()
}

const onAssetChange = (e: any) => {
  const index = e.detail.value
  selectedAsset.value = baseAsset.value[index]
  baseNetwork.value = selectedAsset.value.Network || []
  console.log('Selected Asset:', selectedAsset.value)
}


const onNetworkChange = (e: any) => {
  const index = e.detail.value
  selectedNetwork.value = baseNetwork.value[index]
  console.log('Selected Network:', selectedNetwork.value)
}

const setAll = () => {
  if (selectedAsset.value) {
    amount.value = selectedAsset.value.balance
  }
}

const submitWithdraw = async () => {


  // ✅ Validasi pilih asset
  if (!selectedAsset.value) {
    return uni.showToast({ title: t('transaction.select_asset'), icon: 'none' })
  }

  // ✅ Validasi pilih network
  if (!selectedNetwork.value) {
    return uni.showToast({ title: t('transaction.select_network'), icon: 'none' })
  }

  // ✅ Validasi alamat
  if (!address.value || address.value.trim() === '') {
    return uni.showToast({ title: t('transaction.enter_or_paste_address'), icon: 'none' })
  }

  // ✅ Validasi jumlah
  if (!amount.value || Number(amount.value) <= 0) {
    return uni.showToast({ title: t('transaction.enter_valid_amount'), icon: 'none' })
  }

  // ✅ Validasi minimum withdraw
  if (selectedNetwork.value?.deposit_min_amount &&
    Number(amount.value) < Number(selectedNetwork.value.deposit_min_amount)) {
    return uni.showToast({
      title: t('transaction.min_withdraw') + ': ' + selectedNetwork.value.deposit_min_amount,
      icon: 'none'
    })
  }

  try {
    const withdrawParams: WithdrawParams = {
      passkey: userStore.pasKeyAuth || '',
      device: userStore.deviceAuth || '',
      appversion: userStore.appversionAuth || '',
      token: userInfo?.data?.token || '',
      lang: userStore.language,

      baseAsset: selectedAsset.value.symbol,
      network_id: selectedNetwork.value.id,
      wd_address: address.value,
      amount: amount.value

    }

    console.log('Withdraw Params:', withdrawParams)

    // Panggil API transfer
    const transferResult = await userStore.postWithdraw(withdrawParams)

    // 移除退出登录逻辑，只处理成功情况
    if (transferResult.data.status === 0 || transferResult.data.status === 1) {
      uni.showToast({
        title: transferResult.data.msg || '提现成功',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: transferResult.data.msg || '操作失败',
        icon: 'none'
      })
    }

  } catch (error) {
    console.error('Transfer Error:', error)
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    })
  }

}
</script>


<style scoped>
.page-transfer {
  background: #202020;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header tetap */
.header-transfer {
  width: 100%;
  height: 100rpx;
  background-color: #202020;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 40rpx;
  box-sizing: content-box;
}

/* ✅ Konten scroll + padding aktif */
.content-transfer {
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  /* penting agar padding dihitung */
  padding: 20rpx 20rpx 40rpx 20rpx;
  /* atas, kanan, bawah, kiri */
  display: block;
}



.back-area {
  position: absolute;
  left: 20rpx;
  /* icon nempel kiri */
  height: 100%;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-title {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}

.form-item {
  margin-top: 30rpx;
}

.label {
  color: #bfbfbf;
  font-size: 26rpx;
  margin-bottom: 12rpx;
  display: block;
}

.asset-box {
  background-color: #2A2A2A;
  border-radius: 10rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: #ffffff;
  /* font-weight: bold; */
}

.asset-name {
  font-size: 24rpx;
  color: #8f8f8f;
  margin-top: 4rpx;
}

.arrow {
  font-size: 32rpx;
  color: #8f8f8f;
}

.select-box {
  background: #2A2A2A;
  padding: 26rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.tip {
  margin-top: 20rpx;
  color: #6F4BFD;
  font-size: 22rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #2A2A2A;
  padding: 16rpx;
  border-radius: 12rpx;
  color: #fff;
  font-size: 30rpx;
}

.amount-box {
  display: flex;
  align-items: center;
  position: relative;
}

.all-btn {
  padding: 12rpx 50rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 10rpx;
  margin-left: 20rpx;
  font-size: 24rpx;
  white-space: nowrap;
  position: absolute;
  right: 20rpx;
}

.btn-submit {
  margin-top: 40rpx;
  width: 100%;
  padding: 6rpx 26rpx;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #fff;
  font-size: 30rpx;
  /* font-weight: bold; */
}

.warning-box {
  margin-top: 20rpx;
  background: #1f1f1f;
  /* warna abu gelap seperti di gambar */
  color: #9AA4AE;
  padding: 16px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
}

.warning-title {
  color: #9AA4AE;
  margin-bottom: 10rpx;
  display: block;
}
.network-fee{
  font-size: 22rpx;
  color: #9AA4AE;
}
.warning-item {
  display: block;
  margin-bottom: 6rpx;
}

.info-list {
  margin-top: 16px;
  padding: 12px 0;
  border-top: 1px solid #2a2a2d;
  border-bottom: 1px solid #2a2a2d;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  color: #9AA4AE;
  font-size: 24rpx;
}

.info-row .left {
  font-size: 14px;
  color: #9AA4AE;
}

.info-row .right {
  font-size: 14px;
  color: #9AA4AE;
  text-align: right;
}

.info-row+.info-row {
  margin-top: 4px;
}
</style>