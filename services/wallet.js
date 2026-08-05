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
  wallet.cards.unshift({
    id: Date.now(),
    bank,
    tail: cardNo.slice(-4),
    type: '储蓄卡',
    color: bank === '招商银行' ? '#cb3d4c' : '#263b78'
  })
}

export function withdraw(amount) {
  wallet.availableAmount = Number((wallet.availableAmount - amount).toFixed(2))
}
