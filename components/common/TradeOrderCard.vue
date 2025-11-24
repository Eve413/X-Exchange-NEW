<template>
  <view class="order-card">
    <!-- Header -->
    <view class="divider"></view>
    <view class="header">
      <text class="order">{{ t('trade-page.current-order-card.one') }}：{{ orderId }}</text>
      <text class="time">{{ date }}</text>
    </view>

    <!-- Asset Info -->
    <view class="asset">
      <image class="icon" :src="icon" mode="aspectFit" />
      <view class="info">
        <view class="row">
          <view class="column">
            <view class="row">
              <text class="name">{{ name }}</text>
              <text class="type">{{ typeAsset }}</text>
              <view class="leverage">
                <text>{{ leverage }}</text>
              </view>
            </view>
            <text class="type">{{ type }}</text>
          </view>
          <view class="column-right">
            <view class="left">
              <text>{{ duration }}</text>
            </view>
            <view class="right">
              <view class="bar">
                <view class="progress" :style="{ width: progress + '%' }"></view>
              </view>

            </view>
            <text class="percent">{{ progress }}%</text>
          </view>

        </view>
      </view>

    </view>

    <!-- Duration -->


    <!-- Order info -->
    <view class="info-section">
      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.two') }}</text>
        <view class="value editable" @click="openPricePopup">
          <text>{{ price }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.three') }}</text>
        <view class="value editable" @click="openQuantityPopup">
          <text>{{ quantity }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.four') }}</text>
        <view class="value editable" @click="openAmountPopup">
          <text>{{ amount }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <button class="btn-cancel" @click="$emit('cancelOrder', orderId)">{{ t('trade-page.current-order-card.five') }}</button>
    </view>

    <!-- Edit Price Popup -->
    <view v-if="showPricePopup" class="popup-overlay" @tap="closePricePopup">
      <view class="popup-content" @tap.stop="">
        <text class="popup-header">Confirm Update</text>
        <text class="popup-label">{{ t('trade-page.current-order-card.two') }}</text>
        <!-- <text class="current-value">Current: {{ price }}</text> -->
        <input 
          class="popup-input" 
          type="text" 
          :value="tempPrice"
          :placeholder="price.toString()"
          @input="handlePriceInput"
          @focus="handlePriceFocus"
        />
        <view class="popup-buttons">
          <button class="popup-btn cancel" @tap="closePricePopup">Cancel</button>
          <button class="popup-btn update" @tap="confirmPriceChange">Update</button>
        </view>
      </view>
    </view>

    <!-- Edit Quantity Popup -->
    <view v-if="showQuantityPopup" class="popup-overlay" @tap="closeQuantityPopup">
      <view class="popup-content" @tap.stop="">
        <text class="popup-header">Confirm Update</text>
        <text class="popup-label">{{ t('trade-page.current-order-card.three') }}</text>
        <!-- <text class="current-value">Current: {{ quantity }}</text> -->
        <input 
          class="popup-input" 
          type="text" 
          :value="tempQuantity"
          :placeholder="quantity.toString()"
          @input="handleQuantityInput"
          @focus="handleQuantityFocus"
        />
        <view class="popup-buttons">
          <button class="popup-btn cancel" @tap="closeQuantityPopup">Cancel</button>
          <button class="popup-btn update" @tap="confirmQuantityChange">Update</button>
        </view>
      </view>
    </view>

    <!-- Edit Amount Popup -->
    <view v-if="showAmountPopup" class="popup-overlay" @tap="closeAmountPopup">
      <view class="popup-content" @tap.stop="">
        <text class="popup-header">Confirm Update</text>
        <text class="popup-label">{{ t('trade-page.current-order-card.four') }}</text>
        <!-- <text class="current-value">Current: {{ amount }}</text> -->
        <input 
          class="popup-input" 
          type="text" 
          :value="tempAmount"
          :placeholder="amount.toString()"
          @input="handleAmountInput"
          @focus="handleAmountFocus"
        />
        <view class="popup-buttons">
          <button class="popup-btn cancel" @tap="closeAmountPopup">Cancel</button>
          <button class="popup-btn update" @tap="confirmAmountChange">Update</button>
        </view>
      </view>
    </view>
  </view>
  <view class="divider"></view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

interface Props {
  orderId: string
  date: string
  icon: string
  name: string
  type: string
  typeAsset: string
  leverage: string
  duration: string
  progress: number
  price: number
  quantity: number
  amount: number
}
const props = defineProps<Props>()
const emit = defineEmits(['cancelOrder', 'priceChange', 'quantityChange', 'amountChange'])

// Popup states
const showPricePopup = ref(false)
const showQuantityPopup = ref(false)
const showAmountPopup = ref(false)

// Temporary values
const tempPrice = ref('')
const tempQuantity = ref('')
const tempAmount = ref('')

// Price popup handlers
const openPricePopup = () => {
  tempPrice.value = props.price.toString()
  console.log('Setting price popup value:', tempPrice.value)
  showPricePopup.value = true
}

const handlePriceFocus = (e: any) => {
  console.log('Price input focused')
}

const handlePriceInput = (e: any) => {
  console.log('Price input event:', e)
  tempPrice.value = e.detail.value
  console.log('New tempPrice:', tempPrice.value)
}

const closePricePopup = () => {
  showPricePopup.value = false
}

const confirmPriceChange = () => {
  const newPrice = parseFloat(tempPrice.value)
  if (!isNaN(newPrice) && newPrice > 0) {
    emit('priceChange', newPrice)
  }
  closePricePopup()
}

// Quantity popup handlers
const openQuantityPopup = () => {
  tempQuantity.value = props.quantity.toString()
  console.log('Setting quantity popup value:', tempQuantity.value)
  showQuantityPopup.value = true
}

const handleQuantityFocus = (e: any) => {
  console.log('Quantity input focused')
}

const handleQuantityInput = (e: any) => {
  console.log('Quantity input event:', e)
  tempQuantity.value = e.detail.value
  console.log('New tempQuantity:', tempQuantity.value)
}

const closeQuantityPopup = () => {
  showQuantityPopup.value = false
}

const confirmQuantityChange = () => {
  const newQuantity = parseFloat(tempQuantity.value)
  if (!isNaN(newQuantity) && newQuantity > 0) {
    emit('quantityChange', newQuantity)
  }
  closeQuantityPopup()
}

// Amount popup handlers
const openAmountPopup = () => {
  tempAmount.value = props.amount.toString()
  console.log('Setting amount popup value:', tempAmount.value)
  showAmountPopup.value = true
}

const handleAmountFocus = (e: any) => {
  console.log('Amount input focused')
}

const handleAmountInput = (e: any) => {
  console.log('Amount input event:', e)
  tempAmount.value = e.detail.value
  console.log('New tempAmount:', tempAmount.value)
}

const closeAmountPopup = () => {
  showAmountPopup.value = false
}

const confirmAmountChange = () => {
  const newAmount = parseFloat(tempAmount.value)
  if (!isNaN(newAmount) && newAmount > 0) {
    emit('amountChange', newAmount)
  }
  closeAmountPopup()
}
</script>

<style scoped>
.order-card {
  background-color: #121212;
  border-radius: 20rpx;
  padding: 20rpx;
  color: #fff;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
}

.divider {
  height: 1rpx;
  background-color: #333;
  margin: 15rpx 0;
}

.header {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 24rpx;
}

.icon-small {
  width: 28rpx;
  height: 28rpx;
  opacity: 1;
  margin-right: 8rpx;
}

.asset {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 15rpx;
}

.info {
  flex: 1;
}

.row {
  display: flex;
  flex-direction: row;
  width: 100%;
  /* allow pushing items to the far right */
}

.column {
  display: flex;
  flex-direction: column;
}

/* Right-side column: align everything to the right edge */
.column-right {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  /* push this column to the far right */
  align-items: flex-end;
  text-align: right;
}

/* Ensure the progress line and percent are aligned on the right */
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10rpx;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
}

.type {
  color: #999;
  font-size: 24rpx;
}

.leverage {
  font-size: 24rpx;
  color: #aaa;
}

.duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #a0a4a8;
}

.bar {
  width: 120rpx;
  height: 8rpx;
  background-color: #333;
  border-radius: 4rpx;
  margin: 0 10rpx;
  position: relative;
}

.progress {
  height: 8rpx;
  background-color: #6f6af8;
  border-radius: 4rpx;
}

.percent {
  font-size: 22rpx;
}

.info-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  /* spread items across full width */
  gap: 20rpx;
  /* consistent spacing between items */
  margin-top: 20rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  /* allow each info block to grow equally */
  color: #ccc;
  font-size: 24rpx;
}

