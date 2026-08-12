<template>
  <view class="detail-page">
    <page-nav title="操作教程" />
    <scroll-view class="body" scroll-y><view v-if="article"><text class="title">{{ article.title }}</text><text v-if="article.publishedAt" class="date">更新时间：{{ formatDate(article.publishedAt) }}</text><image v-if="article.coverUrl" class="cover-image" :src="article.coverUrl" mode="aspectFill" /><view v-else-if="article.categoryName" class="cover"><text>{{ article.categoryName }}</text></view><text class="article-content" selectable>{{ article.content || article.summary || '暂无教程正文' }}</text><button v-if="article.externalUrl" class="external" @tap="openExternalUrl(article.externalUrl)">打开相关页面</button><view class="notice"><text>!</text><text>教程内容以平台当前发布版本为准。</text></view></view><view v-else-if="loading" class="state">教程加载中…</view><view v-else class="state"><text>{{ error || '教程不存在' }}</text><button @tap="loadArticle">重新加载</button></view></scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { openExternalUrl } from '../../core/external-link'
import { getContentArticle, unwrap } from '../../services/agent'

const id = ref('')
const article = ref(null)
const loading = ref(false)
const error = ref('')

onLoad((options) => { id.value = String(options?.id || ''); loadArticle() })
usePortalGuard('agent')

async function loadArticle() {
  if (!id.value) { error.value = '缺少教程编号'; return }
  loading.value = true
  error.value = ''
  try {
    const data = unwrap(await getContentArticle(id.value)) || {}
    article.value = {
      title: data.title || '',
      summary: data.summary || '',
      content: readableContent(data.content),
      categoryName: data.category_name || data.categoryName || '',
      coverUrl: data.cover_url || data.coverUrl || '',
      externalUrl: data.video_url || data.videoUrl || data.external_url || data.externalUrl || '',
      publishedAt: data.published_at || data.publishedAt || data.updated_at || data.updatedAt || ''
    }
  } catch (exception) {
    article.value = null
    error.value = exception.message || '教程加载失败'
  } finally {
    loading.value = false
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

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #fff; color: #293550; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; border-bottom: 1rpx solid #eff1f5; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.body { height: calc(100vh - 106rpx - env(safe-area-inset-top)); padding: 40rpx 40rpx 70rpx; box-sizing: border-box; }.title, .date, .article-content { display: block; }.title { font-size: 39rpx; font-weight: 760; line-height: 1.45; }.date { margin-top: 16rpx; color: #9aa4b4; font-size: 21rpx; }.cover, .cover-image { width: 100%; height: 330rpx; margin-top: 34rpx; border-radius: 25rpx; }.cover { display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #e4e7ff, #bfc6ff); color: #5966f3; font-size: 39rpx; font-weight: 750; }.article-content { margin-top: 34rpx; color: #58647a; font-size: 27rpx; line-height: 1.85; white-space: pre-line; }.external { margin-top: 35rpx; border: 0; border-radius: 17rpx; background: #5966f3; color: #fff; font-size: 25rpx; line-height: 82rpx; }.external::after { border: 0; }.notice { display: flex; gap: 12rpx; margin-top: 42rpx; padding: 22rpx; border-radius: 18rpx; background: #f0f2ff; color: #6c7799; font-size: 21rpx; line-height: 1.55; }.notice text:first-child { display: flex; flex: none; align-items: center; justify-content: center; width: 28rpx; height: 28rpx; border-radius: 50%; background: #5966f3; color: #fff; font-size: 18rpx; font-weight: 700; }.state { display: flex; flex-direction: column; align-items: center; padding: 220rpx 0; color: #909bad; font-size: 25rpx; }.state button { margin-top: 30rpx; border: 1rpx solid #d9dfea; background: #fff; color: #5966f3; font-size: 24rpx; }
</style>
