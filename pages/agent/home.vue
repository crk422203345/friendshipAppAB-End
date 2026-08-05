<template>
  <view class="agent-page">
    <view class="page-content">
      <view class="topbar"><view class="user" @tap="go('/pages/agent/profile')"><view class="avatar">{{ firstLetter }}</view><view><text class="greeting">{{ greeting }}，{{ session.user?.name || '张三' }}</text><text class="agent-id">ID：AG10086</text></view></view><view class="bell" @tap="go('/pages/agent/notifications')"><view class="bell-icon"><view class="bell-dome" /><view class="bell-clapper" /></view><i v-if="hasUnread" /></view></view>
      <view class="metric-grid"><view class="metric"><text class="metric-value">5</text><text class="metric-label">已绑定商家</text></view><view class="metric income"><text class="metric-value">¥3,702</text><text class="metric-label">本月预估佣金</text></view></view>
      <view class="commission-note">佣金基于您邀请的商家交易情况自动计算，实际到账金额以结算后最终数据为准。</view>
      <view class="section-heading"><text class="section-title">快捷操作</text></view>
      <view class="quick-grid"><view v-for="item in quickActions" :key="item.name" class="quick" @tap="go(item.path)"><text class="quick-icon">{{ item.icon }}</text><text>{{ item.name }}</text></view></view>
      <view class="section-heading"><text class="section-title">平台公告</text><view class="all" @tap="go('/pages/agent/announcements')"><text>全部</text><view class="all-chevron" /></view></view>
      <view class="notice-list"><view v-for="item in notices" :key="item.id" class="notice" @tap="go(`/pages/agent/article-detail?type=notice&id=${item.id}`)"><view class="notice-dot" /><text class="notice-title">{{ item.title }}</text><text class="notice-date">{{ item.date }}</text></view></view>
    </view>
    <agent-tabbar active="home" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AgentTabbar from '../../components/agent-tabbar.vue'
import { enforcePortal } from '../../core/route-guard'
import { session } from '../../core/session'
const nowHour = new Date().getHours()
const greeting = computed(() => nowHour < 12 ? '上午好' : nowHour < 18 ? '下午好' : '晚上好')
const firstLetter = computed(() => (session.user?.name || '张').slice(0, 1))
const hasUnread = ref(true)
const quickActions = [{ icon: '♙', name: '邀请商家', path: '/pages/agent/invite' }, { icon: '▤', name: '收益明细', path: '/pages/agent/income' }, { icon: '⌁', name: '推广话术', path: '/pages/agent/scripts' }]
const notices = [{ id: 1, title: '单笔佣金调整通知（7月）', date: '07.20' }, { id: 2, title: '月度结算已到账', date: '07.15' }]
onMounted(() => enforcePortal('agent'))
function go(path) { if (path.includes('notifications')) hasUnread.value = false; uni.navigateTo({ url: path }) }
</script>

<style lang="scss" scoped>
.agent-page { min-height: 100vh; background: #f7f8fc; color: #1d2741; }.page-content { padding: calc(46rpx + env(safe-area-inset-top)) 34rpx 154rpx; }.topbar, .user { display: flex; align-items: center; }.topbar { justify-content: space-between; }.user { gap: 18rpx; }.avatar { display: flex; align-items: center; justify-content: center; width: 78rpx; height: 78rpx; border-radius: 50%; background: linear-gradient(145deg, #dce1ff, #b9c0ff); color: #5865f2; font-size: 31rpx; font-weight: 750; }.greeting, .agent-id, .metric-value, .metric-label, .commission-note, .section-title { display: block; }.greeting { font-size: 30rpx; font-weight: 730; }.agent-id { margin-top: 7rpx; color: #9aa3b4; font-size: 20rpx; }.bell { position: relative; display: flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 8rpx 26rpx rgba(33,43,74,.06); }.bell-icon { position: relative; width: 34rpx; height: 40rpx; }.bell-dome { position: absolute; top: 3rpx; left: 6rpx; width: 22rpx; height: 27rpx; border: 3rpx solid #283653; border-bottom: 0; border-radius: 15rpx 15rpx 8rpx 8rpx; box-sizing: border-box; }.bell-dome::after { position: absolute; bottom: -4rpx; left: -5rpx; width: 26rpx; height: 3rpx; border-radius: 4rpx; background: #283653; content: ''; }.bell-clapper { position: absolute; bottom: 3rpx; left: 13rpx; width: 8rpx; height: 8rpx; border-radius: 50%; background: #283653; }.bell i { position: absolute; top: 15rpx; right: 16rpx; width: 12rpx; height: 12rpx; border: 2rpx solid #fff; border-radius: 50%; background: #ff5a7a; }.metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18rpx; margin-top: 40rpx; }.metric { padding: 32rpx 22rpx; border-radius: 24rpx; background: #fff; box-shadow: 0 12rpx 33rpx rgba(33,43,74,.05); }.income { background: linear-gradient(135deg, #5966f3, #7d88ff); }.metric-value { color: #1f2b48; font-size: 48rpx; font-weight: 760; }.income .metric-value { color: #fff; }.metric-label { margin-top: 12rpx; color: #7d889b; font-size: 22rpx; }.income .metric-label { color: #e2e5ff; }.commission-note { margin-top: 17rpx; padding: 20rpx 24rpx; border-radius: 16rpx; background: #eef0ff; color: #6f79a4; font-size: 21rpx; line-height: 1.55; }.section-heading { display: flex; justify-content: space-between; align-items: center; margin: 42rpx 2rpx 20rpx; }.section-title { font-size: 30rpx; font-weight: 750; }.all { display: flex; align-items: center; gap: 10rpx; min-width: 80rpx; min-height: 46rpx; color: #8791a5; font-size: 22rpx; }.all-chevron { width: 15rpx; height: 15rpx; border-top: 3rpx solid #69758b; border-right: 3rpx solid #69758b; transform: rotate(45deg); box-sizing: border-box; }.quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; }.quick { display: flex; flex-direction: column; align-items: center; gap: 13rpx; padding: 27rpx 10rpx; border-radius: 22rpx; background: #fff; color: #4b5670; font-size: 22rpx; box-shadow: 0 10rpx 25rpx rgba(34,42,70,.05); }.quick-icon { display: flex; align-items: center; justify-content: center; width: 56rpx; height: 56rpx; border-radius: 18rpx; background: #eef0ff; color: #5865f2; font-size: 32rpx; }.notice-list { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 25rpx rgba(34,42,70,.05); }.notice { display: flex; align-items: center; gap: 14rpx; min-height: 88rpx; padding: 0 22rpx; border-bottom: 1rpx solid #f0f1f5; }.notice:last-child { border: 0; }.notice-dot { width: 10rpx; height: 10rpx; border-radius: 50%; background: #5865f2; }.notice-title { flex: 1; overflow: hidden; color: #3b4660; font-size: 24rpx; text-overflow: ellipsis; white-space: nowrap; }.notice-date { color: #a3aaba; font-size: 20rpx; }
</style>
