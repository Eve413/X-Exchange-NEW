<template>
  <view class="share-page-dialog">
    <!-- Header -->
    <view class="header-dialog">
      <image
        src="/static/icons/ic_arrow_left.png"
        class="back-icon-dialog"
        @click="goBack"
      />
      <text class="title-dialog">{{$t('referal.share') }}</text>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="share-content-dialog">
      <view class="share-desc-dialog">
        <view class="share-title-row-dialog">
          <!-- <image src="/static/icons/ic_gift.png" class="gift-icon-dialog" /> -->
          <text class="share-main-title-dialog">{{ referal.info.title }}</text>
        </view>
        <text class="share-sub-dialog">
          {{ referal.info.description }}
        </text>

        <view class="rule-btn-dialog">
          <text>{{$t('referal.view_rules') }}</text>
          <!-- <image src="/static/icons/ic_arrow_right_white.png" class="arrow-icon-dialog" /> -->
        </view>
      </view>

      <!-- QR Code -->
      <view class="qr-container-dialog">
        <!-- <canvas canvas-id="qrCanvas" id="qrCanvas" class="qr-canvas-dialog"></canvas> -->
          <image :src= "referal.Qr.img" class="qr-canvas-dialog"  mode="aspectFit" />
        <!-- <image src="/static/icons/ic_arrow_right_white.png" class="qr-canvas-dialog"  mode="aspectFit" /> -->
        <text class="qr-label-dialog">{{$t('referal.scan_address_to_receive_payment') }}</text>

        <view class="address-box-dialog">
          <text>{{ referal.Qr.code ?? "-" }}</text>
          <image src="/static/icons/copy.png" class="copy-icon-dialog" @click="copyAddress" />
          <image src="/static/icons/share.png" class="share-icon-dialog" @click="shareAddress" />
        </view>

        <view class="role-section-dialog">
          <text class="role-title-dialog">{{$t('referal.normal') }}</text>
          <text class="role-type-dialog">KOC/KOL</text>
        </view>

         <view class="reward-page-dialog">
            <view
            v-for="(item, index) in rewards"
            :key="index"
            class="reward-card-dialog"
            >
            <view class="reward-info-dialog">
                <text class="reward-title-dialog">{{ item.title }}</text>
                <view class="reward-amount-row-dialog">
                <text class="reward-amount-dialog">{{ profit(index) }} USDT</text>
                <view
                    v-if="item.button"
                    class="invite-button-dialog"
                    @tap="onInvite"
                >
                    <text>{{ item.button }}</text>
                    <text class="arrow">></text>
                </view>
                </view>
            </view>

            <image :src="item.icon" class="reward-icon-dialog" />
            </view>
        </view>

        <view class="record-page-dialog">
            <!-- Tabs -->
            <view class="tabs-dialog">
            <text
                v-for="(tab, index) in tabs"
                :key="index"
                class="tab-item-dialog"
                :class="{ active: activeTab === index }"
                @tap="activeTab = index"
            >
                {{ tab }}
            </text>
            </view>

            <!-- Divider -->
            <!-- <view class="divider-dialog"></view> -->

            
             <view class="reward-list" v-if="activeTab == 0">
                <view class="reward-item" v-for="(item, index) in commission" :key="index">
                  <!-- Title -->
                  <text class="reward-title">
                    {{ item.username }} 收到 {{ item.type === 'airdrop' ? '空投奖励' : item.type }}
                  </text>

                  <!-- Description -->
                  <text class="reward-desc">
                    {{ $t('referal.normal') }} {{ item.baseAsset }} ｜ {{ $t('referal.quantity') }} {{ item.total }}  
                  </text>

                  <!-- Time -->
                  <text class="reward-time">
                    {{ item.created }}
                  </text>
                </view>
              </view>

              <view class="reward-list" v-if="activeTab == 1">
                <view class="reward-item" v-for="(item, index) in records" :key="index">
                  <!-- Title -->
                  <text class="reward-title">
                    {{ item.username }} {{$t('referal.received') }} {{ item.type === 'airdrop' ? '空投奖励' : item.type }}
                  </text>

                  <!-- Description -->
                  <text class="reward-desc">
                    {{ $t('referal.normal') }} {{ item.baseAsset }} ｜ {{ $t('referal.quantity') }} {{ item.total }}  
                  </text>

                  <!-- Time -->
                  <text class="reward-time">
                    {{ item.created }}
                  </text>
                </view>
              </view>

            <!-- Empty State -->
            <view 
              v-if="(activeTab == 0 && commission.length === 0 ) ||  (activeTab == 1 && records.length === 0)" 
              class="empty-state-dialog"
            >
            <image src="/static/icons/ic_empty_record.png" class="empty-icon-dialog" />
            <text class="empty-text-dialog">{{$t('referal.no_records') }}</text>
            </view>

            <!-- FAQ Section -->
            <view class="faq-section-dialog">
              <text class="faq-title-dialog">{{$t('referal.faq') }}</text>
              <view
                v-for="(faq, index) in referal.Faq"
                :key="index"
                class="faq-item-dialog"
                @tap="toggleFAQ(index)"
              >
                <view class="faq-question-dialog">
                  <text>{{ index + 1 }}、{{ faq.question }}</text>
                  <text class="arrow">{{ faq.open ? '▲' : '▼' }}</text>
                </view>

                <view class="faq-answer-dialog" v-if="faq.open">
                  <div  v-html="faq.answer"></div>
                </view>
              </view>
            </view>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import uQRCode from 'uqrcodejs'
