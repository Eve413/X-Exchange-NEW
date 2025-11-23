<template>
  <view class="transfer-page">
    <!-- Header -->
    <view class="header">
      <view class="header-left">
        <image src="/static/icons/ic_arrow_left.png" class="icon-back"  @click="goBack()" />
      </view>
      <text class="title">{{ $t('transaction.transfer') }}</text>
      <view class="header-right">
        <image src="/static/icons/ic_headphone.png" class="icon" @click="goToCustomerService()" />
        <view class="notif-wrapper">
          <image src="/static/icons/noiceLight.png" class="icon" @click="goToNotif()"/>
          <view class="dot"></view>
        </view>
      </view>
    </view>


    <!-- Card: Pilih akun -->
    <view class="account-card">
      <view class="row">
        <text class="label">{{ $t('transaction.from') }}</text>
        <picker mode="selector" :range="accounts" range-key="name" @change="onFromChange">
          <view class="picker">
            <text>{{ fromAccount.name }}</text>
            <image src="/static/icons/ic_arrow_down.png" class="arrow" />
          </view>
        </picker>
      </view>
      <view class="divider"></view>
      <view class="row">
        <text class="label">{{ $t('transaction.to') }}</text>
        <picker mode="selector" :range="accounts" range-key="name" @change="onToChange">
          <view class="picker">
            <text>{{ toAccount.name }}</text>
            <image src="/static/icons/ic_arrow_down.png" class="arrow" />
          </view>
        </picker>
      </view>
      <view class="switch-circle">
        <text class="switch-text">⇅</text>
      </view>
    </view>

    <!-- Pilih koin -->
    <view class="section" @click="showPopup = true">
      <text class="section-title">{{ $t('transaction.swap') }}</text>
      <view class="coin-selector">
        <image :src="selectedCoin?.icon" class="coin-icon" />
        <text class="coin-name">{{selectedCoin?.symbol}}</text>
        <image src="/static/icons/ic_arrow_down.png" class="arrow" />
      </view>
    </view>

    <!-- Input jumlah -->
    <view class="section" >
      <text class="section-title">{{ $t('transaction.quantity') }}</text>
      <view class="input-row">
        <input class="amount-input" v-model="amount" :placeholder=" $t('transaction.please_enter_amount') " type="number" />
        <text class="max-btn">{{ $t('transaction.max') }}</text>
      </view>
     <text class="available">{{ $t('transaction.available') }} {{selectedCoin?.balance }} {{ selectedCoin?.baseAsset }}</text>
    </view>

    <!-- Tombol konfirmasi -->
    <view class="btn-transfer" @click="submitTransfer">
      <text>{{ $t('transaction.transfer') }}</text>
    </view>

    <!-- Popup蒙层 -->
    <view v-if="showPopup" class="popup-overlay" @click="showPopup = false">
      <!-- Popup Bottom Sheet -->
      <view
        class="popup"
        :style="{ transform: `translateY(${translateY}px)` }"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        @click.stop
      >
      <!-- Handle bar -->
      <view class="handle"></view>

      <!-- Isi konten -->
      <view class="content">
        <slot>
          <view class="search-bar">
              <image src="/static/icons/ic_search.png" class="search-icon" />
              <input
                class="search-input"
                type="text"
                v-model="searchQuery"
                :placeholder="$t('transaction.search_coins')"
                placeholder-class="search-placeholder"
              />
            </view>

            <scroll-view class="coin-scroll" scroll-y="true">
                <view class="coin-list">
                  <view
                    v-for="(coin, index) in coins"
                    :key="index"
                    class="coin-item"
                    @click="onSelectCoin(coin)"
                  >
                    <!-- Kiri: Icon + Nama Coin -->
                    <view class="coin-left">
                      <image :src="coin.icon" class="coin-icon" />
                      <view class="coin-text">
                        <text class="coin-symbol">{{ coin.baseAsset }}</text>
                        <text class="coin-name">{{ coin.name }}</text>
                      </view>
                    </view>

                    <!-- Kanan: Balance + USD -->
                    <view class="coin-right">
                      <text class="coin-balance">{{ coin.pnl_percent }}</text>
                      <text class="coin-usd">${{ coin.balance }}</text>
                    </view>
                  </view>
                </view>
              </scroll-view>
        </slot>
      </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { onLoad } from '@dcloudio/uni-app'
import {useUserStore, WalletsParams, TransferParams} from '@/store/modules/user'

const searchQuery = ref('')
const accounts = ref([{"id" : 'funding', 'name': t('transaction.fund_account')}, {"id" : 'spot', 'name': t('transaction.stock_account')}])
const fromAccount = ref({"id" : 'funding', 'name': t('transaction.fund_account')})
const toAccount = ref({"id" : 'spot', 'name': t('transaction.stock_account')})
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()

const showPopup = ref(false)
const selectedCoin = ref(null)
const translateY = ref(0)
let startY = 0
const masterCoins = ref([])
const coins = ref([])

