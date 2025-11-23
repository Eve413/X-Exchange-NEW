<template>
  <view class="recharge-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit">
        </image>
      </view>
      <view class="header-title">{{ t('recharge.title') }}</view>
      <view class="header-right"></view>
    </view>

    <!-- 主要内容 -->
    <view class="content">
      <!-- 当前余额 -->
      <view class="balance-section">
        <view class="balance-left">
          <view class="balance-label">{{ t('recharge.current_balance') }} <image class="eyes-icon"
              :src="showBalance ? '/static/icons/ic_eye.png' : '/static/icons/ic_eye_close.png'" mode="aspectFit"
              @click="toggleBalanceVisibility"></image>
          </view>
          <view class="balance-amount">
            <text class="currency-symbol">{{showBalance ? "$" : "******"}}</text>
            <text class="amount">{{ showBalance ? dataDeposit?.UserWallet?.balance  : "********" }}</text>
          </view>
        </view>
        <image class="wallet-icon" src="/static/icons/rechargeImg.png" mode="aspectFit"></image>
      </view>

      <!-- 选择币种 -->
       <picker mode="selector" :range="currencyList" range-key="desc" @change="onCurrencyChange">
      <view class="section">
        <view class="section-label">{{ t('recharge.select_currency') }}</view>
        <view class="currency-item">
          <view class="currency-info">
          <image class="currency-logo"  :src="currency.logo"  mode="aspectFit"></image>
            <view class="currency-bottom">
              <text class="currency-name">{{ currency?.baseAsset }}</text>
            <text class="currency-desc">{{ currency?.desc }}</text>
            </view>
          </view>
          <text class="arrow-icon">›</text>
        </view>
      </view>
      </picker>

      <!-- 充值金额 -->
      <!-- <view class="section">
        <view class="section-label">{{ t('recharge.amount') }}</view>
        <input class="amount-input" type="digit" :placeholder="t('recharge.enter_amount')" v-model="rechargeAmount" />
      </view> -->

      <!-- 网络选择 -->
      <view class="section">
        <view class="section-label">{{ t('recharge.network') }}</view>
        <view class="network-item active">
          <text class="network-name">{{currency?.desc}} </text>
          <text class="network-tip">{{ t('recharge.min_amount', { amount: currency?.deposit_min_amount }, {baseAsset: currency?.baseAsset}) }}</text>
        </view>
      </view>

      <!-- 充值地址 -->
      <view class="address-content">
        <view class="address-top">
          <view class="section-label">{{currency?.baseAsset}} {{ t('recharge.address') }} {{currency?.desc}}</view>
          <view class="qrcode-actions">
            <!-- <text class="download-btn"> -->
            <image class="load-arrow" src="/static/icons/load-arrow.png" mode="aspectFit"></image>
            <!-- </text> -->
            <text class="hide-btn" @click="toggleQrCode">{{ showQrCode ? t('recharge.hide_qrcode') : t('recharge.show_qrcode') }}</text>
          </view>
        </view>


        <!-- 二维码 -->
        <view class="qrcode-section">

          <view class="qrcode-container">
            <image class="qrcode-image" :src="dataDeposit?.UserWallet.qr" mode="aspectFit"></image>
          </view>
          <view class="address-display">{{ rechargeAddress }}
            <!-- <text class="copy-text"> -->
            <image class="copy-icon" @click="copyAddress" src="/static/icons/copy-icon.png" mode="aspectFit"></image>
            <!-- </text> -->
          </view>

        </view>
        <!-- <view class="payment-info">
          <view class="payment-title">{{ t('recharge.pay_amount', { amount: '50.91981' }) }}</view>
          <view class="payment-time">{{ t('recharge.payment_time', { time: '2025-09-10 23:52:01' }) }}</view>
          <view class="payment-warning">{{ t('recharge.payment_warning') }}</view>
        </view> -->
      </view>


      <!-- 付款信息 -->


      <!-- 注意事项 -->
      <view class="notice-section">
        <view class="notice-title">
          <image class="notice-icon" src="/static/icons/warnWhite.png" mode="aspectFit"></image>
          {{ dataDeposit?.Tnc?.title }}
        </view>
        <view class="notice-content">
          <view class="notice-item">
            <!-- <text class="notice-number">1.</text> -->
            <text class="notice-text" v-html="dataDeposit.Tnc.content"></text>
          </view>
          <!-- <view class="notice-item">
            <text class="notice-number">2.</text>
            <text class="notice-text">{{ t('recharge.notice_2') }}</text>
          </view>
          <view class="notice-item">
            <text class="notice-number">3.</text>
            <text class="notice-text">{{ t('recharge.notice_3') }}</text>
          </view>
          <view class="notice-item">
            <text class="notice-number">4.</text>
            <text class="notice-text">{{ t('recharge.notice_4') }}</text>
          </view> -->
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <!-- <view class="footer">
      <button class="cancel-btn" @click="cancelOrder">{{ t('recharge.cancel_order') }}</button>
      <button class="confirm-btn" @click="confirmPayment">{{ t('recharge.paid') }}</button>
    </view> -->

    <!-- 支付确认弹窗 -->
    <view v-if="showPaymentPopup" class="popup-overlay" @click.self="closePaymentPopup">
      <view class="payment-popup">
        <view class="popup-header">
          <view class="popup-close" @click="closePaymentPopup">
            <image class="closeIcon" src="/static/icons/closeIcon.png" mode="aspectFit"></image>

          </view>
        </view>
        <view class="popup-content">
        <image class=" warn-dark" src="/static/icons/warn-dark.png" mode="aspectFit"></image>
        <view class="popup-text">{{ t('recharge.payment_confirm_message') }}</view>
      </view>
        <view class="popup-footer">
          <button class="popup-confirm-btn" @click="closePaymentPopup">{{ t('recharge.confirm') }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {useUserStore, DepositParams} from '@/store/modules/user'
import { onLoad } from '@dcloudio/uni-app'

const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()
const dataDeposit = ref(null)
const currency = ref()
const currencyList = ref([])

// 国际化
const { t, locale } = useI18n()

// 监听语言变化，确保页面正确更新
watch(() => locale.value, () => {
  // 语言变化时可以在这里添加需要的更新逻辑
  console.log('语言已切换:', locale.value)
})

// 响应式数据
const rechargeAmount = ref('')
const rechargeAddress = ref(null)
const showQrCode = ref(true)

// 新增：余额显示控制
const showBalance = ref(true)
const actualBalance = ref('1411')

// 新增：支付确认弹窗控制
const showPaymentPopup = ref(false)

 onLoad(async (options) => {

     try {
          const depositParams: DepositParams = {
            passkey: userStore.pasKeyAuth,
            device:userStore.deviceAuth,
            appversion:userStore.appversionAuth,
            token: userInfo.data.token,
            lang: userStore.language
          }

          

          const resultDeposit = await userStore.getDeposit(depositParams)

      
              if (resultDeposit.data.status === -1){
                            handleLogout()
                        }
          dataDeposit.value = resultDeposit.data.data
          rechargeAddress.value = resultDeposit.data.data.UserWallet.address 
          currencyList.value = resultDeposit.data.data.Network
          currency.value = resultDeposit.data.data.Network[0]
        //   coins.value = resultWallets.data.data.Asset.Currency.filter(item => item.type === fromAccount.value.id)
         

        } catch (e) {
          console.error('❌ Failed to load tickers:', e)
        }

  })

// 切换余额显示状态
const toggleBalanceVisibility = () => {
  showBalance.value = !showBalance.value
}

// 获取显示的余额
const getDisplayBalance = () => {
  return showBalance.value ? actualBalance.value : '****'
}

// 切换二维码显示状态
const toggleQrCode = () => {
  showQrCode.value = !showQrCode.value
}

// 返回上一页
const goBack = () => {
  try {
    uni.navigateBack({
      delta: 1,
      success: () => console.log('✅ 成功返回上一页'),
      fail: (err) => console.error('❌ 返回上一页失败:', err)
    })
  } catch (error) {
    console.error('❌ 返回操作发生异常:', error)
  }
}

// 复制地址
const copyAddress = () => {
  try {
    // 复制完整地址到剪贴板
    const fullAddress = '0xc8d4...320f' // 实际应该是完整地址
    uni.setClipboardData({
      data: fullAddress,
      success: () => {
        console.log('✅ 地址复制成功')
        uni.showToast({
          title: t('recharge.copied'),
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        console.error('❌ 地址复制失败:', err)
        uni.showToast({
          title: t('recharge.copy_failed'),
          icon: 'none',
          duration: 2000
        })
      }
    })
  } catch (error) {
    console.error('❌ 复制操作发生异常:', error)
    uni.showToast({
      title: t('recharge.operation_failed'),
      icon: 'none',
      duration: 2000
    })
  }
}

// 取消订单
const cancelOrder = () => {
  try {
    uni.showModal({
      title: t('recharge.confirm_cancel'),
      content: t('recharge.cancel_tip'),
      success: (res) => {
        if (res.confirm) {
          console.log('✅ 用户确认取消订单')
          // 这里应该调用取消订单的API
          uni.navigateBack({
            delta: 1
          })
        }
      },
      fail: (err) => {
        console.error('❌ 弹窗失败:', err)
      }
    })
  } catch (error) {
    console.error('❌ 取消操作发生异常:', error)
    uni.showToast({
      title: t('recharge.operation_failed'),
      icon: 'none',
      duration: 2000
    })
  }
}

// 确认支付
const confirmPayment = () => {
  try {
    // 显示支付确认弹窗
    showPaymentPopup.value = true
  } catch (error) {
    console.error('❌ 确认支付操作发生异常:', error)
    uni.showToast({
      title: t('recharge.operation_failed'),
      icon: 'none',
      duration: 2000
    })
  }
}

// 关闭支付确认弹窗
const closePaymentPopup = () => {
  showPaymentPopup.value = false
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

const onCurrencyChange = (e) => {
  const index = e.detail.value
  currency.value = currencyList.value[index]
}
</script>

<style scoped lang="scss">
.recharge-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #202020;
  color: #ffffff;
}

// 顶部导航栏
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 16px 16px;
  background-color: #202020;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .header-left {
    width: 40px;
    padding-left: 4px;
  }

  .back-icon {
    width: 40rpx;
    height: 32rpx;
  }

  .back-icon {
    font-size: 24px;
    color: #ffffff;
  }

  .header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
  }

  .header-right {
    width: 40px;
  }
}