import { useI18n } from 'vue-i18n'
import {useUserStore, ReferalParams} from '@/store/modules/user'
const userInfo = uni.getStorageSync('userData')
import { onLoad } from '@dcloudio/uni-app'
const { t } = useI18n();
const userStore = useUserStore()

const address = ref('0xc8d4f9e7a93a5b7f89320f')

// 模拟数据
const mockReferalData = {
  info: {
    title: '邀请好友，双方获益',
    description: '分享您的邀请码给好友，好友注册并完成交易后，双方都能获得奖励'
  },
  Qr: {
    img: '/static/icons/qrcode.svg',
    code: 'X-EX123456'
  },
  Profit: {
    deposit_reward: '125.50',
    trading_cashback: '89.75',
    commission: '234.30',
    referral_rebate: '56.20',
    yesterday_commission: '12.80'
  },
  Faq: [
    {
      question: '如何邀请好友？',
      answer: '您可以通过分享您的邀请码或二维码图片给好友，好友通过您的邀请链接注册即可。'
    },
    {
      question: '邀请奖励何时发放？',
      answer: '当您邀请的好友完成首次交易后，奖励将在24小时内发放到您的账户。'
    },
    {
      question: '最多可以邀请多少好友？',
      answer: '目前没有邀请数量限制，邀请越多，奖励越多。'
    },
    {
      question: '奖励如何提现？',
      answer: '您可以在资产页面将奖励金额提现到您的银行卡或数字钱包。'
    }
  ]
}

const mockCommissionData = [
  {
    username: 'user123',
    type: 'commission',
    baseAsset: 'USDT',
    total: '5.20',
    created: '2023-06-15 14:30:22'
  },
  {
    username: 'trader456',
    type: 'airdrop',
    baseAsset: 'BTC',
    total: '0.0025',
    created: '2023-06-10 09:15:45'
  }
]

const mockRecordsData = [
  {
    username: 'newuser789',
    type: 'registration',
    baseAsset: 'USDT',
    total: '10.00',
    created: '2023-06-18 16:45:12'
  }
]

// 初始化时就使用模拟数据作为默认值，确保页面能立即渲染
const referal = ref({...mockReferalData})
const commission = ref([...mockCommissionData])
const records = ref([...mockRecordsData])

const shortAddress = ref(address.value.slice(0, 6) + '...' + address.value.slice(-4))

    onLoad(async (options) => {
      // 页面初始化时已经有模拟数据，这里只在API成功时更新
      try {
          const referalParams: ReferalParams = {
            passkey: userStore.pasKeyAuth || '',
            device: userStore.deviceAuth || '',
            appversion: userStore.appversionAuth || '',
            token: userInfo.data?.token || '',
            lang: userStore.language
          }

          // 尝试从API获取数据，但使用try-catch单独包裹每个请求
          // 这样即使某个请求失败，其他请求仍可能成功
          try {
            const resultReferal = await userStore.getReferal(referalParams)
            // 只在API返回有效数据时更新
            if (resultReferal.data?.data && Object.keys(resultReferal.data.data).length > 0) {
              console.log('API推荐数据获取成功，更新本地数据')
              referal.value = resultReferal.data.data
            } else {
              console.log('API推荐数据无效，保留模拟数据')
            }
          } catch (err) {
            console.log('获取推荐数据失败，保留模拟数据:', err.message)
          }
          
          try {
            const resultCommision = await userStore.getCommision(referalParams)
            if (resultCommision.data?.data && resultCommision.data.data.length > 0) {
              console.log('API佣金数据获取成功，更新本地数据')
              commission.value = resultCommision.data.data
            } else {
              console.log('API佣金数据无效，保留模拟数据')
            }
          } catch (err) {
            console.log('获取佣金数据失败，保留模拟数据:', err.message)
          }
          
          try {
            const resultInfitaion = await userStore.getInvitation(referalParams)
            if (resultInfitaion.data?.data && resultInfitaion.data.data.length > 0) {
              console.log('API邀请记录获取成功，更新本地数据')
              records.value = resultInfitaion.data.data
            } else {
              console.log('API邀请记录无效，保留模拟数据')
            }
          } catch (err) {
            console.log('获取邀请记录失败，保留模拟数据:', err.message)
          }
        } catch (e) {
          console.error('❌ 数据加载过程中发生错误，保留模拟数据:', e)
          // 不做任何操作，保留初始化时的模拟数据
        }
      })

