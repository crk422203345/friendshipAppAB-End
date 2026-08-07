<template>
  <view class="detail-page">
    <page-nav title="收支明细" />

    <scroll-view class="page-body" scroll-y>
      <view class="overview-card">
        <view class="overview-top">
          <view class="month-trigger" @tap="openPicker">
            <text>{{ monthLabel }}</text><view class="down-arrow" />
          </view>
          <view class="total"><text>累计佣金</text><b>¥{{ formatAmount(totalAmount) }}</b></view>
        </view>
        <text class="overview-tip">佣金将在订单结算后计入账户，可提现金额以最终结算为准</text>
      </view>

      <view v-if="groupedRecords.length" class="record-list">
        <view v-for="group in groupedRecords" :key="group.date" class="date-group">
          <text class="date-label">{{ group.date }}</text>
          <view class="record-card">
            <view v-for="record in group.records" :key="record.id" class="record">
              <view class="record-main">
                <text class="merchant-name">{{ record.merchant }}</text>
                <text class="record-time">{{ record.time }} · {{ record.description }}</text>
              </view>
              <view class="record-amount"><text>+</text><b>¥{{ formatAmount(record.amount) }}</b></view>
            </view>
          </view>
        </view>
      </view>

      <empty-state v-else icon="¥" title="当月暂无收支明细" description="选择其他月份查看历史收益" />
    </scroll-view>

    <view v-if="pickerVisible" class="picker-mask" @tap="closePicker">
      <view class="month-picker" @tap.stop>
        <view class="picker-actions"><text @tap="closePicker">取消</text><text class="confirm" @tap="confirmPicker">确定</text></view>
        <view class="year-switcher">
          <view class="year-control" :class="{ disabled: draftYear <= firstAvailableYear }" @tap="changeYear(-1)">‹</view>
          <text>{{ draftYear }}年</text>
          <view class="year-control" :class="{ disabled: draftYear >= currentYear }" @tap="changeYear(1)">›</view>
        </view>
        <view class="month-grid">
          <view
            v-for="number in 12"
            :key="number"
            class="month-option"
            :class="{ active: draftMonth === number, disabled: isFutureMonth(number) }"
            @tap="selectMonth(number)"
          >{{ number }}月</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const firstAvailableYear = 2021
const selectedMonth = ref({ year: currentYear, month: currentMonth })
const pickerVisible = ref(false)
const draftYear = ref(currentYear)
const draftMonth = ref(currentMonth)

const monthLabel = computed(() => `${selectedMonth.value.year}年${selectedMonth.value.month}月`)
const selectedKey = computed(() => monthKey(selectedMonth.value.year, selectedMonth.value.month))
const groupedRecords = computed(() => incomeRecords[selectedKey.value] || [])
const totalAmount = computed(() => groupedRecords.value.reduce((total, group) => (
  total + group.records.reduce((sum, record) => sum + record.amount, 0)
), 0))

const currentKey = monthKey(currentYear, currentMonth)
const previous = previousMonth(currentYear, currentMonth)
const previousKey = monthKey(previous.year, previous.month)
const day = String(Math.max(now.getDate() - 1, 1)).padStart(2, '0')
const earlierDay = String(Math.max(now.getDate() - 4, 1)).padStart(2, '0')
const previousDay = String(Math.max(now.getDate() - 2, 1)).padStart(2, '0')

const incomeRecords = {
  [currentKey]: [
    {
      date: `${currentKey}-${day}`,
      records: [
        { id: 'current-1', merchant: '星河咖啡（中心店）', time: '14:23:00', description: '订单佣金', amount: 56.34 },
        { id: 'current-2', merchant: '悦享生活超市（南门店）', time: '11:08:42', description: '订单佣金', amount: 128.5 }
      ]
    },
    {
      date: `${currentKey}-${earlierDay}`,
      records: [
        { id: 'current-3', merchant: '拾光茶饮（万象店）', time: '16:46:18', description: '订单佣金', amount: 89.2 },
        { id: 'current-4', merchant: '悦享生活超市（南门店）', time: '09:35:16', description: '订单佣金', amount: 42.8 }
      ]
    }
  ],
  [previousKey]: [
    {
      date: `${previousKey}-${previousDay}`,
      records: [
        { id: 'previous-1', merchant: '瑞幸咖啡（大宁店）', time: '14:23:00', description: '订单佣金', amount: 650 },
        { id: 'previous-2', merchant: '全家便利店（陆家嘴店）', time: '10:18:25', description: '订单佣金', amount: 820 }
      ]
    },
    {
      date: `${previousKey}-08`,
      records: [
        { id: 'previous-3', merchant: '喜茶（静安寺店）', time: '18:41:09', description: '订单佣金', amount: 980 }
      ]
    }
  ]
}

usePortalGuard('agent')

