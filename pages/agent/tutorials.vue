<template>
  <view class="sub-page">
    <page-nav title="操作教程" />
    <view class="content">
      <view class="tab-switch"><text :class="{ active: activeTab === 'video' }" @tap="activeTab = 'video'">视频</text><text :class="{ active: activeTab === 'article' }" @tap="activeTab = 'article'">图文</text></view>
      <view v-if="activeTab === 'video'" class="video-section"><view class="video-cover" @tap="playVideo"><view class="play">▶</view><view class="video-caption"><text>新手指南 · 3 分钟快速上手</text><text>了解邀请商家、收益查看与结算流程</text></view></view><view class="video-tip"><text>视频教程</text><text>点击封面开始播放</text></view></view>
      <view v-else class="article-list"><view v-for="item in articles" :key="item.id" class="article" @tap="goDetail(item.id)"><view class="article-index">{{ item.id }}</view><view><text>{{ item.title }}</text><text>{{ item.copy }}</text></view><view class="chevron" /></view></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'

const activeTab = ref('video')
const articles = [
  { id: 1, title: '第一步：面对面邀请商家扫码开店', copy: '展示专属邀请二维码，指导商家完成开户注册。' },
  { id: 2, title: '第二步：协助商家完成资质上传', copy: '核对经营资料，避免因信息缺失影响审核。' },
  { id: 3, title: '第三步：等待平台审核', copy: '审核状态会同步至商家侧与代理人工作台。' },
  { id: 4, title: '第四步：收益查看与银行卡提现流程', copy: '查看结算明细、绑定银行卡并提交提现申请。' }
]
usePortalGuard('agent')
function playVideo() { uni.showToast({ title: '教程视频资源准备中', icon: 'none' }) }
function goDetail(id) { uni.navigateTo({ url: `/pages/agent/tutorial-detail?id=${id}` }) }
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 30rpx 34rpx; }.tab-switch { display: flex; padding: 7rpx; border-radius: 19rpx; background: #e9ebf3; }.tab-switch text { flex: 1; padding: 14rpx 0; border-radius: 14rpx; color: #7a8599; text-align: center; font-size: 25rpx; }.tab-switch .active { background: #fff; color: #5865f2; font-weight: 750; box-shadow: 0 4rpx 12rpx rgba(34, 42, 70, .06); }.video-cover { position: relative; display: flex; flex-direction: column; justify-content: flex-end; height: 390rpx; margin-top: 29rpx; overflow: hidden; padding: 28rpx; border-radius: 26rpx; background: linear-gradient(145deg, #38466f, #717eff); box-sizing: border-box; }.video-cover::after { position: absolute; top: -80rpx; right: -50rpx; width: 290rpx; height: 290rpx; border: 46rpx solid rgba(255, 255, 255, .12); border-radius: 50%; content: ''; }.play { position: absolute; top: 105rpx; left: calc(50% - 49rpx); z-index: 1; display: flex; align-items: center; justify-content: center; width: 98rpx; height: 98rpx; padding-left: 7rpx; border-radius: 50%; background: rgba(255, 255, 255, .92); color: #5966f3; font-size: 36rpx; box-sizing: border-box; }.video-caption { position: relative; z-index: 1; }.video-caption text { display: block; color: #fff; font-size: 29rpx; font-weight: 700; }.video-caption text:last-child { margin-top: 10rpx; color: #dce1ff; font-size: 21rpx; font-weight: 400; }.video-tip { display: flex; justify-content: space-between; margin: 23rpx 5rpx; color: #8290a8; font-size: 22rpx; }.video-tip text:first-child { color: #35415c; font-size: 26rpx; font-weight: 700; }.article-list { margin-top: 28rpx; }.article { display: flex; align-items: center; gap: 17rpx; margin-bottom: 17rpx; padding: 25rpx; border-radius: 21rpx; background: #fff; box-shadow: 0 9rpx 25rpx rgba(34, 42, 70, .045); }.article-index { display: flex; flex: none; align-items: center; justify-content: center; width: 46rpx; height: 46rpx; border-radius: 15rpx; background: #e7eaff; color: #5966f3; font-size: 22rpx; font-weight: 750; }.article > view:nth-child(2) { flex: 1; min-width: 0; }.article > view:nth-child(2) text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.article > view:nth-child(2) text:first-child { color: #34415c; font-size: 25rpx; font-weight: 700; }.article > view:nth-child(2) text:last-child { margin-top: 9rpx; color: #8d98aa; font-size: 20rpx; }.chevron { flex: none; width: 14rpx; height: 14rpx; border-top: 3rpx solid #9ba5b6; border-right: 3rpx solid #9ba5b6; transform: rotate(45deg); box-sizing: border-box; }
</style>
