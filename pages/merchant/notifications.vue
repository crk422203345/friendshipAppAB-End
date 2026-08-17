<template>
  <view class="page"><view class="topbar"><text @tap="goBack">‹</text><text>消息通知</text><text class="read" @tap="readAll">全部已读</text></view><view class="content"><view v-for="item in notifications" :key="item.id" class="notice"><view class="notice-icon">▣<text v-if="item.unread"/></view><view><text>{{ item.title }}</text><text>{{ item.copy }}</text><text>{{ item.time }}</text></view></view></view></view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { useMerchantVerification } from '../../composables/use-merchant-verification'
import { enforcePortal } from '../../core/route-guard'
const {notifications,markNotificationsRead}=useMerchantVerification()
onLoad(()=>enforcePortal('merchant'))
function goBack(){uni.navigateBack()} function readAll(){markNotificationsRead();uni.showToast({title:'已全部标记为已读',icon:'success'})}
</script>
<style lang="scss" scoped>
.page{min-height:100vh;background:#f5f8f7;color:#183b32}.topbar{display:flex;align-items:center;justify-content:space-between;padding:calc(35rpx + env(safe-area-inset-top)) 29rpx 24rpx;background:#fff}.topbar>text:first-child{width:70rpx;color:#177b60;font-size:56rpx;line-height:1}.topbar>text:nth-child(2){font-size:30rpx;font-weight:800}.read{width:120rpx;color:#0b9270;text-align:right;font-size:19rpx}.content{max-width:700rpx;margin:0 auto;padding:24rpx 28rpx}.notice{display:flex;gap:18rpx;margin-bottom:16rpx;padding:25rpx;border-radius:20rpx;background:#fff}.notice-icon{position:relative;display:flex;flex:none;align-items:center;justify-content:center;width:62rpx;height:62rpx;border-radius:18rpx;background:#def7ee;color:#0b9270;font-size:28rpx}.notice-icon>text{position:absolute;top:-3rpx;right:-3rpx;width:13rpx;height:13rpx;border:3rpx solid #fff;border-radius:50%;background:#eb5b54}.notice>view:last-child{flex:1}.notice>view:last-child text{display:block}.notice>view:last-child text:first-child{font-size:24rpx;font-weight:750}.notice>view:last-child text:nth-child(2){margin-top:7rpx;color:#71867e;font-size:20rpx;line-height:1.5}.notice>view:last-child text:last-child{margin-top:8rpx;color:#a2aeaa;font-size:17rpx}
</style>
