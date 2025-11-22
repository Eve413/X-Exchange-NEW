<template>
    <view class="activity-page">
        <!-- 顶部安全区 -->
        <!-- <view class="status-bar-spacer" :style="getTopStyle(0)"></view> -->

        <!-- 头部导航栏 -->
        <view class="header">
            <view class="back-button" @click="goBack">
                <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
            </view>
            <text class="page-title">{{ t('activity.pageTitle') }}</text>
            <view class="header-actions">
                <view class="notification-wrapper" @click="goToCustomerService">
                    <image class="header-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" />
                </view>
                <view class="notification-wrapper" @click="goToNotification">
                    <image class="header-icon" src="/static/icons/ic_bell.png" mode="aspectFit" />
                </view>
            </view>
        </view>

        <!-- 主要内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 活动统计卡片 -->
            <view class="stats-card">
                <text class="stats-title">{{ t('activity.stats.title') }}</text>
                <view class="stats-container">
                    <view class="stat-item">
                        <text class="stat-label">{{ event?.summary?.TotalProject?.title }}</text>
                        <text class="stat-value">{{ event?.summary?.TotalProject?.value }}</text>
                    </view>
                    <!-- <view class="stat-viewider"></view> -->
                    <view class="stat-item">
                        <text class="stat-label">{{ event?.summary?.TotalUsers?.title }}</text>
                        <text class="stat-value">{{ event?.summary?.TotalUsers?.value }}</text>
                    </view>
                </view>
                <image class="stats-icon" src="/static/icons/activeimg2.png" mode="aspectFit" />
            </view>

            <!-- 新人福利导航 -->
            <view class="welfare-nav">
                <view class="welfare-nav-item"
                    :class="{ active: currentWelfareTab === t('activity.welfareTabs.newUser') }"
                    @click="switchWelfareTab(t('activity.welfareTabs.newUser'))">
                    <text>{{ t('activity.welfareTabs.newUser') }}</text>
                </view>
                <view class="welfare-nav-item"
                    :class="{ active: currentWelfareTab === t('activity.welfareTabs.dailyCheckin') }"
                    @click="switchWelfareTab(t('activity.welfareTabs.dailyCheckin'))">
                    <text>{{ t('activity.welfareTabs.dailyCheckin') }}</text>
                </view>
                <view class="welfare-nav-item"
                    :class="{ active: currentWelfareTab === t('activity.welfareTabs.dailyRewards') }"
                    @click="switchWelfareTab(t('activity.welfareTabs.dailyRewards'))">
                    <text>{{ t('activity.welfareTabs.dailyRewards') }}</text>
                </view>
                <view class="welfare-nav-item"
                    :class="{ active: currentWelfareTab === t('activity.welfareTabs.couponCenter') }"
                    @click="switchWelfareTab(t('activity.welfareTabs.couponCenter'))">
                    <text>{{ t('activity.welfareTabs.couponCenter') }}</text>
                </view>
            </view>

            <!-- 倒计时区域 -->
            <view class="imgBox">
                <image class="stats-icon1" src="/static/icons/activeimg1.png" mode="aspectFit" />
            </view>
            <view class="countdown-card">
                <view class="countdown-item">
                    <text class="countdown-number">{{event?.event?.remaining_time?.d}}</text>
                    <!-- <text class="countdown-label">D</text> -->
                </view>
                <text class="countdown-separator">{{ t('activity.countdown.day') }}</text>
                <view class="countdown-item">
                    <text class="countdown-number">{{event?.event?.remaining_time?.h}}</text>
                    <!-- <text class="countdown-label">H</text> -->
                </view>
                <text class="countdown-separator">{{ t('activity.countdown.hour') }}</text>
                <view class="countdown-item">
                    <text class="countdown-number">{{event?.event?.remaining_time?.i}}</text>
                    <!-- <text class="countdown-label">M</text> -->
                </view>
                <text class="countdown-separator">{{ t('activity.countdown.minute') }}</text>
                <view class="countdown-item">
                    <text class="countdown-number">{{event?.event?.remaining_time?.s}}</text>
                    <!-- <text class="countdown-label">S</text> -->
                </view>
            </view>

            <!-- 限时新人福利 -->
            <view class="limited-welfare-card">
                <view class="limited-welfare-header">
                    <text class="limited-welfare-title">{{ event?.event?.info?.name }}</text>
                </view>
                <view class="limited-welfare-amount">{{event?.event?.info?.reward?.title}} </view>
                <view class="limited-welfare-content">
                    <!-- <view class="limited-welfare-reward">{{event?.event?.info?.reward?.value}}</view> -->
                    <view class="imited-welfare-reward-label" v-html="event?.event?.info?.short_description"></view>
                    <!-- <view class="limited-welfare-reward-label">{{ t('activity.limitedWelfare.btcReward') }}</view> -->
                </view>
                <view class="limited-welfare-subtext">{{ event?.reward_top.title }}</view>
            </view>

            <!-- 新人BTC福利 -->
            <view class="btc-welfare-card">
                <view class="btc-welfare-header">
                    <text class="btc-welfare-title">{{ t('activity.btcWelfare.title') }}</text>
                </view>
                <view class="btc-bottom">
                    <view class="btc-welfare-reward">
                        <text class="btc-welfare-amount">{{event?.reward_top?.amount?.value}}</text>
                        <text class="btc-welfare-unit">{{event?.reward_top?.amount?.baseAsset}}</text>
                    </view>
                    <view class="btc-welfare-condition">{{event?.reward_top?.short_description}}, {{event?.reward_top?.description}}</view>
                </view>
            </view>

            <!-- 完成任务说明 -->
            <view class="task-instruction">
                <text class="task-instruction-text">{{ t('activity.taskInstruction.title') }}</text>
                <view class="task-instruction-item">
                    <view class="task-instruction-icon">
                        <text class="icon-number">1</text>
                    </view>
                    <view class="task-instruction-content">
                        <view class="info-top">
                            {{ t('activity.task.inviteRegister') }}<text class="now">0{{ t('activity.task.countSeparator') }}</text><text>1</text>
                        </view>
                        <view>{{ t('activity.taskInstruction.item1') }}</view>
                    </view>
                    <view class="task-instruction-button invite-button" @click="goToInvite">{{
                        t('activity.buttons.goInvite') }}</view>
                </view>
                <view class="line-or">{{ t('activity.task.or') }}</view>
                <view class="task-instruction-item">
                    <view class="task-instruction-icon">
                        <text class="icon-number">2</text>
                    </view>
                    <view class="task-instruction-content">
                        <view class="info-top">
                            {{ t('activity.task.inviteRegister') }}<text class="now">0{{ t('activity.task.countSeparator') }}</text><text>1</text>
                        </view>
                        <view>{{ t('activity.taskInstruction.item2') }}</view>
                    </view>
                    <!-- <view class="task-instruction-content"></view> -->
                    <view class="task-instruction-button sign-button" @click="goToSign">{{
                        t('activity.buttons.goSign') }}</view>
                </view>
                <!-- <view class="task-instruction-buttons"> -->


                <!-- </view> -->
            </view>

            <!-- 新人任务列表 -->
            <view class="task-section">
                <text class="task-section-title">{{ t('activity.taskSection.title') }}</text>

                <!-- 身份认证任务 -->
                
                    <view 
                      v-for="(task, i) in event?.reward?.filter(t => t?.type === 'kyc_verified')"
                      :key="i"
                      class="task-card"
                    >
                        <view class="task-header">
                            <view class="task-info">
                                <view class="task-icon">
                                    <image class="task-icon-img" src="/static/icons/ic_checklist.png" mode="aspectFit" />
                                </view>
                                <view class="task-details">
                                    <text class="task-title">{{ task.title }}</text>
                                    <text class="task-description">{{ task.short_description }}</text>
                                </view>
                                <view class="task-reward">
                                    <view class="task-reward-amount">
                                        <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ task.amount.value }}
                                    </view>
                                </view>
                            </view>
                            <view class="task-bottom">
                                <view class="task-reward">
                                    <view class="task-reward-amount">
                                        <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ task.amount.value }}
                                    </view>
                                </view>
                                <view class="task-button" @click="goToDeposit">{{ t('activity.buttons.goDeposit')
                                    }}</view>
                            </view>
                        </view>
                    </view>

                <!-- 首次充值任务 -->
                <view 
                      v-for="(task, i) in event?.reward?.filter(t => t?.type === 'deposit')"
                      :key="i"
                      class="task-card"
                    >
                    <view class="task-header">
                        <view class="task-info">
                            <view class="task-icon">
                                <image class="task-icon-img" src="/static/icons/rechargeImg.png" mode="aspectFit" />
                            </view>
                            <view class="task-details">
                                 <text class="task-title">{{ task.title }}</text>
                                    <text class="task-description">{{ task.short_description }}</text>
                            </view>
                        </view>
                        <view class="task-bottom">
                            <view class="task-reward">
                                <view class="task-reward-amount">
                                    <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ task.amount.value }}
                                </view>
                            </view>
                            <view class="task-button" @click="goToDeposit">{{ t('activity.buttons.goDeposit')
                            }}</view>
                        </view>
                    </view>
                </view>

                <!-- 首次交易任务 -->
                <view 
                      v-for="(task, i) in event?.reward?.filter(t => t?.type === 'trading')"
                      :key="i"
                      class="task-card"
                    >
                    <view class="task-header">
                        <view class="task-info">
                            <view class="task-icon">
                                <image class="task-icon-img" src="/static/icons/ic_swap.png" mode="aspectFit" />
                            </view>
                            <view class="task-details">
                                 <text class="task-title">{{ task.title }}</text>
                                    <text class="task-description">{{ task.short_description }}</text>
                            </view>
                           <view class="task-reward">
                                <view class="task-reward-amount">
                                    <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ task.amount.value }}
                                </view>
                            </view>
                        </view>
                        <view class="task-bottom">
                            <view class="task-reward">
                                <view class="task-reward-amount">
                                    <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ task.amount.value }}
                                </view>
                            </view>
                            <view class="task-button" @click="goToDeposit">{{ t('activity.buttons.goDeposit')
                            }}</view>
                        </view>
                    </view>
                </view> 
            </view>

            <!-- 新人专享理财 -->
            <view class="finance-section">
                <text class="finance-section-title">{{ t('activity.finance.title') }}</text>
                <view class="finance-card">
                    <view class="finance-info">
                        <view class="finance-rate">
                            <text class="finance-rate-number">{{ event?.reward_bottom?.title }}</text>
                            <!-- <text class="finance-rate-unit">%</text> -->
                            <text class="finance-rate-period">{{event?.reward_bottom?.short_description}}</text>
                        </view>
                        <view class="finance-details">
                            <text class="finance-amount">{{ event?.reward_bottom?.amount?.baseAsset }}</text>
                            <text class="finance-reward">{{ event?.reward_bottom?.description }}</text>
                        </view>
                    </view>
                    <view class="task-bottom">
                        <view class="task-reward">
                            <view class="task-reward-amount">
                                <image class="coinsIocn" src="/static/icons/coinsIocn.png" mode="aspectFit" />{{ event?.reward_bottom?.amount?.value }}
                            </view>
                        </view>
                        <view class="finance-button" @click="goToFinance">{{ t('activity.buttons.goVerify')
                            }}</view>
                    </view>

                </view>
                <text class="finance-note">{{ event?.reward_bottom?.additional_description }}</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSafeArea } from '@/utils/composables/useSafeArea';
