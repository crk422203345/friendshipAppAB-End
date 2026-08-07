<template>
  <view class="detail-page">
    <view class="nav"><text class="back" @tap="back">‹</text><text>操作教程</text><view /></view>
    <scroll-view class="body" scroll-y><text class="title">{{ article.title }}</text><text class="date">更新时间：2026-08-07</text><view class="cover"><text>{{ article.badge }}</text></view><view class="article-content"><text v-for="item in article.paragraphs" :key="item">{{ item }}</text></view><view class="notice"><text>!</text><text>本教程内容仅供平台业务操作参考，请以页面实际提示和平台规则为准。</text></view></scroll-view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { enforcePortal } from '../../core/route-guard'

const id = ref(1)
const articles = {
  1: { title: '第一步：面对面邀请商家扫码开店', badge: '邀请商家', paragraphs: ['打开工作台中的“邀请商家”入口，向商家展示专属邀请二维码。', '请商家使用手机扫描二维码，进入开店引导页后按照步骤完善基本信息。', '邀请码用于识别邀请关系，请勿将二维码用于非业务场景。'] },
  2: { title: '第二步：协助商家完成资质上传', badge: '资质上传', paragraphs: ['提示商家准备营业执照、经营信息及平台要求的其他材料。', '请仔细核对上传资料的清晰度与有效期，避免因信息缺失影响审核进度。', '资料提交后，商家可在工作台查看审核状态。'] },
  3: { title: '第三步：等待平台审核', badge: '平台审核', paragraphs: ['平台会对商家的入驻资料进行审核，并通过页面状态同步审核结果。', '若资料需要补充，请协助商家按提示完成修改后再次提交。', '审核通过后，商家即可使用对应的经营功能。'] },
  4: { title: '第四步：收益查看与银行卡提现流程', badge: '收益提现', paragraphs: ['在收益页面查看按月汇总和按日展示的佣金明细。', '完成银行卡绑定并确认可提现余额后，可提交提现申请。', '实际到账金额和时间以最终结算及银行处理结果为准。'] }
}
const article = computed(() => articles[id.value] || articles[1])
onLoad((options) => { id.value = Number(options?.id) || 1 })
onMounted(() => enforcePortal('agent'))
function back() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #fff; color: #293550; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; border-bottom: 1rpx solid #eff1f5; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.body { height: calc(100vh - 106rpx - env(safe-area-inset-top)); padding: 40rpx 40rpx 70rpx; box-sizing: border-box; }.title, .date, .article-content text { display: block; }.title { font-size: 39rpx; font-weight: 760; line-height: 1.45; }.date { margin-top: 16rpx; color: #9aa4b4; font-size: 21rpx; }.cover { display: flex; align-items: center; justify-content: center; height: 330rpx; margin-top: 34rpx; border-radius: 25rpx; background: linear-gradient(145deg, #e4e7ff, #bfc6ff); color: #5966f3; font-size: 39rpx; font-weight: 750; }.article-content { margin-top: 34rpx; }.article-content text { margin-top: 20rpx; color: #58647a; font-size: 27rpx; line-height: 1.85; }.article-content text:first-child { margin-top: 0; }.notice { display: flex; gap: 12rpx; margin-top: 42rpx; padding: 22rpx; border-radius: 18rpx; background: #f0f2ff; color: #6c7799; font-size: 21rpx; line-height: 1.55; }.notice text:first-child { display: flex; flex: none; align-items: center; justify-content: center; width: 28rpx; height: 28rpx; border-radius: 50%; background: #5966f3; color: #fff; font-size: 18rpx; font-weight: 700; }
</style>
