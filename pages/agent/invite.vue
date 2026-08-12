<template>
  <view class="sub-page">
    <view class="nav"><text @tap="back">‹</text><b>邀请商家</b><view /></view>
    <view v-if="invitation" class="body">
      <view class="person">
        <view class="avatar">{{ firstLetter }}</view>
        <view><b>{{ invitation.agentName || session.user?.name || '-' }} <text v-if="invitation.agentNo">代理人ID：{{ invitation.agentNo }}</text></b><text class="person-copy">商家完成入驻后将自动与您建立绑定关系</text></view>
      </view>
      <view class="qr-card">
        <view class="qr-content">
          <image v-if="invitation.qrCodeUrl" :src="invitation.qrCodeUrl" mode="aspectFit" />
          <canvas v-else-if="invitation.link" id="merchant-invitation-qrcode" canvas-id="merchant-invitation-qrcode" class="qrcode-canvas" :width="qrSize" :height="qrSize" />
          <text v-else class="invite-token">{{ invitation.token || '暂无邀请码' }}</text>
        </view>
      </view>
      <text class="qr-copy">{{ invitation.qrCodeUrl || invitation.link ? '扫码即可填写入驻资料，完成商家入驻' : '请复制邀请码发送给商家完成入驻' }}</text>
      <view class="actions"><button :loading="refreshing" @tap="refreshInvitation">刷新邀请</button><button class="primary" :disabled="!invitation.link" @tap="copyLink">复制链接</button></view>
      <view class="tip">! 商家扫码或打开邀请链接后即可开始填写资料与完成商家入驻</view>
    </view>
    <view v-else-if="!loading" class="empty">暂无可用邀请</view>
    <view v-else class="empty">邀请信息加载中…</view>
  </view>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import UQRCode from 'uqrcodejs'
import { apiBaseUrl } from '../../config/app-profiles'
import { session } from '../../core/session'
import { enforcePortal } from '../../core/route-guard'
import { getMerchantInvitation, refreshMerchantInvitation, reportMerchantInvitationEvent, unwrap } from '../../services/agent'

const QR_CANVAS_ID = 'merchant-invitation-qrcode'
const QR_CONTENT_SIZE_RPX = 480
const QR_MARGIN_RPX = 40
const qrSize = uni.upx2px(QR_CONTENT_SIZE_RPX)
const qrMargin = uni.upx2px(QR_MARGIN_RPX)
const invitation = ref(null)
const loading = ref(false)
const refreshing = ref(false)
const firstLetter = computed(() => String(invitation.value?.agentName || session.user?.name || '?').slice(0, 1))

onMounted(() => {
  if (enforcePortal('agent')) loadInvitation()
})

function normalizeInvitation(data) {
  const invitationNo = data.invitation_no || data.invitationNo || ''
  const directLink = data.invite_url || data.invitation_url || data.inviteUrl || data.url || ''
  const baseUrl = String(apiBaseUrl || '').replace(/\/$/, '')
  return {
    token: data.invite_token || data.invitation_token || data.token || data.inviteCode || invitationNo,
    link: directLink || (invitationNo && /^https?:\/\//i.test(baseUrl) ? `${baseUrl}/i/${encodeURIComponent(invitationNo)}` : ''),
    qrCodeUrl: data.qr_code_url || data.qrcode_url || data.qrCodeUrl || '',
    agentName: data.agent_name || data.agentName || data.agent?.name || '',
    agentNo: data.agent_no || data.agentNo || data.agent?.agent_no || ''
  }
}

async function loadInvitation() {
  loading.value = true
  try {
    invitation.value = normalizeInvitation(unwrap(await getMerchantInvitation()) || {})
    await drawInvitationQrCode()
  } catch (error) {
    invitation.value = null
    uni.showToast({ title: error.message || '邀请信息加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function drawInvitationQrCode() {
  if (!invitation.value?.link || invitation.value.qrCodeUrl) return
  await nextTick()
  try {
    const qr = new UQRCode()
    qr.data = invitation.value.link
    qr.size = qrSize
    qr.margin = qrMargin
    qr.errorCorrectLevel = UQRCode.errorCorrectLevel.M
    qr.make()
    qr.canvasContext = uni.createCanvasContext(QR_CANVAS_ID)
    await qr.drawCanvas()
  } catch (error) {
    uni.showToast({ title: '二维码生成失败，请复制链接', icon: 'none' })
  }
}

async function refreshInvitation() {
  if (refreshing.value) return
  refreshing.value = true
  try {
    const refreshed = normalizeInvitation(unwrap(await refreshMerchantInvitation()) || {})
    invitation.value = refreshed.link || refreshed.token || refreshed.qrCodeUrl ? refreshed : invitation.value
    await drawInvitationQrCode()
    uni.showToast({ title: '邀请信息已刷新', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: error.message || '刷新失败', icon: 'none' })
  } finally {
    refreshing.value = false
  }
}

async function copyLink() {
  if (!invitation.value?.link) return
  uni.setClipboardData({ data: invitation.value.link, success: () => uni.showToast({ title: '邀请链接已复制', icon: 'success' }) })
  if (!invitation.value.token) return
  try {
    await reportMerchantInvitationEvent({ invite_token: invitation.value.token, action: 'copy', source_channel: 'agent_app', landing_version: 'v1' }, `invite-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`)
  } catch (error) { console.warn('Failed to report invitation copy event', error) }
}

function back() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #26314a }
.nav { display: flex; justify-content: space-between; align-items: center; height: calc(102rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 30rpx }
.nav text { width: 58rpx; color: #5865f2; font-size: 60rpx; line-height: 1 }
.nav view { width: 58rpx }
.body { padding: 46rpx 42rpx }
.person { display: flex; align-items: center; gap: 18rpx }
.avatar { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; border-radius: 50%; background: #dfe3ff; color: #5865f2; font-size: 30rpx; font-weight: 700 }
.person b, .person-copy, .qr-copy { display: block }
.person b { font-size: 27rpx }
.person b text { color: #8994a9; font-size: 20rpx; font-weight: 400 }
.person-copy { margin-top: 9rpx; color: #7d889d; font-size: 21rpx }
.qr-card { width: 560rpx; height: 560rpx; margin: 58rpx auto 0; padding: 40rpx; border-radius: 24rpx; background: #fff; box-shadow: 0 20rpx 55rpx rgba(35,46,80,.09); box-sizing: border-box }
.qr-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #fff }
.qr-content image, .qrcode-canvas { display: block; flex: none; width: 100%; height: 100% }
.invite-token { overflow-wrap: anywhere; color: #27314a; text-align: center; font-size: 28rpx; font-weight: 700 }
.qr-copy { margin: 34rpx 0 0; color: #708097; text-align: center; font-size: 24rpx }
.actions { display: flex; gap: 20rpx; margin-top: 46rpx }
.actions button { flex: 1; border: 1rpx solid #d9deea; border-radius: 16rpx; background: #fff; color: #56627a; font-size: 25rpx; line-height: 84rpx }
.actions .primary { border: 0; background: #5865f2; color: #fff }
.actions .primary[disabled] { background: #c8cdd9 }
.actions button::after { border: 0 }
.tip { margin-top: 42rpx; padding: 23rpx; border-radius: 18rpx; background: #eef0ff; color: #6875a3; font-size: 23rpx; line-height: 1.5 }
.empty { padding-top: 300rpx; color: #8790a1; text-align: center; font-size: 28rpx }
</style>