.value {
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #fff;
}

.editable text {
  font-weight: bold;
}

.editable {
  cursor: pointer;
}

.btn-cancel {
  background: linear-gradient(175deg, #5246a3, #d75b99);
  border: none;
  color: #fff;
  border-radius: 12rpx;
  padding: 12rpx 30rpx;
  font-size: 28rpx;
  text-align: center;
}

/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 500rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.5);
}

.popup-header {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30rpx;
  text-align: center;
}

.popup-label {
  display: block;
  font-size: 28rpx;
  color: #aaa;
  margin-bottom: 15rpx;
}

.current-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 20rpx;
}

.popup-input {
  width: 100%;
  height: 80rpx;
  padding: 20rpx;
  font-size: 32rpx;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
  border: 3rpx solid #6f6af8;
  border-radius: 12rpx;
  text-align: center;
  margin-bottom: 30rpx;
  box-sizing: border-box;
  pointer-events: auto !important;
  user-select: auto !important;
  -webkit-user-select: auto !important;
  touch-action: auto !important;
}

.popup-buttons {
  display: flex;
  gap: 20rpx;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  border: none;
  font-weight: bold;
}

.popup-btn.cancel {
  background-color: rgba(255, 255, 255, 0.1);
  color: #999;
}

.popup-btn.update {
  background: linear-gradient(175deg, #5246a3, #d75b99);
  color: #fff;
}
</style>
