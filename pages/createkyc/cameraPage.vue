<template>
  <view class="camera-page">
    <!-- Header -->
    <view class="header">
      <image
        class="back"
        src="/static/icons/ic_arrow_left.png"
        mode="aspectFit"
        @click="goBack"
      />
      <text class="title">实名认证</text>
      <text class="upload" @click="uploadFromAlbum">从相册上传</text>
    </view>

    <!-- Instruksi -->
    <view class="content">
      <text class="main-title">拍摄身份证正面</text>
      <text class="sub-title">请确保证件四个角在相框中清晰可见</text>

      <!-- Area kamera -->
      <view class="camera-box">
        <camera
          device-position="back"
          flash="off"
          mode="normal"
          class="camera-view"
          @error="cameraError"
        ></camera>

        <!-- Frame kotak -->
        <view class="frame-overlay"></view>
      </view>

      <!-- Tombol capture -->
      <view class="capture-button" @click="takePhoto">
        <view class="inner-circle"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
const goBack = () => {
  uni.navigateBack();
};

const uploadFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      console.log('Selected:', res.tempFilePaths[0]);
    },
  });
};

const takePhoto = () => {
  const ctx = uni.createCameraContext();
  ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      console.log('Photo path:', res.tempImagePath);
      uni.previewImage({ urls: [res.tempImagePath] });
    },
  });
};

const cameraError = (e) => {
  console.error('Camera Error:', e);
};
</script>

<style scoped>
.camera-page {
  background-color: #121212;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80rpx 40rpx 30rpx;
  font-size: 30rpx;
}

.back {
  width: 48rpx;
  height: 48rpx;
}

.title {
  font-weight: 700;
  font-size: 32rpx;
}

.upload {
  color: #9c9c9c;
  font-size: 28rpx;
}

/* Content */
.content {
  flex: 1;
  text-align: center;
  padding: 40rpx;
}

.main-title {
  display: block;
  text-align: left;
  font-size: 38rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
}

.sub-title {
  display: block;
  text-align: left;
  color: #9a9a9a;
  font-size: 28rpx;
  margin-bottom: 80rpx;
}

/* Kamera */
.camera-box {
  position: relative;
  margin: 0 auto;
  width: 640rpx;
  height: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #1a1a1a;
}

.camera-view {
  width: 100%;
  height: 100%;
}

.frame-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 24rpx;
  box-shadow: 0 0 0 3rpx rgba(255, 255, 255, 0.05);
}

/* Tombol Capture */
.capture-button {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background-color: #fff;
  margin: 120rpx auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inner-circle {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  border: 4rpx solid #000;
  background-color: #fff;
}
</style>
