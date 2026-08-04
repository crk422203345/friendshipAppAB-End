<template>
  <view class="onboarding-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>商家开店</text><view /></view>
    <view class="content">
      <view class="advisor"><view class="avatar">张</view><view><text class="name">张三</text><text class="role">深圳市南山区 · 商家代理人</text></view></view>
      <view class="qr-wrap"><view class="qr"><view v-for="item in qrCells" :key="item" class="qr-cell" :class="{ filled: item % 3 === 0 || item % 7 === 1 }" /></view></view>
      <text class="qr-title">扫码获取专属开店邀请</text>
      <text class="qr-copy">长按识别二维码，了解商家入驻流程和资料要求</text>
      <view class="notice"><text class="notice-dot">i</text><text>已有邀请链接？请在浏览器中打开链接完成入驻。</text></view>
    </view>
  </view>
</template>

<script setup>
const qrCells = Array.from({ length: 225 }, (_, index) => index)
function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.onboarding-page { min-height: 100vh; background: #f6fbf9; color: #173a30; }.topbar { display: flex; align-items: center; justify-content: space-between; height: calc(100rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 29rpx; font-weight: 650; }.topbar view, .back { width: 58rpx; }.back { color: #0f9d7a; font-size: 60rpx; line-height: 1; }.content { padding: 78rpx 54rpx; }.advisor { display: flex; align-items: center; gap: 22rpx; }.avatar { display: flex; align-items: center; justify-content: center; width: 84rpx; height: 84rpx; border-radius: 50%; background: #d7f2e9; color: #0f9d7a; font-size: 32rpx; font-weight: 700; }.name, .role, .qr-title, .qr-copy { display: block; }.name { color: #203c35; font-size: 30rpx; font-weight: 700; }.role { margin-top: 8rpx; color: #729187; font-size: 23rpx; }.qr-wrap { display: flex; justify-content: center; margin-top: 84rpx; }.qr { display: grid; grid-template-columns: repeat(15, 1fr); width: 440rpx; height: 440rpx; padding: 20rpx; border: 16rpx solid #fff; border-radius: 22rpx; background: #fff; box-shadow: 0 24rpx 60rpx rgba(20,85,65,.11); box-sizing: border-box; }.qr-cell { background: #fff; }.qr-cell.filled { background: #173a30; }.qr-title { margin-top: 52rpx; color: #163d32; text-align: center; font-size: 33rpx; font-weight: 700; }.qr-copy { margin-top: 17rpx; color: #719085; text-align: center; font-size: 24rpx; line-height: 1.6; }.notice { display: flex; gap: 14rpx; margin-top: 80rpx; padding: 23rpx; border-radius: 18rpx; background: #e5f6f0; color: #598176; font-size: 23rpx; line-height: 1.5; }.notice-dot { display: flex; flex: none; align-items: center; justify-content: center; width: 28rpx; height: 28rpx; margin-top: 3rpx; border-radius: 50%; background: #0f9d7a; color: #fff; font-size: 19rpx; }
</style>
