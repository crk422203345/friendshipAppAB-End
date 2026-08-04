<template>
  <view class="form-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>重置密码</text><view /></view>
    <view class="content">
      <text class="eyebrow">ACCOUNT SECURITY</text><text class="title">忘记密码</text><text class="copy">通过邮箱验证码设置新密码</text>
      <view class="form-card">
        <view class="field"><text>邮箱</text><input v-model="email" placeholder="请输入邮箱地址" /></view>
        <view class="field"><text>新密码</text><input v-model="password" password placeholder="至少 6 位" /></view>
        <view class="field code-field"><text>邮箱验证码</text><input v-model="code" maxlength="6" type="number" placeholder="6 位验证码" /><text class="code-button" @tap="sendCode">{{ countdown ? `${countdown}s` : '获取验证码' }}</text></view>
        <button class="primary-button" :loading="submitting" @tap="submit">确认重置</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { resetPassword, sendEmailCode } from '../../services/auth'

const portal = ref('merchant'); const email = ref(''); const password = ref(''); const code = ref(''); const countdown = ref(0); const submitting = ref(false); let timer
onLoad((options) => { if (options?.portal === 'agent') portal.value = 'agent' })
onBeforeUnmount(() => clearInterval(timer))
async function sendCode() { if (countdown.value) return; try { await sendEmailCode({ email: email.value, purpose: 'reset-password', portal: portal.value }); countdown.value = 60; timer = setInterval(() => { countdown.value -= 1; if (!countdown.value) clearInterval(timer) }, 1000); uni.showToast({ title: '验证码已发送（演示码：123456）', icon: 'none' }) } catch (error) { uni.showToast({ title: error.message, icon: 'none' }) } }
async function submit() { submitting.value = true; try { await resetPassword({ email: email.value, password: password.value, code: code.value }); uni.showToast({ title: '密码已重置，请登录', icon: 'success' }); setTimeout(goBack, 800) } catch (error) { uni.showToast({ title: error.message, icon: 'none' }) } finally { submitting.value = false } }
function goBack() { uni.redirectTo({ url: `/pages/auth/login?portal=${portal.value}` }) }
</script>

<style lang="scss" scoped>
.form-page { min-height: 100vh; background: #f7f8fc; color: #172033; }.topbar { display: flex; justify-content: space-between; align-items: center; height: calc(100rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 29rpx; font-weight: 650; }.topbar view, .back { width: 58rpx; }.back { color: #5865f2; font-size: 60rpx; line-height: 1; }.content { padding: 70rpx 54rpx; }.eyebrow, .title, .copy { display: block; }.eyebrow { color: #5865f2; font-size: 20rpx; font-weight: 700; letter-spacing: 2rpx; }.title { margin-top: 20rpx; font-size: 52rpx; font-weight: 750; }.copy { margin-top: 14rpx; color: #7b879d; font-size: 25rpx; }.form-card { margin-top: 52rpx; padding: 18rpx 30rpx 34rpx; border-radius: 30rpx; background: #fff; box-shadow: 0 22rpx 60rpx rgba(44,54,86,.08); }.field { margin-top: 14rpx; padding: 19rpx 0; border-bottom: 1rpx solid #e8ebf2; }.field text:first-child { display: block; margin-bottom: 12rpx; color: #4d5870; font-size: 23rpx; font-weight: 650; }.field input { height: 45rpx; font-size: 28rpx; }.code-field { position: relative; }.code-field input { padding-right: 150rpx; }.code-button { position: absolute; right: 0; bottom: 22rpx; color: #5865f2; font-size: 23rpx; }.primary-button { margin-top: 36rpx; border-radius: 16rpx; background: #5865f2; color: #fff; line-height: 90rpx; font-size: 28rpx; }.primary-button::after { border: 0; }
</style>
