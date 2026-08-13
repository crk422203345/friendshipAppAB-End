<template><view class="cards-page"><view class="nav"><text @tap="back">‹</text><text>银行卡管理</text><view/></view><view class="body"><view v-if="loading" class="state">正在加载银行卡…</view><template v-else><view class="count">已绑定 {{ cards.length }} 张银行卡</view><view v-for="card in cards" :key="card.id" class="bank-card" :style="{background: `linear-gradient(135deg, ${card.color}, #1e2745)`}" @tap="cardActions(card)"><text class="bank-name">{{card.bank}}<i v-if="card.isDefault">默认</i></text><text class="card-type">{{card.type}}</text><text class="card-number">••••  ••••  ••••  {{card.tail || '—'}}</text><text v-if="card.owner" class="card-owner">{{card.owner}}</text></view><view v-if="!cards.length" class="state">{{ error || '暂未绑定银行卡' }}</view><button v-if="error" class="add" @tap="loadCards">重新加载</button><button v-else class="add" @tap="addCard">＋ 添加银行卡</button></template></view></view></template>
<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { enforcePortal } from '../../core/route-guard'
import { createLatestTask } from '../../core/latest-task.mjs'
import { deleteBankCard, getBankCards, listOf, setDefaultBankCard } from '../../services/agent'

const cards = ref([])
const loading = ref(false)
const error = ref('')
const cardRequests = createLatestTask()
onShow(() => { if (enforcePortal('agent')) loadCards() })

async function loadCards() {
  const request = cardRequests.begin()
  loading.value = true
  error.value = ''
  try { const items = listOf(await getBankCards()); if (!cardRequests.isCurrent(request)) return; cards.value = items.map(normalizeCard).filter((card) => card.id !== undefined && card.id !== null && card.id !== '') }
  catch (exception) { if (!cardRequests.isCurrent(request)) return; cards.value = []; error.value = exception.message || '银行卡加载失败' }
  finally { if (cardRequests.isCurrent(request)) loading.value = false }
}
function normalizeCard(card) {
  const bank = card.bank_name || card.bankName || card.bank || '银行卡'
  return { id: card.id ?? card.bank_card_id ?? card.bankCardId ?? card.bank_card_no ?? card.bankCardNo, bank, tail: card.card_last_four || card.cardLastFour || card.tail || String(card.card_no || card.cardNo || '').slice(-4), type: card.card_type_name || card.cardTypeName || card.type || '储蓄卡', owner: card.account_name_masked || card.accountNameMasked || card.owner_name || '', isDefault: Boolean(card.is_default ?? card.isDefault), color: bank.includes('招商') ? '#cb3d4c' : '#263b78' }
}
function back() { uni.navigateBack() }
function addCard() { uni.showModal({ title: '暂不支持 App 内绑卡', content: '当前后端尚未提供安全绑卡接口，请联系平台客服完成银行卡绑定。', showCancel: false }) }
function cardActions(card) {
  const actions = card.isDefault ? ['解除绑定'] : ['设为默认', '解除绑定']
  uni.showActionSheet({ itemList: actions, success: ({ tapIndex }) => { if (actions[tapIndex] === '设为默认') makeDefault(card); else confirmDelete(card) } })
}
async function makeDefault(card) {
  try { await setDefaultBankCard(card.id); await loadCards(); uni.showToast({ title: '已设为默认银行卡', icon: 'success' }) }
  catch (exception) { uni.showToast({ title: exception.message || '设置失败', icon: 'none' }) }
}
function confirmDelete(card) {
  uni.showModal({ title: '解除绑定', content: `确认解绑${card.bank}（尾号${card.tail}）吗？`, success: async ({ confirm }) => { if (!confirm) return; try { await deleteBankCard(card.id); await loadCards(); uni.showToast({ title: '银行卡已解绑', icon: 'success' }) } catch (exception) { uni.showToast({ title: exception.message || '解绑失败', icon: 'none' }) } } })
}
</script>
<style lang="scss" scoped>.cards-page{min-height:100vh;background:#f7f8fc;color:#28334c}.nav{display:flex;justify-content:space-between;align-items:center;height:calc(102rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 32rpx 0;background:#fff;box-sizing:border-box;font-size:30rpx;font-weight:720}.nav text:first-child{width:60rpx;color:#5966f3;font-size:60rpx;line-height:1}.nav view{width:60rpx}.body{padding:36rpx 34rpx}.count{display:block;margin-bottom:25rpx;color:#7d889b;font-size:23rpx}.state{padding:100rpx 20rpx;color:#8e98aa;text-align:center;font-size:25rpx}.bank-card{position:relative;height:268rpx;margin-bottom:22rpx;padding:31rpx;border-radius:28rpx;color:#fff;box-shadow:0 17rpx 36rpx rgba(25,36,75,.18);box-sizing:border-box}.bank-name,.card-type,.card-number,.card-owner{display:block}.bank-name{font-size:32rpx;font-weight:750}.bank-name i{margin-left:14rpx;padding:5rpx 10rpx;border-radius:8rpx;background:rgba(255,255,255,.18);font-size:18rpx;font-style:normal}.card-type{margin-top:8rpx;color:rgba(255,255,255,.72);font-size:20rpx}.card-number{margin-top:68rpx;font-size:32rpx;letter-spacing:3rpx}.card-owner{position:absolute;bottom:28rpx;color:rgba(255,255,255,.75);font-size:21rpx}.add{width:100%;margin-top:17rpx;border:1rpx solid #cdd3e0;border-radius:16rpx;background:#fff;color:#5966f3;font-size:27rpx;line-height:86rpx}.add::after{border:0}</style>
