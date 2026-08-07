<template>
  <view class="profile-page">
    <view class="page-content">
      <text class="page-title">我的</text>

      <view class="user-card" @tap="go('/pages/agent/profile-detail')">
        <image v-if="session.user?.avatar" class="avatar-image" :src="session.user.avatar" mode="aspectFill" />
        <view v-else class="avatar">{{ first }}</view>
        <view class="user-info"><text class="user-name">{{ session.user?.name || '张三' }}</text><text>代理人 ID：{{ session.user?.agentId || 'AG10086' }}</text><text>{{ session.user?.email || '12121212@qq.com' }}</text></view>
        <view class="chevron" />
      </view>

      <view class="section-label">帮助与指南</view>
      <menu-list :items="guideMenus" @select="go" />

      <view class="section-label">设置</view>
      <menu-list :items="settingMenus" @select="go" />

      <button class="logout" @tap="confirmLogout">退出登录</button>
    </view>
    <agent-tabbar active="profile" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import AgentTabbar from '../../components/agent-tabbar.vue'
import MenuList from '../../components/menu-list.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { clearSession, session } from '../../core/session'

const guideMenus = [
  { name: '常见问题', icon: '?', path: '/pages/agent/faq' },
  { name: '平台规则', icon: '◈', path: '/pages/agent/platform-rules' },
  { name: '操作教程', icon: '◇', path: '/pages/agent/tutorials' }
]
const settingMenus = [
  { name: '修改密码', icon: '↻', path: '/pages/agent/change-password' },
  { name: '关于我们', icon: 'i', path: '/pages/agent/about' }
]
const first = computed(() => (session.user?.name || '张三').slice(0, 1))

usePortalGuard('agent')
function go(item) { uni.navigateTo({ url: typeof item === 'string' ? item : item.path }) }
function confirmLogout() {
  uni.showModal({
    title: '确认退出登录？',
    content: '退出后需要重新登录才能继续使用。',
    confirmText: '退出登录',
    success: ({ confirm }) => { if (confirm) { clearSession(); uni.reLaunch({ url: '/pages/auth/login?portal=agent' }) } }
  })
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.page-content { padding: calc(42rpx + env(safe-area-inset-top)) 34rpx 166rpx; }.page-title { display: block; font-size: 38rpx; font-weight: 760; }.user-card { display: flex; align-items: center; margin-top: 39rpx; padding: 27rpx; border-radius: 26rpx; background: linear-gradient(135deg, #fff, #f2f3ff); box-shadow: 0 14rpx 35rpx rgba(35, 45, 76, .06); }.avatar, .avatar-image { flex: none; width: 94rpx; height: 94rpx; border-radius: 50%; }.avatar { display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #dce1ff, #b9c0ff); color: #5865f2; font-size: 36rpx; font-weight: 750; }.user-info { min-width: 0; margin-left: 20rpx; }.user-info text { display: block; overflow: hidden; color: #8994a7; font-size: 21rpx; line-height: 1.55; text-overflow: ellipsis; white-space: nowrap; }.user-info .user-name { margin-bottom: 4rpx; color: #27314a; font-size: 31rpx; font-weight: 750; }.chevron { flex: none; width: 15rpx; height: 15rpx; margin-left: auto; border-top: 3rpx solid #a0a9b9; border-right: 3rpx solid #a0a9b9; transform: rotate(45deg); box-sizing: border-box; }.section-label { margin: 39rpx 2rpx 17rpx; color: #7d879a; font-size: 23rpx; font-weight: 650; }.menu-card { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34, 42, 70, .045); }.menu-row { display: flex; align-items: center; min-height: 102rpx; padding: 0 26rpx; border-bottom: 1rpx solid #eff1f5; font-size: 27rpx; }.menu-row:last-child { border: 0; }.menu-icon { display: flex; align-items: center; justify-content: center; width: 47rpx; height: 47rpx; margin-right: 17rpx; border-radius: 15rpx; background: #eef0ff; color: #5865f2; font-size: 27rpx; font-weight: 750; }.logout { width: 100%; margin-top: 44rpx; border: 1rpx solid #d9dfea; border-radius: 17rpx; background: #fff; color: #5865f2; font-size: 27rpx; font-weight: 650; line-height: 88rpx; }.logout::after { border: 0; }
</style>
