<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="nav">
        <view class="backBox">
          <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
        </view>

        <text class="title">{{ $t('kyc.openAccount.identity_verification') }}</text>
        <view class="rightBox"></view>
      </view>

      <!-- Progress Bar -->
      <view class="progress-bar">
        <view class="progress"></view>
      </view>
    </view>

    <!-- Scrollable Form -->
    <scroll-view scroll-y class="content">


      <!-- <view class="form-container"> -->

      <!-- Nomor Identitas -->
      <!-- <view class="form-item">
      <text class="label">{{$t('kyc.openAccount.id_number')}}</text>
      <input
        class="input id-input"
        v-model="form.id_number"
        :placeholder="$t('kyc.openAccount.enter_id_number')"
        placeholder-class="placeholder"
      />
    </view> -->

      <!-- Nama Lengkap -->
      <!-- <view class="form-item">
      <text class="label">{{$t('kyc.openAccount.full_name')}}</text>
      <input
        class="input id-input"
        v-model="form.full_name"
       :placeholder="$t('kyc.openAccount.enter_full_name')"
        placeholder-class="placeholder"
      />
    </view> -->

      <!-- Jenis Kelamin -->
      <!-- <view class="field">
      <text class="label">{{$t('kyc.openAccount.gender')}}</text>
      <picker mode="selector" :range="genders" range-key="name" @change="onChangeGender">
        <view class="picker">
          <text>{{ selectedGender?.name || $t('kyc.openAccount.select_gender') }}</text>
          <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
        </view>
      </picker>
    </view> -->

      <!-- Tanggal Lahir -->
      <!-- <view class="field">
      <text class="label">{{$t('kyc.openAccount.date_of_birth')}}</text>
      <picker
       mode="date" 
       :start="minDate"
      :end="maxDate" 
      @change="onChangeDate">
        <view class="picker">
          <text>{{ form.date_of_birth || $t('kyc.openAccount.select_date_of_birth') }}</text>
          <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
        </view>
      </picker>
    </view> -->



      <!-- Alamat -->
      <!-- <view class="form-item">
      <text class="label">{{$t('kyc.openAccount.address')}}</text>
      <textarea
        class="textarea"
        v-model="form.address"
        :placeholder="$t('kyc.openAccount.enter_address_as_per_id')"
        placeholder-class="placeholder"
      />
    </view> -->
      <!-- </view> -->


      <view class="field">
        <text class="label">{{ $t('kyc.openAccount.what_is_your_nationality') }}</text>
        <picker mode="selector" :range="countries" range-key="name" @change="onChangeCountry">
          <view class="picker">
            <text>{{ selectedCountry?.name }}</text>
            <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
          </view>
        </picker>
        <text class="hint">{{ $t('kyc.openAccount.must_match_id_document_information') }}</text>
      </view>

      <view class="field">
        <text class="label">{{ $t('kyc.openAccount.what_is_your_tax_residency') }}</text>
        <picker mode="selector" :range="cities" range-key="name" @change="onChangeCity">
          <view class="picker">
            <text>{{ selectedCity?.name }}</text>
            <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
          </view>
        </picker>
        <text class="hint">{{ $t('kyc.openAccount.most_users_tax_residency_matches_nationality') }}</text>
      </view>

      <view class="field">
        <text class="label">{{ $t('kyc.openAccount.do_you_have_an_overseas_bank_account') }}</text>
        <picker mode="selector" :range="bankOptions" range-key="name" @change="onChangeBank">
          <view class="picker">
            <text>{{ selectedBank?.name }}</text>
            <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">{{ $t('kyc.openAccount.which_document_would_you_like_to_upload') }}</text>
        <picker mode="selector" :range="idTypes" range-key="name" @change="onChangeIdType">
          <view class="picker">
            <text>{{ selectedIdType?.name }}</text>
            <image class="arrow" src="/static/icons/ic_arrow_down.png" mode="aspectFit" />
          </view>
        </picker>
        <text class="hint">{{ $t('kyc.openAccount.we_need_a_photo_to_verify_your_identity') }}</text>
      </view>
    </scroll-view>

    <!-- Tombol -->
    <button class="btn" @click="openPopup">{{ $t('kyc.openAccount.confirm') }}</button>
  </view>
</template>

<script setup lang="ts">
import { SettingsParams, useUserStore } from '@/store/modules/user'
import { ref, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

// 用户存储实例
const userStore = useUserStore()
const params: SettingsParams = {
  lang: "zh",
  passkey: userStore.pasKeyAuth,
  device: userStore.deviceAuth,
  appversion: userStore.appversionAuth,
};

// 移除了弹窗相关状态

// 国家和城市数据
let countries: any[] = []
let selectedCountry = ref(null)
let cities: any[] = []
let selectedCity = ref(null)

// 银行账户选项
const bankOptions = [{ 'id': 1, 'name': '是' }, { 'id': 0, 'name': '否' }]
let selectedBank = ref(null)

// 证件类型选项
let idTypes: any[] = []
let selectedIdType = ref(null)

// 返回上一页
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) uni.navigateBack()
  else {
    // 无系统 tabBar，回到首页使用 reLaunch 且路径修正为 /pages/home/index
    uni.reLaunch({ url: '/pages/home/index' })
  }
}