import { useI18n } from 'vue-i18n';
import { useUserStore,EventParams } from '@/store/modules/user';
const userInfo = uni.getStorageSync('userData');
const userStore = useUserStore();

const { getTopStyle } = useSafeArea();
const { t } = useI18n();

// 当前福利标签
const currentWelfareTab = ref(t('activity.welfareTabs.newUser'));

// 活动统计数据
const stats = {
    totalRewards: '1.21M',
    participants: '47,894'
};

// 返回上一页
const goBack = () => {
    uni.navigateBack();
};

// 跳转到客服页面
const goToCustomerService = () => {
    uni.navigateTo({
        url: '/pages/customerservice/index',
        success: () => console.log('✅ 跳转到客服页面成功'),
        fail: (err) => console.error('❌ 跳转到客服页面失败:', err)
    });
};

// 跳转到消息通知页面
const goToNotification = () => {
    uni.navigateTo({
        url: '/pages/notification/index',
        success: () => console.log('✅ 跳转到消息通知页面成功'),
        fail: (err) => console.error('❌ 跳转到消息通知页面失败:', err)
    });
};

// 切换福利标签
const switchWelfareTab = (tab: string) => {
    currentWelfareTab.value = tab;
    // 这里可以根据不同标签加载不同内容
    console.log('切换到标签:', tab);
};

