<template>
  <view class="home-page agent-home">
    <view class="top"><view><text class="greeting">早上好，{{ session.user?.name || '代理人' }}</text><text class="hint">今天也要把每一次连接做好</text></view><view class="avatar">{{ firstLetter }}</view></view>
    <view class="hero"><text class="hero-label">AGENT WORKSPACE</text><text class="hero-title">代理人工作台</text><text class="hero-copy">客户、商机与服务进度，在这里有序推进。</text><view class="hero-line"><text>本周新增线索</text><text class="hero-number">24</text></view></view>
    <text class="section-title">快捷工作</text><view class="grid"><view v-for="item in shortcuts" :key="item.name" class="shortcut" @tap="notify(item.name)"><text class="shortcut-icon">{{ item.icon }}</text><text>{{ item.name }}</text></view></view>
    <view class="account-row"><text>当前身份</text><text class="badge">代理人端</text><text class="logout" @tap="logout">退出登录</text></view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { clearSession, session } from '../../core/session'
const shortcuts = [{ icon: '◎', name: '客户管理' }, { icon: '◈', name: '商机跟进' }, { icon: '◌', name: '服务中心' }, { icon: '◫', name: '数据概览' }]
const firstLetter = computed(() => (session.user?.name || '代').slice(0, 1))
onMounted(() => enforcePortal('agent'))
function notify(name) { uni.showToast({ title: `${name}功能待接入`, icon: 'none' }) }
function logout() { clearSession(); uni.reLaunch({ url: '/pages/auth/login?portal=agent' }) }
</script>

<style lang="scss" scoped>
.home-page { min-height: 100vh; padding: calc(52rpx + env(safe-area-inset-top)) 34rpx 60rpx; background: #f7f8fc; box-sizing: border-box; color: #192440; }.top { display: flex; justify-content: space-between; align-items: center; }.greeting, .hint, .hero-label, .hero-title, .hero-copy, .section-title { display: block; }.greeting { font-size: 38rpx; font-weight: 750; }.hint { margin-top: 10rpx; color: #8390a7; font-size: 23rpx; }.avatar { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; border-radius: 50%; background: #dfe4ff; color: #5865f2; font-size: 30rpx; font-weight: 700; }.hero { margin-top: 50rpx; padding: 38rpx; border-radius: 30rpx; background: linear-gradient(135deg, #5865f2, #7d87fa); color: #fff; box-shadow: 0 20rpx 45rpx rgba(88,101,242,.24); }.hero-label { color: #d8dcff; font-size: 19rpx; font-weight: 700; letter-spacing: 2rpx; }.hero-title { margin-top: 18rpx; font-size: 41rpx; font-weight: 750; }.hero-copy { margin-top: 13rpx; color: #eef0ff; font-size: 24rpx; }.hero-line { display: flex; justify-content: space-between; align-items: center; margin-top: 42rpx; padding-top: 25rpx; border-top: 1rpx solid rgba(255,255,255,.26); color: #e4e7ff; font-size: 23rpx; }.hero-number { color: #fff; font-size: 38rpx; font-weight: 750; }.section-title { margin: 48rpx 0 24rpx; font-size: 31rpx; font-weight: 750; }.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; }.shortcut { padding: 29rpx; border-radius: 24rpx; background: #fff; color: #35415d; font-size: 26rpx; box-shadow: 0 12rpx 32rpx rgba(31,44,73,.05); }.shortcut-icon { display: block; margin-bottom: 20rpx; color: #5865f2; font-size: 39rpx; }.account-row { display: flex; align-items: center; gap: 16rpx; margin-top: 48rpx; padding: 28rpx; border-radius: 20rpx; background: #fff; color: #66738a; font-size: 24rpx; }.badge { padding: 7rpx 13rpx; border-radius: 10rpx; background: #e8eaff; color: #5865f2; font-size: 21rpx; }.logout { margin-left: auto; color: #5865f2; }
</style>
