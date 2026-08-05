<template>
  <view class="detail-page">
    <view class="nav"><text class="back" @tap="back">‹</text><text class="nav-title">商家详情</text><view /></view>
    <scroll-view scroll-y class="scroll"><view class="body"><view class="heading"><view><text class="name">{{ merchant.name }}</text><text class="status" :class="merchant.status">{{ statusName }}</text></view><text class="id">商家编号 M{{ merchant.id }}000{{ merchant.id }}</text></view>
      <view class="info-card"><view class="info"><text class="info-icon">⌖</text><text>{{ merchant.address }}</text></view><view class="info"><text class="info-icon">◷</text><text>工作时间：{{ merchant.hours }}</text></view><view class="info clickable" @tap="callMerchant"><text class="info-icon">◔</text><text>联系商家：{{ merchant.phone }}</text></view></view>
      <view v-if="merchant.status === 'online'" class="metrics"><view><b>¥12,340.00</b><text>本月收益</text></view><view><b>128单</b><text>本月核销</text></view></view>
      <view v-else class="state-card" :class="merchant.status"><text class="state-icon">{{ merchant.status === 'pending' ? '◌' : '!' }}</text><view><b>{{ merchant.status === 'pending' ? '正在审核中' : '商家已暂停服务' }}</b><text>{{ merchant.status === 'pending' ? '资料审核完成后将自动上线' : '请协助商家恢复上线服务' }}</text></view></view>
      <view class="map-card" @tap="openLocation"><view class="map-lines"><i /><i /><i /></view><view class="pin"><view /> </view><text>商家注册地址</text></view><button class="location-button" @tap="openLocation">去到这里</button>
      <button v-if="merchant.status !== 'offline'" class="contract-button" @tap="showContract">查看商家签约合同</button><button v-else class="restore-button" @tap="restoreMerchant">协助商家恢复上线</button>
    </view></scroll-view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { enforcePortal } from '../../core/route-guard'
