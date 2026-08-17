<template>
  <view class="page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><view><text>订单列表</text><text>{{ filteredOrders.length }} 笔订单</text></view><view class="placeholder"/></view>
    <scroll-view scroll-x class="filters"><view class="filter-row"><text v-for="item in filters" :key="item.key" :class="{ active: filter===item.key }" @tap="filter=item.key">{{ item.label }}</text></view></scroll-view>
    <view class="content">
      <view v-for="order in filteredOrders" :key="order.id" class="order" @tap="selectedOrder=order">
        <view class="row"><text class="name">{{ order.packageName }}</text><text class="status" :class="order.status">{{ statusMeta(order).label }}</text><text class="pill">桌号 {{ order.table }}</text><text class="pill">{{ order.time }}</text></view>
        <view class="row bottom"><view><text>卡券码</text><text>{{ formatCode(order.voucherCode) }}</text></view><text class="amount">¥{{ order.amount.toFixed(2) }}</text><text class="arrow">›</text></view>
      </view>
      <view v-if="!filteredOrders.length" class="empty"><text>暂无该状态订单</text><text>切换其他筛选条件查看</text></view>
    </view>
    <merchant-tabbar active="verify"/>
    <merchant-order-detail :order="selectedOrder" @close="selectedOrder=null" @verify="confirmVerification"/>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MerchantOrderDetail from '../../components/merchant-order-detail.vue'
import MerchantTabbar from '../../components/merchant-tabbar.vue'
import { orderStatusMeta, useMerchantVerification } from '../../composables/use-merchant-verification'
import { enforcePortal } from '../../core/route-guard'
const { orders, verifyOrder }=useMerchantVerification()
const filter=ref('all'),selectedOrder=ref(null)
const filters=[{key:'all',label:'全部订单'},{key:'pending',label:'待核销'},{key:'expired',label:'已超时'},{key:'verified',label:'已核销'}]
const filteredOrders=computed(()=>filter.value==='all'?orders.value:orders.value.filter(item=>item.status===filter.value))
onLoad(()=>enforcePortal('merchant'))
function statusMeta(order){return orderStatusMeta[order.status]||orderStatusMeta.pending}
function formatCode(code){return String(code).replace(/(\d{4})(?=\d)/g,'$1 ')}
function goBack(){uni.navigateBack()}
function confirmVerification(order){uni.showModal({title:'确认核销',content:`确认核销“${order.packageName}”吗？`,confirmText:'确认核销',success:({confirm})=>{if(!confirm)return;const result=verifyOrder(order.id);selectedOrder.value=result.order||null;uni.showToast({title:result.message,icon:result.ok?'success':'none'})}})}
</script>

<style lang="scss" scoped>
.page{min-height:100vh;padding-bottom:calc(120rpx + env(safe-area-inset-bottom));background:#f5f8f7;color:#183b32}.topbar{display:flex;align-items:center;justify-content:space-between;padding:calc(32rpx + env(safe-area-inset-top)) 29rpx 22rpx;background:#fff}.back,.placeholder{width:60rpx}.back{color:#177b60;font-size:56rpx}.topbar>view:nth-child(2){text-align:center}.topbar>view:nth-child(2) text{display:block}.topbar>view:nth-child(2) text:first-child{font-size:30rpx;font-weight:800}.topbar>view:nth-child(2) text:last-child{margin-top:4rpx;color:#94a29d;font-size:18rpx}.filters{width:100%;border-bottom:1rpx solid #e4ebe8;background:#fff;white-space:nowrap}.filter-row{display:flex;gap:18rpx;padding:15rpx 28rpx 20rpx}.filter-row text{display:inline-flex;padding:13rpx 22rpx;border:1rpx solid #dae4e0;border-radius:22rpx;color:#63776f;font-size:20rpx}.filter-row text.active{border-color:#a7ead5;background:#d9f8ee;color:#087d5c;font-weight:700}.content{max-width:700rpx;margin:0 auto;padding:23rpx 28rpx}.order{margin-bottom:17rpx;padding:23rpx;border:1rpx solid #dfe7e4;border-radius:20rpx;background:#fff;box-shadow:0 8rpx 24rpx rgba(19,63,51,.04)}.row{display:flex;align-items:center;gap:9rpx}.name{max-width:245rpx;overflow:hidden;font-size:23rpx;font-weight:800;white-space:nowrap}.status,.pill{padding:6rpx 11rpx;border-radius:12rpx;font-size:16rpx}.status.pending{background:#d8f7e5;color:#147e5b}.status.verified{background:#fff6aa;color:#796400}.status.expired{background:#ffdedb;color:#c83e39}.pill{border:1rpx solid #d8e0dd;color:#60736c}.bottom{margin-top:23rpx}.bottom>view{flex:1}.bottom>view text{display:block}.bottom>view text:first-child{color:#98a49f;font-size:17rpx}.bottom>view text:last-child{margin-top:5rpx;color:#364f47;font-family:monospace;font-size:23rpx;font-weight:750}.amount{font-size:29rpx;font-weight:850}.arrow{margin-left:8rpx;color:#83938e;font-size:43rpx}.empty{padding:120rpx 20rpx;text-align:center}.empty text{display:block;color:#82938d;font-size:23rpx}.empty text:last-child{margin-top:10rpx;color:#a5afac;font-size:19rpx}
</style>
