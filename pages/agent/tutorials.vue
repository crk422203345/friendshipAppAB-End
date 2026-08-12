<template>
  <view class="sub-page">
    <page-nav title="操作教程" />
    <view class="content">
      <view class="tab-switch">
        <text :class="{ active: activeTab === 'video' }" @tap="activeTab = 'video'">视频</text>
        <text :class="{ active: activeTab === 'article' }" @tap="activeTab = 'article'">图文</text>
      </view>
      <view v-if="loading" class="loading">正在加载操作教程…</view>
      <view v-else-if="activeTab === 'video'">
        <view v-if="videoItems.length" class="video-section">
          <view v-for="item in videoItems" :key="item.id" class="video-item">
            <view class="video-cover" @tap="playVideo(item)">
              <image v-if="item.coverUrl" :src="item.coverUrl" mode="aspectFill" />
              <view class="cover-shade" />
              <view class="play">▶</view>
              <view class="video-caption">
                <text>{{ item.title }}</text>
                <text v-if="item.summary">{{ item.summary }}</text>
              </view>
            </view>
            <view class="video-tip">
              <text>{{ item.categoryName || '视频教程' }}</text>
              <text>点击封面开始播放</text>
            </view>
          </view>
        </view>
        <empty-state v-else icon="▶" title="暂无视频教程" />
      </view>
      <view v-else>
        <view v-if="articleItems.length" class="article-list">
          <view v-for="(item, index) in articleItems" :key="item.id" class="article" @tap="goDetail(item.id)">
            <view class="article-index">{{ index + 1 }}</view>
            <view>
              <text>{{ item.title }}</text>
              <text>{{ item.summary }}</text>
            </view>
            <view class="chevron" />
          </view>
        </view>
        <empty-state v-else icon="◇" :title="error || '暂无图文教程'" :description="error ? '请检查网络后重试' : ''" />
      </view>
      <button v-if="error" class="retry" @tap="loadTutorials">重新加载</button>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { openExternalUrl } from '../../core/external-link'
import { getTutorials, listOf } from '../../services/agent'

const activeTab = ref('video')
const tutorials = ref([])
const loading = ref(false)
const error = ref('')
const videoItems = computed(() => tutorials.value.filter((item) => item.kind === 'video'))
const articleItems = computed(() => tutorials.value.filter((item) => item.kind !== 'video'))

usePortalGuard('agent')
onMounted(loadTutorials)

async function loadTutorials() {
  loading.value = true
  error.value = ''
  try {
    const items = listOf(await getTutorials({ page: 1, page_size: 100 }))
    tutorials.value = items.map((item) => {
      const videoUrl = item.video_url || item.videoUrl || item.media_url || item.mediaUrl || ''
      const externalUrl = item.external_url || item.externalUrl || ''
      const declaredType = String(item.media_type || item.mediaType || item.tutorial_type || item.tutorialType || item.type || '').toLowerCase()
      const isVideo = declaredType === 'video' || Boolean(videoUrl) || isVideoUrl(externalUrl)
      return {
        id: item.article_no || item.articleNo || item.id,
        title: item.title || '',
        summary: item.summary || '',
        categoryName: item.category_name || item.categoryName || '',
        coverUrl: item.cover_url || item.coverUrl || '',
        videoUrl: videoUrl || (isVideo ? externalUrl : ''),
        kind: isVideo ? 'video' : 'article'
      }
    }).filter((item) => item.id && item.title)
    if (!videoItems.value.length && articleItems.value.length) activeTab.value = 'article'
    else if (!articleItems.value.length && videoItems.value.length) activeTab.value = 'video'
  } catch (exception) {
    tutorials.value = []
    error.value = exception.message || '操作教程加载失败'
  } finally {
    loading.value = false
  }
}

