<template>
  <view class="income-page">
    <view class="content">
      <view class="header"><view><text class="title">我的收益</text><text class="subtitle">实时更新您的收益数据</text></view><view class="wallet-icon">¥</view></view>
      <view class="balance-card"><text>累计可提现佣金</text><view><text class="currency">¥</text><b>{{ formatAmount(summary.availableBalanceAmount) }}</b></view><text class="balance-tip">实际到账金额以最终结算数据为准</text></view>
      <button class="withdraw-button" :disabled="summary.availableBalanceAmount <= 0" @tap="goWithdraw">{{ summary.availableBalanceAmount > 0 ? '申请提现' : '暂无可提现金额' }}</button>
      <view class="bank-entry" @tap="goBankCards"><view class="bank-symbol">▣</view><view><b>银行卡管理</b><text>已绑定 {{ bankCardCount }} 张</text></view><view class="chevron" /></view>
      <view class="section-heading"><text>收益明细</text><text @tap="goDetails()">查看全部</text></view>
      <view v-if="summaries.length" class="income-list"><view v-for="item in summaries" :key="item.month" class="income-row" @tap="goDetails(item.month)"><view><b>{{ formatMonth(item.month) }}</b><text>{{ item.label }}：<strong>¥{{ formatAmount(item.amount) }}</strong></text></view><view class="chevron" /></view></view>
      <view v-else-if="!loading" class="empty-income">暂无收益明细</view>
    </view><agent-tabbar active="income" />
  </view>
</template>

<script setup>
import AgentTabbar from '../../components/agent-tabbar.vue'
import { onMounted, ref } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { getBankCards, getCommissionMonths, getCommissionSummary, listOf, unwrap } from '../../services/agent'

const summary = ref({ availableBalanceAmount: 0 })
const bankCardCount = ref(0)
const summaries = ref([])
const loading = ref(false)

onMounted(async () => {
  if (!enforcePortal('agent')) return
  loading.value = true
  try { await Promise.all([loadSummary(), loadBankCards(), loadMonths()]) } finally { loading.value = false }
})
async function loadSummary() {
  try {
    const data = unwrap(await getCommissionSummary()) || {}
    summary.value = { availableBalanceAmount: Number(data.available_balance_amount ?? data.availableBalanceAmount ?? 0) }
  } catch (error) { uni.showToast({ title: error.message || '收益加载失败', icon: 'none' }) }
}
async function loadBankCards() {
  try { bankCardCount.value = listOf(await getBankCards()).length } catch (error) { uni.showToast({ title: error.message || '银行卡加载失败', icon: 'none' }) }
}
async function loadMonths() {
  try {
    summaries.value = listOf(await getCommissionMonths(12)).map((item) => ({
      month: item.month || item.month_key || item.monthKey || '',
      amount: Number(item.income_amount ?? item.incomeAmount ?? item.net_amount ?? item.netAmount ?? item.amount ?? item.commission_amount ?? item.commissionAmount ?? item.settled_amount ?? 0),
      label: item.label || (item.empty ? '暂无收益' : item.status === 'estimated' ? '本月预估' : '当月收入')
    })).filter((item) => item.month)
  } catch (error) { uni.showToast({ title: error.message || '收益明细加载失败', icon: 'none' }) }
}
function formatAmount(value) { return Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function formatMonth(month) { const matched = String(month).match(/^(\d{4})[-/](\d{1,2})/); return matched ? `${matched[1]}年${Number(matched[2])}月` : month }
function goWithdraw() { uni.navigateTo({ url: '/pages/agent/withdraw' }) }
function goBankCards() { uni.navigateTo({ url: '/pages/agent/bank-cards' }) }
function goDetails(month) { uni.navigateTo({ url: `/pages/agent/income-details${month ? `?month=${encodeURIComponent(month)}` : ''}` }) }
</script>

<style lang="scss" scoped>
.income-page { min-height: 100vh; background: #f7f8fc; color: #28334c; }.content { padding: calc(42rpx + env(safe-area-inset-top)) 34rpx 150rpx; }.header { display: flex; align-items: flex-start; justify-content: space-between; }.title, .subtitle, .balance-card > text, .balance-tip, .bank-entry b, .bank-entry text, .income-row b, .income-row text { display: block; }.title { font-size: 38rpx; font-weight: 760; }.subtitle { margin-top: 10rpx; color: #98a2b3; font-size: 22rpx; }.wallet-icon { display: flex; align-items: center; justify-content: center; width: 70rpx; height: 70rpx; border-radius: 22rpx; background: #e6e8ff; color: #5966f3; font-size: 35rpx; font-weight: 750; }.balance-card { margin-top: 37rpx; padding: 34rpx; border-radius: 28rpx; background: linear-gradient(135deg, #283865, #5966f3); color: #fff; box-shadow: 0 20rpx 48rpx rgba(63,78,185,.22); }.balance-card > text { color: #dbe1ff; font-size: 23rpx; }.balance-card > view { display: flex; align-items: baseline; margin-top: 17rpx; }.currency { margin-right: 8rpx; font-size: 34rpx; font-weight: 700; }.balance-card b { font-size: 54rpx; letter-spacing: 1rpx; }.balance-card .balance-tip { margin-top: 19rpx; color: #cdd4ff; font-size: 20rpx; }.withdraw-button { width: 100%; margin-top: 22rpx; border: 0; border-radius: 17rpx; background: #5966f3; color: #fff; font-size: 28rpx; font-weight: 650; line-height: 89rpx; }.withdraw-button::after { border: 0; }.withdraw-button[disabled] { background: #c8cdd9; }.bank-entry { display: flex; align-items: center; gap: 18rpx; margin-top: 34rpx; padding: 26rpx; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34,42,70,.045); }.bank-symbol { display: flex; align-items: center; justify-content: center; width: 62rpx; height: 62rpx; border-radius: 18rpx; background: #eef0ff; color: #5966f3; font-size: 31rpx; }.bank-entry b { font-size: 26rpx; }.bank-entry text { margin-top: 8rpx; color: #95a0b2; font-size: 21rpx; }.chevron { flex: none; width: 16rpx; height: 16rpx; margin-left: auto; border-top: 3rpx solid #8c97aa; border-right: 3rpx solid #8c97aa; transform: rotate(45deg); box-sizing: border-box; }.section-heading { display: flex; justify-content: space-between; align-items: center; margin: 43rpx 2rpx 20rpx; }.section-heading text:first-child { font-size: 30rpx; font-weight: 750; }.section-heading text:last-child { color: #808ca0; font-size: 22rpx; }.income-list { overflow: hidden; border-radius: 22rpx; background: #fff; box-shadow: 0 10rpx 27rpx rgba(34,42,70,.045); }.income-row { display: flex; align-items: center; padding: 27rpx; border-bottom: 1rpx solid #f0f1f5; }.income-row:last-child { border: 0; }.income-row b { font-size: 26rpx; }.income-row text { margin-top: 12rpx; color: #8490a3; font-size: 22rpx; }.income-row strong { color: #3d4964; font-weight: 700; }.empty-income { padding: 54rpx 0; border-radius: 22rpx; background: #fff; color: #9aa4b5; text-align: center; font-size: 24rpx; }
</style>