// 主要内容
.content {
  flex: 1;
  padding: 100px 16px 100px;
}

.eyes-icon {
  width: 32rpx;
  height: 32rpx;
  margin-left: 8rpx;
}

// 余额部分
.balance-section {
  margin-bottom: 10px;
  background-color: #2A2A2A;
  display: flex;
  justify-content: space-between;
  border-radius: 20rpx;
  padding: 28rpx 20rpx;

  .balance-label {
    font-size: 28rpx;
    color: #9AA4AE;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  .balance-amount {
    display: flex;
    align-items: baseline;

    .currency-symbol {
      font-size: 32px;
      color: #ffffff;
      margin-right: 4px;
      font-weight: bold;
    }

    .amount {
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
    }
  }
}

// 钱包图标
.wallet-icon {
  display: flex;
  justify-content: flex-end;
  // margin-bottom: 30px;
  width: 156rpx;
  height: 156rpx;

  image {
    width: 60px;
    height: 60px;
  }
}

// 通用section样式
.section {
  margin-bottom: 26rpx;

  .section-label {
    font-size: 14px;
    color: #9AA4AE;
    margin-bottom: 12px;
  }
}

.address-content {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
}

// 币种选择
.currency-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16rpx;
  background-color: #2A2A2A;
  border-radius: 12px;

  .currency-info {
    display: flex;
    align-items: center;

    .currency-logo {
      width: 68rpx;
      height: 68rpx;
      margin-right: 16rpx;
    }

    .currency-bottom {
      display: flex;
      flex-direction: column;
    }

    .currency-desc {
      font-size: 22rpx;
      color: #9AA4AE;
    }

    .currency-name {
      font-size: 16px;
      color: #ffffff;
    }
  }

  .currency-code {
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
  }

  .arrow-icon {
    font-size: 24px;
    color: #999999;
    display: flex;
    align-items: center;
  }
}

