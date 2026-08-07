<template>
  <view class="detail-page">
    <view class="nav"><text class="back" @tap="back">‹</text><text>个人资料</text><view /></view>
    <view class="content">
      <view class="avatar-panel" @tap="chooseAvatar">
        <image v-if="session.user?.avatar" class="avatar-image" :src="session.user.avatar" mode="aspectFill" />
        <view v-else class="avatar">{{ first }}</view>
        <text>点击更换头像</text>
      </view>
      <view class="info-card">
        <view v-for="item in details" :key="item.label" class="info-row"><text>{{ item.label }}</text><text class="value" :class="{ copyable: item.copyable }" @tap="copy(item)">{{ item.value }}</text></view>
      </view>
      <text class="tip">头像仅保存在当前设备的演示会话中。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { session, updateSessionUser } from '../../core/session'

const first = computed(() => (session.user?.name || '张三').slice(0, 1))
const details = computed(() => [
  { label: '姓名', value: session.user?.name || '张三' },
  { label: 'ID', value: session.user?.agentId || 'AG10086', copyable: true },
  { label: '邮箱', value: session.user?.email || '12121212@qq.com', copyable: true },
  { label: '手机号', value: session.user?.phone || '暂未绑定' }
])
onMounted(() => enforcePortal('agent'))
function back() { uni.navigateBack() }
function copy(item) { if (item.copyable) uni.setClipboardData({ data: item.value, success: () => uni.showToast({ title: '已复制', icon: 'success' }) }) }
function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths, tempFiles }) => {
      const size = tempFiles?.[0]?.size || 0
      if (size > 5 * 1024 * 1024) { uni.showToast({ title: '图片不能超过 5MB', icon: 'none' }); return }
      updateSessionUser({ avatar: tempFilePaths[0] })
      uni.showToast({ title: '头像更新成功', icon: 'success' })
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 38rpx 34rpx; }.avatar-panel { display: flex; flex-direction: column; align-items: center; padding: 38rpx; border-radius: 26rpx; background: #fff; }.avatar, .avatar-image { width: 148rpx; height: 148rpx; border-radius: 50%; }.avatar { display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #dce1ff, #b9c0ff); color: #5865f2; font-size: 54rpx; font-weight: 750; }.avatar-panel > text { margin-top: 19rpx; color: #7f8ba0; font-size: 23rpx; }.info-card { overflow: hidden; margin-top: 26rpx; border-radius: 22rpx; background: #fff; }.info-row { display: flex; align-items: center; justify-content: space-between; min-height: 101rpx; padding: 0 27rpx; border-bottom: 1rpx solid #eef0f5; font-size: 26rpx; }.info-row:last-child { border: 0; }.value { max-width: 440rpx; overflow: hidden; color: #7d899d; text-align: right; text-overflow: ellipsis; white-space: nowrap; }.copyable { color: #5966f3; }.tip { display: block; margin-top: 23rpx; color: #a1a9b7; text-align: center; font-size: 20rpx; }
</style>
