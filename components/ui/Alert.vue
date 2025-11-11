<template>
  <transition name="fade">
    <div v-if="show" class="ios-alert-overlay">
      <div class="ios-alert-box">
        <!-- Title + Description -->
        <div class="px-6 pt-6 pb-4">
          <h2 class="text-black text-lg font-semibold mb-3 text-center leading-snug px-6 pt-8">
            {{ title }}
          </h2>
          <p class="text-gray-600 text-sm text-center leading-snug px-6 pb-4">
            {{ description }}
          </p>
        </div>

        <div class="border-t border-gray-200"></div>

        <!-- Buttons -->
        <div
          class="flex divide-x divide-gray-200"
          :class="{ 'justify-center': !cancelText || !confirmText }"
        >
          <!-- Cancel Button -->
          <button
            v-if="cancelText"
            class="flex-1 py-3.5 text-blue-500 font-medium active:bg-gray-100"
            @click="onCancel"
          >
            {{ cancelText }}
          </button>

          <!-- Confirm Button -->
          <button
            v-if="confirmText"
            class="flex-1 py-3.5 text-blue-500 font-medium active:bg-gray-100"
            @click="onConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() {
  emit('confirm')
}
function onCancel() {
  emit('cancel')
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style scoped>
.ios-alert-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.ios-alert-box {
  background: white;
  border-radius: 18px;
  width: 80%;
  padding-top: 10%;
  max-width: 320px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

/* animasi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