const amount = ref('')
const errorMessage = ref('')

// 模拟数据定义
const mockData = {
  Asset: {
    Currency: [
      {
        id: '1',
        baseAsset: 'USDT',
        symbol: 'USDT',
        name: 'Tether',
        balance: '1500',
        pnl_percent: '+2.5%',
        type: 'funding',
        icon: '/static/icons/Export.png'
      },
      {
        id: '2',
        baseAsset: 'BTC',
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: '0.054',
        pnl_percent: '+1.2%',
        type: 'funding',
        icon: '/static/icons/Export.png'
      },
      {
        id: '3',
        baseAsset: 'ETH',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '1.2',
        pnl_percent: '-0.5%',
        type: 'funding',
        icon: '/static/icons/Export.png'
      },
      {
        id: '4',
        baseAsset: 'USDT',
        symbol: 'USDT',
        name: 'Tether',
        balance: '800',
        pnl_percent: '+0.3%',
        type: 'spot',
        icon: '/static/icons/Export.png'
      },
      {
        id: '5',
        baseAsset: 'BTC',
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: '0.02',
        pnl_percent: '+1.8%',
        type: 'spot',
        icon: '/static/icons/Export.png'
      }
    ]
  }
}

onLoad(async (options) => {

   try {
        const wallletsParams: WalletsParams = {
          passkey: userStore.pasKeyAuth,
          device:userStore.deviceAuth,
          appversion:userStore.appversionAuth,
          token: userInfo.data.token,
          lang: userStore.language
        }

        
        const resultWallets = await userStore.getWallets(wallletsParams)
        
        // 使用模拟数据，不再调用退出登录逻辑
        if (!resultWallets.data || !resultWallets.data.data || !resultWallets.data.data.Asset) {
          console.log('使用模拟数据进行渲染')
          masterCoins.value = mockData.Asset.Currency
          coins.value = mockData.Asset.Currency.filter(item => item.type === fromAccount.value.id)
        } else {
          masterCoins.value = resultWallets.data.data.Asset.Currency
          coins.value = resultWallets.data.data.Asset.Currency.filter(item => item.type === fromAccount.value.id)
        }
        
      } catch (e) {
        console.error('❌ Failed to load wallets:', e)
        // 错误时使用模拟数据
        console.log('API调用失败，使用模拟数据进行渲染')
        masterCoins.value = mockData.Asset.Currency
        coins.value = mockData.Asset.Currency.filter(item => item.type === fromAccount.value.id)
      }

})

  // Fungsi validasi
const validateForm = () => {
  if (!fromAccount.value?.id) {
    errorMessage.value = t('transaction.from') + ' ' + t('transaction.required')
    return false
  }

  if (!toAccount.value?.id) {
    errorMessage.value = t('transaction.to') + ' ' + t('transaction.required')
    return false
  }

  if (fromAccount.value.id === toAccount.value.id) {
    errorMessage.value = t('transaction.from_to_same')
    return false
  }

  if (!selectedCoin.value) {
    errorMessage.value = t('transaction.select_coin')
    return false
  }

  if (!amount.value || Number(amount.value) <= 0) {
    errorMessage.value = t('transaction.enter_valid_amount')
    return false
  }

  if (Number(amount.value) > Number(selectedCoin.value.balance)) {
    errorMessage.value = t('transaction.insufficient_balance')
    return false
  }

  errorMessage.value = ''
  return true
}

// Submit Transfer
// Pastikan fungsi ini async
const submitTransfer = async () => {
  // Cek validasi form
  if (!validateForm()) {
    uni.showToast({
      title: errorMessage.value,
      icon: 'none'
    })
    return
  }

  try {
    // Parameter untuk API Transfer
    const transferParam: TransferParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: userStore.language,

      from_account: fromAccount.value?.id || "",
      to_account: toAccount.value?.id || "",
      baseAsset: selectedCoin.value?.baseAsset || "",
      amount: amount.value // Pastikan ini angka/input user
    }

    console.log('Transfer Params:', transferParam)

    // Panggil API transfer
    const transferResult = await userStore.getTransfer(transferParam)

    // 不再调用退出登录逻辑
    if (transferResult.data.status == 0 || transferResult.data.status == 1) {
          uni.showToast({
                  title: transferResult.data.msg || '转账成功',
                  icon: 'success'
                })
      }

    
  } catch (error) {
    console.error('Transfer Error:', error)
    uni.showToast({
      title: '转账失败，请重试',
      icon: 'none'
    })
  }
}

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

// Saat klik item coin
const onSelectCoin = (coin) => {
  selectedCoin.value = coin
  showPopup.value = false
}

function touchStart(e) {
  startY = e.touches[0].clientY
}

function touchMove(e) {
  const moveY = e.touches[0].clientY
  const diff = moveY - startY

  // Geser ke bawah hanya
  if (diff > 0) translateY.value = diff
}

function touchEnd() {
  if (translateY.value > 120) {
    closePopup()
  } else {
    translateY.value = 0 // balik ke posisi awal
  }
}

