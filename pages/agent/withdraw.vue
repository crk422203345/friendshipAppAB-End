<template>
  <view class="withdraw-page">
    <view class="nav"><text class="back" @tap="back">‹</text><text>申请提现</text><view /></view>
    <view class="body">
      <view v-if="loading" class="loading">正在加载提现信息…</view>
      <template v-else>
        <view v-if="selectedCard" class="bank-choice" @tap="chooseCard">
          <view class="bank-logo">{{ selectedCard.bank.slice(0, 1) }}</view>
          <view><b>{{ selectedCard.bank }}（尾号{{ selectedCard.tail }}）</b><text>{{ arrivalText }}</text></view>
          <view class="chevron" />
        </view>
        <view v-else class="empty-card" @tap="goBankCards"><b>尚未绑定银行卡</b><text>绑定银行卡后才能申请提现</text></view>
        <view class="amount-card"><text>提现金额</text><view class="amount-input"><text>¥</text><input v-model="amount" type="digit" placeholder="0.00" placeholder-class="placeholder" /></view><view class="available"><text>当前可提现佣金 {{ formattedAvailable }} 元</text><text @tap="fillAll">全部提现</text></view></view>
        <button class="confirm" :disabled="!isAmountValid || submitting" :loading="submitting" @tap="openPassword">确认提现</button>
        <text class="rule">{{ ruleText }}</text>
      </template>
    </view>
    <view v-if="showPassword" class="mask"><view class="password-panel"><text class="close" @tap="closePassword">×</text><text class="panel-title">确认支付密码</text><text class="amount-title">提现金额</text><text class="panel-amount">¥{{ normalizedAmount }}</text><view class="password-boxes"><view v-for="index in 6" :key="index" class="box"><i v-if="password.length >= index" /></view></view><text class="forgot" @tap="goForgot">忘记支付密码？</text><view class="keypad"><view v-for="(key, index) in keys" :key="index" @tap="pressKey(key)">{{ key }}</view><view @tap="pressKey('delete')">⌫</view></view></view></view>
    <view v-if="showError" class="dialog-mask"><view class="error-dialog"><text>{{ errorMessage }}</text><view><button @tap="goForgot">忘记密码</button><button class="retry" @tap="retry">重新输入</button></view></view></view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { enforcePortal } from '../../core/route-guard'
