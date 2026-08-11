<template>
  <view class="nav">
    <text class="back" @tap="goBack">‹</text>
    <text>{{ title }}</text>
    <view><slot name="right" /></view>
  </view>
</template>

<script setup>
import { getPortalHome } from '../config/portals'
import { session } from '../core/session'

const props = defineProps({
  title: { type: String, required: true },
  fallbackUrl: { type: String, default: '' }
})

function goBack() {
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  if (pages.length > 1) {
    uni.navigateBack()
    return
  }
  const fallbackUrl = props.fallbackUrl || (session.token ? getPortalHome(session.portal) : '/pages/auth/login')
  uni.reLaunch({ url: fallbackUrl })
}
</script>

<style scoped>
.nav { display: flex; align-items: center; justify-content: space-between; min-height: 88rpx; padding: 0 32rpx; background: #fff; box-sizing: border-box; color: #28334c; font-size: 30rpx; font-weight: 720; }
.nav view, .back { width: 60rpx; }.back { color: #5966f3; font-size: 60rpx; line-height: 1; }
</style>
