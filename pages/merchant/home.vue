<template>
  <view class="home-page merchant-home">
    <view class="top"><view><text class="greeting">你好，{{ session.user?.name || '商家' }}</text><text class="hint">店铺经营数据已为你准备好</text></view><view class="avatar">{{ firstLetter }}</view></view>
    <view class="hero"><text class="hero-label">MERCHANT CENTER</text><text class="hero-title">商家经营中心</text><text class="hero-copy">把握订单与门店动态，让生意稳步向前。</text><view class="hero-line"><text>今日待处理订单</text><text class="hero-number">8</text></view></view>
    <text class="section-title">商家服务</text><view class="grid"><view v-for="item in shortcuts" :key="item.name" class="shortcut" @tap="notify(item.name)"><text class="shortcut-icon">{{ item.icon }}</text><text>{{ item.name }}</text></view></view>
    <view class="account-row"><text>当前身份</text><text class="badge">商家端</text><text class="logout" @tap="logout">退出登录</text></view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { clearSession, session } from '../../core/session'
const shortcuts = [{ icon: '▣', name: '订单管理' }, { icon: '◉', name: '商品管理' }, { icon: '◐', name: '门店运营' }, { icon: '▥', name: '经营报表' }]
const firstLetter = computed(() => (session.user?.name || '商').slice(0, 1))
onMounted(() => enforcePortal('merchant'))
function notify(name) { uni.showToast({ title: `${name}功能待接入`, icon: 'none' }) }
function logout() { clearSession(); uni.reLaunch({ url: '/pages/auth/login?portal=merchant' }) }
</script>

<style lang="scss" scoped>
.home-page { min-height: 100vh; padding: calc(52rpx + env(safe-area-inset-top)) 34rpx 60rpx; background: #f6fbf9; box-sizing: border-box; color: #173a30; }.top { display: flex; justify-content: space-between; align-items: center; }.greeting, .hint, .hero-label, .hero-title, .hero-copy, .section-title { display: block; }.greeting { font-size: 38rpx; font-weight: 750; }.hint { margin-top: 10rpx; color: #78968d; font-size: 23rpx; }.avatar { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; border-radius: 50%; background: #d7f2e9; color: #0f9d7a; font-size: 30rpx; font-weight: 700; }.hero { margin-top: 50rpx; padding: 38rpx; border-radius: 30rpx; background: linear-gradient(135deg, #0f9d7a, #32be99); color: #fff; box-shadow: 0 20rpx 45rpx rgba(15,157,122,.23); }.hero-label { color: #d8fff2; font-size: 19rpx; font-weight: 700; letter-spacing: 2rpx; }.hero-title { margin-top: 18rpx; font-size: 41rpx; font-weight: 750; }.hero-copy { margin-top: 13rpx; color: #edfff9; font-size: 24rpx; }.hero-line { display: flex; justify-content: space-between; align-items: center; margin-top: 42rpx; padding-top: 25rpx; border-top: 1rpx solid rgba(255,255,255,.28); color: #dcfff4; font-size: 23rpx; }.hero-number { color: #fff; font-size: 38rpx; font-weight: 750; }.section-title { margin: 48rpx 0 24rpx; font-size: 31rpx; font-weight: 750; }.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; }.shortcut { padding: 29rpx; border-radius: 24rpx; background: #fff; color: #36584e; font-size: 26rpx; box-shadow: 0 12rpx 32rpx rgba(23,74,58,.05); }.shortcut-icon { display: block; margin-bottom: 20rpx; color: #0f9d7a; font-size: 39rpx; }.account-row { display: flex; align-items: center; gap: 16rpx; margin-top: 48rpx; padding: 28rpx; border-radius: 20rpx; background: #fff; color: #67847b; font-size: 24rpx; }.badge { padding: 7rpx 13rpx; border-radius: 10rpx; background: #e2f7ef; color: #0f9d7a; font-size: 21rpx; }.logout { margin-left: auto; color: #0f9d7a; }
</style>