// 跳转到身份认证
const goToVerify = () => {
    uni.navigateTo({
        url: '/pages/createkyc/intro',
        success: () => console.log('✅ 跳转到身份认证页面成功'),
        fail: (err) => console.error('❌ 跳转到身份认证页面失败:', err)
    });
};

// 跳转到充值页面
const goToDeposit = () => {
    uni.navigateTo({
        url: '/pages/recharge/index',
        success: () => console.log('✅ 跳转到充值页面成功'),
        fail: (err) => console.error('❌ 跳转到充值页面失败:', err)
    });
};

// 跳转到交易页面
const goToTrade = () => {
    uni.navigateTo({
        url: '/pages/trade/index',
        success: () => console.log('✅ 跳转到交易页面成功'),
        fail: (err) => console.error('❌ 跳转到交易页面失败:', err)
    });
};

// 跳转到理财页面
const goToFinance = () => {
    uni.navigateTo({
        url: '/pages/wealth/index',
        success: () => console.log('✅ 跳转到理财页面成功'),
        fail: (err) => console.error('❌ 跳转到理财页面失败:', err)
    });
};

// 跳转到邀请页面
const goToInvite = () => {
    console.log('✅ 跳转到邀请页面');
    // 这里可以根据实际需求添加跳转逻辑
};

