<template>
  <view class="tabbar">
    <view v-for="item in items" :key="item.key" class="tab" :class="{ active: active === item.key }" @tap="select(item)">
      <text class="icon iconfont" :class="item.iconClass" /><text>{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({ active: { type: String, default: 'verify' } })
const items = [
  { key: 'verify', label: '核销', iconClass: 'icon-a-22hexiaosaoma', path: '/pages/merchant/home' },
  { key: 'campaign', label: '活动', iconClass: 'icon-liwuhuodong', path: '/pages/merchant/activities' },
  { key: 'bill', label: '账单', iconClass: 'icon-wj-zd' },
  { key: 'manage', label: '管理', iconClass: 'icon-guanli1' }
]
function select(item) {
  if (item.path) { uni.reLaunch({ url: item.path }); return }
  uni.showToast({ title: `${item.label}功能即将开放`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.tabbar{position:fixed;z-index:20;right:0;bottom:0;left:0;display:flex;height:calc(104rpx + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);border-top:1rpx solid #e5ece9;background:rgba(255,255,255,.97);box-sizing:border-box;box-shadow:0 -8rpx 28rpx rgba(22,63,51,.04)}.tab{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:6rpx;color:#83918c;font-size:19rpx}.icon.iconfont{font-size:34rpx;line-height:1}.tab.active{color:#0b9971;font-weight:700}.tab.active .icon{display:flex;align-items:center;justify-content:center;width:56rpx;height:43rpx;border-radius:18rpx;background:#d9f8ee}
</style>
