<template>
  <view class="password-page">
    <page-nav title="修改密码" />
    <view class="content">
      <view class="hero"><view class="lock">⌑</view><text>设置新的登录密码</text><text>修改成功后需要重新登录</text></view>
      <view class="form-card">
        <view class="field"><text>邮箱</text><input :value="email" disabled /></view>
        <view class="field"><text>新密码</text><input v-model="password" :password="!showPassword" maxlength="20" placeholder="8—20 位，需包含字母和数字" placeholder-class="placeholder" /><text class="visibility" @tap="showPassword = !showPassword">{{ showPassword ? '◉' : '◌' }}</text></view>
        <view class="field code-field"><text>验证码</text><input v-model="code" maxlength="6" type="number" placeholder="请输入 6 位验证码" placeholder-class="placeholder" /><text class="send" :class="{ disabled: countdown }" @tap="sendCode">{{ countdown ? `${countdown}s 后重试` : '获取验证码' }}</text></view>
      </view>
      <text class="password-tip">密码需包含字母和数字，修改后当前登录状态将失效。</text>
      <button class="submit" :disabled="!canSubmit || submitting" :loading="submitting" @tap="submit">确认修改</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { useVerificationCountdown } from '../../composables/use-verification-countdown'
import { clearSession, session } from '../../core/session'
import { changeCurrentPassword, sendEmailCode } from '../../services/auth'

const email = computed(() => session.user?.email || session.user?.username || '')
const password = ref('')
const code = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const { countdown, execute: sendWithCountdown } = useVerificationCountdown()
const canSubmit = computed(() => /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/.test(password.value) && /^\d{6}$/.test(code.value))
usePortalGuard('agent')
async function sendCode() {
  if (countdown.value) return
  try {
    const sent = await sendWithCountdown(() => sendEmailCode({ email: email.value, purpose: 'reset-password', portal: 'agent' }))
    if (sent) uni.showToast({ title: '验证码已发送，请注意查收', icon: 'none' })
  } catch (error) { uni.showToast({ title: error.message, icon: 'none' }) }
}
async function submit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    await changeCurrentPassword({ email: email.value, password: password.value, code: code.value })
    uni.showModal({ title: '新密码修改成功！', content: '请使用新密码重新登录。', showCancel: false, success: () => { clearSession(); uni.reLaunch({ url: '/pages/auth/login?portal=agent' }) } })
  } catch (error) { uni.showToast({ title: error.message || '修改失败，请重试', icon: 'none' }) } finally { submitting.value = false }
}
</script>

<style lang="scss" scoped>
.password-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 55rpx 54rpx; }.hero { display: flex; flex-direction: column; align-items: center; }.lock { display: flex; align-items: center; justify-content: center; width: 98rpx; height: 98rpx; border-radius: 31rpx; background: #e5e8ff; color: #5966f3; font-size: 53rpx; font-weight: 700; }.hero text { display: block; margin-top: 26rpx; font-size: 34rpx; font-weight: 750; }.hero text:last-child { margin-top: 11rpx; color: #909bab; font-size: 22rpx; font-weight: 400; }.form-card { margin-top: 50rpx; padding: 8rpx 30rpx; border-radius: 25rpx; background: #fff; box-shadow: 0 15rpx 38rpx rgba(34, 42, 70, .055); }.field { position: relative; padding: 24rpx 0; border-bottom: 1rpx solid #eaedf3; }.field:last-child { border: 0; }.field > text:first-child { display: block; margin-bottom: 13rpx; color: #46526a; font-size: 23rpx; font-weight: 700; }.field input { height: 46rpx; padding-right: 186rpx; color: #6e7a90; font-size: 26rpx; }.placeholder { color: #b1b9c6; font-size: 23rpx; }.visibility, .send { position: absolute; right: 0; bottom: 28rpx; color: #5966f3; font-size: 23rpx; }.visibility { font-size: 31rpx; }.send.disabled { color: #a6afbf; }.password-tip { display: block; margin: 21rpx 3rpx 0; color: #949ead; font-size: 20rpx; line-height: 1.55; }.submit { width: 100%; margin-top: 43rpx; border: 0; border-radius: 17rpx; background: #5966f3; color: #fff; font-size: 28rpx; line-height: 89rpx; }.submit[disabled] { background: #c8cdd9; }.submit::after { border: 0; }
</style>
