<template>
  <view class="about-page">
    <page-nav title="关于我们" />
    <view class="content">
      <view class="brand">
        <image :src="appConfig.logoUrl || '/static/logo.png'" mode="aspectFit" />
        <text class="brand-name">{{ appConfig.appName || '—' }}</text>
        <text class="brand-version">Version {{ clientVersion || '—' }}</text>
      </view>
      <menu-list :items="items" @select="handle" />
      <text class="copyright">© {{ currentYear }} {{ appConfig.appName || '' }} · All rights reserved</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import MenuList from '../../components/menu-list.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { openExternalUrl } from '../../core/external-link'
import { getAppConfig, unwrap } from '../../services/agent'
import { getRuntimeInfo } from '../../services/app-runtime'

const runtime = getRuntimeInfo()
const currentYear = new Date().getFullYear()
const appConfig = ref({ appName: '', logoUrl: '', currentVersion: '', updateUrl: '', forceUpdate: false, serviceAgreementUrl: '', privacyPolicyUrl: '', officialWebsiteUrl: '', customerServiceUrl: '' })
const clientVersion = computed(() => runtime.appVersion || appConfig.value.currentVersion || '')
const items = computed(() => [
  { name: '检查版本更新', action: 'version', detail: clientVersion.value ? `V${clientVersion.value}` : '' },
  appConfig.value.serviceAgreementUrl && { name: '服务协议', action: 'service', url: appConfig.value.serviceAgreementUrl },
  appConfig.value.privacyPolicyUrl && { name: '隐私政策', action: 'privacy', url: appConfig.value.privacyPolicyUrl },
  appConfig.value.officialWebsiteUrl && { name: '官方网站', action: 'website', url: appConfig.value.officialWebsiteUrl },
  appConfig.value.customerServiceUrl && { name: '联系客服', action: 'service-center', url: appConfig.value.customerServiceUrl }
].filter(Boolean))

usePortalGuard('agent')
onMounted(loadConfig)

async function loadConfig() {
  try {
    const data = unwrap(await getAppConfig()) || {}
    appConfig.value = {
      appName: data.app_name || data.appName || '',
      logoUrl: data.logo_url || data.logoUrl || '',
      currentVersion: data.current_version || data.currentVersion || '',
      updateUrl: data.update_url || data.updateUrl || '',
      forceUpdate: Boolean(data.force_update ?? data.forceUpdate),
      serviceAgreementUrl: data.service_agreement_url || data.serviceAgreementUrl || '',
      privacyPolicyUrl: data.privacy_policy_url || data.privacyPolicyUrl || '',
      officialWebsiteUrl: data.official_website_url || data.officialWebsiteUrl || '',
      customerServiceUrl: data.customer_service_url || data.customerServiceUrl || ''
    }
    if (appConfig.value.forceUpdate && hasUpdate()) checkUpdate()
  } catch (error) {
    uni.showToast({ title: error.message || '应用信息加载失败', icon: 'none' })
  }
}

function compareVersion(left, right) {
  const leftParts = String(left || '').split('.').map(Number)
  const rightParts = String(right || '').split('.').map(Number)
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const difference = (leftParts[index] || 0) - (rightParts[index] || 0)
    if (difference) return difference
  }
  return 0
}

function hasUpdate() {
  return Boolean(runtime.appVersion && appConfig.value.currentVersion && compareVersion(appConfig.value.currentVersion, runtime.appVersion) > 0)
}

function checkUpdate() {
  if (!hasUpdate()) { uni.showToast({ title: '当前已是最新版本', icon: 'none' }); return }
  uni.showModal({
    title: `发现新版本 ${appConfig.value.currentVersion}`,
    content: appConfig.value.updateUrl ? '是否立即前往更新？' : '新版本已发布，请联系平台获取更新方式。',
    showCancel: Boolean(appConfig.value.updateUrl) && !appConfig.value.forceUpdate,
    confirmText: appConfig.value.updateUrl ? '立即更新' : '知道了',
    success: ({ confirm }) => { if (confirm && appConfig.value.updateUrl) openExternalUrl(appConfig.value.updateUrl) }
  })
}

function handle(item) {
  if (item.action === 'version') { checkUpdate(); return }
  if (!openExternalUrl(item.url)) uni.showToast({ title: '链接暂不可用', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.about-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 56rpx 34rpx; }.brand { display: flex; flex-direction: column; align-items: center; }.brand image { width: 120rpx; height: 120rpx; border-radius: 30rpx; box-shadow: 0 13rpx 30rpx rgba(55, 67, 143, .12); }.brand-name { display: block; margin-top: 21rpx; color: #2c3854; font-size: 34rpx; font-weight: 760; }.brand-version { display: block; margin-top: 15rpx; color: #a1a9b7; font-size: 21rpx; }.menu-card { overflow: hidden; margin-top: 60rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34, 42, 70, .045); }.menu-row { display: flex; align-items: center; min-height: 102rpx; padding: 0 27rpx; border-bottom: 1rpx solid #eef0f5; font-size: 26rpx; }.menu-row:last-child { border: 0; }.chevron { width: 15rpx; height: 15rpx; margin-left: auto; border-top: 3rpx solid #a0a9b9; border-right: 3rpx solid #a0a9b9; transform: rotate(45deg); box-sizing: border-box; }.copyright { display: block; margin-top: 53rpx; color: #a5adba; text-align: center; font-size: 20rpx; }
</style>
