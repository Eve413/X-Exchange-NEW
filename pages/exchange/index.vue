<template>
    <view class="follow-page">
        <!-- 固定头部区域 -->
        <view class="fixed-header-area">
            <!-- 页面头部 -->
            <view class="header">
                <view class="header-left" @click="goBack">
                    <!-- <text class="back-arrow"> -->
                    <image class="back-arrow" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
                    <!-- </text> -->
                </view>
                <view class="header-center">
                    <text class="header-title">{{ $t('exchange') }}</text>
                </view>
                <view class="header-right">
                    <view class="notification-wrapper" @click="goToCustomerService">
                        <image class="header-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" />
                    </view>
                    <view class="notification-wrapper" @click="goToNotification">
                        <image class="header-icon" src="/static/icons/ic_bell.png" mode="aspectFit" />
                        <view class="notification-badge"></view>
                    </view>
                </view>
            </view>
        </view>
        <view class="swap-tab">
            <view class="swap-wrapper">
                <!-- From 部分 -->
                <view class="swap-box swap-box1">
                    <view class="swap-header">
                        <text class="swap-label">{{ $t('market.from') }}</text>
                        <view class="max-half-buttons">
                            <view class="max-btn" @click="maxBtnClick">{{ $t('market.max') }}</view>
                            <view class="half-btn" @click="halfBtnClick">{{ $t('market.half') }}</view>
                        </view>
                    </view>
                    <view class="contentbox">
                    <picker mode="selector" :range="marketData.coins" range-key="baseAsset" @change="onFromChange">
                        <view class="coin-selector">
                            <image :src="selectedFromCoin.icon" class="coin-icon" mode="aspectFit" />
                            <view class="right-box">
                                <view class="coin-code">{{ selectedFromCoin.baseAsset }}
                                    <image class="dropdown-arrow" src="/static/icons/arrow-bottom.png"
                                        mode="aspectFit" />
                                </view>
                                <text class="coin-name">{{ selectedFromCoin.name  || "-"}}</text>
                            </view>
                        </view>
                    </picker>
                        <view class="content-right">
                            <view class="amount-display">
                                <input class="amount-value" type="digit" v-model="selectedAmountValue"
                                    @input="updateEstimatedValue" placeholder="0.00" placeholder-style="color: #666;" />
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
                        <picker mode="selector" :range="marketData.coins" range-key="baseAsset" @change="onToChange">
                            <view class="coin-selector">
                                <image :src="selectedToCoin.icon "
                                    class="coin-icon" mode="aspectFit" />
                                <view class="right-box">
                                    <view class="coin-code">{{ selectedToCoin.baseAsset }}
                                        <image class="dropdown-arrow" src="/static/icons/arrow-bottom.png"
                                            mode="aspectFit" />
                                    </view>
                                    <text class="coin-name">{{ selectedToCoin.name || "-"}}</text>
                                </view>
                            </view>
                        </picker>
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
                            <text class="rate-value">{{exchangeRateExample1 }}</text>
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
                    <button class="swap-button" @click="handleSwap">{{ $t('exchange') }}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storage } from '@/utils/storage'
import {useUserStore, AssetParams, ExchangeCheckParams, ExchangeParams} from '@/store/modules/user'
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()


const { t, locale } = useI18n()

const router = useRouter()
// 闪兑功能相关

// 先定义getMockMarketData函数
const getMockMarketData = () => {
    return {
        coins: [
            { baseAsset: 'USDT', name: '', icon: '/static/icons/usdt.png', balance: '1000.00', price: 1.0 },
            { baseAsset: 'BTC', name: '', icon: '/static/icons/btc.png', balance: '0.001', price: 40000 },
            { baseAsset: 'ETH', name: '', icon: '/static/icons/eth.png', balance: '0.05', price: 2500 },
            { baseAsset: 'BNB', name: '', icon: '/static/icons/bnb.png', balance: '0.1', price: 300 }
        ],
        rates: {
            'USDT_BTC': 0.000025,
            'BTC_USDT': 40000,
            'USDT_ETH': 0.0004,
            'ETH_USDT': 2500,
            'BTC_ETH': 16,
            'ETH_BTC': 0.0625
        }
    }
}

// 然后定义所有响应式变量
const marketData = ref(getMockMarketData())

