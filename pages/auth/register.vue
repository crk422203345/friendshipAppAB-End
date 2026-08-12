<template>
  <view class="form-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>注册代理人账号</text><view /></view>
    <view class="content">
      <view class="brand-mark">F</view>
      <text class="title">创建你的账号</text>
      <text class="copy">注册成功后将进入代理人工作台</text>
      <view class="form-card">
        <view class="field"><text>邮箱</text><input v-model="email" placeholder="请输入邮箱地址" /></view>
        <view class="field"><text>设置密码</text><input v-model="password" password placeholder="至少 6 位" /></view>
        <view class="field code-field"><text>邮箱验证码</text><input v-model="code" maxlength="6" type="number" placeholder="6 位验证码" /><text class="code-button" @tap="sendCode">{{ countdown ? `${countdown}s` : '获取验证码' }}</text></view>
        <button class="primary-button" :loading="submitting" @tap="submit">注册并登录</button>
      </view>
      <text class="login-link" @tap="goBack">已有账号，去登录</text>
    </view>
  </view>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { registerAgent, sendEmailCode } from '../../services/auth'

const email = ref('')
const password = ref('')
const code = ref('')
const countdown = ref(0)
const submitting = ref(false)
let timer
onBeforeUnmount(() => clearInterval(timer))

async function sendCode() {
  if (countdown.value) return
  try {
    await sendEmailCode({ email: email.value, purpose: 'register', portal: 'agent' })
    countdown.value = 60
    timer = setInterval(() => { countdown.value -= 1; if (!countdown.value) clearInterval(timer) }, 1000)
    uni.showToast({ title: '验证码已发送，请注意查收', icon: 'none' })
  } catch (error) { uni.showToast({ title: error.message, icon: 'none' }) }
}

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    await registerAgent({ email: email.value, password: password.value, code: code.value })
    uni.showToast({ title: '注册成功，请登录', icon: 'success' })
    setTimeout(goBack, 800)
  } catch (error) { uni.showToast({ title: error.message, icon: 'none' }) } finally { submitting.value = false }
}
function goBack() { uni.redirectTo({ url: '/pages/auth/login?portal=agent' }) }
</script>

<style lang="scss" scoped>
.form-page { min-height: 100vh; background: #f7f8fc; color: #1a2340; }.topbar { display: flex; justify-content: space-between; align-items: center; height: calc(100rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; font-size: 29rpx; font-weight: 650; box-sizing: border-box; }.topbar view, .back { width: 58rpx; }.back { color: #5865f2; font-size: 60rpx; line-height: 1; }.content { padding: 62rpx 54rpx; }.brand-mark { display: flex; align-items: center; justify-content: center; width: 82rpx; height: 82rpx; border-radius: 26rpx; background: #5865f2; color: #fff; font-size: 43rpx; font-weight: 800; }.title, .copy { display: block; }.title { margin-top: 38rpx; font-size: 48rpx; font-weight: 750; }.copy { margin-top: 15rpx; color: #7d879b; font-size: 25rpx; }.form-card { margin-top: 50rpx; padding: 18rpx 30rpx 34rpx; border-radius: 30rpx; background: #fff; box-shadow: 0 22rpx 60rpx rgba(44,54,86,.08); }.field { margin-top: 14rpx; padding: 19rpx 0; border-bottom: 1rpx solid #e8ebf2; }.field text:first-child { display: block; margin-bottom: 12rpx; color: #4d5870; font-size: 23rpx; font-weight: 650; }.field input { height: 45rpx; font-size: 28rpx; }.code-field { position: relative; }.code-field input { padding-right: 150rpx; }.code-button { position: absolute; right: 0; bottom: 22rpx; color: #5865f2; font-size: 23rpx; }.primary-button { margin-top: 36rpx; border-radius: 16rpx; background: #5865f2; color: #fff; line-height: 90rpx; font-size: 28rpx; }.primary-button::after { border: 0; }.login-link { display: block; margin-top: 36rpx; color: #5865f2; text-align: center; font-size: 25rpx; }
</style>
