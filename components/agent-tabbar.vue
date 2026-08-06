<template>
  <view class="tabbar">
    <view v-for="item in items" :key="item.path" class="tab" :class="{ active: active === item.key }" @tap="navigate(item.path)">
      <text class="tab-icon iconfont" :class="iconClass(item.key)" /><text>{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({ active: { type: String, default: 'home' } })
const items = [
  { key: 'home', name: '首页', icon: '▦', path: '/pages/agent/home' },
  { key: 'merchants', name: '我的商家', icon: '▤', path: '/pages/agent/merchants' },
  { key: 'income', name: '我的收益', icon: '◉', path: '/pages/agent/income' },
  { key: 'profile', name: '我的', icon: '◡', path: '/pages/agent/profile' }
]
const iconClasses = {
  home: 'icon-shouyechangguishouye-copy-copy',
  merchants: 'icon-shangjia',
  income: 'icon-shouyi',
  profile: 'icon-wode'
}
function iconClass(key) { return iconClasses[key] }
function navigate(path) { uni.reLaunch({ url: path }) }
</script>

<style lang="scss" scoped>
.tabbar { position: fixed; right: 0; bottom: 0; left: 0; z-index: 10; display: flex; height: calc(108rpx + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom); border-top: 1rpx solid #eef0f6; background: rgba(255,255,255,.97); box-sizing: border-box; }.tab { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 5rpx; color: #8993a7; font-size: 20rpx; }.tab-icon { font-size: 34rpx; line-height: 1; }.tab.active { color: #5865f2; font-weight: 650; }
</style>
