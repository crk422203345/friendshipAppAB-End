<template>
  <view class="progress">
    <view v-for="(item, index) in steps" :key="item.label" class="step" :style="{ left: `${index * 25}%` }">
      <view class="step-head">
        <view class="dot" :class="{ active: index + 1 === current, done: index + 1 < current }">
          <text v-if="index + 1 < current" class="check">✓</text>
          <text v-else>{{ index + 1 }}</text>
        </view>
        <view v-if="index < steps.length - 1" class="line" :class="{ done: index + 1 < current }" />
      </view>
      <text class="label" :class="{ active: index + 1 === current }">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  current: { type: Number, default: 1 }
})

const steps = [
  { label: '基础资料' },
  { label: '资质认证' },
  { label: '收付签约' },
  { label: '审核结果' }
]
</script>

<style lang="scss" scoped>
.progress { position: relative; width: 640rpx; max-width: 100%; height: 154rpx; margin: 0 auto; overflow: visible; box-sizing: border-box; }
.step { position: absolute; top: 30rpx; width: 25%; min-width: 0; text-align: center; }
.step-head { position: relative; display: flex; justify-content: center; }
.dot { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; width: 54rpx; height: 54rpx; border: 8rpx solid #f4f7f6; border-radius: 50%; background: #e1e7e5; color: #7f8d88; font-size: 23rpx; font-weight: 750; box-sizing: content-box; }
.dot.active { border-color: #d9f7ee; background: #22b88c; color: #fff; box-shadow: 0 8rpx 18rpx rgba(34,184,140,.18); }
.dot.done { border-color: #e3faf3; background: #9cebd5; color: #0a7257; }
.check { font-size: 28rpx; font-weight: 900; }
.line { position: absolute; top: 26rpx; left: calc(50% + 30rpx); width: calc(100% - 60rpx); height: 4rpx; border-radius: 4rpx; background: #e4e9e7; }
.line.done { background: #9cebd5; }
.label { display: block; margin-top: 10rpx; overflow: visible; color: #93a09b; font-size: 20rpx; line-height: 30rpx; white-space: nowrap; }
.label.active { color: #176c57; font-weight: 700; }
</style>
