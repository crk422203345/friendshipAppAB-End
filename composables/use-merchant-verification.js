import { computed, ref } from 'vue'

const STORAGE_KEY = 'merchant-verification-orders-v1'

const initialOrders = [
  { id: 'O20260817001', packageName: '家庭四人套餐', status: 'pending', table: 'A12', time: '19:02', customer: '李女士', phone: '138-****-4412', voucherCode: '99218832', amount: 168, createdAt: '2026-08-17T19:02:00+08:00', items: [{ name: '香煎牛排', quantity: 2, price: 88 }, { name: '田园沙拉', quantity: 1, price: 32 }] },
  { id: 'O20260817002', packageName: '超值单人午餐', status: 'pending', table: 'B05', time: '18:45', customer: '张先生', phone: '138-****-1209', voucherCode: '77231102', amount: 98, createdAt: '2026-08-17T18:45:00+08:00', items: [{ name: '巧克力松露熔岩蛋糕', quantity: 1, price: 58 }, { name: '法式鲜果塔', quantity: 1, price: 40 }] },
  { id: 'O20260817003', packageName: '双人聚餐套餐', status: 'pending', table: 'C08', time: '18:32', customer: '王先生', phone: '138-****-8821', voucherCode: '82910293', amount: 126, createdAt: '2026-08-17T18:32:00+08:00', items: [{ name: '意式经典拿铁', quantity: 2, price: 26 }, { name: '海盐芝士披萨', quantity: 1, price: 74 }] },
  { id: 'O20260817004', packageName: '家庭四人套餐', status: 'verified', table: 'A15', time: '16:20', customer: '陈女士', phone: '138-****-6358', voucherCode: '11111111', amount: 206, createdAt: '2026-08-17T16:20:00+08:00', verifiedAt: '2026-08-17T16:34:00+08:00', items: [{ name: '家庭分享主餐', quantity: 1, price: 158 }, { name: '鲜榨果汁', quantity: 4, price: 12 }] },
  { id: 'O20260816005', packageName: '下午茶双人套餐', status: 'verified', table: 'D03', time: '15:10', customer: '周女士', phone: '138-****-5076', voucherCode: '55667788', amount: 106, createdAt: '2026-08-16T15:10:00+08:00', verifiedAt: '2026-08-16T15:20:00+08:00', items: [{ name: '手作甜点', quantity: 2, price: 35 }, { name: '精品咖啡', quantity: 2, price: 18 }] },
  { id: 'O20260815006', packageName: '周末限定套餐', status: 'expired', table: 'E06', time: '20:00', customer: '赵先生', phone: '138-****-3390', voucherCode: '66001234', amount: 188, createdAt: '2026-08-15T20:00:00+08:00', items: [{ name: '限定主厨套餐', quantity: 2, price: 94 }] }
]

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function localDateKey(value) {
  const date = value instanceof Date ? value : new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function loadOrders() {
  const saved = uni.getStorageSync(STORAGE_KEY)
  return Array.isArray(saved) && saved.length ? saved : clone(initialOrders)
}

const orders = ref(loadOrders())
const notifications = ref([
  { id: 1, title: '今日核销提醒', copy: '当前有 3 笔订单等待核销，请及时处理。', time: '刚刚', unread: true },
  { id: 2, title: '账单结算通知', copy: '昨日营业款已进入结算流程。', time: '09:30', unread: false }
])

function persist() { uni.setStorageSync(STORAGE_KEY, clone(orders.value)) }
export function normalizeVoucherCode(value) { return String(value || '').replace(/\D/g, '').slice(0, 8) }

export function useMerchantVerification() {
  const pendingOrders = computed(() => orders.value.filter((item) => item.status === 'pending'))
  const todayVerifiedOrders = computed(() => orders.value.filter((item) => item.status === 'verified' && item.verifiedAt && localDateKey(item.verifiedAt) === localDateKey(new Date())))
  const todayVerifiedAmount = computed(() => todayVerifiedOrders.value.reduce((sum, item) => sum + Number(item.amount || 0), 0))
  const unreadCount = computed(() => notifications.value.filter((item) => item.unread).length)

  function findByCode(code) {
    const normalized = normalizeVoucherCode(code)
    return orders.value.find((item) => item.voucherCode === normalized) || null
  }
  function verifyOrder(orderId) {
    const order = orders.value.find((item) => item.id === orderId)
    if (!order) return { ok: false, message: '未找到对应订单' }
    if (order.status === 'verified') return { ok: false, order, message: '该券码已完成核销' }
    order.status = 'verified'
    order.verifiedAt = new Date().toISOString()
    persist()
    return { ok: true, order, message: '核销成功' }
  }
  function markNotificationsRead() {
    notifications.value.forEach((item) => { item.unread = false })
  }
  return { orders, notifications, pendingOrders, todayVerifiedOrders, todayVerifiedAmount, unreadCount, findByCode, verifyOrder, markNotificationsRead }
}

export const orderStatusMeta = {
  pending: { label: '待核销', tone: 'pending' },
  verified: { label: '已核销', tone: 'verified' },
  expired: { label: '已超时', tone: 'expired' }
}
