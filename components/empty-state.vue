<template>
  <view class="empty-state">
    <view v-if="icon" class="empty-icon">{{ icon }}</view>
    <text>{{ title }}</text>
    <text v-if="description" class="empty-copy">{{ description }}</text>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '暂无内容' },
  description: { type: String, default: '' }
})
</script>

<style scoped>
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 160rpx 30rpx; color: #707c91; font-size: 28rpx; }.empty-icon { display: flex; align-items: center; justify-content: center; width: 92rpx; height: 92rpx; margin-bottom: 25rpx; border-radius: 30rpx; background: #e8ebff; color: #6571ed; font-size: 46rpx; font-weight: 750; }.empty-copy { margin-top: 13rpx; color: #a0a8b7; font-size: 22rpx; }
</style>
