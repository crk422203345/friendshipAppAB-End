<template>
  <view class="sub-page">
    <page-nav title="平台规则" />
    <view class="content">
      <scroll-view v-if="ruleSets.length" scroll-x class="tabs"><view class="tabs-inner"><text v-for="item in ruleSets" :key="item.key" :class="{ active: activeKey === item.key }" @tap="selectRule(item.key)">{{ item.name }}</text></view></scroll-view>
      <view v-if="current" class="rule-card"><text class="rule-title">{{ current.title }}</text><text v-if="current.summary" class="rule-intro">{{ current.summary }}</text><text v-if="detailLoading" class="rule-loading">规则正文加载中…</text><text v-else class="rule-content" selectable>{{ current.content || '暂无规则正文' }}</text></view>
      <view v-else-if="loading" class="loading">正在加载平台规则…</view>
      <empty-state v-else icon="!" :title="error || '暂无平台规则'" :description="error ? '请检查网络后重试' : ''" />
      <button v-if="error" class="retry" @tap="loadRules">重新加载</button>
      <view v-if="current" class="notice"><text>!</text><text>{{ ruleNotice }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { getContentArticle, getPlatformRules, listOf, unwrap } from '../../services/agent'

const activeKey = ref('')
const ruleSets = ref([])
const loading = ref(false)
const detailLoading = ref(false)
const error = ref('')
const current = computed(() => ruleSets.value.find((item) => item.key === activeKey.value))
const ruleNotice = computed(() => {
  if (!current.value) return ''
  const version = current.value.version ? `当前版本 V${current.value.version}。` : ''
  return `${version}${current.value.requiresAck ? '请阅读并遵守本规则，规则更新以平台发布内容为准。' : '规则更新以平台最新发布内容为准。'}`
})

usePortalGuard('agent')
onMounted(loadRules)

async function loadRules() {
  loading.value = true
  error.value = ''
  try {
    const items = listOf(await getPlatformRules({ page: 1, page_size: 100 }))
    ruleSets.value = items.map((item) => ({
      key: item.article_no || item.articleNo || item.id,
      name: item.category_name || item.categoryName || item.title || '',
      title: item.title || '',
      summary: item.summary || '',
      content: readableContent(item.content),
      version: item.version_no || item.versionNo || '',
      requiresAck: Boolean(item.requires_ack ?? item.requiresAck)
    })).filter((item) => item.key && item.title)
    activeKey.value = ruleSets.value[0]?.key || ''
    if (activeKey.value) await loadRuleDetail(activeKey.value)
  } catch (exception) {
    ruleSets.value = []
    activeKey.value = ''
    error.value = exception.message || '平台规则加载失败'
  } finally {
    loading.value = false
  }
}

async function selectRule(key) {
  if (activeKey.value === key) return
  activeKey.value = key
  await loadRuleDetail(key)
}

async function loadRuleDetail(key) {
  const target = ruleSets.value.find((item) => item.key === key)
  if (!target || target.content) return
  detailLoading.value = true
  try {
    const detail = unwrap(await getContentArticle(key)) || {}
    Object.assign(target, {
      title: detail.title || target.title,
      summary: detail.summary || target.summary,
      content: readableContent(detail.content),
      version: detail.version_no || detail.versionNo || target.version,
      requiresAck: Boolean(detail.requires_ack ?? detail.requiresAck ?? target.requiresAck)
    })
  } catch (exception) {
    uni.showToast({ title: exception.message || '规则正文加载失败', icon: 'none' })
  } finally {
    detailLoading.value = false
  }
}

function readableContent(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/\*\*|__/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 27rpx 34rpx; }.tabs { white-space: nowrap; }.tabs-inner { display: inline-flex; gap: 17rpx; }.tabs text { min-width: 136rpx; padding: 15rpx 18rpx; border-radius: 20rpx; background: #fff; color: #7c879a; text-align: center; font-size: 24rpx; box-sizing: border-box; }.tabs .active { background: #5966f3; color: #fff; font-weight: 700; }.rule-card { margin-top: 27rpx; padding: 32rpx 29rpx; border-radius: 25rpx; background: #fff; box-shadow: 0 12rpx 30rpx rgba(34, 42, 70, .05); }.rule-title, .rule-intro, .rule-content, .rule-loading { display: block; }.rule-title { color: #293550; font-size: 31rpx; font-weight: 750; line-height: 1.45; }.rule-intro { margin-top: 17rpx; color: #7e899b; font-size: 23rpx; line-height: 1.6; }.rule-content { margin-top: 28rpx; color: #596579; font-size: 24rpx; line-height: 1.8; white-space: pre-line; }.rule-loading, .loading { padding: 100rpx 0; color: #929cad; text-align: center; font-size: 23rpx; }.loading { padding: 180rpx 0; }.retry { width: 240rpx; margin: -100rpx auto 0; border: 1rpx solid #d9dfea; border-radius: 17rpx; background: #fff; color: #5966f3; font-size: 24rpx; line-height: 72rpx; }.retry::after { border: 0; }.notice { display: flex; gap: 12rpx; margin-top: 24rpx; padding: 21rpx 23rpx; border-radius: 17rpx; background: #eef0ff; color: #68749c; font-size: 21rpx; line-height: 1.55; }.notice text:first-child { display: flex; flex: none; align-items: center; justify-content: center; width: 28rpx; height: 28rpx; border-radius: 50%; background: #5966f3; color: #fff; font-size: 18rpx; font-weight: 700; }
</style>