function closePopup() {
  translateY.value = 1000
  setTimeout(() => {
    showPopup.value = false
    translateY.value = 0
  }, 200)
}

const onFromChange = (e) => {
  fromAccount.value = accounts.value[e.detail.value]
  selectedCoin.value = null;
  coins.value = masterCoins.value.filter(item => item.type === fromAccount.value.id)
}

const onToChange = (e) => {
  toAccount.value = accounts.value[e.detail.value]
}

const goBack = () => {
  uni.navigateBack()
}
const goToNotif = () => {
  setTimeout(() => {
      uni.navigateTo({
        url: '/pages/notification/index',
        success: () => console.log('✅ Navigated'),
        fail: (err) => console.error('❌ Navigation failed:', err)
      })
    }, 500)
}

const goToCustomerService = () => {
  setTimeout(() => {
      uni.navigateTo({
        url: '/pages/customerservice/index',
        success: () => console.log('✅ Navigated to customer service'),
        fail: (err) => console.error('❌ Navigation to customer service failed:', err)
      })
    }, 500)
}
</script>

<style scoped>
.transfer-page {
  background-color: #202020;
  min-height: 100vh;
  color: #fff;
  padding: 40rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0rpx;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  width: 100rpx; /* 固定宽度以确保标题居中 */
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
}

.icon-back {
  width: 40rpx;
  height: 32rpx;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  min-width: 0; /* 防止文本过长时破坏布局 */
}

.header-right .icon {
  width: 36rpx;
  height: 36rpx;
  /* margin-left: 20rpx; */
}

.notif-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 30rpx;
}

.notif-wrapper .dot {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4d6d;
  border-radius: 50%;
}

.account-card {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  position: relative;
  margin-top: 30rpx;
  padding-right: 80rpx;
}

.row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 80rpx;
  width: 100%;
}

.label {
  font-size: 28rpx;
  color: #aaa;
}

.picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 10rpx; */
  margin-left: 30rpx;
  width: 100%;
}

.arrow {
  width: 26rpx;
  height: 26rpx;
}

.divider {
  height: 2rpx;
  background-color: #333;
  margin: 10rpx 0;
}

.switch-circle {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.switch-text {
  font-size: 26rpx;
  color: #999;
}

.section {
  margin-top: 40rpx;
}

.section-title {
  font-size: 26rpx;
  color: #aaa;
  margin-bottom: 20rpx;
  display: block;
}

.coin-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12rpx;
  background-color: #2A2A2A;
  padding: 20rpx;
}

.coin-icon {
  width: 50rpx;
  height: 50rpx;
}

.coin-name {
  flex: 1;
  margin-left: 20rpx;
  font-size: 30rpx;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2A2A2A;
  border-radius: 12rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.amount-input {
  flex: 1;
  font-size: 28rpx;
  color: #fff;
}

.max-btn {
  font-size: 26rpx;
  color: #ff4d6d;
}

.available {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #888;
}

.btn-transfer {
  background-image: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 20rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
}

.btn-transfer text {
  font-size: 30rpx;
  color: #fff;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.popup {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #1f1f1f;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: transform 0.25s ease;
}

.handle {
  width: 80rpx;
  height: 8rpx;
  background: #555;
  border-radius: 10rpx;
  margin: 20rpx auto;
}

.content {
  padding: 20rpx;
  color: #fff;
  min-height: 300rpx;
}

.search-bar {
  width: 90%;
  margin: 20rpx auto;
  background-color: #2A2A2A;    /* Warna gelap sesuai gambar */
  border-radius: 40rpx;         /* Sudut membulat */
  padding: 18rpx 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-icon {
  width: 60rpx;
  height: 40rpx;
  margin-right: 16rpx;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  color: #ffffff;
  font-size: 28rpx;
}

.search-placeholder {
  color: #8a8f98; /* Warna placeholder seperti di gambar */
  font-size: 28rpx;
}
.coin-scroll {
  height: 60vh;        /* Agar bisa scroll di area tertentu */
  overflow: hidden;    /* Hindari overflow luar */
}

.coin-list {
  padding: 20rpx;
}

.coin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #2e323a;
}

.coin-item:last-child {
  border-bottom: none;
}

.coin-left {
  display: flex;
  align-items: center;
}

.coin-icon {
  width: 50rpx;
  height: 50rpx;
  margin-right: 20rpx;
  border-radius: 50%;
}

.coin-text {
  display: flex;
  flex-direction: column;
}

.coin-symbol {
  color: #ffffff;
  font-weight: bold;
  font-size: 30rpx;
}

.coin-name {
  color: #8a8f98;
  font-size: 24rpx;
  margin-top: 4rpx;
}

.coin-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.coin-balance {
  color: #ffffff;
  font-size: 28rpx;
}

.coin-usd {
  color: #8a8f98;
  font-size: 24rpx;
  margin-top: 4rpx;
}
</style>
