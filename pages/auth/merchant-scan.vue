<template>
  <view class="scan-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>扫一扫</text><view /></view>
    <view class="scan-content">
      <view class="scanner-frame">
        <view class="corner top-left" /><view class="corner top-right" /><view class="corner bottom-left" /><view class="corner bottom-right" />
        <view class="scan-line" />
        <view class="scanner-copy"><text>请扫描代理人开店二维码</text><text>二维码将用于识别专属邀请关系</text></view>
      </view>
      <button class="scan-button" @tap="startScan">打开相机扫码</button>
      <text class="hint">请将二维码放入取景框内</text>
    </view>
  </view>
</template>

<script setup>
import { parseInvitationCode } from '../../core/invitation.mjs'

function goBack() { uni.navigateBack() }
function startScan() {
  // #ifdef H5
  uni.showModal({
    title: '当前环境不支持直接扫码',
    content: '请使用 App 或微信小程序打开扫一扫。',
    showCancel: false
  })
  return
  // #endif

  uni.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode'],
    success: ({ result }) => {
      const inviteCode = parseInvitationCode(result)
      if (!inviteCode) {
        uni.showToast({ title: '无效的开店邀请二维码', icon: 'none' })
        return
      }
      uni.setStorageSync('merchant-pending-invite', inviteCode)
      uni.showToast({ title: '已识别开店邀请', icon: 'success' })
      setTimeout(goBack, 700)
    },
    fail: (error) => { if (!String(error.errMsg || '').includes('cancel')) uni.showToast({ title: '未能识别二维码，请重试', icon: 'none' }) }
  })
}

</script>

<style lang="scss" scoped>
.scan-page { min-height: 100vh; background: #132e28; color: #fff; }.topbar { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 31rpx; font-weight: 700; }.topbar view, .back { width: 60rpx; }.back { font-size: 64rpx; line-height: 1; }.scan-content { display: flex; flex-direction: column; align-items: center; padding: 86rpx 52rpx; }.scanner-frame { position: relative; width: 590rpx; height: 590rpx; overflow: hidden; background: rgba(255, 255, 255, .06); }.corner { position: absolute; z-index: 2; width: 72rpx; height: 72rpx; border-color: #44d4ad; border-style: solid; }.top-left { top: 0; left: 0; border-width: 7rpx 0 0 7rpx; }.top-right { top: 0; right: 0; border-width: 7rpx 7rpx 0 0; }.bottom-left { bottom: 0; left: 0; border-width: 0 0 7rpx 7rpx; }.bottom-right { right: 0; bottom: 0; border-width: 0 7rpx 7rpx 0; }.scan-line { position: absolute; top: 0; right: 30rpx; left: 30rpx; height: 3rpx; background: #55e0ba; box-shadow: 0 0 18rpx #55e0ba; animation: scanning 2.3s ease-in-out infinite; }.scanner-copy { position: absolute; right: 0; bottom: 205rpx; left: 0; text-align: center; }.scanner-copy text { display: block; font-size: 28rpx; }.scanner-copy text:last-child { margin-top: 14rpx; color: rgba(255,255,255,.56); font-size: 21rpx; }.scan-button { width: 100%; margin-top: 70rpx; border-radius: 16rpx; background: #11a982; color: #fff; font-size: 28rpx; line-height: 91rpx; }.scan-button::after { border: 0; }.hint { margin-top: 25rpx; color: rgba(255,255,255,.54); font-size: 22rpx; }@keyframes scanning { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(550rpx); } }
</style>