// 跳转到签到页面
const goToSign = () => {
    console.log('✅ 跳转到签到页面');
    // 这里可以根据实际需求添加跳转逻辑
};
const event = ref<any>(null)

onMounted(async () => {
    try {
    const params: EventParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: 'en',
      type: "new_user"
    }
    const result = await userStore.getEvent(params)
    if (result.data.status === -1) handleLogout()
    event.value = result.data.data

    const remaining_time = result.data.data.event.remaining_time
//     countdownParts.value = [
//     String(remaining_time?.d).padStart(2, '0'),
//     String(remaining_time?.h).padStart(2, '0'),
//     String(remaining_time?.i).padStart(2, '0'),

//     String(remaining_time?.s).padStart(2, '0')
//   ]
  } catch (e) {
    console.error('❌ Failed to load airdrops:', e)
  }
})

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
</script>

<style lang="scss" scoped>
.activity-page {
    min-height: 100vh;
    background: #202020;
    color: #ffffff;
    position: relative;
}

.status-bar-spacer {
    width: 100%;
}

.header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: #202020;
    position: sticky;
    padding-top: 50rpx;
    top: 0;
    z-index: 100;
}

.back-button {
    width: 80px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.back-icon {
    width: 40rpx;
    height: 32rpx;
}

.page-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    position: relative;
}

.header-actions {
    display: flex;
    align-items: center;
    width: 80px;
    /* 与左边返回按钮区域宽度相同，确保标题居中 */
    justify-content: flex-end;
}

.notification-wrapper {
    margin-left: 20px;
}

.header-icon {
    width: 24px;
    height: 24px;
}

.content-scroll {
    flex: 1;
    padding-bottom: 100rpx;
}

