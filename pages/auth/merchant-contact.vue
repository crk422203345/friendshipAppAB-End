<template>
  <view class="contact-page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>联系方式</text><view /></view>
    <view class="content">
      <view v-if="loading" class="state">正在加载联系方式…</view>
      <template v-else-if="contact.available">
        <view class="advisor"><image v-if="contact.avatar" class="avatar-image" :src="contact.avatar" mode="aspectFill" /><view v-else class="avatar">{{ firstLetter }}</view><view><text class="name">{{ contact.name }}</text><text class="role">{{ contact.role }}</text></view></view>
        <view class="contact-card"><text class="contact-label">{{ contact.label }}</text><text class="contact-value">{{ contact.value || '在线客服' }}</text><text class="copy-action" @tap="handleContact">{{ contact.value ? '复制联系方式' : '打开在线客服' }}</text></view>
        <view v-if="contact.qrCodeUrl" class="qr-panel"><image class="qr-image" :src="contact.qrCodeUrl" mode="aspectFit" /></view>
      </template>
      <view v-else class="state"><b>暂未配置入驻联系人</b><text>{{ error || '请返回登录页稍后重试，或通过平台官方渠道联系支持人员。' }}</text><button v-if="error" @tap="loadContact">重新加载</button></view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { openExternalUrl } from '../../core/external-link'
import { getAppConfig, unwrap } from '../../services/agent'

const loading = ref(false)
const error = ref('')
const contact = ref({ available: false, name: '', role: '', label: '', value: '', avatar: '', qrCodeUrl: '', url: '' })
const firstLetter = computed(() => String(contact.value.name || '客').slice(0, 1))
onMounted(loadContact)

async function loadContact() {
  loading.value = true
  error.value = ''
  try {
    const data = unwrap(await getAppConfig()) || {}
    const value = data.merchant_contact || data.merchantContact || data.customer_service_phone || data.customerServicePhone || data.customer_service_wechat || data.customerServiceWechat || ''
    const url = data.merchant_contact_url || data.merchantContactUrl || data.customer_service_url || data.customerServiceUrl || ''
    const qrCodeUrl = data.merchant_contact_qr_code_url || data.merchantContactQrCodeUrl || ''
    contact.value = {
      available: Boolean(value || url || qrCodeUrl),
      name: data.merchant_contact_name || data.merchantContactName || data.customer_service_name || data.customerServiceName || '平台客服',
      role: data.merchant_contact_role || data.merchantContactRole || '商家入驻支持',
      label: data.merchant_contact_label || data.merchantContactLabel || (value ? '联系方式' : '在线客服'),
      value,
      avatar: data.merchant_contact_avatar_url || data.merchantContactAvatarUrl || '',
      qrCodeUrl,
      url
    }
  } catch (exception) { error.value = exception.message || '联系方式加载失败' } finally { loading.value = false }
}
function goBack() { uni.navigateBack() }
function handleContact() {
  if (contact.value.value) { uni.setClipboardData({ data: String(contact.value.value), success: () => uni.showToast({ title: '联系方式已复制', icon: 'success' }) }); return }
  if (!openExternalUrl(contact.value.url)) uni.showToast({ title: '客服链接暂不可用', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.contact-page { min-height: 100vh; background: #f7fbf9; color: #193c32; }.topbar { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.topbar view, .back { width: 60rpx; }.back { color: #0f9d7a; font-size: 64rpx; line-height: 1; }.content { padding: 45rpx 52rpx; }.state { padding: 140rpx 20rpx; color: #7d998f; text-align: center; font-size: 24rpx; line-height: 1.6; }.state b,.state text{display:block}.state b{color:#284d42;font-size:30rpx}.state button{margin-top:32rpx;border-radius:15rpx;background:#0f9d7a;color:#fff;font-size:24rpx}.advisor { display: flex; align-items: center; gap: 20rpx; }.avatar,.avatar-image { width: 92rpx; height: 92rpx; border-radius: 50%; }.avatar { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #d7f4ea, #c0eadc); color: #168466; font-size: 35rpx; font-weight: 750; }.name, .role { display: block; }.name { color: #1e4137; font-size: 31rpx; font-weight: 750; }.role { margin-top: 10rpx; color: #7d998f; font-size: 22rpx; }.contact-card { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12rpx; margin-top: 39rpx; padding: 24rpx 27rpx; border-radius: 20rpx; background: #e8f8f2; }.contact-label { color: #72968a; font-size: 21rpx; }.contact-value { color: #245a4a; font-size: 29rpx; font-weight: 750; }.copy-action { grid-column: 1 / -1; color: #0d9874; font-size: 22rpx; }.qr-panel { display: flex; justify-content: center; margin-top: 70rpx; }.qr-image { width: 440rpx; height: 440rpx; padding: 24rpx; border-radius: 26rpx; background: #fff; box-shadow: 0 20rpx 55rpx rgba(22, 84, 65, .12); box-sizing: border-box; }
</style>
