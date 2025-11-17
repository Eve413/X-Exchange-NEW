<template>
  <view v-if="show" class="dialog-mask" @tap="closeDialog">
    <view class="dialog-container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
      :style="{ transform: `translateY(${translateY}px)` }" @tap.stop>
      <!-- Drag Indicator -->
      <view class="drag-bar"></view>

      <!-- Header -->
      <view class="header">
        <view class="search-box">
          <image class="searchImg" src="/static/icons/searchImg.png" mode="aspectFit" />
          <input v-model="search" class="search-input" placeholder="Select" type="text" />
        </view>
        <text class="cancel" @tap="closeDialog">Cancel</text>
      </view>
      <!-- List negara -->
      <scroll-view class="country-list" scroll-y>
        <view v-for="country in filteredCountries" :key="country.code" class="country-item"
          @tap="selectCountry(country)">
          <image class="flag" :src="country.flag" mode="aspectFit" />
          <text class="name">{{ country.name }}</text>
          <text class="dial-code">+{{ country.dial }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["update:show", "select"]);

const search = ref("");
const countries = ref([
  { name: "中国大陆(CN)", dial: 86, code: "CN", flag: "/static/flags/cn.png" },
  { name: "中国香港(HK)", dial: 852, code: "HK", flag: "/static/flags/cn.png" },
  { name: "马来西亚(MY)", dial: 60, code: "MY", flag: "/static/flags/my_1.png" },
]);

const filteredCountries = computed(() => {
  const query = search.value.toLowerCase();
  return countries.value.filter((c) => c.name.toLowerCase().includes(query));
});

function selectCountry(country) {
  emit("select", country);
  closeDialog();
}

function closeDialog() {
  // 确保弹窗正确关闭
  emit("update:show", false);
}

/* ✅ Swipe-to-close logic */
const startY = ref(0);
const translateY = ref(0);

function onTouchStart(e) {
  startY.value = e.touches[0].clientY;
}

function onTouchMove(e) {
  const deltaY = e.touches[0].clientY - startY.value;
  if (deltaY > 0) {
    translateY.value = deltaY; // geser ke bawah
  }
}

function onTouchEnd() {
  if (translateY.value > 120) {
    // jika digeser cukup jauh ke bawah, tutup dialog
    closeDialog();
  }
  translateY.value = 0; // reset posisi
}
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999;
  transition: opacity 0.3s;
  /* 确保点击事件能正常触发 */
  pointer-events: auto;
}

.dialog-container {
  width: 100%;
  height: 80vh;
  background: #2A2A2A;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  padding: 30rpx 24rpx 0;
  box-sizing: border-box;
  transition: transform 0.2s ease-out;
  /* 确保容器在遮罩层上方 */
  z-index: 1;
}

/* Garis kecil di atas dialog */
.drag-bar {
  width: 120rpx;
  height: 12rpx;
  background: #666;
  opacity: 0.5;
  border-radius: 8rpx;
  margin: 0 auto 24rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.search-box {
  background: #3B3B3B;
  border-radius: 12rpx;
  padding: 20rpx 20rpx;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-input {
  flex: 1;

  color: #fff;

  font-size: 28rpx;
  box-sizing: border-box;
  /* height: 68rpx; */
}
.input-placeholder{
  color: #fff !important;
}
.searchImg {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.cancel {
  color: #fff;
  font-size: 28rpx;
  margin-left: 20rpx;
}

.country-list {
  height: calc(80vh - 140rpx);
}

.country-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  margin-top: 10rpx;
  /* border-bottom: 1rpx solid #2c2c2c; */
}

.flag {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  border-radius: 50%;
}

.name {
  flex: 1;
  color: #fff;
  font-size: 28rpx;
}

.dial-code {
  color: #9AA4AE;
  font-size: 26rpx;
}
</style>