/* 活动统计卡片 */
.stats-card {
    margin: 0 16px 0;
    padding: 20px 0;
    // background: linear-gradient(175deg, #5565B9, #CD5890);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
}

.stats-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 16px;
    display: block;
}

.stats-container {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.stat-item {
    margin-right: 50rpx;
    // flex: 1;
}

.stat-value {
    font-size: 30rpx;
    font-weight: 700;
    color: #ffffff;
    display: block;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 24rpx;
    color: #9AA4AE;
}

.stat-viewider {
    width: 1px;
    height: 40px;
    background: #9AA4AE;
    margin: 0 20px;
}

.stats-icon {
    position: absolute;
    right: 20rpx;
    bottom: 60rpx;
    width: 200rpx;
    height: 200rpx;
    // opacity: 0.2;
}

.imgBox {
    // padding-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stats-icon1 {
    // position: absolute;
    // right: 20rpx;
    // bottom: 60rpx;
    width: 200rpx;
    margin: 20rpx auto 0;
    height: 200rpx;
    // opacity: 0.2;
}

/* 福利导航 */
.welfare-nav {
    display: flex;
    padding: 0 16px;
    margin-bottom: 16px;
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
    padding-bottom: 20rpx;
}

.welfare-nav-item {
    color: #9AA4AE;
    flex: 1;
    text-align: center;
    // padding: 12px 0;
    // border-radius: 8px;
    // background: #2a2a2a;
    margin: 0 4px;
}

.welfare-nav-item.active {
    color: #ffffff;
    // background: linear-gradient(175deg, #5565B9, #CD5890);
}

.welfare-nav-item text {
    // color: #ffffff;
    font-size: 14px;
}

/* 倒计时区域 */
.countdown-card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 16px 0px;
    padding: 20px;
    // background: #2a2a2a;
    border-radius: 16px;
}

.countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #3B3B3B;
    border-radius: 8px;
    padding: 8px 12px;
    margin: 0 4px;
}

.countdown-number {
    font-size: 26rpxpx;
    font-weight: 700;
    color: #ffffff;
}

.countdown-label {
    font-size: 12px;
    color: #9AA4AE;
    margin-top: 2px;
}

.countdown-separator {
    font-size: 28rpx;
    // font-weight: 700;
    color: #ffffff;
    margin: 0 8px;
}

/* 限时新人福利 */
.limited-welfare-card {
    // margin: 0 16px 16px;
    // padding: 20px;
    // background: #2a2a2a;
    border-radius: 16px;
    justify-content: center;
}

.limited-welfare-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
}

.limited-welfare-title {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
}

.limited-welfare-amount {
    font-size: 18px;
    font-weight: 700;
    color: #19AF00;
    text-align: center;
}

.limited-welfare-content {
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.limited-welfare-reward {
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 4px;
    display: block;
}

.limited-welfare-reward-label {
    font-size: 14px;
    color: #9AA4AE;
    display: block;
    align-items: center;
}

.limited-welfare-subtext {
    font-size: 12px;
    color: #9AA4AE;
    text-align: center;
}

/* 新人BTC福利 */
.btc-welfare-card {
    margin: 20rpx 16px 16px;
    padding: 20px;
    background: #2a2a2a;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.btc-bottom {
    display: flex;
    background-color: #3B3B3B;
    padding: 30rpx;
    border-radius: 10rpx;
}

.btc-welfare-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.btc-welfare-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
}

.btc-welfare-reward {
    display: flex;
    // align-items: baseline;
    align-items: center;
    padding-right: 30rpx;
}

.btc-welfare-amount {
    font-size: 20px;
    font-weight: 700;
    color: #19AF00;
    margin-right: 4px;
}

.btc-welfare-unit {
    font-size: 12px;
    color: #9AA4AE;
}

.btc-welfare-condition {
    font-size: 12px;
    color: #9AA4AE;
    background-color: #2A2A2A;
    flex: 1;
    border-radius: 10rpx;
    padding: 30rpx;
}

