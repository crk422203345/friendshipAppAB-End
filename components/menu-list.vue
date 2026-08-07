<template>
  <view class="menu-card">
    <view v-for="item in items" :key="item.key || item.name" class="menu-row" @tap="$emit('select', item)">
      <view v-if="item.icon" class="menu-icon">{{ item.icon }}</view>
      <text>{{ item.name }}</text>
      <view v-if="item.detail" class="detail">{{ item.detail }}</view>
      <view v-if="item.showChevron !== false" class="chevron" />
    </view>
  </view>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
defineEmits(['select'])
</script>

<style scoped>
.menu-card { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34, 42, 70, .045); }.menu-row { display: flex; align-items: center; min-height: 102rpx; padding: 0 26rpx; border-bottom: 1rpx solid #eff1f5; color: #27314a; font-size: 27rpx; }.menu-row:last-child { border: 0; }.menu-icon { display: flex; align-items: center; justify-content: center; width: 47rpx; height: 47rpx; margin-right: 17rpx; border-radius: 15rpx; background: #eef0ff; color: #5865f2; font-size: 27rpx; font-weight: 750; }.detail { margin-left: auto; color: #97a1b1; font-size: 22rpx; }.chevron { flex: none; width: 15rpx; height: 15rpx; margin-left: auto; border-top: 3rpx solid #a0a9b9; border-right: 3rpx solid #a0a9b9; transform: rotate(45deg); box-sizing: border-box; }.detail + .chevron { margin-left: 17rpx; }
</style>