import { createWithdrawal, getBankCards, getCommissionSummary, getWithdrawalPolicy, listOf, unwrap } from '../../services/agent'
const amount = ref(''); const availableAmount = ref(0); const cards = ref([]); const policy = ref({}); const selectedCardIndex = ref(0); const loading = ref(false); const submitting = ref(false); const showPassword = ref(false); const showError = ref(false); const errorMessage = ref('提现申请失败，请重试'); const password = ref(''); const keys = ['1','2','3','4','5','6','7','8','9','','0']
onMounted(loadWithdrawalInfo)
const selectedCard = computed(() => cards.value[selectedCardIndex.value] || null)
const normalizedAmount = computed(() => Number(amount.value || 0).toFixed(2))
const formattedAvailable = computed(() => `¥${availableAmount.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
const minimumAmount = computed(() => Number(policy.value.minimum_amount ?? policy.value.min_amount ?? policy.value.minimumAmount ?? 0))
const maximumAmount = computed(() => Number(policy.value.maximum_amount ?? policy.value.max_amount ?? policy.value.maximumAmount ?? availableAmount.value) || availableAmount.value)
const effectiveMaximum = computed(() => Math.min(availableAmount.value, maximumAmount.value))
const isAmountValid = computed(() => Boolean(selectedCard.value) && Number(amount.value) > 0 && Number(amount.value) >= minimumAmount.value && Number(amount.value) <= effectiveMaximum.value)
const arrivalText = computed(() => policy.value.arrival_text || policy.value.arrivalText || '到账时间以银行处理结果为准')
const ruleText = computed(() => minimumAmount.value > 0 ? `单笔最低提现 ¥${minimumAmount.value.toFixed(2)}，最高不超过可提现余额` : '单笔提现金额不得超过可提现佣金余额')
let withdrawalKey = ''
watch([amount, selectedCardIndex], () => { withdrawalKey = '' })
async function loadWithdrawalInfo() {
  if (!enforcePortal('agent')) return
  loading.value = true
  try {
    const [summaryResult, cardsResult, policyResult] = await Promise.allSettled([getCommissionSummary(), getBankCards(), getWithdrawalPolicy()])
    const failures = []
    if (summaryResult.status === 'fulfilled') {
      const summary = unwrap(summaryResult.value) || {}
      availableAmount.value = Number(summary.available_balance_amount ?? summary.availableBalanceAmount ?? 0)
    } else { availableAmount.value = 0; failures.push(summaryResult.reason) }
    if (cardsResult.status === 'fulfilled') cards.value = listOf(cardsResult.value).map(normalizeCard).filter((card) => card.id !== undefined && card.id !== null && card.id !== '')
    else { cards.value = []; failures.push(cardsResult.reason) }
    policy.value = policyResult.status === 'fulfilled' ? (unwrap(policyResult.value) || {}) : {}
    const defaultIndex = cards.value.findIndex((card) => card.isDefault)
    selectedCardIndex.value = defaultIndex >= 0 ? defaultIndex : 0
    if (failures.length) uni.showToast({ title: failures[0]?.message || '部分提现信息加载失败', icon: 'none' })
  } catch (error) { uni.showToast({ title: error.message || '提现信息加载失败', icon: 'none' }) } finally { loading.value = false }
}
function normalizeCard(card) { return { id: card.id ?? card.bank_card_id ?? card.bankCardId ?? card.bank_card_no ?? card.bankCardNo, bank: card.bank_name || card.bankName || card.bank || '银行卡', tail: card.card_last_four || card.cardLastFour || card.tail || String(card.card_no || card.cardNo || '').slice(-4), isDefault: Boolean(card.is_default ?? card.isDefault) } }
function back() { uni.navigateBack() }
function fillAll() { amount.value = effectiveMaximum.value.toFixed(2) }
function chooseCard() { if (!cards.value.length) return; uni.showActionSheet({ itemList: cards.value.map((item) => `${item.bank}（尾号${item.tail}）`), success: ({ tapIndex }) => { selectedCardIndex.value = tapIndex } }) }
function openPassword() { if (!isAmountValid.value) return; password.value = ''; showPassword.value = true }
function closePassword() { showPassword.value = false; password.value = '' }
function pressKey(key) { if (key === '') return; if (key === 'delete') { password.value = password.value.slice(0, -1); return } if (password.value.length < 6) password.value += key; if (password.value.length === 6) setTimeout(submitWithdrawal, 180) }
async function submitWithdrawal() {
  if (submitting.value || !isAmountValid.value || password.value.length !== 6) return
  submitting.value = true
  try {
    if (!withdrawalKey) withdrawalKey = `withdraw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    await createWithdrawal({ bank_card_id: selectedCard.value.id, amount: Number(normalizedAmount.value), payment_password: password.value }, withdrawalKey)
    withdrawalKey = ''
    showPassword.value = false
    uni.showModal({ title: '提现申请已提交', content: '可在收益明细中查看后续处理状态。', showCancel: false, success: back })
  } catch (error) { if (error.statusCode >= 400 && error.statusCode < 500) withdrawalKey = ''; showPassword.value = false; errorMessage.value = error.message || '提现申请失败，请重试'; showError.value = true } finally { password.value = ''; submitting.value = false }
}
function retry() { showError.value = false; password.value = ''; showPassword.value = true }
function goForgot() { showError.value = false; showPassword.value = false; uni.navigateTo({ url: '/pages/agent/payment-password-reset' }) }
function goBankCards() { uni.navigateTo({ url: '/pages/agent/bank-cards' }) }
</script>

