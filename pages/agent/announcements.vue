<template>
  <view class="sub-page"><view class="nav"><text @tap="back">‹</text><b>平台公告</b><view /></view><view class="body"><picker mode="date" fields="month" :value="selectedMonth" @change="changeMonth"><view class="month"><text>{{ monthLabel }}</text><view class="chevron" /></view></picker><view v-if="items.length" class="list"><view v-for="item in items" :key="item.id" class="card" @tap="detail(item)"><b>{{ item.title }}</b><text>{{ item.date }}</text></view></view><view v-else-if="!loading" class="empty">暂无平台公告</view><view v-else class="empty">公告加载中…</view></view></view>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { createLatestTask } from '../../core/latest-task.mjs'
import { getAnnouncements, listOf } from '../../services/agent'

const now = new Date()
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
const items = ref([])
const loading = ref(false)
const requestTask = createLatestTask()
const monthLabel = computed(() => { const [year, month] = selectedMonth.value.split('-'); return `${year}年${Number(month)}月` })

onMounted(() => { if (enforcePortal('agent')) loadAnnouncements() })
onBeforeUnmount(requestTask.invalidate)
async function loadAnnouncements() {
  const requestId = requestTask.begin()
  loading.value = true
  try {
    const nextItems = listOf(await getAnnouncements({ month: selectedMonth.value, page: 1, page_size: 50 })).map((item) => ({
      id: item.announcement_no || item.announcementNo || item.id,
      title: item.title || '-',
      date: String(item.published_at || item.publishedAt || item.created_at || item.createdAt || '').slice(0, 10)
    })).filter((item) => item.id)
    if (requestTask.isCurrent(requestId)) items.value = nextItems
  } catch (error) {
    if (requestTask.isCurrent(requestId)) { items.value = []; uni.showToast({ title: error.message || '公告加载失败', icon: 'none' }) }
  } finally { if (requestTask.isCurrent(requestId)) loading.value = false }
}
function back() { uni.navigateBack() }
function changeMonth(event) { selectedMonth.value = event.detail.value; loadAnnouncements() }
function detail(item) { uni.navigateTo({ url: `/pages/agent/article-detail?type=notice&id=${encodeURIComponent(item.id)}` }) }
</script>

<style lang="scss" scoped>
.sub-page{min-height:100vh;background:#f7f8fc;color:#27314a}.nav{display:flex;justify-content:space-between;align-items:center;height:calc(102rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 32rpx 0;background:#fff;box-sizing:border-box;font-size:30rpx}.nav text{width:58rpx;color:#5865f2;font-size:60rpx;line-height:1}.nav view{width:58rpx}.body{padding:30rpx 34rpx}.month{display:inline-flex;align-items:center;gap:14rpx;padding:14rpx 20rpx;border-radius:14rpx;background:#eef0ff;color:#5865f2;font-size:27rpx;font-weight:700}.month text{width:auto;color:inherit;font-size:inherit;line-height:1}.chevron{width:12rpx!important;height:12rpx!important;margin-top:-6rpx;border-right:3rpx solid #5865f2;border-bottom:3rpx solid #5865f2;transform:rotate(45deg);box-sizing:border-box}.list{margin-top:28rpx}.card{display:flex;justify-content:space-between;align-items:center;margin-bottom:18rpx;padding:29rpx;border:1rpx solid #e5e8f0;border-radius:20rpx;background:#fff}.card b{overflow:hidden;font-size:27rpx;text-overflow:ellipsis;white-space:nowrap}.card text{padding-left:18rpx;color:#9aa3b3;font-size:20rpx;white-space:nowrap}.empty{padding-top:300rpx;color:#8790a1;text-align:center;font-size:28rpx}
</style>
