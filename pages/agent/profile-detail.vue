<template>
  <view class="detail-page">
    <page-nav title="个人资料" />
    <view class="content">
      <view class="avatar-panel">
        <image v-if="profile.avatar" class="avatar-image" :src="profile.avatar" mode="aspectFill" />
        <view v-else class="avatar">{{ first }}</view>
        <text>账户头像</text>
      </view>
      <view class="info-card">
        <view v-for="item in details" :key="item.label" class="info-row"><text>{{ item.label }}</text><text class="value" :class="{ copyable: item.copyable }" @tap="copy(item)">{{ item.value }}</text></view>
      </view>
      <text class="tip">账户资料已与服务端同步，如需修改请联系平台客服。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import PageNav from '../../components/page-nav.vue'
import { enforcePortal } from '../../core/route-guard'
import { session, updateSessionUser } from '../../core/session'
import { getCurrentAccount, unwrap } from '../../services/agent'

const profile = ref({ name: '', agentNo: '', email: '', phone: '', avatar: '' })
const first = computed(() => String(profile.value.name || '?').slice(0, 1))
const details = computed(() => [
  { label: '姓名', value: profile.value.name || '—' },
  { label: 'ID', value: profile.value.agentNo || '—', copyable: Boolean(profile.value.agentNo) },
  { label: '邮箱', value: profile.value.email || '—', copyable: Boolean(profile.value.email) },
  { label: '手机号', value: profile.value.phone || '暂未绑定' }
])
onShow(() => { if (enforcePortal('agent')) loadProfile() })

async function loadProfile() {
  try {
    const data = unwrap(await getCurrentAccount()) || {}
    const agent = data.agent || data.account?.agent || {}
    const user = data.user || data.account?.user || {}
    profile.value = {
      name: agent.name || '',
      agentNo: agent.agent_no || agent.agentNo || '',
      email: agent.email || user.email || user.username || '',
      phone: agent.phone || '',
      avatar: agent.avatar_url || agent.avatarUrl || agent.avatar || ''
    }
    updateSessionUser({ ...agent, name: profile.value.name, agentId: profile.value.agentNo, email: profile.value.email, phone: profile.value.phone, avatar: profile.value.avatar })
  } catch (error) {
    profile.value = {
      name: session.user?.name || '',
      agentNo: session.user?.agentId || session.user?.agent_no || '',
      email: session.user?.email || session.user?.username || '',
      phone: session.user?.phone || '',
      avatar: session.user?.avatar || session.user?.avatar_url || ''
    }
    uni.showToast({ title: error.message || '个人资料加载失败', icon: 'none' })
  }
}
function copy(item) { if (item.copyable) uni.setClipboardData({ data: item.value, success: () => uni.showToast({ title: '已复制', icon: 'success' }) }) }
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 38rpx 34rpx; }.avatar-panel { display: flex; flex-direction: column; align-items: center; padding: 38rpx; border-radius: 26rpx; background: #fff; }.avatar, .avatar-image { width: 148rpx; height: 148rpx; border-radius: 50%; }.avatar { display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #dce1ff, #b9c0ff); color: #5865f2; font-size: 54rpx; font-weight: 750; }.avatar-panel > text { margin-top: 19rpx; color: #7f8ba0; font-size: 23rpx; }.info-card { overflow: hidden; margin-top: 26rpx; border-radius: 22rpx; background: #fff; }.info-row { display: flex; align-items: center; justify-content: space-between; min-height: 101rpx; padding: 0 27rpx; border-bottom: 1rpx solid #eef0f5; font-size: 26rpx; }.info-row:last-child { border: 0; }.value { max-width: 440rpx; overflow: hidden; color: #7d899d; text-align: right; text-overflow: ellipsis; white-space: nowrap; }.copyable { color: #5966f3; }.tip { display: block; margin-top: 23rpx; color: #a1a9b7; text-align: center; font-size: 20rpx; }
</style>
