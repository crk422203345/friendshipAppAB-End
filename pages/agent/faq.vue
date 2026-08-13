<template>
  <view class="sub-page">
    <page-nav title="常见问题" />
    <view class="content">
      <view class="search"><text>⌕</text><input v-model="keyword" placeholder="搜索问题关键词" placeholder-class="placeholder" /><text v-if="keyword" class="clear" @tap="keyword = ''">×</text></view>
      <scroll-view scroll-x class="tabs"><view class="tabs-inner"><text v-for="item in categories" :key="item.key" :class="{ active: activeCategory === item.key }" @tap="activeCategory = item.key">{{ item.name }}</text></view></scroll-view>
      <view v-if="questions.length" class="question-list"><view v-for="item in questions" :key="item.id" class="question" @tap="toggle(item)"><view class="question-title"><text>{{ item.title }}</text><text class="arrow" :class="{ expanded: expandedId === item.id }">⌄</text></view><text v-if="expandedId === item.id" class="answer">{{ item.loading ? '答案加载中…' : item.answer || '暂无答案内容' }}</text></view></view>
      <view v-else-if="loading" class="loading">正在加载常见问题…</view>
      <empty-state v-else icon="?" :title="error || '没有找到相关问题'" :description="error ? '请检查网络后重试' : '换个关键词再试试'" />
      <button v-if="error" class="retry" @tap="loadQuestions">重新加载</button>
      <button v-if="supportUrl" class="support" @tap="contactSupport"><text>◌</text>没有找到答案？联系在线客服</button>
    </view>
  </view>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { toPlainText } from '../../core/content.mjs'
import { createLatestTask } from '../../core/latest-task.mjs'
import { openExternalUrl } from '../../core/external-link'
import { getAppConfig, getContentArticle, getFaqs, listOf, unwrap } from '../../services/agent'

const categories = [
  { key: '', name: '全部' },
  { key: 'merchant', name: '入驻流程' },
  { key: 'withdrawal', name: '提现收益' },
  { key: 'verification', name: '账号认证' }
]
const activeCategory = ref('')
const keyword = ref('')
const expandedId = ref(null)
const questions = ref([])
const loading = ref(false)
const error = ref('')
const supportUrl = ref('')
let searchTimer
const questionRequests = createLatestTask()

usePortalGuard('agent', () => { loadQuestions(); loadSupportConfig() })
onBeforeUnmount(() => { clearTimeout(searchTimer); questionRequests.invalidate() })
watch([keyword, activeCategory], () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadQuestions, 350)
})

async function loadQuestions() {
  const request = questionRequests.begin()
  const query = { keyword: keyword.value.trim(), category: activeCategory.value }
  loading.value = true
  error.value = ''
  expandedId.value = null
  try {
    const items = listOf(await getFaqs({
      page: 1,
      page_size: 100,
      keyword: query.keyword,
      category: query.category
    }))
    if (!questionRequests.isCurrent(request)) return
    questions.value = items.map((item) => ({
      id: item.article_no || item.articleNo || item.id,
      title: item.title || '',
      answer: toPlainText(item.content || item.summary),
      hasFullContent: Boolean(item.content),
      loading: false
    })).filter((item) => item.id && item.title)
  } catch (exception) {
    if (!questionRequests.isCurrent(request)) return
    questions.value = []
    error.value = exception.message || '常见问题加载失败'
  } finally {
    if (questionRequests.isCurrent(request)) loading.value = false
  }
}

async function toggle(item) {
  if (expandedId.value === item.id) { expandedId.value = null; return }
  expandedId.value = item.id
  if (item.hasFullContent || item.loading) return
  item.loading = true
  try {
    const detail = unwrap(await getContentArticle(item.id)) || {}
    item.answer = toPlainText(detail.content || detail.summary || item.answer)
    item.hasFullContent = true
  } catch (exception) {
    uni.showToast({ title: exception.message || '答案加载失败', icon: 'none' })
  } finally {
    item.loading = false
  }
}

async function loadSupportConfig() {
  try {
    const data = unwrap(await getAppConfig()) || {}
    supportUrl.value = data.customer_service_url || data.customerServiceUrl || ''
  } catch { supportUrl.value = '' }
}

function contactSupport() { openExternalUrl(supportUrl.value) }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 27rpx 34rpx calc(42rpx + env(safe-area-inset-bottom)); }.search { display: flex; align-items: center; height: 82rpx; padding: 0 22rpx; border-radius: 18rpx; background: #fff; box-shadow: 0 8rpx 22rpx rgba(34, 42, 70, .04); }.search > text:first-child { color: #5966f3; font-size: 38rpx; }.search input { flex: 1; margin-left: 14rpx; font-size: 25rpx; }.placeholder { color: #adb5c2; }.clear { color: #a5adbd; font-size: 36rpx; }.tabs { margin-top: 25rpx; white-space: nowrap; }.tabs-inner { display: inline-flex; gap: 15rpx; }.tabs text { padding: 13rpx 24rpx; border-radius: 20rpx; background: #ebedf4; color: #7d879b; font-size: 23rpx; }.tabs .active { background: #e4e7ff; color: #5865f2; font-weight: 700; }.question-list { margin-top: 26rpx; }.question { margin-bottom: 16rpx; padding: 25rpx 26rpx; border-radius: 20rpx; background: #fff; box-shadow: 0 8rpx 23rpx rgba(34, 42, 70, .04); }.question-title { display: flex; align-items: center; justify-content: space-between; color: #2d3852; font-size: 27rpx; font-weight: 700; }.arrow { color: #8792a5; font-size: 32rpx; transition: transform .2s; }.arrow.expanded { transform: rotate(180deg); }.answer { display: block; margin-top: 18rpx; padding-top: 18rpx; border-top: 1rpx solid #edf0f4; color: #7c879a; font-size: 23rpx; line-height: 1.65; white-space: pre-line; }.loading { padding: 150rpx 0; color: #9aa4b5; text-align: center; font-size: 25rpx; }.retry { width: 240rpx; margin: -100rpx auto 0; border: 1rpx solid #d9dfea; border-radius: 17rpx; background: #fff; color: #5966f3; font-size: 24rpx; line-height: 72rpx; }.retry::after { border: 0; }.support { width: 100%; margin-top: 26rpx; border: 0; border-radius: 17rpx; background: #5966f3; color: #fff; font-size: 25rpx; line-height: 88rpx; }.support::after { border: 0; }.support text { margin-right: 12rpx; font-size: 30rpx; }
</style>