<style lang="scss" scoped>
.withdraw-page{min-height:100vh;background:#f7f8fc;color:#28334c}.nav{display:flex;justify-content:space-between;align-items:center;height:calc(102rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 32rpx 0;background:#fff;box-sizing:border-box;font-size:30rpx;font-weight:720}.nav .back{width:60rpx;color:#5966f3;font-size:60rpx;line-height:1}.nav view{width:60rpx}.body{padding:34rpx}.loading{padding:180rpx 0;color:#909aac;text-align:center;font-size:25rpx}.bank-choice{display:flex;align-items:center;gap:18rpx;padding:27rpx;border-radius:22rpx;background:#fff}.bank-logo{display:flex;align-items:center;justify-content:center;width:61rpx;height:61rpx;border-radius:17rpx;background:#e9edff;color:#5966f3;font-size:29rpx;font-weight:750}.bank-choice b,.bank-choice text,.empty-card b,.empty-card text{display:block}.bank-choice b{font-size:26rpx}.bank-choice text,.empty-card text{margin-top:8rpx;color:#8d98aa;font-size:21rpx}.empty-card{padding:30rpx;border:1rpx dashed #cbd1df;border-radius:22rpx;background:#fff;text-align:center}.empty-card b{font-size:27rpx}.chevron{width:16rpx;height:16rpx;margin-left:auto;border-top:3rpx solid #8d97a9;border-right:3rpx solid #8d97a9;transform:rotate(45deg);box-sizing:border-box}.amount-card{margin-top:23rpx;padding:30rpx;border-radius:23rpx;background:#fff}.amount-card>text{color:#68758c;font-size:23rpx}.amount-input{display:flex;align-items:center;margin-top:34rpx;border-bottom:1rpx solid #e6e9f0}.amount-input>text{padding-right:15rpx;font-size:44rpx;font-weight:700}.amount-input input{height:82rpx;flex:1;font-size:50rpx;font-weight:700}.placeholder{color:#c5cad5;font-size:43rpx}.available{display:flex;justify-content:space-between;margin-top:20rpx;color:#8c97a8;font-size:21rpx}.available text:last-child{color:#5966f3}.confirm{width:100%;margin-top:42rpx;border:0;border-radius:16rpx;background:#5966f3;color:#fff;font-size:28rpx;line-height:88rpx}.confirm[disabled]{background:#c5cad7}.confirm::after{border:0}.rule{display:block;margin-top:22rpx;color:#a0a8b7;text-align:center;font-size:20rpx}.mask,.dialog-mask{position:fixed;inset:0;z-index:20;display:flex;align-items:flex-end;background:rgba(23,31,52,.45)}.password-panel{position:relative;width:100%;padding:38rpx 34rpx calc(30rpx + env(safe-area-inset-bottom));border-radius:30rpx 30rpx 0 0;background:#fff;box-sizing:border-box;text-align:center}.close{position:absolute;top:24rpx;left:30rpx;color:#7f899b;font-size:44rpx}.panel-title,.amount-title,.panel-amount,.forgot{display:block}.panel-title{font-size:31rpx;font-weight:750}.amount-title{margin-top:31rpx;color:#8b95a5;font-size:21rpx}.panel-amount{margin-top:8rpx;font-size:43rpx;font-weight:750}.password-boxes{display:flex;justify-content:center;gap:13rpx;margin-top:31rpx}.box{display:flex;align-items:center;justify-content:center;width:64rpx;height:68rpx;border:1rpx solid #d8dce7;border-radius:12rpx}.box i{width:15rpx;height:15rpx;border-radius:50%;background:#27314a}.forgot{margin:25rpx 0;color:#5966f3;font-size:22rpx}.keypad{display:grid;grid-template-columns:repeat(3,1fr);margin:0 -34rpx -30rpx}.keypad view{height:91rpx;border-top:1rpx solid #e7e9ef;border-right:1rpx solid #e7e9ef;font-size:34rpx;line-height:91rpx}.keypad view:nth-child(3n){border-right:0}.error-dialog{width:560rpx;margin:auto;padding:49rpx 30rpx 28rpx;border-radius:25rpx;background:#fff;text-align:center;font-size:28rpx;font-weight:700}.error-dialog>view{display:flex;gap:17rpx;margin-top:38rpx}.error-dialog button{flex:1;border:1rpx solid #d7dce8;border-radius:14rpx;background:#fff;color:#68758d;font-size:24rpx;line-height:75rpx}.error-dialog .retry{border:0;background:#5966f3;color:#fff}.error-dialog button::after{border:0}</style>