// 金额输入
.amount-input {
  width: 100%;
  height: 48px;
  padding: 16px;
  background-color: #2A2A2A;
  border-radius: 12px;
  color: #ffffff;
  font-size: 28rpx;
  box-sizing: border-box;
}

.amount-input::placeholder {
  color: #9AA4AE !important;
}

.uni-input-placeholder {
  color: #9AA4AE !important;
}

// 网络选择
.network-item {
  padding: 16rpx 20rpx;
  background-color: #2A2A2A;
  border-radius: 12px;
  // border: 2px solid #4CAF50;

  .network-name {
    font-size: 30rpx;
    color: #ffffff;
    font-weight: 500;
    display: block;
    // margin-bottom: 4px;
  }

  .network-tip {
    font-size: 24rpx;
    color: #9AA4AE;
  }
}

.address-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 地址显示
.address-container {
  display: flex;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 0 16px;

  .address-input {
    flex: 1;
    padding: 16px 0;
    color: #ffffff;
    font-size: 14px;
    background: transparent;
  }

  .copy-btn {
    padding: 8px;

    .copy-icon {
      font-size: 20px;
    }
  }
}

// 二维码部分
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10rpx 0;

  .qrcode-container {
    border-radius: 12px;
    margin-bottom: 20px;
    margin-top: 20rpx;
  }

  .qrcode-image {
    width: 392rpx;
    height: 392rpx;
  }

  .address-display {
    width: 100%;
    background-color: #3B3B3B;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 16px;
    padding: 20rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .copy-btn-large {
    // padding: 10px 24px;
    // background-color: #2a2a2a;
    // border-radius: 20px;

    .copy-text {
      font-size: 14px;
      color: #ffffff;
    }
  }

  .copy-icon {
    width: 28rpx;
    height: 28rpx;
  }
}