onMounted(() => {
  // generateQR()
})

// function generateQR() {
//   const qr = new uQRCode({
//     text: address.value,
//     size: 200,
//     margin: 10,
//     backgroundColor: '#111',
//     foregroundColor: '#fff',
//     fileType: 'jpg',
//     correctLevel: uQRCode.errorCorrectLevel.H,
//     canvasId: 'qrCanvas'
//   })
//   qr.make()
// }

function copyAddress() {
  // 优先使用referal中的邀请码，如果没有则使用默认地址
  const textToCopy = referal.value.Qr?.code || address.value
  uni.setClipboardData({
    data: textToCopy,
    success: () => uni.showToast({ title: '复制成功', icon: 'none' }),
    fail: () => uni.showToast({ title: '复制失败', icon: 'none' })
  })
}

function shareAddress() {
  uni.showShareMenu({
    withShareTicket: true,
    success: () => uni.showToast({ title: '分享已打开', icon: 'none' })
  })
}

function goBack() {
  uni.navigateBack()
}

const rewards = [
  { title: t('referal.remittance_reward'), icon: '/static/icons/reward1.png' },
  { title: t('referal.stock_cashback'), icon: '/static/icons/reward2.png' },
  { title: t('referal.stock_commission_rebate'), icon: '/static/icons/reward3.png' },
  { title: t('referal.total_invitations'), icon: '/static/icons/reward4.png', button: '邀请' },
  { title: t('referal.yesterday_commission_rebate'), icon: '/static/icons/reward5.png' },
  // { title: '累计返佣', icon: '/static/icons/reward6.png' },
]

const tabs = [t('referal.commission_rebate_history'), t('referal.invitation_records')]
const activeTab = ref(0)
const hasRecords = false

// 初始化为空，将使用referal.value.Faq中的数据
const faqs = ref([])

function toggleFAQ(index) {
  // 检查referal.value.Faq是否存在且有数据
  if (referal.value.Faq && referal.value.Faq[index]) {
    // 为FAQ项添加open属性（如果不存在）
    if (referal.value.Faq[index].open === undefined) {
      referal.value.Faq[index].open = false
    }
    // 切换open状态
    referal.value.Faq[index].open = !referal.value.Faq[index].open
  }
}

// 在组件挂载后初始化FAQ的open状态
onMounted(() => {
  // 初始化FAQ的open状态
  if (referal.value.Faq && Array.isArray(referal.value.Faq)) {
    referal.value.Faq.forEach(faq => {
      if (faq.open === undefined) {
        faq.open = false
      }
    })
  }
})

function profit(index) {
  
  if (index == 0){
    return  referal.value.Profit.deposit_reward
  } else  if (index == 1){
    return  referal.value.Profit.trading_cashback
  }else  if (index == 2){
    return  referal.value.Profit.commission
  }else  if (index == 3){
    return  referal.value.Profit.referral_rebate
  }else  if (index == 4){
    return  referal.value.Profit.yesterday_commission
  }
  
}