const exchangeRateExample1 = ref('')
const selectedFromCoin = ref(marketData.value.coins[0])
const selectedToCoin = ref(marketData.value.coins[1])
const selectedAmountValue = ref('')
const rates = ref(0.0)
const estimatedValue = ref('0.001')
const swapFee = ref('0.3')
const slippage = ref('0.5')
const UserAsset = ref({
                "qty": "0.00000000",
                "baseAsset": "BTC"
            })

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 跳转到客服页面
const goToCustomerService = () => {
    uni.navigateTo({
        url: '/pages/customerservice/index',
        success: () => console.log('✅ 跳转到客服页面成功'),
        fail: (err) => console.error('❌ 跳转到客服页面失败:', err)
    })
}

// 跳转到消息通知页面
const goToNotification = () => {
    uni.navigateTo({
        url: '/pages/notification/index',
        success: () => console.log('✅ 跳转到消息通知页面成功'),
        fail: (err) => console.error('❌ 跳转到消息通知页面失败:', err)
    })
}

// 变量和函数定义已移至文件顶部

// 币种切换方法
const swapCoins = () => {
    const tempCoin = { ...selectedFromCoin.value }
    selectedFromCoin.value = { ...selectedToCoin.value }
    selectedToCoin.value = tempCoin
    // 更新估值
    updateEstimatedValue()
    exchangeCheckParams()
    console.log('✅ 币种切换成功')
}

// 更新估值
const updateEstimatedValue = () => {
    const amount = parseFloat(selectedAmountValue.value) || 0
    if (amount > 0) {
        const rateKey = `${selectedFromCoin.value.baseAsset}_${selectedToCoin.value.baseAsset}`
        const reverseRateKey = `${selectedToCoin.value.baseAsset}_${selectedFromCoin.value.baseAsset}`

        // 使用模拟市场数据中的汇率
        let rate = rates.value

        // 如果没有直接汇率，尝试反向汇率
        if (!rate && rates.value) {
            rate = 1 / rates.value
        }

        // 如果仍然没有汇率，使用随机值作为后备
        if (!rate) {
            rate = Math.random() * 0.00001 + 0.00001
        }

        estimatedValue.value = (amount * rate).toFixed(6)
    } else {
        estimatedValue.value = '0.000000'
    }
}

// 最大按钮点击
const maxBtnClick = () => {
    selectedAmountValue.value = selectedFromCoin.value.balance
    updateEstimatedValue()
}

// 半额按钮点击
const halfBtnClick = () => {
    const halfAmount = (parseFloat(selectedFromCoin.value.balance) / 2).toFixed(2)
    selectedAmountValue.value = halfAmount
    updateEstimatedValue()
}

// 处理兑换
const handleSwap = async () => {
    const amount = parseFloat(selectedAmountValue.value)
    const balance = parseFloat(selectedFromCoin.value.balance)

    if (!amount || amount <= 0) {
        uni.showToast({
            title: '请输入有效金额',
            icon: 'none'
        })
        return
    }

    // if (amount > balance) {
    //     uni.showToast({
    //         title: '余额不足',
    //         icon: 'none'
    //     })
    //     return
    // }

    // 显示确认对话框
   
   
    uni.showModal({
        title: '确认兑换',
        content: `确定要兑换 ${selectedAmountValue.value} ${selectedFromCoin.value.baseAsset} 为 ${estimatedValue.value} ${selectedToCoin.value.baseAsset} 吗？`,
        success: (res) => {
            if (res.confirm) {
                // 这里应该调用实际的兑换API
                console.log('✅ 确认兑换', {
                    fromCoin: selectedFromCoin.value.baseAsset,
                    toCoin: selectedToCoin.value.baseAsset,
                    amount: selectedAmountValue.value,
                    estimatedValue: estimatedValue.value
                })


                const exchangeParams: ExchangeParams = {
                        passkey: userStore.pasKeyAuth,
                        device:userStore.deviceAuth,
                        appversion:userStore.appversionAuth,
                        token: userInfo.data.token,
                        lang: userStore.language,
                        from_asset:selectedFromCoin.value.baseAsset,
                        to_asset:selectedToCoin.value.baseAsset,
                        amount: amount
                        }

                        submit(exchangeParams);
                       
                // uni.showLoading({
                //     title: '兑换中...'
                // })

                // 模拟兑换请求
                // setTimeout(() => {
                //     uni.hideLoading()
                //     uni.showToast({
                //         title: '兑换成功',
                //         icon: 'success'
                //     })

                //     // 模拟更新余额
                //     selectedFromCoin.value.balance = (balance - amount).toFixed(2)
                //     selectedToCoin.value.balance = (parseFloat(selectedToCoin.value.balance) + parseFloat(estimatedValue.value)).toFixed(6)

                //     // 清空输入
                //     selectedAmountValue.value = ''
                //     estimatedValue.value = '0.000000'
                // }, 1500)
            }
        }
    })
}