// 付款信息
.payment-info {
  background-color: #3B3B3B;
  border-radius: 20rpx;
  padding: 20rpx;
  // margin-bottom: 30px;

  .payment-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #ff4444;
    text-align: center;
    margin-bottom: 12rpx;
  }

  .payment-time {
    font-size: 24rpx;
    color: #9AA4AE;
    text-align: center;
    margin-bottom: 8rpx;
  }

  .hint-text {
    color: #6F4BFD;
  }

  .payment-warning {
    font-size: 24rpx;
    color: #9AA4AE;
    text-align: center;
  }
}

.load-arrow {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}

.qrcode-actions {
  display: flex;
  align-items: center;
}

.hide-btn {
  font-size: 26rpx !important;
}

// 注意事项
.notice-section {
  margin-top: 30rpx;
  background-color: #2A2A2A;
  padding: 20rpx;
  border-radius: 20rpx;
  margin-bottom: 30px;

  .notice-title {
    font-size: 28rpx;
    // font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    // margin-bottom: 12px;
  }

  .notice-icon {
    width: 28rpx;
    height: 28rpx;
    margin-right: 8rpx;
  }

  .notice-content {
    // background-color: #1e1e1e;
    border-radius: 12px;
    padding-top: 20rpx;
    // padding: 16px;

    .notice-item {
      display: flex;
      margin-bottom: 12px;
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }

      .notice-number {
        font-size: 24rpx;
        color: #9AA4AE;
        // color: #4CAF50;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .notice-text {
        font-size: 24rpx;
        color: #9AA4AE;
        flex: 1;
      }
    }
  }
}

// 底部按钮
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 16px;
  background-color: #202020;
  // border-top: 1px solid #2a2a2a;

  button {
    flex: 1;
    height: 84rpx;
    font-size: 30rpx;
    border-radius: 20rpx;
    margin: 0 8px;
  }

  .cancel-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #202020;
    color: #9AA4AE;
    border: 1rpx solid #9AA4AE;
    // border: none;
  }

  .confirm-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #6a5acd, #ff69b4);
    color: #ffffff;
    border: none;
  }
}

// 支付确认弹窗样式
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.payment-popup {
  width: 680rpx;
  // min-width: 500rpx;
  background-color: #2A2A2A;
  border-radius: 20rpx;
  overflow: hidden;
}

.closeIcon {
  width: 28rpx;
  height: 28rpx;
}

.popup-header {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 20rpx 0;
}

.popup-close {
  font-size: 48rpx;
  color: #999;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  padding: 0 30rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warn-dark {
  width: 96rpx;
  height: 96rpx;
  margin-bottom: 20rpx;
}

.info-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #404040;
  color: #8A7CF0;
  font-size: 56rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-text {
  font-size: 28rpx;
  color: #9AA4AE;
  text-align: center;
  line-height: 1.5;
  padding-top: 20rpx;
}

.popup-footer {
  padding: 0 40rpx 40rpx;
  display: flex;
  justify-content: center;
}

.popup-confirm-btn {
  width:328rpx;
  height: 84rpx;
  background: linear-gradient(170deg, #5a4db1, #c2588d);
  color: #ffffff;
  border: none;
  border-radius: 20rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>