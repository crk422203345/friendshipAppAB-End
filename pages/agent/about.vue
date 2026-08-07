<template>
  <view class="about-page">
    <page-nav title="关于我们" />
    <view class="content">
      <view class="brand"><image src="/static/logo.png" mode="aspectFit" /><text>Friendship</text><text>让合作更简单</text><text>Version 1.0.0</text></view>
      <menu-list :items="items" @select="handle" />
      <text class="copyright">© 2026 Friendship · All rights reserved</text>
    </view>
  </view>
</template>

<script setup>
import PageNav from '../../components/page-nav.vue'
import MenuList from '../../components/menu-list.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
const items = [{ name: '检查版本更新', action: 'version' }, { name: '服务协议', action: 'service' }, { name: '隐私政策', action: 'privacy' }, { name: '官方网站', action: 'website' }]
usePortalGuard('agent')
function handle(item) {
  const { action } = item
  if (action === 'version') { uni.showToast({ title: '当前已是最新版本', icon: 'none' }); return }
  if (action === 'website') { uni.setClipboardData({ data: 'https://friendship.example.com', success: () => uni.showToast({ title: '官网地址已复制', icon: 'success' }) }); return }
  uni.showModal({ title: action === 'service' ? '服务协议' : '隐私政策', content: '相关内容将在正式服务上线后提供，请以平台最新公示为准。', showCancel: false })
}
</script>

<style lang="scss" scoped>
.about-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 56rpx 34rpx; }.brand { display: flex; flex-direction: column; align-items: center; }.brand image { width: 120rpx; height: 120rpx; border-radius: 30rpx; box-shadow: 0 13rpx 30rpx rgba(55, 67, 143, .12); }.brand text { display: block; margin-top: 21rpx; color: #2c3854; font-size: 34rpx; font-weight: 760; }.brand text:nth-child(3) { margin-top: 7rpx; color: #8b96a8; font-size: 23rpx; font-weight: 400; }.brand text:last-child { margin-top: 15rpx; color: #a1a9b7; font-size: 21rpx; font-weight: 400; }.menu-card { overflow: hidden; margin-top: 60rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34, 42, 70, .045); }.menu-row { display: flex; align-items: center; min-height: 102rpx; padding: 0 27rpx; border-bottom: 1rpx solid #eef0f5; font-size: 26rpx; }.menu-row:last-child { border: 0; }.chevron { width: 15rpx; height: 15rpx; margin-left: auto; border-top: 3rpx solid #a0a9b9; border-right: 3rpx solid #a0a9b9; transform: rotate(45deg); box-sizing: border-box; }.copyright { display: block; margin-top: 53rpx; color: #a5adba; text-align: center; font-size: 20rpx; }
</style>
