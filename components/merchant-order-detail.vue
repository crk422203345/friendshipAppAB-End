<template>
  <view v-if="order" class="mask" @tap="$emit('close')">
    <view class="sheet" @tap.stop>
      <view class="handle" />
      <view class="sheet-head"><view><text class="receipt">▤</text><text>订单详情</text></view><text class="close" @tap="$emit('close')">×</text></view>
      <scroll-view scroll-y class="sheet-scroll">
        <view class="summary"><view><text>{{ order.packageName }}</text><text>订单号 {{ order.id }}</text></view><view><text class="status" :class="order.status">{{ meta.label }}</text><text class="amount">¥{{ order.amount }}</text></view></view>
        <text class="section-label">顾客联系信息</text>
        <view class="info-card"><view><text>顾客姓名</text><text>{{ order.customer }}</text></view><view><text>用餐桌号</text><text class="table">{{ order.table }} 桌</text></view><view><text>联系电话</text><text>{{ order.phone }}</text></view></view>
        <text class="section-label">套餐内含菜品明细</text>
        <view class="info-card menu"><view v-for="item in order.items" :key="item.name"><text>{{ item.name }}</text><text>x{{ item.quantity }}</text><text>¥{{ item.price }}</text></view></view>
        <text class="section-label">券码凭证信息</text>
        <view class="info-card"><view><text>下单时间</text><text>{{ order.time }}</text></view><view @tap="copyCode"><text>券码卡券号</text><text class="voucher">{{ spacedCode }}</text></view></view>
      </scroll-view>
      <view class="actions"><button v-if="order.status === 'pending'" class="cancel" @tap="$emit('close')">取消</button><button v-if="order.status === 'pending' || order.status === 'expired'" class="confirm" @tap="$emit('verify', order)">确认核销此单</button><button v-if="order.status === 'expired'" class="cancel" @tap="$emit('close')">关闭</button><button v-if="order.status === 'verified'" class="confirm full" @tap="$emit('close')">关闭</button></view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { orderStatusMeta } from '../composables/use-merchant-verification'
const props = defineProps({ order: { type: Object, default: null } })
defineEmits(['close', 'verify'])
const meta = computed(() => orderStatusMeta[props.order?.status] || orderStatusMeta.pending)
const spacedCode = computed(() => String(props.order?.voucherCode || '').replace(/(\d{4})(?=\d)/g, '$1 '))
function copyCode() { uni.setClipboardData({ data: props.order.voucherCode, success: () => uni.showToast({ title: '券码已复制', icon: 'success' }) }) }
</script>

<style lang="scss" scoped>
.mask{position:fixed;z-index:50;inset:0;display:flex;align-items:flex-end;background:rgba(13,38,31,.48)}.sheet{width:100%;max-height:88vh;padding-top:14rpx;border-radius:32rpx 32rpx 0 0;background:#fff;box-sizing:border-box}.handle{width:70rpx;height:7rpx;margin:0 auto 13rpx;border-radius:7rpx;background:#d9e0dd}.sheet-head{display:flex;align-items:center;justify-content:space-between;padding:15rpx 31rpx 24rpx;border-bottom:1rpx solid #edf1ef;color:#193d33;font-size:29rpx;font-weight:800}.sheet-head>view{display:flex;align-items:center;gap:12rpx}.receipt{color:#0b9871;font-size:34rpx}.close{padding:0 8rpx;color:#8b9a95;font-size:46rpx;font-weight:300}.sheet-scroll{height:calc(88vh - 215rpx);padding:25rpx 30rpx;box-sizing:border-box}.summary{display:flex;align-items:center;justify-content:space-between;padding:27rpx;border-radius:22rpx;background:linear-gradient(135deg,#eefaf6,#f7fbfa)}.summary text{display:block}.summary>view:first-child text:first-child{color:#24483e;font-size:27rpx;font-weight:800}.summary>view:first-child text:last-child{margin-top:8rpx;color:#91a09b;font-size:18rpx}.summary>view:last-child{text-align:right}.status{display:inline-block!important;padding:7rpx 14rpx;border-radius:15rpx;font-size:18rpx}.status.pending{background:#d9f8e6;color:#19825f}.status.verified{background:#fff7ad;color:#846d00}.status.expired{background:#ffe0de;color:#c94540}.amount{margin-top:10rpx;color:#088760;font-size:28rpx;font-weight:800}.section-label{display:block;margin:30rpx 4rpx 13rpx;color:#7e938b;font-size:20rpx;font-weight:700}.info-card{padding:19rpx 23rpx;border-radius:18rpx;background:#f7f9f8}.info-card>view{display:flex;align-items:center;justify-content:space-between;min-height:52rpx;color:#294a41;font-size:22rpx}.info-card>view>text:first-child{color:#8a9c95}.table{padding:5rpx 13rpx;border-radius:12rpx;background:#e1f4ed;color:#16785e}.menu>view{border-bottom:1rpx solid #e8edeb}.menu>view:last-child{border:0}.menu>view>text:first-child{flex:1;color:#294a41}.menu>view>text:nth-child(2){width:65rpx;color:#8c9b96}.voucher{padding:8rpx 15rpx;border:1rpx solid #cfe5dd;border-radius:10rpx;background:#edf8f4;color:#087e5b;font-family:monospace;font-size:26rpx;font-weight:800;letter-spacing:2rpx}.actions{display:flex;gap:15rpx;padding:18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom));border-top:1rpx solid #edf1ef;background:#fff}.actions button{flex:1;border-radius:15rpx;font-size:24rpx;line-height:83rpx}.actions button::after{border:0}.cancel{border:1rpx solid #dce5e1;background:#fff;color:#5e726b}.confirm{background:#0b9b72;color:#fff}.confirm.full{flex-basis:100%}
.sheet{display:flex;flex-direction:column;height:calc(100vh - 105rpx - env(safe-area-inset-top));max-height:calc(100vh - 105rpx - env(safe-area-inset-top));overflow:hidden}
.handle,.sheet-head{flex:none}
.sheet-scroll{flex:1;width:100%;height:auto;min-height:0;padding-bottom:36rpx}
.actions{position:relative;z-index:2;flex:none;padding:20rpx 28rpx calc(30rpx + env(safe-area-inset-bottom));box-shadow:0 -10rpx 28rpx rgba(20,62,50,.06)}
.actions button{height:84rpx;margin:0;line-height:82rpx;box-sizing:border-box}
</style>