function onInvite() {
  uni.showToast({
    title: '邀请按钮被点击',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.share-page-dialog {
  background-color: #202020;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  /* 适配刘海屏/状态栏安全区 */
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  box-sizing: border-box;
  height: 100rpx;
  background-color: #202020;
  padding-top: 40rpx;
  z-index: 10;
  box-sizing: content-box;
  /* border-bottom: 1rpx solid #2a2a2a; */
}
.back-icon-dialog {
  position: absolute;
  left: 24rpx;
  width: 40rpx;
  height: 32rpx;
}
.title-dialog {
  font-size: 34rpx;
  font-weight: bold;
}

/* Content */
.share-content-dialog {
  padding: 30rpx;
  flex: 1;
}

/* Deskripsi */
.share-desc-dialog {
  text-align: center;
  margin-bottom: 40rpx;
}
.share-title-row-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
}
.gift-icon-dialog {
  width: 36rpx;
  height: 36rpx;
}
.share-main-title-dialog {
  font-size: 30rpx;
  font-weight: 600;
}
.share-sub-dialog {
  display: block;
  color: #aaa;
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 20rpx;
}
.rule-btn-dialog {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  border-radius: 40rpx;
  padding: 12rpx 36rpx;
  font-size: 26rpx;
  color: #fff;
}
.arrow-icon-dialog {
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
}

/* QR */
.qr-container-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qr-canvas-dialog {
  width: 420rpx;
  height: 420rpx;
  /* background: #000; */
  border-radius: 16rpx;
  padding: 20rpx;
}
.qr-label-dialog {
  color: #999;
  font-size: 26rpx;
  margin-top: 20rpx;
}

/* Address */
.address-box-dialog {
  display: flex;
  align-items: center;
  background-color: #2A2A2A;
  border-radius: 50rpx;
  padding: 10rpx 20rpx;
  margin-top: 10rpx;
  gap: 16rpx;
}
.copy-icon-dialog,
.share-icon-dialog {
  width: 34rpx;
  height: 34rpx;
}

/* Role Section */
.role-section-dialog {
  display: flex;
  justify-content: flex-start; /* sejajar kiri */
  align-items: center;
  margin-top: 30rpx;
  width: 100%;
  padding-left: 40rpx; /* beri jarak dari tepi kiri */
  text-align: left; /* pastikan teks juga rata kiri */
}
.role-title-dialog {
  color: #999;
  font-size: 28rpx;
}
.role-type-dialog {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.reward-page-dialog {
  background-color: #202020;
  width: 100%;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.reward-card-dialog {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  padding: 14rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.reward-info-dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.reward-title-dialog {
  color: #a5a5a5;
  font-size: 26rpx;
  margin-bottom: 12rpx;
}

.reward-amount-row-dialog {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.reward-amount-dialog {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.invite-button-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #6a5acd, #ff69b4);
  border-radius: 50rpx;
  padding: 10rpx 30rpx;
  font-size: 26rpx;
  color: #fff;
  .arrow{
    color: #fff;
  }
}

.invite-button-dialog .arrow {
  margin-left: 6rpx;
}

.reward-icon-dialog {
  width: 90rpx;
  height: 90rpx;
}
.record-page-dialog {
  background-color: #202020;
  color: #fff;
  min-height: 100vh;
  padding: 0 24rpx 40rpx;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Tabs */
.tabs-dialog {
  display: flex;
  justify-content: flex-start;
  gap: 40rpx;
  padding: 30rpx 0 20rpx;
  background-color: #202020;
}

.tab-item-dialog {
  font-size: 30rpx;
  color: #aaa;
}

.tab-item-dialog.active {
  color: #fff;
  font-weight: bold;
  /* border-bottom: 4rpx solid #9c4df4; */
  padding-bottom: 6rpx;
}

/* Divider */
.divider-dialog {
  height: 1rpx;
  background-color: #2a2a2a;
  margin-bottom: 40rpx;
}

/* Empty State */
.empty-state-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100rpx;
}
.empty-icon-dialog {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 30rpx;
}
.empty-text-dialog {
  font-size: 28rpx;
  color: #a6a8ad;
}

/* FAQ Section */
.faq-section-dialog {
  margin-top: 60rpx;
  width: 100%;
}
.faq-title-dialog {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
  color: #fff;
}
.faq-item-dialog {
  border-top: 1rpx solid #2a2a2a;
  padding: 24rpx 0;
  transition: all 0.3s ease;
}
.faq-item-dialog:last-child {
  border-bottom: 1rpx solid #2a2a2a;
}
.faq-question-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #fff;
  padding-right: 10rpx;
}
.arrow {
  color: #9c4df4;
  font-size: 24rpx;
  transition: transform 0.3s ease;
}
.faq-answer-dialog {
  margin-top: 16rpx;
  color: #a6a8ad;
  font-size: 26rpx;
  line-height: 1.6;
  padding: 0 0 0 40rpx;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.reward-list {
  /* padding: 20rpx; */
}

.reward-item {
  padding: 20rpx;
  border-bottom: 1px solid #2a2a2a;
}

.reward-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #fff;
}

.reward-desc {
  font-size: 26rpx;
  color: #b9b9b9;
  margin-top: 8rpx;
  display: block;
}

.reward-time {
  font-size: 22rpx;
  color: #777;
  margin-top: 10rpx;
  display: block;
}
</style>
