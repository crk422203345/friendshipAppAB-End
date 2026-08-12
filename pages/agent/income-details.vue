<template>
  <view class="detail-page">
    <page-nav title="收支明细" />
    <scroll-view class="page-body" scroll-y>
      <view class="overview-card">
        <view class="overview-top"><view class="month-trigger" @tap="openPicker"><text>{{ monthLabel }}</text><view class="down-arrow" /></view><view class="total"><text>累计佣金</text><b>¥{{ formatAmount(totalAmount) }}</b></view></view>
        <text class="overview-tip">佣金将在订单结算后计入账户，可提现金额以最终结算为准</text>
      </view>
      <view v-if="groupedRecords.length" class="record-list"><view v-for="group in groupedRecords" :key="group.date" class="date-group"><text class="date-label">{{ group.date }}</text><view class="record-card"><view v-for="record in group.records" :key="record.id" class="record"><view class="record-main"><text class="merchant-name">{{ record.merchant }}</text><text class="record-time">{{ record.time }} · {{ record.description }}</text></view><view class="record-amount"><text>{{ record.amount >= 0 ? '+' : '-' }}</text><b>¥{{ formatAmount(Math.abs(record.amount)) }}</b></view></view></view></view></view>
      <empty-state v-else-if="!loading" icon="¥" title="当月暂无收支明细" description="选择其他月份查看历史收益" />
      <view v-else class="loading-state">收支明细加载中…</view>
    </scroll-view>
    <view v-if="pickerVisible" class="picker-mask" @tap="closePicker"><view class="month-picker" @tap.stop><view class="picker-actions"><text @tap="closePicker">取消</text><text class="confirm" @tap="confirmPicker">确定</text></view><view class="year-switcher"><view class="year-control" :class="{ disabled: draftYear <= firstAvailableYear }" @tap="changeYear(-1)">‹</view><text>{{ draftYear }}年</text><view class="year-control" :class="{ disabled: draftYear >= currentYear }" @tap="changeYear(1)">›</view></view><view class="month-grid"><view v-for="number in 12" :key="number" class="month-option" :class="{ active: draftMonth === number, disabled: isFutureMonth(number) }" @tap="selectMonth(number)">{{ number }}月</view></view></view></view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'
import { getLedger, listOf, unwrap } from '../../services/agent'

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const firstAvailableYear = 2021
const selectedMonth = ref({ year: currentYear, month: currentMonth })
const pickerVisible = ref(false)
const draftYear = ref(currentYear)
const draftMonth = ref(currentMonth)
const records = ref([])
const monthTotal = ref(null)
const loading = ref(false)

onLoad((options) => {
  const matched = String(options?.month || '').match(/^(\d{4})[-/](\d{1,2})/)
  if (matched) selectedMonth.value = { year: Number(matched[1]), month: Number(matched[2]) }
})
usePortalGuard('agent')
onMounted(loadLedger)

const selectedKey = computed(() => monthKey(selectedMonth.value.year, selectedMonth.value.month))
const monthLabel = computed(() => `${selectedMonth.value.year}年${selectedMonth.value.month}月`)
const groupedRecords = computed(() => {
  const groups = new Map()
  records.value.forEach((record) => {
    const date = record.date || '-'
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date).push(record)
  })
  return [...groups.entries()].map(([date, groupRecords]) => ({ date, records: groupRecords }))
})
const totalAmount = computed(() => monthTotal.value ?? records.value.reduce((total, record) => total + record.amount, 0))

