<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="nav">
        <view class="backBox">
          <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
        </view>

        <text class="title">{{ $t('kyc.openAccount.realNameVerification') }}</text>
        <view class="rightBox"></view>
      </view>

      <!-- Progress Bar -->
      <view class="progress-bar">
        <view class="progress" :style="{ width: showIdentityModal ? '75%' : '60%' }"></view>
      </view>
    </view>

    <!-- Konten scrollable -->
    <scroll-view scroll-y class="content">
      <view class="section">
        <!-- Upload bagian depan -->
        <view class="upload-box">
          <view class="upload-item">
            <view class="upload-left">
              <text class="upload-title">{{ $t('kyc.openAccount.frontSide') }}</text>
              <text class="upload-desc">{{ $t('kyc.openAccount.clickToUploadId') }}</text>
            </view>

            <view class="upload-right" @click="uploadFront">
              <view class="upload-frame">
                <!-- ✅ tampilkan preview kalau sudah upload -->
                <image :src="frontPreview || '/static/icons/frame_photo.png'" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>

        <!-- Upload bagian belakang -->
        <view class="upload-box">
          <view class="upload-item">
            <view class="upload-left">
              <text class="upload-title">{{ $t('kyc.openAccount.backSide') }}</text>
              <text class="upload-desc">{{ $t('kyc.openAccount.clickToUploadIdInfo') }}</text>
            </view>

            <view class="upload-right" @click="uploadBack">
              <view class="upload-frame">
                <!-- ✅ tampilkan preview kalau sudah upload -->
                <image :src="backPreview || '/static/icons/frame_photo.png'" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>

        <!-- Syarat -->
        <view class="rules">
          <view class="rule-item" v-for="(r, i) in rules" :key="i">
            <image class="dot" src="/static/icons/ic_checklist.png" mode="widthFix" />
            <text>{{ r }}</text>
          </view>
        </view>

      </view>
    </scroll-view>
    
    <!-- 底部继续按钮 -->
    <view class="btn-continue" @click="agree">{{ $t('kyc.openAccount.continue') }}</view>

    <!-- Alert -->
    <Alert :show="showAlert" :title="titleAlert" :description="messageAlert" :cancelText="''"
      :confirmText="$t('common.confirm')" @confirm="handleConfirm" />

    <!-- 身份信息确认弹窗 -->
    <view class="identity-modal" v-if="showIdentityModal">
      <view class="modal-backdrop" @click="closeIdentityModal"></view>
      <view class="modal-content">
        <view class="line"></view>
        <view class="modal-header">
          <text class="modal-title">确认身份信息</text>
          <text class="modal-subtitle">确定你的身份信息和身份证保持一致</text>
        </view>

        <view class="modal-body">
          <view class="info-item">
            <text class="info-label">姓名</text>
            <text class="info-value">{{ identityInfo.name }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">性别</text>
            <text class="info-value">{{ identityInfo.gender }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">出生年月</text>
            <text class="info-value">{{ identityInfo.birthDate }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">证件号码</text>
            <text class="info-value">{{ identityInfo.idNumber }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">地址</text>
            <text class="info-value address-value">{{ identityInfo.address }}</text>
          </view>
        </view>

        <view class="modal-footer">
          <button class="confirm-button" @click="confirmIdentity">确认无误</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { KycParams, useUserStore } from '@/store/modules/user'
import Alert from '@/components/ui/Alert.vue'
const { t } = useI18n()

// 🧠 State (data)
const receivedData = ref(null)
const frontPreview = ref('') // base64 hasil foto depan
const backPreview = ref('') // base64 hasil foto belakang
const frontPreviewBase64 = ref('') // base64 hasil foto depan
const backPreviewBase64 = ref('') // base64 hasil foto belakang
// const rules = ref([t('kyc.openAccount.uploadIdTip'), t('kyc.openAccount.selfVerifyOnly')])
const rules = ref(['正面和反面都要拍照上传', '文字清晰的彩色图片', '要露出证件四个角'])
const userStore = useUserStore()
const messageAlert = ref('')
const titleAlert = ref(t('kyc.openAccount.openAccount'))
const showAlert = ref(false)
const goHomeAlert = ref(false)

// 身份信息弹窗状态
const showIdentityModal = ref(false)

// 身份信息数据（使用假数据）
const identityInfo = reactive({
  name: '辛弃疾',
  gender: '男',
  birthDate: '1149年5月28日',
  idNumber: '370112114005287975',
  address: '山东省济南市历城区遥墙镇四风闸村东组25号'
})

// ✅ Kembali ke halaman sebelumnya
const goBack = () => {
  uni.navigateBack()
}

// ✅ Lifecycle: onLoad
onLoad((options) => {
  console.log('options:', options)
  if (options.data) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data))
      console.log('Received data:', data)
      receivedData.value = data
    } catch (e) {
      console.error('Failed to parse data:', e)
    }
  }
})

