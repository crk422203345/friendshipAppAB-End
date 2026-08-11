import { reactive } from 'vue'

export const wallet = reactive({
  availableAmount: 3702,
  totalCommission: 3702,
  cards: [
    { id: 1, bank: '工商银行', tail: '8888', type: '储蓄卡', color: '#263b78' },
    { id: 2, bank: '招商银行', tail: '6218', type: '储蓄卡', color: '#cb3d4c' }
  ]
})

export function addBankCard({ bank, cardNo }) {
  const normalizedBank = String(bank || '').trim()
  const normalizedCardNo = String(cardNo || '').replace(/\s/g, '')
  if (!normalizedBank) throw new Error('请选择开户银行')
  if (!/^\d{13,19}$/.test(normalizedCardNo)) throw new Error('银行卡号格式不正确')

  const card = {
    id: Date.now(),
    bank: normalizedBank,
    tail: normalizedCardNo.slice(-4),
    type: '储蓄卡',
    color: normalizedBank === '招商银行' ? '#cb3d4c' : '#263b78'
  }
  wallet.cards.unshift(card)
  return card
}

export function withdraw(amount) {
  const normalizedAmount = Number(amount)
  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) throw new Error('提现金额必须大于 0')
  if (normalizedAmount > wallet.availableAmount) throw new Error('提现金额不能超过可提现余额')
  wallet.availableAmount = Number((wallet.availableAmount - normalizedAmount).toFixed(2))
  return wallet.availableAmount
}
