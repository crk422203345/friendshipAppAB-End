<template>
  <view class="page" :class="`status-${status}`">
    <view class="topbar"><text class="back" @tap="backToGuide">‹</text><text>商家入驻与协议</text><view /></view>
    <view class="body">
      <merchant-onboarding-progress :current="4" />
      <view class="result-card">
        <view class="status-mark"><view class="status-inner"><text>{{ statusIcon }}</text></view></view>
        <text class="result-kicker">{{ statusKicker }}</text>
        <text class="result-title">{{ statusTitle }}</text>
        <text class="result-copy">{{ statusCopy }}</text>

        <view v-if="status === 'reviewing'" class="timeline">
          <view class="timeline-item done"><text class="timeline-dot">✓</text><view><text>资料已提交</text><text>{{ submittedTime }}</text></view></view>
          <view class="timeline-line" />
          <view class="timeline-item"><text class="timeline-dot">2</text><view><text>平台审核中</text><text>预计 1–3 个工作日完成</text></view></view>
          <view class="timeline-line muted" />
          <view class="timeline-item muted"><text class="timeline-dot">3</text><view><text>开通商家工作台</text><text>审核结果将通过消息通知</text></view></view>
        </view>

        <view v-if="status === 'failed'" class="reason-panel">
          <view class="reason-head"><text>!</text><text>驳回原因详情</text></view>
          <view v-for="(reason, index) in rejectionReasons" :key="`${reason.step}-${index}`" class="reason-item">
            <text class="reason-dot" />
            <view><text>{{ reason.step }}</text><text>{{ reason.message }}</text></view>
          </view>
        </view>

        <button v-if="status === 'success'" class="primary" @tap="enterWorkbench">进入商家工作台</button>
        <button v-else-if="status === 'failed'" class="primary" @tap="returnToEdit">返回修改</button>
        <button v-else class="secondary" @tap="backToGuide">返回开店引导</button>
      </view>

      <view v-if="status !== 'success'" class="support" @tap="contactSupport">
        <view class="support-icon">☏</view><view><text>联系在线客服</text><text>工作日 09:00–18:00</text></view><text class="arrow">›</text>
      </view>
      <text class="application-no">申请编号：{{ applicationNumber }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MerchantOnboardingProgress from '../../components/merchant-onboarding-progress.vue'
import { loadMerchantOnboardingDraft, saveMerchantOnboardingDraft } from '../../composables/use-merchant-onboarding'

const draft = reactive(loadMerchantOnboardingDraft())
const status = ref(['reviewing', 'success', 'failed'].includes(draft.status) ? draft.status : 'reviewing')
const defaultReasons = [
  { step: '基础资料录入', message: '品牌名称与实际经营内容不符', route: '/pages/merchant/onboarding-basic' },
  { step: '执照上传与验证', message: '营业执照图片模糊，无法识别统一社会信用代码', route: '/pages/merchant/onboarding-qualification' }
]

onLoad((options) => {
  if (['reviewing', 'success', 'failed'].includes(options?.status)) {
    status.value = options.status
    draft.status = options.status
    saveMerchantOnboardingDraft(draft)
  }
})

const rejectionReasons = computed(() => draft.rejectionReasons.length ? draft.rejectionReasons : defaultReasons)
const statusIcon = computed(() => status.value === 'failed' ? '×' : status.value === 'success' ? '✓' : '⌛')
const statusKicker = computed(() => status.value === 'success' ? '审核已通过' : status.value === 'failed' ? '需要补充资料' : '申请已提交')
const statusTitle = computed(() => status.value === 'success' ? '恭喜，您的店铺已成功入驻！' : status.value === 'failed' ? '审核未通过，请修改后重新提交' : '资料正在审核中')
const statusCopy = computed(() => status.value === 'success' ? '现在可以进入核销工作台，开始管理门店订单。' : status.value === 'failed' ? '请根据下方原因修改对应资料，无需重新填写全部步骤。' : '我们正在核验您的主体与经营资料，请耐心等待。')
const submittedTime = computed(() => {
  if (!draft.submittedAt) return '刚刚'
  const date = new Date(draft.submittedAt)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
})
const applicationNumber = computed(() => {
  const seed = draft.submittedAt ? new Date(draft.submittedAt).getTime().toString().slice(-8) : 'PENDING'
  return `MER-${seed}`
})

function backToGuide() { uni.reLaunch({ url: '/pages/auth/merchant-onboarding' }) }
function contactSupport() { uni.navigateTo({ url: '/pages/auth/merchant-contact' }) }
function enterWorkbench() { uni.reLaunch({ url: '/pages/merchant/home' }) }
function returnToEdit() {
  draft.status = 'draft'
  saveMerchantOnboardingDraft(draft)
  uni.reLaunch({ url: rejectionReasons.value[0]?.route || '/pages/merchant/onboarding-basic' })
}
</script>

<style lang="scss" scoped>
.page{min-height:100vh;background:#f3f7f5;color:#193b32}.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;height:calc(98rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 30rpx 0;border-bottom:1rpx solid #e5ece9;background:rgba(255,255,255,.96);box-sizing:border-box;font-size:30rpx;font-weight:750}.topbar view,.back{width:58rpx}.back{color:#14795e;font-size:58rpx;line-height:1}.body{max-width:700rpx;margin:0 auto;padding:0 30rpx calc(50rpx + env(safe-area-inset-bottom))}.result-card{margin-top:24rpx;padding:46rpx 32rpx 31rpx;border:1rpx solid #dfe8e4;border-radius:30rpx;background:#fff;text-align:center;box-shadow:0 18rpx 50rpx rgba(28,74,61,.07)}.status-mark{display:flex;align-items:center;justify-content:center;width:130rpx;height:130rpx;margin:0 auto 23rpx;border-radius:50%;background:#d8faef}.status-inner{display:flex;align-items:center;justify-content:center;width:88rpx;height:88rpx;border-radius:50%;background:#20b88b;color:#fff;font-size:54rpx;font-weight:850}.status-reviewing .status-mark{background:#fff4c7}.status-reviewing .status-inner{background:#f1c84b;color:#795d00;font-size:34rpx}.status-failed .status-mark{background:#ffe0df}.status-failed .status-inner{background:#ef625d}.result-kicker,.result-title,.result-copy,.timeline-item text,.reason-item text,.support text,.application-no{display:block}.result-kicker{color:#14a47b;font-size:20rpx;font-weight:750;letter-spacing:1rpx}.status-reviewing .result-kicker{color:#b6860e}.status-failed .result-kicker{color:#d74e49}.result-title{margin-top:10rpx;color:#173d32;font-size:34rpx;font-weight:800;line-height:1.4}.result-copy{max-width:520rpx;margin:13rpx auto 0;color:#7e908a;font-size:22rpx;line-height:1.6}.timeline{margin-top:34rpx;padding:25rpx;border-radius:20rpx;background:#f6f9f8;text-align:left}.timeline-item{display:flex;align-items:flex-start;gap:16rpx}.timeline-dot{display:flex!important;flex:none;align-items:center;justify-content:center;width:39rpx;height:39rpx;border-radius:50%;background:#e2e9e7;color:#75857f;font-size:19rpx;font-weight:750}.timeline-item.done .timeline-dot{background:#29b98e;color:#fff}.timeline-item text:first-child{color:#314f46;font-size:22rpx;font-weight:700}.timeline-item text:last-child{margin-top:4rpx;color:#94a29d;font-size:18rpx}.timeline-item.muted{opacity:.55}.timeline-line{width:3rpx;height:24rpx;margin:6rpx 0 6rpx 18rpx;background:#77d5ba}.timeline-line.muted{background:#dce4e1}.reason-panel{margin-top:30rpx;padding:24rpx;border:1rpx solid #f2d9d7;border-radius:19rpx;background:#fff8f7;text-align:left}.reason-head{display:flex;align-items:center;gap:10rpx;margin-bottom:18rpx;color:#9f3432;font-size:23rpx;font-weight:750}.reason-head text:first-child{display:flex;align-items:center;justify-content:center;width:29rpx;height:29rpx;border:2rpx solid #d64d48;border-radius:6rpx}.reason-item{display:flex;gap:15rpx;margin-top:17rpx}.reason-dot{flex:none;width:10rpx;height:10rpx;margin-top:11rpx;border-radius:50%;background:#e34f4a}.reason-item text:first-child{color:#5c413e;font-size:21rpx;font-weight:700}.reason-item text:last-child{margin-top:5rpx;color:#7f6461;font-size:21rpx;line-height:1.5}.primary,.secondary{width:100%;margin-top:35rpx;border-radius:17rpx;font-size:27rpx;font-weight:700;line-height:91rpx}.primary{background:linear-gradient(135deg,#0f9b75,#20bb8d);color:#fff;box-shadow:0 14rpx 28rpx rgba(17,158,119,.18)}.secondary{border:1rpx solid #bde6da;background:#f1fbf7;color:#138363}.primary::after,.secondary::after{border:0}.support{display:flex;align-items:center;margin-top:20rpx;padding:24rpx 26rpx;border:1rpx solid #dfe8e4;border-radius:22rpx;background:#fff}.support-icon{display:flex;align-items:center;justify-content:center;width:58rpx;height:58rpx;margin-right:16rpx;border-radius:18rpx;background:#dcf8ef;color:#109675;font-size:28rpx}.support text:first-child{color:#304d45;font-size:23rpx;font-weight:700}.support text:last-child{margin-top:4rpx;color:#94a29d;font-size:19rpx}.arrow{margin-left:auto!important;color:#7f918b!important;font-size:43rpx!important;font-weight:300!important}.application-no{margin-top:20rpx;color:#a0aca8;text-align:center;font-size:18rpx}
.page{overflow-x:hidden}.body{width:100%;box-sizing:border-box}
</style>
