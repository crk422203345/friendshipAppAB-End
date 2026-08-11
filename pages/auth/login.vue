<template>
  <view class="auth-page" :class="`portal-${portal.code}`">
    <view class="orb orb-one" />
    <view class="orb orb-two" />
    <view class="content safe-area">
      <view class="brand" @tap="goLegacyPage">
        <view class="brand-mark">F</view>
        <view>
          <text class="brand-name">Friendship</text>
          <text class="brand-slogan">让合作更简单</text>
        </view>
      </view>

      <view class="heading">
        <text class="eyebrow">WELCOME BACK</text>
        <text class="title">{{ portal.loginTitle }}</text>
        <text class="subtitle">使用邮箱登录，开启你的工作台</text>
      </view>

      <view class="login-card">
        <view class="login-tabs">
          <text :class="{ active: loginType === 'code' }" @tap="setLoginType('code')">邮箱验证码</text>
          <text :class="{ active: loginType === 'password' }" @tap="setLoginType('password')">密码登录</text>
        </view>

        <view class="field">
          <text class="field-label">邮箱</text>
          <input v-model="email" type="text" placeholder="请输入邮箱地址" placeholder-class="placeholder" />
        </view>
        <view v-if="loginType === 'code'" class="field">
          <text class="field-label">邮箱验证码</text>
          <input v-model="code" type="number" maxlength="6" placeholder="请输入 6 位验证码" placeholder-class="placeholder" />
          <text class="code-button" :class="{ disabled: countdown }" @tap="sendCode">{{ countdown ? `${countdown}s 后重发` : '获取验证码' }}</text>
        </view>
        <view v-else class="field">
          <text class="field-label">密码</text>
          <input v-model="password" password placeholder="请输入密码" placeholder-class="placeholder" />
        </view>

        <button class="primary-button" :loading="submitting" @tap="submitLogin">登录</button>
        <view class="card-actions">
          <text v-if="portal.showRegister" @tap="goRegister">注册账号</text>
          <text v-if="loginType === 'password' || portal.code === 'agent'" @tap="goForgot">忘记密码？</text>
        </view>
      </view>

      <view v-if="portal.showOnboarding" class="onboarding" @tap="goOnboarding">
        <view>
          <text class="onboarding-title">开店指引</text>
          <text class="onboarding-copy">扫码注册店铺，或查看专属代理人联系方式</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <button v-if="portal.showOtherLogin" class="secondary-button" @tap="otherLogin">其他登录方式</button>

      <view class="switch-portal" @tap="switchPortal">
        <text>{{ portal.switchLabel }}</text>
        <text class="switch-arrow">→</text>
      </view>
      <text class="agreement">登录即表示你同意《服务协议》与《隐私政策》</text>
      <button class="quick-login" :loading="quickSubmitting" @tap="quickLogin">
        <text class="quick-login-icon">⚡</text>
        一键登录体验 {{ portal.name }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useVerificationCountdown } from '../../composables/use-verification-countdown'
import { getPortal, PORTAL_AGENT, PORTAL_MERCHANT } from '../../config/portals'
import { setSession } from '../../core/session'
import { login, sendEmailCode } from '../../services/auth'

const portalCode = ref(PORTAL_MERCHANT)
const loginType = ref('code')
const email = ref('')
const password = ref('')
const code = ref('')
const submitting = ref(false)
const quickSubmitting = ref(false)
const { countdown, execute: sendWithCountdown } = useVerificationCountdown()

const portal = computed(() => getPortal(portalCode.value))

onLoad((options) => {
  if (options?.portal === PORTAL_AGENT) portalCode.value = PORTAL_AGENT
})

function setLoginType(type) {
  loginType.value = type
}

async function sendCode() {
  if (countdown.value) return
  try {
    const sent = await sendWithCountdown(() => sendEmailCode({ email: email.value, purpose: 'login', portal: portalCode.value }))
    if (sent) uni.showToast({ title: '验证码已发送（演示码：123456）', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: error.message, icon: 'none' })
  }
}