function isVideoUrl(value) {
  return /(?:\.mp4(?:$|\?)|\.m3u8(?:$|\?)|bilibili\.com|youtu(?:\.be|be\.com)|v\.qq\.com)/i.test(String(value || ''))
}

function playVideo(item) {
  if (item.videoUrl && openExternalUrl(item.videoUrl)) return
  goDetail(item.id)
}

function goDetail(id) { uni.navigateTo({ url: `/pages/agent/tutorial-detail?id=${encodeURIComponent(id)}` }) }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 30rpx 34rpx; }.tab-switch { display: flex; padding: 7rpx; border-radius: 19rpx; background: #e9ebf3; }.tab-switch text { flex: 1; padding: 14rpx 0; border-radius: 14rpx; color: #7a8599; text-align: center; font-size: 25rpx; }.tab-switch .active { background: #fff; color: #5865f2; font-weight: 750; box-shadow: 0 4rpx 12rpx rgba(34, 42, 70, .06); }.video-item { margin-top: 29rpx; }.video-cover { position: relative; display: flex; flex-direction: column; justify-content: flex-end; height: 390rpx; overflow: hidden; padding: 28rpx; border-radius: 26rpx; background: linear-gradient(145deg, #38466f, #717eff); box-sizing: border-box; }.video-cover > image, .cover-shade { position: absolute; inset: 0; width: 100%; height: 100%; }.cover-shade { background: linear-gradient(180deg, rgba(31, 42, 76, .08), rgba(31, 42, 76, .8)); }.video-cover::after { position: absolute; top: -80rpx; right: -50rpx; width: 290rpx; height: 290rpx; border: 46rpx solid rgba(255, 255, 255, .12); border-radius: 50%; content: ''; }.play { position: absolute; top: 105rpx; left: calc(50% - 49rpx); z-index: 2; display: flex; align-items: center; justify-content: center; width: 98rpx; height: 98rpx; padding-left: 7rpx; border-radius: 50%; background: rgba(255, 255, 255, .92); color: #5966f3; font-size: 36rpx; box-sizing: border-box; }.video-caption { position: relative; z-index: 2; }.video-caption text { display: block; color: #fff; font-size: 29rpx; font-weight: 700; }.video-caption text:last-child { margin-top: 10rpx; color: #dce1ff; font-size: 21rpx; font-weight: 400; }.video-tip { display: flex; justify-content: space-between; margin: 23rpx 5rpx; color: #8290a8; font-size: 22rpx; }.video-tip text:first-child { color: #35415c; font-size: 26rpx; font-weight: 700; }.article-list { margin-top: 28rpx; }.article { display: flex; align-items: center; gap: 17rpx; margin-bottom: 17rpx; padding: 25rpx; border-radius: 21rpx; background: #fff; box-shadow: 0 9rpx 25rpx rgba(34, 42, 70, .045); }.article-index { display: flex; flex: none; align-items: center; justify-content: center; width: 46rpx; height: 46rpx; border-radius: 15rpx; background: #e7eaff; color: #5966f3; font-size: 22rpx; font-weight: 750; }.article > view:nth-child(2) { flex: 1; min-width: 0; }.article > view:nth-child(2) text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.article > view:nth-child(2) text:first-child { color: #34415c; font-size: 25rpx; font-weight: 700; }.article > view:nth-child(2) text:last-child { margin-top: 9rpx; color: #8d98aa; font-size: 20rpx; }.chevron { flex: none; width: 14rpx; height: 14rpx; border-top: 3rpx solid #9ba5b6; border-right: 3rpx solid #9ba5b6; transform: rotate(45deg); box-sizing: border-box; }.loading { padding: 180rpx 0; color: #929cad; text-align: center; font-size: 25rpx; }.retry { width: 240rpx; margin: -100rpx auto 0; border: 1rpx solid #d9dfea; border-radius: 17rpx; background: #fff; color: #5966f3; font-size: 24rpx; line-height: 72rpx; }.retry::after { border: 0; }
</style>