function monthKey(year, month) { return `${year}-${String(month).padStart(2, '0')}` }
function normalizeRecord(item) {
  const occurredAt = item.occurred_at || item.occurredAt || item.created_at || item.createdAt || item.settled_at || ''
  const occurredDate = String(occurredAt).slice(0, 10)
  return {
    id: item.entry_no || item.entryNo || item.ledger_no || item.ledgerNo || item.id || `${occurredAt}-${Math.random()}`,
    merchant: item.merchant_name || item.merchantName || item.merchant?.name || item.title || '-',
    description: item.description || item.type_name || item.typeName || item.remark || '佣金收入',
    amount: Number(item.signed_amount ?? item.signedAmount ?? item.amount ?? item.commission_amount ?? item.commissionAmount ?? item.change_amount ?? 0),
    date: occurredDate,
    time: String(occurredAt).slice(11, 19) || '--:--:--'
  }
}
async function loadLedger() {
  loading.value = true
  try {
    const response = await getLedger({ month: selectedKey.value, page: 1, page_size: 100 })
    const payload = unwrap(response) || {}
    records.value = listOf(response).map(normalizeRecord)
    const total = Number(payload.month_total ?? payload.monthTotal)
    monthTotal.value = Number.isFinite(total) ? total : null
    if (!records.value.length && Array.isArray(payload.ledger_items)) records.value = payload.ledger_items.map(normalizeRecord)
  } catch (error) {
    records.value = []
    monthTotal.value = null
    uni.showToast({ title: error.message || '收支明细加载失败', icon: 'none' })
  } finally { loading.value = false }
}
function formatAmount(amount) { return Number(amount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function openPicker() { draftYear.value = selectedMonth.value.year; draftMonth.value = selectedMonth.value.month; pickerVisible.value = true }
function closePicker() { pickerVisible.value = false }
function changeYear(offset) { const nextYear = draftYear.value + offset; if (nextYear < firstAvailableYear || nextYear > currentYear) return; draftYear.value = nextYear; if (draftYear.value === currentYear && draftMonth.value > currentMonth) draftMonth.value = currentMonth }
function isFutureMonth(month) { return draftYear.value === currentYear && month > currentMonth }
function selectMonth(month) { if (!isFutureMonth(month)) draftMonth.value = month }
function confirmPicker() { selectedMonth.value = { year: draftYear.value, month: draftMonth.value }; closePicker(); loadLedger() }
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f6f7fb; color: #202a43; }.page-body { height: calc(100vh - 108rpx - env(safe-area-inset-top)); box-sizing: border-box; }.overview-card { margin: 26rpx 32rpx 0; padding: 28rpx 30rpx; border-radius: 24rpx; background: linear-gradient(135deg, #ffffff, #f2f3ff); box-shadow: 0 10rpx 30rpx rgba(34, 43, 75, .05); }.overview-top { display: flex; align-items: center; justify-content: space-between; }.month-trigger { display: flex; align-items: center; gap: 13rpx; padding: 10rpx 0; color: #273450; font-size: 29rpx; font-weight: 750; }.down-arrow { width: 15rpx; height: 15rpx; margin-top: -7rpx; border-right: 4rpx solid #5865f2; border-bottom: 4rpx solid #5865f2; transform: rotate(45deg); box-sizing: border-box; }.total { text-align: right; }.total text, .total b { display: block; }.total text { color: #8792a7; font-size: 20rpx; }.total b { margin-top: 6rpx; color: #2c3859; font-size: 31rpx; }.overview-tip { display: block; margin-top: 19rpx; padding-top: 18rpx; border-top: 1rpx solid #e6e9f4; color: #8994a8; font-size: 20rpx; line-height: 1.5; }.record-list { padding: 28rpx 32rpx 56rpx; }.date-group + .date-group { margin-top: 30rpx; }.date-label { display: block; margin: 0 0 14rpx 4rpx; color: #8691a6; font-size: 22rpx; }.record-card { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 28rpx rgba(34, 43, 75, .045); }.record { display: flex; align-items: center; justify-content: space-between; min-height: 110rpx; padding: 20rpx 25rpx; border-bottom: 1rpx solid #eff1f6; box-sizing: border-box; }.record:last-child { border-bottom: 0; }.record-main { min-width: 0; padding-right: 18rpx; }.merchant-name, .record-time { display: block; }.merchant-name { overflow: hidden; color: #2b3651; font-size: 27rpx; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }.record-time { margin-top: 9rpx; color: #9aa4b5; font-size: 20rpx; }.record-amount { display: flex; flex: none; align-items: baseline; gap: 8rpx; color: #5865f2; }.record-amount text { font-size: 26rpx; font-weight: 700; }.record-amount b { font-size: 30rpx; }.loading-state { padding-top: 215rpx; color: #707c91; text-align: center; font-size: 28rpx; }.picker-mask { position: fixed; z-index: 100; inset: 0; display: flex; align-items: flex-end; background: rgba(19, 27, 48, .42); }.month-picker { width: 100%; padding: 0 32rpx calc(30rpx + env(safe-area-inset-bottom)); border-radius: 30rpx 30rpx 0 0; background: #fff; box-sizing: border-box; }.picker-actions { display: flex; align-items: center; justify-content: space-between; height: 104rpx; color: #8a94a6; font-size: 28rpx; }.picker-actions .confirm { color: #5865f2; font-weight: 750; }.year-switcher { display: flex; align-items: center; justify-content: center; gap: 44rpx; padding: 8rpx 0 30rpx; color: #293550; font-size: 32rpx; font-weight: 750; }.year-control { display: flex; align-items: center; justify-content: center; width: 52rpx; height: 52rpx; border-radius: 50%; background: #f0f2fb; color: #5865f2; font-size: 45rpx; font-weight: 400; line-height: 1; }.year-control.disabled, .month-option.disabled { color: #c7cddb; opacity: .6; }.month-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 17rpx; }.month-option { padding: 20rpx 0; border-radius: 15rpx; background: #f6f7fb; color: #5e6980; text-align: center; font-size: 25rpx; }.month-option.active { background: #5966f3; color: #fff; font-weight: 700; }.month-option.disabled { background: #f8f9fc; }
</style>