async function submitLogin() {
  if (submitting.value) return
  submitting.value = true
  try {
    const result = await login({
      email: email.value,
      password: password.value,
      code: code.value,
      loginType: loginType.value,
      portal: portalCode.value
    })
    setSession(result)
    uni.reLaunch({ url: getPortal(result.portal).homePath })
  } catch (error) {
    uni.showToast({ title: error.message || '登录失败，请重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

async function quickLogin() {
  if (quickSubmitting.value) return
  quickSubmitting.value = true
  try {
    const result = await login({
      email: portalCode.value === PORTAL_AGENT ? 'agent@example.com' : 'merchant@example.com',
      password: 'demo-pass',
      loginType: 'password',
      portal: portalCode.value
    })
    setSession(result)
    uni.reLaunch({ url: getPortal(result.portal).homePath })
  } catch (error) {
    uni.showToast({ title: error.message || '一键登录失败，请重试', icon: 'none' })
  } finally {
    quickSubmitting.value = false
  }
}

function switchPortal() {
  const next = portalCode.value === PORTAL_AGENT ? PORTAL_MERCHANT : PORTAL_AGENT
  uni.redirectTo({ url: `/pages/auth/login?portal=${next}` })
}

function goForgot() {
  uni.navigateTo({ url: `/pages/auth/forgot-password?portal=${portalCode.value}` })
}

function goRegister() {
  uni.navigateTo({ url: '/pages/auth/register' })
}

function goOnboarding() {
  uni.navigateTo({ url: '/pages/auth/merchant-onboarding' })
}

function otherLogin() {
  uni.showToast({ title: '第三方登录待接入', icon: 'none' })
}

function goLegacyPage() {
  uni.navigateTo({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.auth-page { min-height: 100vh; overflow: hidden; background: #f7f8fc; color: #172033; position: relative; }
.content { position: relative; z-index: 1; max-width: 680rpx; min-height: 100vh; margin: 0 auto; padding: 78rpx 44rpx 50rpx; box-sizing: border-box; }
.safe-area { padding-top: calc(78rpx + env(safe-area-inset-top)); }
.orb { position: absolute; border-radius: 50%; filter: blur(2rpx); opacity: .75; }
.orb-one { width: 460rpx; height: 460rpx; top: -250rpx; right: -190rpx; background: #dfe4ff; }
.orb-two { width: 320rpx; height: 320rpx; bottom: -180rpx; left: -170rpx; background: #d5f5ea; }
.portal-agent .orb-one { background: #dfe4ff; }.portal-merchant .orb-one { background: #d2f2e8; }
.brand { display: flex; align-items: center; gap: 18rpx; width: max-content; }
.brand-mark { display: flex; align-items: center; justify-content: center; width: 68rpx; height: 68rpx; border-radius: 22rpx; background: linear-gradient(135deg, #5865f2, #8a93ff); color: #fff; font-size: 38rpx; font-weight: 800; box-shadow: 0 12rpx 24rpx rgba(88,101,242,.24); }
.portal-merchant .brand-mark { background: linear-gradient(135deg, #0f9d7a, #38c6a2); box-shadow: 0 12rpx 24rpx rgba(15,157,122,.24); }
.brand-name, .brand-slogan, .eyebrow, .title, .subtitle, .field-label, .onboarding-title, .onboarding-copy, .agreement { display: block; }
.brand-name { font-size: 28rpx; font-weight: 750; letter-spacing: .4rpx; }.brand-slogan { margin-top: 2rpx; color: #8490a5; font-size: 20rpx; }
.heading { margin: 78rpx 0 42rpx; }.eyebrow { color: #6d7bf7; font-size: 20rpx; letter-spacing: 2.4rpx; font-weight: 700; }.portal-merchant .eyebrow { color: #0f9d7a; }
.title { margin-top: 16rpx; font-size: 54rpx; font-weight: 750; letter-spacing: -1rpx; }.subtitle { margin-top: 14rpx; color: #7a869b; font-size: 26rpx; }
.login-card { padding: 32rpx; border: 1rpx solid rgba(222,226,239,.9); border-radius: 30rpx; background: rgba(255,255,255,.94); box-shadow: 0 24rpx 70rpx rgba(30,43,70,.08); }
.login-tabs { display: flex; gap: 40rpx; margin-bottom: 28rpx; border-bottom: 1rpx solid #edf0f5; }.login-tabs text { position: relative; padding: 0 2rpx 20rpx; color: #8993a7; font-size: 27rpx; }.login-tabs .active { color: #25304a; font-weight: 700; }.login-tabs .active::after { position: absolute; bottom: -1rpx; left: 0; width: 100%; height: 5rpx; border-radius: 6rpx; background: #5865f2; content: ''; }.portal-merchant .login-tabs .active::after { background: #0f9d7a; }
.field { position: relative; margin-top: 22rpx; padding: 14rpx 0; border-bottom: 1rpx solid #e8ebf1; }.field-label { margin-bottom: 10rpx; color: #4d5870; font-size: 23rpx; font-weight: 650; }.field input { height: 48rpx; padding-right: 184rpx; font-size: 29rpx; }.placeholder { color: #b3bbc9; font-size: 26rpx; }.code-button { position: absolute; right: 0; bottom: 20rpx; color: #5865f2; font-size: 24rpx; }.portal-merchant .code-button { color: #0f9d7a; }.code-button.disabled { color: #aeb5c2; }
.primary-button { width: 100%; margin-top: 42rpx; border-radius: 16rpx; background: #5865f2; color: #fff; font-size: 29rpx; font-weight: 650; line-height: 94rpx; }.portal-merchant .primary-button { background: #0f9d7a; }.primary-button::after, .secondary-button::after { border: 0; }
.card-actions { display: flex; justify-content: flex-end; gap: 26rpx; margin-top: 24rpx; color: #69758c; font-size: 23rpx; }
.onboarding { display: flex; align-items: center; justify-content: space-between; margin-top: 28rpx; padding: 26rpx 28rpx; border: 1rpx solid #cbece2; border-radius: 22rpx; background: #edfbf6; }.onboarding-title { color: #1b644f; font-size: 27rpx; font-weight: 700; }.onboarding-copy { margin-top: 7rpx; color: #568473; font-size: 21rpx; line-height: 1.45; }.arrow { color: #0f9d7a; font-size: 52rpx; font-weight: 300; }
.secondary-button { width: 100%; margin-top: 26rpx; border: 1rpx solid #dce1eb; border-radius: 16rpx; background: #fff; color: #536078; font-size: 27rpx; line-height: 88rpx; }.switch-portal { display: flex; align-items: center; justify-content: center; gap: 12rpx; margin-top: 64rpx; color: #43506a; font-size: 27rpx; }.switch-arrow { color: #5865f2; font-size: 37rpx; font-weight: 600; }.portal-merchant .switch-arrow { color: #0f9d7a; }.agreement { margin-top: 28rpx; color: #a0a8b8; text-align: center; font-size: 20rpx; }.quick-login { display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 32rpx; border: 1rpx solid #ccd2ff; border-radius: 16rpx; background: rgba(255,255,255,.78); color: #5865f2; font-size: 26rpx; font-weight: 650; line-height: 88rpx; box-shadow: 0 12rpx 25rpx rgba(46,58,104,.05); }.quick-login::after { border: 0; }.quick-login-icon { margin-right: 10rpx; font-size: 27rpx; }.portal-merchant .quick-login { border-color: #bce9da; color: #0f9d7a; }
</style>
