<template>
  <view class="merchant-page">
    <view class="content">
      <view class="header"><view><text class="title">我的商家</text><text class="count">共 {{ merchants.length }} 家</text></view><view class="head-icon">店</view></view>
      <view class="search"><text class="search-icon">⌕</text><input v-model="keyword" placeholder="搜索商家名称" placeholder-class="placeholder" /><text v-if="keyword" class="clear" @tap="keyword = ''">×</text></view>
      <scroll-view class="tabs" scroll-x :show-scrollbar="false"><view v-for="item in filters" :key="item.key" class="tab" :class="{ active: activeFilter === item.key }" @tap="activeFilter = item.key">{{ item.name }}</view></scroll-view>
      <view v-if="filteredMerchants.length" class="merchant-list"><view v-for="item in filteredMerchants" :key="item.id" class="merchant-card" @tap="openDetail(item)"><view class="card-top"><view><text class="merchant-name">{{ item.name }}</text><text class="joined">入驻时间：{{ item.joinedAt }}</text></view><text class="status" :class="item.status">{{ getStatusName(item.status) }}</text></view><view class="card-divider" /><view class="card-bottom"><text :class="{ 'offline-reason': item.status === 'offline' }">{{ getCardHint(item) }}</text><view class="card-chevron" /></view></view></view>
      <view v-else class="empty"><text class="empty-icon">⌕</text><text>未找到相关商家</text><text class="empty-copy">试试更换搜索关键词或状态筛选</text></view>
    </view>
    <view class="invite-bar"><button @tap="goInvite"><text>＋</text> 邀请商家入驻</button></view>
    <agent-tabbar active="merchants" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AgentTabbar from '../../components/agent-tabbar.vue'
import { enforcePortal } from '../../core/route-guard'

const keyword = ref('')
const activeFilter = ref('all')
const filters = [{ key: 'all', name: '全部' }, { key: 'online', name: '已上线' }, { key: 'pending', name: '审核中' }, { key: 'offline', name: '已下线' }]
const merchants = [
  { id: 1, name: '瑞幸咖啡（大宁店）', status: 'online', joinedAt: '2023-08-15', income: '¥12,450.00', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  { id: 2, name: '好利来（长宁路店）', status: 'pending', joinedAt: '2024-01-10', materials: '待审核资料 1 份', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  { id: 3, name: '喜茶（静安寺店）', status: 'online', joinedAt: '2023-05-22', income: '¥28,900.00', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  { id: 4, name: '全家便利店（陆家嘴店）', status: 'online', joinedAt: '2023-02-14', income: '¥15,320.00', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  { id: 5, name: '捞王（合生汇店）', status: 'offline', joinedAt: '2023-11-30', reason: '由于欠费自动暂停服务', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' }
]
const filteredMerchants = computed(() => merchants.filter((item) => (activeFilter.value === 'all' || item.status === activeFilter.value) && item.name.includes(keyword.value.trim())))
onMounted(() => enforcePortal('agent'))
function getStatusName(status) { return ({ online: '已上线', pending: '审核中', offline: '已下线' })[status] }
function getCardHint(item) { return item.status === 'online' ? `上月收益：${item.income}` : item.status === 'pending' ? item.materials : item.reason }
function openDetail(item) { uni.navigateTo({ url: `/pages/agent/merchant-detail?id=${item.id}` }) }
function goInvite() { uni.navigateTo({ url: '/pages/agent/invite' }) }
</script>

<style lang="scss" scoped>
.merchant-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.content { padding: calc(42rpx + env(safe-area-inset-top)) 34rpx 240rpx; }.header { display: flex; align-items: center; justify-content: space-between; }.title, .count, .merchant-name, .joined { display: block; }.title { font-size: 38rpx; font-weight: 760; }.count { margin-top: 8rpx; color: #929cad; font-size: 21rpx; }.head-icon { display: flex; align-items: center; justify-content: center; width: 70rpx; height: 70rpx; border-radius: 22rpx; background: #e4e7ff; color: #5966f3; font-size: 26rpx; font-weight: 700; }.search { display: flex; align-items: center; margin-top: 34rpx; padding: 0 23rpx; border-radius: 17rpx; background: #fff; box-shadow: 0 10rpx 26rpx rgba(34,42,70,.04); }.search-icon { color: #8c97aa; font-size: 36rpx; }.search input { flex: 1; height: 82rpx; padding: 0 17rpx; color: #303c56; font-size: 25rpx; }.placeholder { color: #adb5c2; }.clear { color: #9ba5b5; font-size: 36rpx; }.tabs { display: flex; width: 100%; margin: 28rpx 0 23rpx; white-space: nowrap; }.tab { display: inline-flex; align-items: center; justify-content: center; min-width: 110rpx; height: 58rpx; margin-right: 15rpx; padding: 0 20rpx; border: 1rpx solid #e1e5ee; border-radius: 30rpx; color: #7e899c; font-size: 23rpx; box-sizing: border-box; }.tab.active { border-color: #5966f3; background: #5966f3; color: #fff; font-weight: 650; }.merchant-card { margin-bottom: 17rpx; padding: 27rpx 25rpx 22rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34,42,70,.045); }.card-top { display: flex; justify-content: space-between; gap: 18rpx; }.merchant-name { overflow: hidden; font-size: 28rpx; font-weight: 720; text-overflow: ellipsis; white-space: nowrap; }.joined { margin-top: 12rpx; color: #94a0b2; font-size: 21rpx; }.status { flex: none; min-width: 84rpx; padding: 8rpx 10rpx; border-radius: 9rpx; text-align: center; font-size: 21rpx; line-height: 1; }.status.online { background: #d9f6df; color: #25844a; }.status.pending { background: #fff5bf; color: #9b7902; }.status.offline { background: #e7e9ee; color: #6f7785; }.card-divider { height: 1rpx; margin: 22rpx 0 17rpx; background: #eff1f5; }.card-bottom { display: flex; align-items: center; justify-content: space-between; color: #7f899a; font-size: 22rpx; }.offline-reason { color: #e06464; }.card-chevron { width: 15rpx; height: 15rpx; border-top: 3rpx solid #8e98aa; border-right: 3rpx solid #8e98aa; transform: rotate(45deg); box-sizing: border-box; }.empty { display: flex; flex-direction: column; align-items: center; padding-top: 220rpx; color: #8791a3; font-size: 27rpx; }.empty-icon { margin-bottom: 22rpx; color: #c2c9d7; font-size: 68rpx; }.empty-copy { margin-top: 14rpx; color: #abb3c1; font-size: 21rpx; }.invite-bar { position: fixed; right: 0; bottom: calc(108rpx + env(safe-area-inset-bottom)); left: 0; z-index: 9; padding: 20rpx 34rpx; background: linear-gradient(to top, #f7f8fc 70%, rgba(247,248,252,0)); }.invite-bar button { border: 0; border-radius: 16rpx; background: #5966f3; color: #fff; font-size: 27rpx; font-weight: 650; line-height: 88rpx; box-shadow: 0 13rpx 28rpx rgba(89,102,243,.23); }.invite-bar button::after { border: 0; }.invite-bar button text { margin-right: 5rpx; font-size: 33rpx; }
</style>