// 初始化数据
onMounted(async () => {
  const result = await userStore.getSettings(params)

  // 初始化国家列表
  result.data.data.Country.map((item, index) => {
    countries.push(item)
  })
  selectedCountry.value = countries[0]

  // 初始化城市列表（这里使用国家数据作为城市数据）
  result.data.data.Country.map((item, index) => {
    cities.push(item)
  })
  selectedCity.value = cities[0]

  // 初始化证件类型列表
  result.data.data.IdType.map((item, index) => {
    idTypes.push(item)
  })
  selectedIdType.value = idTypes[0]

  // 初始化银行账户选项
  selectedBank.value = bankOptions[0]
})

// 选择器值变更处理函数
const onChangeCountry = (e) => {
  selectedCountry.value = countries[e.detail.value]
}

const onChangeCity = (e) => {
  selectedCity.value = cities[e.detail.value]
}

const onChangeBank = (e) => {
  selectedBank.value = bankOptions[e.detail.value]
}

const onChangeIdType = (e) => {
  selectedIdType.value = idTypes[e.detail.value]
}

// 确认提交
const openPopup = () => {
  if (validateForm()) {
    // 只包含当前需要的字段
    let params = {
      "nationality_id": selectedCountry.value?.id, // 国籍
      "tax_residence_id": selectedCity.value?.id, // 税务居住地
      "has_overseas_bank_account": selectedBank.value?.id, // 1 = 是, 0 = 否
      "id_type": selectedIdType.value?.id, // 证件类型
    }

    uni.navigateTo({
      url: `/pages/createkyc/authentication?data=${encodeURIComponent(JSON.stringify(params))}`
    })
  }
}

// 表单校验 - 只校验当前需要的字段
const validateForm = () => {
  const missingFields = []

  // 只校验当前页面显示的四个选择项
  if (!selectedCountry.value?.id) missingFields.push(t('kyc.openAccount.nationality'))
  if (!selectedCity.value?.id) missingFields.push(t('kyc.openAccount.tax_residency'))
  if (!selectedBank.value?.id && selectedBank.value?.id !== 0)
    missingFields.push(t('kyc.openAccount.bank_account'))
  if (!selectedIdType.value?.id) missingFields.push(t('kyc.openAccount.id_type'))

  if (missingFields.length > 0) {
    uni.showToast({
      title: t('kyc.openAccount.please_complete_required_fields'),
      icon: 'none'
    })
    console.warn('Missing fields:', missingFields)
    return false
  }

  return true
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Header dan Progress tetap di atas */
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  background: #202020;
  z-index: 100;
  padding: 60rpx 30rpx 20rpx;
  box-sizing: border-box;
}

.nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.backBox {
  flex: 1;
}

.back {
  width: 40rpx;
  height: 36rpx;
}

.rightBox {
  flex: 1;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  flex: 1;
  text-align: center;
  color: #fff;
  white-space: nowrap;
}

/* 进度条样式 */
.progress-bar {
  height: 20rpx;
  background-color: #222;
  border-radius: 10rpx;
  overflow: hidden;
  margin-top: 20rpx;
}

.progress {
  width: 40%; /* KYC流程的第一步进度 */
  height: 100%;
  background: #6F4BFD;
}

/* Content Style */
.content {
  margin-top: 190rpx;
  flex: 1;
  padding: 0 30rpx;
  padding-bottom: 200rpx;
  overflow-y: auto;
}

.field {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 30rpx;
  margin-bottom: 10rpx;
}

.picker {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  width: 28rpx;
  height: 28rpx;
}

.hint {
  color: #9AA4AE;
  font-size: 24rpx;
  margin-top: 10rpx;
}

/* Tombol bawah */
.btn {
  position: fixed;
  bottom: 80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 684rpx;
  height: 84rpx;
  border: none;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 0;
}

.btn::after {
  border: none;
}

/* 移除了弹窗相关样式 */

.form-container {
  background-color: #111;
  color: #fff;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 60rpx;
}

.label {
  font-size: 28rpx;
  color: #fff;
}

.input,
.textarea {
  background-color: #1b1b1b;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 30rpx;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder {
  color: #666;
}

.arrow {
  width: 24rpx;
  height: 24rpx;
}

.id-input {
  height: 90rpx;
  line-height: 90rpx;
}
</style>
