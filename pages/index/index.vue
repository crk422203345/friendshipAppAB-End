<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">UNI-APP FOUNDATION</text>
      <text class="title">{{ appProfile.name }}</text>
      <text class="copy">A、B、C 三端共享基础能力，各自保留独立的产品配置和业务流程。</text>
      <view class="build-badge">
        <text>当前构建档</text>
        <text class="build-code">{{ appProfile.code.toUpperCase() }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">已就绪的公共层</text>
      <view class="foundation-grid">
        <view v-for="item in foundations" :key="item.title" class="foundation-item">
          <text class="foundation-mark" :class="item.tone">{{ item.mark }}</text>
          <text class="foundation-title">{{ item.title }}</text>
          <text class="foundation-copy">{{ item.copy }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">应用构建档</text>
      <button
        v-for="profile in appProfiles"
        :key="profile.code"
        class="profile-row"
        :class="{ active: profile.code === appProfile.code }"
        @tap="showBuildHint(profile)"
      >
        <view class="profile-code" :style="{ backgroundColor: profile.themeColor }">{{ profile.code.toUpperCase() }}</view>
        <view class="profile-content">
          <text class="profile-name">{{ profile.name }}</text>
          <text class="profile-url">{{ profile.apiBaseUrl }}</text>
        </view>
        <text class="profile-state">{{ profile.code === appProfile.code ? '已选' : '构建' }}</text>
      </button>
    </view>

    <view class="notice">
      <text class="notice-title">发布前配置</text>
      <text class="notice-copy">在独立端工程中填写包名、签名、推送、支付和服务地址，再进行 Android/iOS 云打包。</text>
    </view>
  </view>
</template>

<script setup>
import { appProfile, appProfiles } from '../../config/app-profiles'

const foundations = [
  { mark: '核', title: 'Core', copy: '请求、会话与本地存储', tone: 'blue' },
  { mark: '服', title: 'Services', copy: '上传、运行时与权限接口', tone: 'green' },
  { mark: '配', title: 'Config', copy: 'A/B/C 构建档与环境入口', tone: 'orange' }
]

function showBuildHint(profile) {
  const command = profile.code === 'template' ? 'npm run build:app' : `npm run build:app:${profile.code}`
  uni.showToast({
    title: command,
    icon: 'none',
    duration: 2400
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
}

.hero {
  padding: 42rpx 36rpx;
  border-radius: 8rpx;
  background: #1e2933;
  color: #ffffff;
}

.eyebrow,
.title,
.copy,
.section-title,
.foundation-title,
.foundation-copy,
.profile-name,
.profile-url,
.notice-title,
.notice-copy {
  display: block;
}

.eyebrow {
  color: #9bc3ff;
  font-size: 22rpx;
  letter-spacing: 1rpx;
}

.title {
  margin-top: 14rpx;
  font-size: 42rpx;
  font-weight: 700;
}

.copy {
  margin-top: 16rpx;
  color: #c7d0d9;
  font-size: 27rpx;
  line-height: 1.65;
}

.build-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32rpx;
  padding-top: 22rpx;
  border-top: 1rpx solid #40505f;
  color: #c7d0d9;
  font-size: 24rpx;
}

.build-code {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
}

.section {
  margin-top: 40rpx;
}

.section-title {
  margin-bottom: 18rpx;
  color: #252f38;
  font-size: 30rpx;
  font-weight: 650;
}

.foundation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.foundation-item {
  min-height: 182rpx;
  padding: 24rpx 20rpx;
  border: 1rpx solid #e2e7eb;
  border-radius: 8rpx;
  background: #ffffff;
  box-sizing: border-box;
}

.foundation-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 54rpx;
  border-radius: 6rpx;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.blue { background: #246bce; }
.green { background: #2f855a; }
.orange { background: #b45f06; }

.foundation-title {
  margin-top: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.foundation-copy {
  margin-top: 6rpx;
  color: #7a838c;
  font-size: 21rpx;
  line-height: 1.45;
}

.profile-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 112rpx;
  margin: 0 0 14rpx;
  padding: 18rpx 22rpx;
  border: 1rpx solid #e0e5e9;
  border-radius: 8rpx;
  background: #ffffff;
  box-sizing: border-box;
  text-align: left;
}

.profile-row.active {
  border-color: #246bce;
}

.profile-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 6rpx;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 700;
}

.profile-content {
  flex: 1;
  min-width: 0;
  margin-left: 18rpx;
}

.profile-name {
  color: #29333d;
  font-size: 27rpx;
  font-weight: 600;
}

.profile-url {
  margin-top: 5rpx;
  overflow: hidden;
  color: #8a929a;
  font-size: 21rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-state {
  color: #246bce;
  font-size: 24rpx;
}

.notice {
  margin-top: 30rpx;
  padding: 26rpx 28rpx;
  border-left: 6rpx solid #b45f06;
  background: #ffffff;
}

.notice-title {
  color: #313a43;
  font-size: 27rpx;
  font-weight: 600;
}

.notice-copy {
  margin-top: 8rpx;
  color: #727c85;
  font-size: 23rpx;
  line-height: 1.6;
}
</style>
