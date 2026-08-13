<template>
  <view class="sub-page">
    <view class="nav"><text @tap="back">‹</text><b>消息通知</b><text v-if="hasUnread" class="read-all" @tap="readAll">{{ readAllPending ? '处理中…' : '全部已读' }}</text><view v-else /></view>
    <view v-if="notifications.length" class="notification-list"><view v-for="item in notifications" :key="item.id" class="notification-card" :class="{ unread: !item.read }" @tap="readNotification(item)"><view class="notification-dot" /><view class="notification-main"><view class="notification-heading"><b>{{ item.title }}</b><text>{{ item.time }}</text></view><text class="notification-content">{{ item.content }}</text></view></view></view>
    <view v-else-if="!loading" class="empty"><text>♧</text><b>暂无最新消息</b><text class="empty-copy">平台动态会第一时间通知你</text></view>
    <view v-else class="loading">消息加载中…</view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { getNotifications, listOf, markAllNotificationsRead, markNotificationRead } from '../../services/agent'

const notifications = ref([])
const loading = ref(false)
const readAllPending = ref(false)
const pendingIds = new Set()
const hasUnread = computed(() => notifications.value.some((item) => !item.read))

onMounted(() => { if (enforcePortal('agent')) loadNotifications() })
function normalizeNotification(item) {
  const occurredAt = item.published_at || item.publishedAt || item.created_at || item.createdAt || item.sent_at || item.sentAt || item.updated_at || ''
  return {
    id: item.notification_no || item.notificationNo || item.id,
    title: item.title || item.subject || '平台通知',
    content: item.content || item.message || item.summary || '',
    time: String(occurredAt).replace('T', ' ').slice(0, 16),
    read: item.status === 'read' || item.is_read === true || item.isRead === true
  }
}
async function loadNotifications() {
  loading.value = true
  try { notifications.value = listOf(await getNotifications({ status: 'all', page: 1, page_size: 50 })).map(normalizeNotification).filter((item) => item.id) } catch (error) { notifications.value = []; uni.showToast({ title: error.message || '消息加载失败', icon: 'none' }) } finally { loading.value = false }
}
async function readNotification(item) {
  if (item.read || pendingIds.has(item.id)) return
  pendingIds.add(item.id)
  try { await markNotificationRead(item.id); item.read = true } catch (error) { uni.showToast({ title: error.message || '标记已读失败', icon: 'none' }) } finally { pendingIds.delete(item.id) }
}
async function readAll() {
  if (readAllPending.value || !hasUnread.value) return
  readAllPending.value = true
  try { await markAllNotificationsRead(); notifications.value.forEach((item) => { item.read = true }); uni.showToast({ title: '已全部标记为已读', icon: 'success' }) } catch (error) { uni.showToast({ title: error.message || '操作失败', icon: 'none' }) } finally { readAllPending.value = false }
}
function back() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; justify-content: space-between; align-items: center; height: calc(102rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 30rpx; }.nav > text:first-child, .nav > view { width: 110rpx; color: #5865f2; font-size: 60rpx; line-height: 1; }.nav .read-all { width: 110rpx; color: #5865f2; text-align: right; font-size: 23rpx; }.notification-list { padding: 24rpx 32rpx 60rpx; }.notification-card { display: flex; gap: 17rpx; margin-bottom: 17rpx; padding: 25rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34,42,70,.04); }.notification-dot { flex: none; width: 12rpx; height: 12rpx; margin-top: 10rpx; border-radius: 50%; background: transparent; }.notification-card.unread .notification-dot { background: #5966f3; }.notification-main { min-width: 0; flex: 1; }.notification-heading { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }.notification-heading b { overflow: hidden; color: #2c3854; font-size: 27rpx; text-overflow: ellipsis; white-space: nowrap; }.notification-heading text { flex: none; color: #a0a8b7; font-size: 20rpx; }.notification-content { display: block; margin-top: 12rpx; color: #7d899d; font-size: 23rpx; line-height: 1.5; }.empty { display: flex; flex-direction: column; align-items: center; padding-top: 290rpx; }.empty > text:first-child { color: #cfd5e5; font-size: 72rpx; }.empty b { margin-top: 25rpx; font-size: 29rpx; }.empty .empty-copy { margin-top:12rpx;color: #98a2b4; font-size: 23rpx; }.loading { padding-top: 290rpx; color: #98a2b4; text-align: center; font-size: 26rpx; }
</style>
