<template>
  <view class="contact-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>联系方式</text><view /></view>
    <view class="content">
      <view class="advisor"><view class="avatar">张</view><view><text class="name">张三</text><text class="role">深圳市南山区 · 商家代理人</text></view></view>
      <view class="contact-card"><text class="contact-label">微信 / 手机号</text><text class="contact-value">138 0000 8888</text><text class="copy-action" @tap="copyContact">复制联系方式</text></view>
      <view class="qr-panel" @longpress="copyContact"><view class="qr"><view v-for="item in qrCells" :key="item" class="qr-cell" :class="{ filled: isFilled(item) }" /></view></view>
      <text class="save-tip">长按二维码可复制代理人联系方式</text>
    </view>
  </view>
</template>

<script setup>
const qrCells = Array.from({ length: 441 }, (_, index) => index)
function isFilled(index) {
  const row = Math.floor(index / 21)
  const column = index % 21
  const marker = (row < 6 && column < 6) || (row < 6 && column > 14) || (row > 14 && column < 6)
  return marker || (index * 13 + row * 7) % 5 < 2
}
function goBack() { uni.navigateBack() }
function copyContact() { uni.setClipboardData({ data: '13800008888', success: () => uni.showToast({ title: '联系方式已复制', icon: 'success' }) }) }
</script>

<style lang="scss" scoped>
.contact-page { min-height: 100vh; background: #f7fbf9; color: #193c32; }.topbar { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.topbar view, .back { width: 60rpx; }.back { color: #0f9d7a; font-size: 64rpx; line-height: 1; }.content { padding: 45rpx 52rpx; }.advisor { display: flex; align-items: center; gap: 20rpx; }.avatar { display: flex; align-items: center; justify-content: center; width: 92rpx; height: 92rpx; border-radius: 50%; background: linear-gradient(135deg, #d7f4ea, #c0eadc); color: #168466; font-size: 35rpx; font-weight: 750; }.name, .role { display: block; }.name { color: #1e4137; font-size: 31rpx; font-weight: 750; }.role { margin-top: 10rpx; color: #7d998f; font-size: 22rpx; }.contact-card { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12rpx; margin-top: 39rpx; padding: 24rpx 27rpx; border-radius: 20rpx; background: #e8f8f2; }.contact-label { color: #72968a; font-size: 21rpx; }.contact-value { color: #245a4a; font-size: 29rpx; font-weight: 750; }.copy-action { grid-column: 1 / -1; color: #0d9874; font-size: 22rpx; }.qr-panel { display: flex; justify-content: center; margin-top: 70rpx; }.qr { display: grid; grid-template-columns: repeat(21, 1fr); width: 440rpx; height: 440rpx; padding: 24rpx; border-radius: 26rpx; background: #fff; box-shadow: 0 20rpx 55rpx rgba(22, 84, 65, .12); box-sizing: border-box; }.qr-cell { background: #fff; }.qr-cell.filled { background: #194739; }.save-tip { display: block; margin-top: 35rpx; color: #80998f; text-align: center; font-size: 23rpx; }
</style>