// ✅ Fungsi ketika tombol '继续' ditekan
async function agree() {
  // 验证是否上传了图片
  if (!frontPreview.value || !backPreview.value) {
    uni.showToast({
      title: '请上传身份证正反面照片',
      icon: 'none'
    })
    return
  }

  // 显示身份信息确认弹窗
  showIdentityModal.value = true
}

// 关闭身份信息弹窗
function closeIdentityModal() {
  showIdentityModal.value = false
}

// 确认身份信息并跳转到协议页面
async function confirmIdentity() {
  showIdentityModal.value = false
  
  // 构建参数对象
  const params: KycParams = {
    passkey: userStore.pasKeyAuth,
    device: userStore.deviceAuth,
    appversion: userStore.appversionAuth,
    lang: "zh",
    token: "",
    nationality_id: receivedData.value?.nationality_id || '',
    tax_residence_id: receivedData.value?.tax_residence_id || '',
    has_overseas_bank_account: receivedData.value?.has_overseas_bank_account || false,
    id_type: receivedData.value?.id_type || '',
    id_front: frontPreviewBase64.value,
    id_back: backPreviewBase64.value,
    full_name: identityInfo.name, // 使用弹窗中的姓名
    gender_id: identityInfo.gender === '男' ? 1 : 2, // 根据性别设置gender_id
    date_of_birth: identityInfo.birthDate,
    id_number: identityInfo.idNumber,
    address: identityInfo.address,
  };

  console.log("params >>>>>>>>>")
  console.log(params)

  // 保存参数到全局状态或本地存储，以便在协议页面使用
  try {
    // 这里可以先保存参数到store，供后续使用
    // 然后跳转到协议页面
    uni.navigateTo({
      url: '/pages/createkyc/agreement'
    })
  } catch (error) {
    console.error('跳转失败:', error)
    uni.showToast({
      title: '跳转失败，请稍后重试',
      icon: 'none'
    })
  }
}

function handleConfirm() {
  showAlert.value = false

  if (goHomeAlert.value) {
    setTimeout(() => uni.reLaunch({ url: '/pages/home/index' }), 500)
  }
}

const uploadFront = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const filePath = res.tempFilePaths[0]
      frontPreview.value = filePath
      uni.showToast({ title: '正面上传成功', icon: 'success' })

      // 🔍 Cek apakah di App, baru ambil base64
      // #ifdef APP-PLUS
      uni.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: (f) => {
          const base64Data = f.data
          console.log('Front base64:', base64Data.slice(0, 50))
          // simpan ke variabel atau kirim ke server
        }
      })
      // #endif

      // #ifdef H5
      console.log('Running in H5 — skip base64 conversion')
      // Kalau di web, kamu bisa pakai <input type="file"> native
      // atau kirim filePath langsung ke backend
      // (browser tidak izinkan baca file system langsung)
      // base64 conversion H5 perlu FileReader
      // Contoh:
      const reader = new FileReader()
      reader.onload = (e) => {
        frontPreviewBase64.value = e.target.result
        console.log('Front base64 (H5):', e.target.result.slice(0, 50))
      }
      fetch(filePath)
        .then(res => res.blob())
        .then(blob => reader.readAsDataURL(blob))
      // #endif
    },
    fail: (err) => {
      console.error('Choose image failed:', err)
    }
  })
}


