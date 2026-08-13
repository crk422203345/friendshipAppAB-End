<template>
  <view class="profile-page">
    <view class="page-content">
      <text class="page-title">我的</text>

      <view class="user-card" @tap="go('/pages/agent/profile-detail')">
        <image v-if="profile.avatar" class="avatar-image" :src="profile.avatar" mode="aspectFill" />
        <view v-else class="avatar">{{ first }}</view>
        <view class="user-info"><text class="user-name">{{ profile.name || '—' }}</text><text>代理人 ID：{{ profile.agentNo || '—' }}</text><text>{{ profile.email || '—' }}</text></view>
        <view class="chevron" />
      </view>

      <view class="section-label">帮助与指南</view>
      <menu-list :items="guideMenus" @select="go" />

      <view class="section-label">设置</view>
      <menu-list :items="settingMenus" @select="go" />

      <button class="logout" :loading="loggingOut" :disabled="loggingOut" @tap="confirmLogout">退出登录</button>
    </view>
    <agent-tabbar active="profile" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AgentTabbar from '../../components/agent-tabbar.vue'
import MenuList from '../../components/menu-list.vue'
import { enforcePortal } from '../../core/route-guard'
import { openPage } from '../../core/navigation'
import { clearSession, session, updateSessionUser } from '../../core/session'
import { getCurrentAccount, unwrap } from '../../services/agent'
import { logout } from '../../services/auth'

const guideMenus = [
  { name: '常见问题', icon: '?', path: '/pages/agent/faq' },
  { name: '平台规则', icon: '◈', path: '/pages/agent/platform-rules' },
  { name: '操作教程', icon: '◇', path: '/pages/agent/tutorials' }
]
const settingMenus = [
  { name: '修改密码', icon: '↻', path: '/pages/agent/change-password' },
  { name: '关于我们', icon: 'i', path: '/pages/agent/about' }
]
const remoteProfile = ref(null)
const loggingOut = ref(false)
const profile = computed(() => remoteProfile.value || {
  name: session.user?.name || '',
  agentNo: session.user?.agentId || session.user?.agent_no || '',
  email: session.user?.email || session.user?.username || '',
  avatar: session.user?.avatar || session.user?.avatar_url || ''
})
const first = computed(() => String(profile.value.name || '?').slice(0, 1))

onShow(() => { if (enforcePortal('agent')) loadProfile() })

async function loadProfile() {
  try {
    const data = unwrap(await getCurrentAccount()) || {}
    const agent = data.agent || data.account?.agent || {}
    const user = data.user || data.account?.user || {}
    remoteProfile.value = {
      name: agent.name || '',
      agentNo: agent.agent_no || agent.agentNo || '',
      email: agent.email || user.email || user.username || '',
      avatar: agent.avatar_url || agent.avatarUrl || agent.avatar || ''
    }
    updateSessionUser({
      ...agent,
      name: remoteProfile.value.name,
      agentId: remoteProfile.value.agentNo,
      email: remoteProfile.value.email,
      avatar: remoteProfile.value.avatar
    })
  } catch (error) {
    if (!session.user) uni.showToast({ title: error.message || '个人资料加载失败', icon: 'none' })
  }
}

function go(item) { openPage(item) }
function confirmLogout() {
  uni.showModal({
    title: '确认退出登录？',
    content: '退出后需要重新登录才能继续使用。',
    confirmText: '退出登录',
    success: ({ confirm }) => { if (confirm) performLogout() }
  })
}

async function performLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try { await logout() } catch { /* 服务端会话失效时仍需清除本地登录状态。 */ }
  clearSession()
  uni.reLaunch({ url: '/pages/auth/login?portal=agent' })
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.page-content { padding: calc(42rpx + env(safe-area-inset-top)) 34rpx 166rpx; }.page-title { display: block; font-size: 38rpx; font-weight: 760; }.user-card { display: flex; align-items: center; margin-top: 39rpx; padding: 27rpx; border-radius: 26rpx; background: linear-gradient(135deg, #fff, #f2f3ff); box-shadow: 0 14rpx 35rpx rgba(35, 45, 76, .06); }.avatar, .avatar-image { flex: none; width: 94rpx; height: 94rpx; border-radius: 50%; }.avatar { display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #dce1ff, #b9c0ff); color: #5865f2; font-size: 36rpx; font-weight: 750; }.user-info { min-width: 0; margin-left: 20rpx; }.user-info text { display: block; overflow: hidden; color: #8994a7; font-size: 21rpx; line-height: 1.55; text-overflow: ellipsis; white-space: nowrap; }.user-info .user-name { margin-bottom: 4rpx; color: #27314a; font-size: 31rpx; font-weight: 750; }.chevron { flex: none; width: 15rpx; height: 15rpx; margin-left: auto; border-top: 3rpx solid #a0a9b9; border-right: 3rpx solid #a0a9b9; transform: rotate(45deg); box-sizing: border-box; }.section-label { margin: 39rpx 2rpx 17rpx; color: #7d879a; font-size: 23rpx; font-weight: 650; }.menu-card { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34, 42, 70, .045); }.menu-row { display: flex; align-items: center; min-height: 102rpx; padding: 0 26rpx; border-bottom: 1rpx solid #eff1f5; font-size: 27rpx; }.menu-row:last-child { border: 0; }.menu-icon { display: flex; align-items: center; justify-content: center; width: 47rpx; height: 47rpx; margin-right: 17rpx; border-radius: 15rpx; background: #eef0ff; color: #5865f2; font-size: 27rpx; font-weight: 750; }.logout { width: 100%; margin-top: 44rpx; border: 1rpx solid #d9dfea; border-radius: 17rpx; background: #fff; color: #5865f2; font-size: 27rpx; font-weight: 650; line-height: 88rpx; }.logout::after { border: 0; }
</style>