const submit = async (exchangeParams: ExchangeParams ) => {
 const resultExchange = await userStore.exchangeParams(exchangeParams)
 if (resultExchange.data.status === -1) handleLogout()
 if (resultExchange.data.status == "error"){
    uni.showToast({
            title: resultExchange.data.msg,
            icon: 'none'
        })
 }
 
}

// 加载数据 - 与market页面保持一致的加载逻辑
const loadData = async () => {
    // 模拟API请求延迟
    setTimeout(() => {
        // 在实际项目中，这里应该调用API获取真实数据
        // 现在使用模拟数据
        marketData.value = getMockMarketData()
        console.log('✅ 市场数据加载完成')

        // 更新选中的币种信息
        const fromCoinData = marketData.value.coins.find(coin => coin.baseAsset === selectedFromCoin.value.baseAsset)
        const toCoinData = marketData.value.coins.find(coin => coin.baseAsset === selectedToCoin.value.baseAsset)

        if (fromCoinData) {
            selectedFromCoin.value = { ...fromCoinData }
        }
        if (toCoinData) {
            selectedToCoin.value = { ...toCoinData }
        }

        updateEstimatedValue()
    }, 500)


    const assetParams: AssetParams = {
          passkey: userStore.pasKeyAuth,
          device:userStore.deviceAuth,
          appversion:userStore.appversionAuth,
          token: userInfo.data.token,
          lang: userStore.language,

          
        }

        
        const resultAsset = await userStore.getAssetParams(assetParams)
if (resultAsset.data.status === -1) handleLogout()
        selectedFromCoin.value = resultAsset.data.data[0]
        selectedToCoin.value = resultAsset.data.data[1]
        marketData.value = {
        coins: resultAsset.data.data,
        rates: {
            'USDT_BTC': 0.000025,
            'BTC_USDT': 40000,
            'USDT_ETH': 0.0004,
            'ETH_USDT': 2500,
            'BTC_ETH': 16,
            'ETH_BTC': 0.0625
        }

        
    }
    
    exchangeCheckParams()
}

const exchangeCheckParams = async() => {

    const exchangeCheckParams: ExchangeCheckParams = {
          passkey: userStore.pasKeyAuth,
          device:userStore.deviceAuth,
          appversion:userStore.appversionAuth,
          token: userInfo.data.token,
          lang: userStore.language,
          from_asset:selectedFromCoin.value.baseAsset,
          to_asset:selectedToCoin.value.baseAsset
        }

        
        const resultExchange = await userStore.getExchangeCheckParams(exchangeCheckParams)
        if (resultExchange.data.status === -1) handleLogout()
        exchangeRateExample1.value = resultExchange.data.data.rate
        rates.value = parseFloat(resultExchange.data.data.price as any)
        swapFee.value = resultExchange.data.data.swap_fee
        slippage.value = resultExchange.data.data.slippage
        UserAsset.value = resultExchange.data.data.UserAsset
    
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

const onFromChange = (e) => {
  selectedFromCoin.value = marketData.value.coins[e.detail.value]
  exchangeCheckParams()
//   coins.value = masterCoins.value.filter(item => item.type === fromAccount.value.id)
}

const onToChange = (e) => {
  selectedToCoin.value = marketData.value.coins[e.detail.value]
  exchangeCheckParams()
//   coins.value = masterCoins.value.filter(item => item.type === fromAccount.value.id)
}

onMounted(() => {
    console.log('兑换页面加载完成')
    loadData()
})
</script>

<style lang="scss" scoped>
.follow-page {
    min-height: 100vh;
    background: #202020;
    padding: 0 30rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
}

/* 固定头部区域 */
.fixed-header-area {
    background-color: #202020;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
}

/* 页面头部 */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 80rpx 32rpx 24rpx;
}

.header-left {
    // width: 80rpx;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

/* 闪兑功能样式 */
.swap-tab {
    margin-top: 200rpx;
    // padding: 330rpx;
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

.profit-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.back-arrow {
    // font-size: 48rpx;
    width: 40rpx;
    height: 32rpx;
    // color: #ffffff;
}

.header-center {
    flex: 1;
    text-align: center;
    justify-content: center;
}

.header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
}

.header-right {
    // width: 80rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 24rpx;
    flex: 1;
}

.notification-wrapper {
    position: relative;
}

.header-icon {
    width: 46rpx;
    height: 46rpx;
    margin-left: 24rpx;
}

.notification-badge {
    position: absolute;
    top: 0;
    right: 15rpx;
    width: 20rpx;
    height: 20rpx;
    background-color: #EF4444;
    border-radius: 50%;
}
</style>