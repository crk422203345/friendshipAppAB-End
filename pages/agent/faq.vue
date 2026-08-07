<template>
  <view class="sub-page">
    <page-nav title="常见问题" />
    <view class="content">
      <view class="search"><text>⌕</text><input v-model="keyword" placeholder="搜索问题关键词" placeholder-class="placeholder" /><text v-if="keyword" class="clear" @tap="keyword = ''">×</text></view>
      <scroll-view scroll-x class="tabs"><view class="tabs-inner"><text v-for="item in categories" :key="item" :class="{ active: activeCategory === item }" @tap="activeCategory = item">{{ item }}</text></view></scroll-view>
      <view v-if="filteredQuestions.length" class="question-list"><view v-for="item in filteredQuestions" :key="item.id" class="question" @tap="toggle(item.id)"><view class="question-title"><text>{{ item.title }}</text><text class="arrow" :class="{ expanded: expandedId === item.id }">⌄</text></view><text v-if="expandedId === item.id" class="answer">{{ item.answer }}</text></view></view>
      <empty-state v-else icon="?" title="没有找到相关问题" description="换个关键词再试试" />
      <button class="support" @tap="contactSupport"><text>◌</text>没有找到答案？联系在线客服</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'

const categories = ['全部', '入驻流程', '提现收益', '商家核销']
const activeCategory = ref('全部')
const keyword = ref('')
const expandedId = ref(1)
const questions = [
  { id: 1, category: '入驻流程', title: '如何邀请商家入驻？', answer: '进入工作台，点击“邀请商家”，向商家展示专属二维码或邀请链接。商家完成资料提交后，即可进入平台审核流程。' },
  { id: 2, category: '入驻流程', title: '商家提交资料后多久审核？', answer: '资料齐全时，平台会在 1—3 个工作日内完成审核；如资料有误，商家可根据提示补充后再次提交。' },
  { id: 3, category: '提现收益', title: '佣金什么时候结算到账？', answer: '订单完成并通过结算周期后会计入可提现余额。具体到账金额请以收益明细及最终结算数据为准。' },
  { id: 4, category: '提现收益', title: '为什么暂时不能提现？', answer: '请确认已绑定有效银行卡、余额达到提现条件且不存在待结算订单。如仍有疑问，请联系在线客服。' },
  { id: 5, category: '商家核销', title: '商家如何完成订单核销？', answer: '商家登录工作台后，在订单列表核对订单信息并完成核销；核销结果会同步至代理人的收益记录。' }
]
const filteredQuestions = computed(() => {
  const term = keyword.value.trim()
  return questions.filter((item) => (activeCategory.value === '全部' || item.category === activeCategory.value) && (!term || `${item.title}${item.answer}`.includes(term)))
})
usePortalGuard('agent')
function toggle(id) { expandedId.value = expandedId.value === id ? null : id }
function contactSupport() { uni.showActionSheet({ itemList: ['在线客服', '拨打客服热线 400-888-10086'], success: ({ tapIndex }) => uni.showToast({ title: tapIndex ? '客服热线已复制' : '在线客服接入中', icon: 'none' }) }) }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 27rpx 34rpx calc(42rpx + env(safe-area-inset-bottom)); }.search { display: flex; align-items: center; height: 82rpx; padding: 0 22rpx; border-radius: 18rpx; background: #fff; box-shadow: 0 8rpx 22rpx rgba(34, 42, 70, .04); }.search > text:first-child { color: #5966f3; font-size: 38rpx; }.search input { flex: 1; margin-left: 14rpx; font-size: 25rpx; }.placeholder { color: #adb5c2; }.clear { color: #a5adbd; font-size: 36rpx; }.tabs { margin-top: 25rpx; white-space: nowrap; }.tabs-inner { display: inline-flex; gap: 15rpx; }.tabs text { padding: 13rpx 24rpx; border-radius: 20rpx; background: #ebedf4; color: #7d879b; font-size: 23rpx; }.tabs .active { background: #e4e7ff; color: #5865f2; font-weight: 700; }.question-list { margin-top: 26rpx; }.question { margin-bottom: 16rpx; padding: 25rpx 26rpx; border-radius: 20rpx; background: #fff; box-shadow: 0 8rpx 23rpx rgba(34, 42, 70, .04); }.question-title { display: flex; align-items: center; justify-content: space-between; color: #2d3852; font-size: 27rpx; font-weight: 700; }.arrow { color: #8792a5; font-size: 32rpx; transition: transform .2s; }.arrow.expanded { transform: rotate(180deg); }.answer { display: block; margin-top: 18rpx; padding-top: 18rpx; border-top: 1rpx solid #edf0f4; color: #7c879a; font-size: 23rpx; line-height: 1.65; }.empty { padding: 180rpx 0; color: #9aa4b5; text-align: center; font-size: 26rpx; }.support { width: 100%; margin-top: 26rpx; border: 0; border-radius: 17rpx; background: #5966f3; color: #fff; font-size: 25rpx; line-height: 88rpx; }.support::after { border: 0; }.support text { margin-right: 12rpx; font-size: 30rpx; }
</style>