/* 完成任务说明 */
.task-instruction {
    margin: 0 16px 16px;
    padding: 20px;
    background: #2a2a2a;
    border-radius: 16px;
}

.task-instruction-text {
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 12px;
    display: block;
    font-weight: 500;
}

.task-instruction-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.line-or {
    text-align: center;
    // border: 1rpx solid #fff;
    // padding: 4rpx;
    // border-radius: 50%;
    // box-sizing: content-box;
}

.task-instruction-icon {
    width: 24px;
    height: 24px;
    background: #3B3B3B;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.icon-number {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
}

.task-instruction-content {
    font-size: 14px;
    color: #9AA4AE;
    // flex: 1;
}

.task-instruction-buttons {
    display: flex;
    margin-top: 16px;
    // gap: 12px;
}

.task-instruction-button {
    // flex: 1;
    padding: 2rpx 20rx;
    border-radius: 40px;
    font-size: 26rpx;
    font-weight: 500;
    text-align: center;
    border: none;
    color: #ffffff;
}

.invite-button {
    background: linear-gradient(175deg, #5565B9, #CD5890);
}

.sign-button {
    background: linear-gradient(175deg, #5565B9, #CD5890);
}

/* 任务列表 */
.task-section {
    margin-bottom: 16px;
}

.task-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 16px 12px;
    display: block;
}

.task-card {
    margin: 0 16px 12px;
    padding: 16px;
    background: #2a2a2a;
    border-radius: 12px;
}

.task-header {
    width: 100%;
}

.task-info {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.task-icon {
    width: 48px;
    height: 48px;
    background: #3B3B3B;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.task-icon-img {
    width: 28px;
    height: 28px;
}

.task-details {
    flex: 1;
}

.info-top {
    font-size: 24rpx;
    color: #fff;

}

.now {
    color: #6F4BFD;
    margin-left: 8rpx;
}

.task-title {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 4px;
    display: block;
}

.task-description {
    font-size: 12px;
    color: #9AA4AE;
}

.task-reward {
    display: flex;
    align-items: center;
}

.task-reward-amount {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffd700;
    position: relative;
    // padding-left: 16px;
}

.coinsIocn {
    width: 24rpx;
    height: 24rpx;
}

.task-reward-amount::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: url('/static/icons/coinsIocn.png') no-repeat center;
    background-size: contain;
}

.task-bottom {
    display: flex;
    justify-content: space-between;
}

.task-button {
    // width: 100%;
    padding: 2px 20rpx;
    background: linear-gradient(175deg, #5565B9, #CD5890);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 26rpx;
    font-weight: 500;
}

/* 新人专享理财 */
.finance-section {
    margin-bottom: 16px;
}

.finance-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 16px 12px;
    display: block;
}

.finance-card {
    margin: 0 16px 8px;
    padding: 16px;
    background: #2a2a2a;
    border-radius: 12px;
}

.finance-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.finance-rate {
    display: flex;
    align-items: baseline;
}

.finance-rate-number {
    font-size: 28px;
    font-weight: 700;
    color: #19AF00;
    margin-right: 2px;
}

.finance-rate-unit {
    font-size: 16px;
    font-weight: 700;
    color: #19AF00;
    margin-right: 4px;
}

.finance-rate-period {
    font-size: 12px;
    color: #9AA4AE;
}

.finance-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.finance-amount {
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 4px;
}

.finance-reward {
    font-size: 12px;
    color: #9AA4AE;
    display: flex;
    align-items: center;
}

.finance-reward::before {
    content: "";
    width: 16px;
    height: 16px;
    background: url('/static/tubiao/bizhong/USDT.png') no-repeat center;
    background-size: contain;
    margin-right: 4px;
}

.finance-button {
    // width: 100%;
    padding:4rpx 20rpx;
    background: linear-gradient(175deg, #5565B9, #CD5890);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 26rpx;
    font-weight: 500;
}

.finance-note {
    font-size: 12px;
    color: #9AA4AE;
    margin: 0 16px;
    text-align: right;
}
</style>