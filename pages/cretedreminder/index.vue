<template>
  <view class="alert-page-stock">
    <!-- Header -->
    <view class="header-stock">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon-stock" @click="goBack"  />
      <text class="title-stock">{{ $t('create_reminder') }}</text>
    </view>

    <!-- Scrollable Content -->
    <scroll-view scroll-y class="scroll-content-stock">
      <!-- Stock Info -->
      <view class="stock-info-stock">
        <view class="stock-left-stock">
          <text class="stock-name-stock">{{ $t('tesla') }}</text>
          <text class="stock-code-stock">TSLA</text>
        </view>
        <view class="stock-right-stock">
          <text class="night-label-stock">{{ $t('night_session') }}</text>
          <text class="stock-price-stock">0</text>
          <text class="stock-percent-stock">0.00%</text>
        </view>
      </view>

      <!-- Form Fields -->
      <view class="form-section-stock">
        <!-- 提醒类型 -->
        <text class="label-stock">{{ $t('reminder_type') }}</text>
        <picker class="picker-stock" :range="types" range-key="name" @change="onTypeChange">
          <view class="picker-text-stock">
            <text>{{ selectedType.name }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>

        <!-- 美股股票价格 -->
        <text class="label-stock">{{ $t('us_stock_price') }}</text>
        <view class="input-box-stock">
          <input
            type="number"
            v-model="price"
            placeholder-class="placeholder-stock"
          />
        </view>

        <!-- 提醒频率 -->
        <text class="label-stock">{{ $t('reminder_frequency') }}</text>
        <picker class="picker-stock" :range="frequencies" range-key="name" @change="onFreqChange">
          <view class="picker-text-stock">
            <text>{{ selectedFreq.name }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>

        <!-- Tips -->
        <view class="tips-stock">
          {{ $t('max_per_stock') }}<br />
          {{ $t('total_limit') }}<br />
          {{ $t('alert_validity') }}
        </view>
      </view>

      <!-- Button -->
      <view class="bottom-btn-stock">
        <button class="submit-btn-stock" @click="createAlert">{{ $t('create_reminder') }}</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { useUserStore, AlertParams, SettingsParams} from '@/store/modules/user'
const userInfo = uni.getStorageSync('userData')

const { t } = useI18n()
const userStore = useUserStore()

let types : any[] = []
let frequencies: any[] = []

const selectedType = ref({
                    "id": "price_reach",
                    "name": "Price Reach",
                    "type": "amount"
                })
const selectedFreq = ref({
                    "id": "once",
                    "name": "Once"
                })
const price = ref('')
const detail = ref({})

const onTypeChange = (e) => {
  selectedType.value = types[e.detail.value]
}
const onFreqChange = (e) => {
  selectedFreq.value = frequencies[e.detail.value]
}

onLoad((options) => {
   
  if (options.data) {
    try {
      
        const data = JSON.parse(decodeURIComponent(options.data))
      detail.value =  data

     
      console.log('📦 Data via query:', data)
    } catch (e) {
      console.error('❌ Gagal parse data dari query:', e)
    }
  }
})

onMounted(async () => {

    const params: SettingsParams = {
              lang: userStore.language,
              passkey: userStore.pasKeyAuth,
              device: userStore.deviceAuth,
              appversion: userStore.appversionAuth,
          };

      const result = await userStore.getSettings(params)

      result.data.data.AlertType.map((item, index) => {
        types.push(item)
    })
    result.data.data.frequency.map((item, index) => {
        frequencies.push(item)
    })

})

// ✅ Validasi & Kirim Alert
async function createAlert() {
  if (!selectedType.value?.id) {
    return uni.showToast({ title: t('reminder_type') + ' ' + t('is_required'), icon: 'none' })
  }
  if (!price.value || Number(price.value) <= 0) {
    return uni.showToast({ title: t('us_stock_price') + ' ' + t('is_required'), icon: 'none' })
  }
  if (!selectedFreq.value?.id) {
    return uni.showToast({ title: t('reminder_frequency') + ' ' + t('is_required'), icon: 'none' })
  }

  const alertParams: AlertParams = {
    passkey: userStore.pasKeyAuth,
    device: userStore.deviceAuth,
    appversion: userStore.appversionAuth,
    token: userInfo.data.token,
    lang: userStore.language,
    symbol:detail.value.symbol,
    amount: price.value,
    alert_type: selectedType.value.id,
    frequency: selectedFreq.value.id,
  }

  try {

    console.log("detail.value?.symbol")
console.log(detail.value.symbol)
    const res = await userStore.createdAlert(alertParams)
    if (res?.data?.code === 0) {
      uni.showToast({ title: t('created_successfully'), icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } else {
      uni.showToast({ title: res?.data?.msg || 'Create failed', icon: 'none' })
    }
  } catch (err) {
    uni.showToast({ title: 'Network error', icon: 'none' })
  }
}

// ✅ Fungsi kembali
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.alert-page-stock {
  background-color: #202020;
  color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Header tetap di atas */
.header-stock {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #202020;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:60rpx 40rpx 30rpx;
}
.back-icon-stock {
  position: absolute;
  left: 30rpx;
  width: 40rpx;
  height: 40rpx;
}
.title-stock {
  font-size: 34rpx;
  font-weight: bold;
}

/* Scrollable content di bawah header */
.scroll-content-stock {
  padding-top: 180rpx; /* beri jarak agar tidak tertutup header */
  padding-left: 30rpx;
  padding-right: 30rpx;
  box-sizing: border-box;
  height: calc(100vh - 140rpx);
}

/* Stock Info */
.stock-info-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}
.stock-left-stock {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.stock-name-stock {
  font-size: 32rpx;
  font-weight: 600;
}
.stock-code-stock {
  color: #9AA4AE;
}
.stock-right-stock {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: #9AA4AE;
}
.night-label-stock {
  color: #9AA4AE;
}
.stock-percent-stock {
  color: #9AA4AE;
}

/* Labels */
.label-stock {
  color: #9AA4AE;
  font-size: 26rpx;
  margin-top: 30rpx;
  margin-bottom: 10rpx;
  display: block;
}

/* Picker & Input */
.picker-stock,
.input-box-stock {
  background-color: #2a2a2a;
  border-radius: 12rpx;
  padding: 24rpx;
  color: #fff;
  font-size: 28rpx;
}
.picker-text-stock {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.placeholder-stock {
  color: #9AA4AE;
}

/* ▼ Arrow style */
.arrow {
  font-size: 28rpx;
  color: #9AA4AE;
  margin-left: 10rpx;
}

/* Tips */
.tips-stock {
  color: #7b7b7b;
  font-size: 22rpx;
  line-height: 1.8;
  margin-top: 30rpx;
}

/* Bottom Button */
.bottom-btn-stock {
  margin-top: 60rpx;
  display: flex;
  justify-content: center;
}
.submit-btn-stock {
  width: 90%;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 14rpx 0;
  font-size: 30rpx;
}
</style>