const uploadBack = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const filePath = res.tempFilePaths[0]
      backPreview.value = filePath
      uni.showToast({ title: '正面上传成功', icon: 'success' })

      // 🔍 Cek apakah di App, baru ambil base64
      // #ifdef APP-PLUS
      uni.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: (f) => {
          const base64Data = f.data
          console.log('Front base64:', base64Data.slice(0, 50))
          // simpan ke variabel atau kirim ke server
        }
      })
      // #endif

      // #ifdef H5
      console.log('Running in H5 — skip base64 conversion')
      // Kalau di web, kamu bisa pakai <input type="file"> native
      // atau kirim filePath langsung ke backend
      // (browser tidak izinkan baca file system langsung)
      // base64 conversion H5 perlu FileReader
      // Contoh:
      const reader = new FileReader()
      reader.onload = (e) => {
        backPreviewBase64.value = e.target.result
      }
      fetch(filePath)
        .then(res => res.blob())
        .then(blob => reader.readAsDataURL(blob))
      // #endif
    },
    fail: (err) => {
      console.error('Choose image failed:', err)
    }
  })
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

/* HEADER tetap di atas */
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
  /* position: relative; */
}

.backBox {

  flex: 1;
}

.back {
  /* position: absolute; */
  /* left: 40rpx; */
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
  white-space: nowrap;
  /* flex: 1; */
}

/* Progress bar */
.progress-bar {
  height: 20rpx;
  background-color: #222;
  border-radius: 10rpx;
  overflow: hidden;
  margin-top: 20rpx;
}

.progress {
  height: 100%;
  background: #6F4BFD;
  transition: width 0.3s ease;
}

/* Konten scrollable */
.content {
  margin-top: 160rpx;
  flex: 1;
  overflow-y: scroll;
  padding: 0 30rpx 200rpx;
  box-sizing: border-box;
}

/* Upload Box */
.upload-box {
  margin-top: 40rpx;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2A2A2A;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

.upload-left {
  display: flex;
  flex-direction: column;
}

.upload-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.upload-desc {
  font-size: 26rpx;
  color: #999;
}

.upload-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-frame {
  height: 160rpx;
  width: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-frame image {
  height: 160rpx;
  width: 240rpx;
  opacity: 0.85;
  border-radius: 10rpx;
}

/* Rules */
.rules {
  margin-top: 40rpx;
}

.rule-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #bbb;
  margin-bottom: 16rpx;
}

.rule-item .dot {
  width: 32rpx;
  height: 32rpx;
  margin-right: 14rpx;
}

/* Tombol lanjut */
.btn-continue {
  position: fixed;
  bottom: 80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 684rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 20rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: white;
  z-index: 30;
  padding: 0;
  border: none;
}

.btn-continue::after {
  border: none;
}
</style>

<style scoped>
/* 身份信息弹窗样式 */
.identity-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 100%;
  background-color: #2A2A2A;
  border-radius: 30rpx 30rpx 0 0;
  padding-bottom: 40rpx;
  position: relative;
  z-index: 10;
}

.line {
  background-color: #676D75;
  width: 116rpx;
  height: 10rpx;
  border-radius: 10rpx;
  margin: 20rpx auto 0;
}

.modal-header {
  padding: 40rpx 30rpx 0rpx;
  text-align: center;
  /* border-bottom: 1rpx solid #3A3A3A; */
}

.modal-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
  display: block;
  text-align: left;
  margin-bottom: 10rpx;

}

.modal-subtitle {
  font-size: 28rpx;
  color: #9AA4AE;
  display: block;
  text-align: left;
}

.modal-body {
  padding: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  /* border-bottom: 1rpx solid #3A3A3A; */
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #9AA4AE;
  flex: 0 0 20%;
}

.info-value {
  font-size: 28rpx;
  color: #FFFFFF;
  flex: 0 0 75%;
  text-align: right;
  word-break: break-all;
}

.address-value {
  text-align: right;
  white-space: normal;
  line-height: 1.4;
}

.modal-footer {
  padding: 30rpx;
  padding-top: 40rpx;
}

.confirm-button {
  width: 684rpx;
  height: 88rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 20rpx;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 隐藏按钮默认样式 */
.confirm-button::after {
  border: none;
}
</style>