function monthKey(year, month) { return `${year}-${String(month).padStart(2, '0')}` }
function previousMonth(year, month) { return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 } }
function formatAmount(amount) { return Number(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function openPicker() {
  draftYear.value = selectedMonth.value.year
  draftMonth.value = selectedMonth.value.month
  pickerVisible.value = true
}
function closePicker() { pickerVisible.value = false }
function changeYear(offset) {
  const nextYear = draftYear.value + offset
  if (nextYear < firstAvailableYear || nextYear > currentYear) return
  draftYear.value = nextYear
  if (draftYear.value === currentYear && draftMonth.value > currentMonth) draftMonth.value = currentMonth
}
function isFutureMonth(month) { return draftYear.value === currentYear && month > currentMonth }
function selectMonth(month) { if (!isFutureMonth(month)) draftMonth.value = month }
function confirmPicker() {
  selectedMonth.value = { year: draftYear.value, month: draftMonth.value }
  closePicker()
}
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f6f7fb; color: #202a43; }
.nav { display: flex; align-items: center; justify-content: space-between; height: calc(108rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 30rpx 0; background: #fff; box-sizing: border-box; }
.nav-back, .nav-placeholder { width: 64rpx; height: 64rpx; }
.nav-back { display: flex; align-items: center; justify-content: center; color: #293653; font-size: 64rpx; line-height: 1; }
.nav-back text { margin-top: -8rpx; }
.nav-title { font-size: 32rpx; font-weight: 750; }
.page-body { height: calc(100vh - 108rpx - env(safe-area-inset-top)); box-sizing: border-box; }
.overview-card { margin: 26rpx 32rpx 0; padding: 28rpx 30rpx; border-radius: 24rpx; background: linear-gradient(135deg, #ffffff, #f2f3ff); box-shadow: 0 10rpx 30rpx rgba(34, 43, 75, .05); }
.overview-top { display: flex; align-items: center; justify-content: space-between; }
.month-trigger { display: flex; align-items: center; gap: 13rpx; padding: 10rpx 0; color: #273450; font-size: 29rpx; font-weight: 750; }
.down-arrow { width: 15rpx; height: 15rpx; margin-top: -7rpx; border-right: 4rpx solid #5865f2; border-bottom: 4rpx solid #5865f2; transform: rotate(45deg); box-sizing: border-box; }
.total { text-align: right; }.total text, .total b { display: block; }.total text { color: #8792a7; font-size: 20rpx; }.total b { margin-top: 6rpx; color: #2c3859; font-size: 31rpx; }
.overview-tip { display: block; margin-top: 19rpx; padding-top: 18rpx; border-top: 1rpx solid #e6e9f4; color: #8994a8; font-size: 20rpx; line-height: 1.5; }
.record-list { padding: 28rpx 32rpx 56rpx; }.date-group + .date-group { margin-top: 30rpx; }.date-label { display: block; margin: 0 0 14rpx 4rpx; color: #8691a6; font-size: 22rpx; }
.record-card { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 28rpx rgba(34, 43, 75, .045); }.record { display: flex; align-items: center; justify-content: space-between; min-height: 110rpx; padding: 20rpx 25rpx; border-bottom: 1rpx solid #eff1f6; box-sizing: border-box; }.record:last-child { border-bottom: 0; }
.record-main { min-width: 0; padding-right: 18rpx; }.merchant-name, .record-time { display: block; }.merchant-name { overflow: hidden; color: #2b3651; font-size: 27rpx; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }.record-time { margin-top: 9rpx; color: #9aa4b5; font-size: 20rpx; }
.record-amount { display: flex; flex: none; align-items: baseline; gap: 8rpx; color: #5865f2; }.record-amount text { font-size: 26rpx; font-weight: 700; }.record-amount b { font-size: 30rpx; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding-top: 215rpx; color: #707c91; font-size: 28rpx; }.empty-icon { display: flex; align-items: center; justify-content: center; width: 92rpx; height: 92rpx; margin-bottom: 25rpx; border-radius: 30rpx; background: #e8ebff; color: #6571ed; font-size: 46rpx; font-weight: 750; }.empty-tip { margin-top: 13rpx; color: #a0a8b7; font-size: 22rpx; }
.picker-mask { position: fixed; z-index: 100; inset: 0; display: flex; align-items: flex-end; background: rgba(19, 27, 48, .42); }.month-picker { width: 100%; padding: 0 32rpx calc(30rpx + env(safe-area-inset-bottom)); border-radius: 30rpx 30rpx 0 0; background: #fff; box-sizing: border-box; }
.picker-actions { display: flex; align-items: center; justify-content: space-between; height: 104rpx; color: #8a94a6; font-size: 28rpx; }.picker-actions .confirm { color: #5865f2; font-weight: 750; }.year-switcher { display: flex; align-items: center; justify-content: center; gap: 44rpx; padding: 8rpx 0 30rpx; color: #293550; font-size: 32rpx; font-weight: 750; }.year-control { display: flex; align-items: center; justify-content: center; width: 52rpx; height: 52rpx; border-radius: 50%; background: #f0f2fb; color: #5865f2; font-size: 45rpx; font-weight: 400; line-height: 1; }.year-control.disabled, .month-option.disabled { color: #c7cddb; opacity: .6; }
.month-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 17rpx; }.month-option { padding: 20rpx 0; border-radius: 15rpx; background: #f6f7fb; color: #5e6980; text-align: center; font-size: 25rpx; }.month-option.active { background: #5966f3; color: #fff; font-weight: 700; }.month-option.disabled { background: #f8f9fc; }
</style>