const id = ref(1)
const data = {
  1: { id: 1, name: '瑞幸咖啡（大宁店）', status: 'online', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  2: { id: 2, name: '好利来（长宁路店）', status: 'pending', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  3: { id: 3, name: '喜茶（静安寺店）', status: 'online', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  4: { id: 4, name: '全家便利店（陆家嘴店）', status: 'online', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' },
  5: { id: 5, name: '捞王（合生汇店）', status: 'offline', address: '深圳市南山区粤海街道科技园社区科技路9号金融服务技术创业基地1栋602', phone: '13718888888', hours: '09:00 - 18:00' }
}
onLoad((options) => { id.value = Number(options?.id) || 1 })
onMounted(() => enforcePortal('agent'))
const merchant = computed(() => data[id.value] || data[1])
const statusName = computed(() => ({ online: '已上线', pending: '审核中', offline: '已下线' })[merchant.value.status])
function back() { uni.navigateBack() }
function callMerchant() { uni.makePhoneCall({ phoneNumber: merchant.value.phone }) }
function openLocation() { uni.openLocation({ latitude: 22.5431, longitude: 114.0579, name: merchant.value.name, address: merchant.value.address }) }
function showContract() { uni.showToast({ title: '合同预览待接入', icon: 'none' }) }
function restoreMerchant() { uni.showToast({ title: '已发起恢复上线协助', icon: 'success' }) }
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(102rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; border-bottom: 1rpx solid #e9ecf2; background: #fff; box-sizing: border-box; }.back { width: 60rpx; color: #5966f3; font-size: 60rpx; line-height: 1; }.nav-title { font-size: 30rpx; font-weight: 720; }.nav view { width: 60rpx; }.scroll { height: calc(100vh - 102rpx - env(safe-area-inset-top)); }.body { padding: 34rpx 34rpx 70rpx; }.heading { display: flex; align-items: flex-start; justify-content: space-between; }.heading > view { display: flex; align-items: center; gap: 14rpx; min-width: 0; }.name { overflow: hidden; font-size: 35rpx; font-weight: 760; text-overflow: ellipsis; white-space: nowrap; }.id { margin-top: 11rpx; color: #9da6b5; font-size: 20rpx; }.status { flex: none; padding: 8rpx 11rpx; border-radius: 9rpx; font-size: 21rpx; line-height: 1; }.status.online { background: #d9f6df; color: #25844a; }.status.pending { background: #fff5bf; color: #9b7902; }.status.offline { background: #e7e9ee; color: #6f7785; }.info-card { margin-top: 31rpx; padding: 27rpx; border-radius: 23rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34,42,70,.04); }.info { display: flex; align-items: flex-start; gap: 16rpx; padding: 10rpx 0; color: #647088; font-size: 23rpx; line-height: 1.45; }.info-icon { flex: none; color: #5966f3; font-size: 32rpx; line-height: .9; }.clickable { color: #4d5c78; }.metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 17rpx; margin-top: 24rpx; }.metrics view { padding: 27rpx 20rpx; border-radius: 20rpx; background: #eef0ff; text-align: center; }.metrics b, .metrics text, .state-card b, .state-card text { display: block; }.metrics b { color: #5260ed; font-size: 29rpx; }.metrics text { margin-top: 10rpx; color: #7984a4; font-size: 21rpx; }.state-card { display: flex; align-items: center; gap: 18rpx; margin-top: 24rpx; padding: 25rpx; border-radius: 20rpx; }.state-card.pending { background: #fff9db; }.state-card.offline { background: #f1f2f5; }.state-icon { display: flex; align-items: center; justify-content: center; width: 50rpx; height: 50rpx; border-radius: 16rpx; background: #fff0a1; color: #907004; font-size: 30rpx; font-weight: 700; }.offline .state-icon { background: #e0e3e9; color: #687181; }.state-card b { font-size: 25rpx; }.state-card text { margin-top: 7rpx; color: #818a9a; font-size: 21rpx; }.map-card { position: relative; display: flex; align-items: center; justify-content: center; height: 330rpx; margin-top: 27rpx; overflow: hidden; border-radius: 23rpx; background: #e4e9e6; color: #738078; font-size: 23rpx; }.map-lines { position: absolute; inset: 0; transform: rotate(-19deg); }.map-lines i { position: absolute; display: block; width: 160%; height: 18rpx; background: rgba(255,255,255,.7); }.map-lines i:nth-child(1) { top: 70rpx; left: -100rpx; }.map-lines i:nth-child(2) { top: 175rpx; left: -60rpx; }.map-lines i:nth-child(3) { top: 275rpx; left: -140rpx; }.pin { position: relative; z-index: 1; width: 52rpx; height: 52rpx; border-radius: 50% 50% 50% 0; background: #5966f3; transform: rotate(-45deg); box-shadow: 0 7rpx 13rpx rgba(65,77,170,.2); }.pin view { position: absolute; top: 15rpx; left: 15rpx; width: 22rpx; height: 22rpx; border-radius: 50%; background: #fff; }.map-card > text { position: absolute; bottom: 22rpx; left: 25rpx; z-index: 1; padding: 8rpx 13rpx; border-radius: 9rpx; background: rgba(255,255,255,.86); color: #68746e; font-size: 20rpx; }.location-button { display: block; width: 226rpx; margin: 25rpx auto 0; border: 1rpx solid #cbd2df; border-radius: 15rpx; background: #fff; color: #536078; font-size: 25rpx; line-height: 76rpx; }.location-button::after, .contract-button::after, .restore-button::after { border: 0; }.contract-button, .restore-button { width: 100%; margin-top: 34rpx; border-radius: 16rpx; font-size: 26rpx; line-height: 86rpx; }.contract-button { border: 1rpx solid #c9d0df; background: #fff; color: #536078; }.restore-button { border: 0; background: #5966f3; color: #fff; }
</style>
