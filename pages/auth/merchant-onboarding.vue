<template>
  <view class="guide-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>开店引导</text><view /></view>
    <view class="content">
      <view class="hero-card">
        <view class="hero-logo"><text>F</text></view>
        <view class="hero-glow" />
      </view>
      <text class="title">欢迎开通商家店铺</text>
      <text class="copy">完成三步，即可开始使用商家工作台</text>

      <view class="steps">
        <view class="step"><view class="step-number">1</view><view><text>联系专属代理人</text><text>获取店铺邀请与入驻协助</text></view></view>
        <view class="step-line" />
        <view class="step"><view class="step-number">2</view><view><text>扫码开户注册</text><text>填写商家基本资料</text></view></view>
        <view class="step-line" />
        <view class="step"><view class="step-number">3</view><view><text>平台审核开通</text><text>审核通过后即可登录</text></view></view>
      </view>

      <button class="primary-button" @tap="goScan"><text class="scan-symbol">⌁</text>扫描代理人二维码注册开店</button>
      <button class="secondary-button" @tap="goContact">暂未联系代理人？查看联系方式</button>
      <text class="footer-copy">注册申请提交后，代理人将协助您完成入驻审核</text>
    </view>
  </view>
</template>

<script setup>
function goBack() { uni.navigateBack() }
function goScan() { uni.navigateTo({ url: '/pages/auth/merchant-scan' }) }
function goContact() { uni.navigateTo({ url: '/pages/auth/merchant-contact' }) }
</script>

<style lang="scss" scoped>
.guide-page { min-height: 100vh; background: #f7fbf9; color: #193c32; }.topbar { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.topbar view, .back { width: 60rpx; }.back { color: #0f9d7a; font-size: 64rpx; line-height: 1; }.content { padding: 26rpx 52rpx calc(58rpx + env(safe-area-inset-bottom)); text-align: center; }.hero-card { position: relative; display: flex; align-items: center; justify-content: center; height: 250rpx; overflow: hidden; border-radius: 38rpx; background: linear-gradient(135deg, #d9f8ee, #bceede); }.hero-logo { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; width: 116rpx; height: 116rpx; border-radius: 34rpx; background: linear-gradient(135deg, #079a75, #36c8a2); color: #fff; font-size: 66rpx; font-weight: 800; box-shadow: 0 16rpx 38rpx rgba(13, 142, 108, .26); }.hero-glow { position: absolute; width: 280rpx; height: 280rpx; border: 42rpx solid rgba(255, 255, 255, .38); border-radius: 50%; transform: rotate(25deg); }.title, .copy, .step text, .footer-copy { display: block; }.title { margin-top: 48rpx; color: #163a30; font-size: 39rpx; font-weight: 760; }.copy { margin-top: 15rpx; color: #78968d; font-size: 25rpx; }.steps { margin: 46rpx 0 40rpx; padding: 30rpx; border-radius: 25rpx; background: #fff; text-align: left; box-shadow: 0 15rpx 42rpx rgba(24, 78, 63, .06); }.step { display: flex; align-items: center; gap: 20rpx; }.step-number { display: flex; flex: none; align-items: center; justify-content: center; width: 44rpx; height: 44rpx; border-radius: 50%; background: #dff7ee; color: #0c9873; font-size: 23rpx; font-weight: 750; }.step text:first-child { color: #27483e; font-size: 26rpx; font-weight: 700; }.step text:last-child { margin-top: 6rpx; color: #8aa198; font-size: 21rpx; }.step-line { width: 2rpx; height: 22rpx; margin: 7rpx 0 7rpx 21rpx; background: #c8e9de; }.primary-button, .secondary-button { width: 100%; border-radius: 17rpx; font-size: 27rpx; font-weight: 650; }.primary-button { background: #0f9d7a; color: #fff; line-height: 92rpx; box-shadow: 0 12rpx 26rpx rgba(15, 157, 122, .2); }.primary-button::after, .secondary-button::after { border: 0; }.scan-symbol { margin-right: 11rpx; font-size: 37rpx; }.secondary-button { margin-top: 20rpx; border: 1rpx solid #bbe8da; background: #fff; color: #23735e; line-height: 88rpx; }.footer-copy { margin-top: 29rpx; color: #9aaea7; font-size: 20rpx; }
</style>
