<template>
  <view class="sub-page">
    <page-nav title="平台规则" />
    <view class="content">
      <scroll-view scroll-x class="tabs"><view class="tabs-inner"><text v-for="item in ruleSets" :key="item.key" :class="{ active: activeKey === item.key }" @tap="activeKey = item.key">{{ item.name }}</text></view></scroll-view>
      <view class="rule-card"><text class="rule-title">{{ current.title }}</text><text class="rule-intro">{{ current.intro }}</text><view v-for="(item, index) in current.items" :key="item.title" class="rule-item"><view class="number">{{ index + 1 }}</view><view><text>{{ item.title }}</text><text>{{ item.copy }}</text></view></view></view>
      <view class="notice"><text>!</text><text>本规则最终解释权归平台所有，如有更新将通过平台公告通知。</text></view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageNav from '../../components/page-nav.vue'
import { usePortalGuard } from '../../composables/use-portal-guard'

const activeKey = ref('commission')
const ruleSets = [
  { key: 'commission', name: '分佣规则', title: '代理人推广与佣金结算规则说明', intro: '佣金根据已完成结算的商家订单计算，页面展示金额仅供参考。', items: [{ title: '结算范围', copy: '仅统计经平台确认且处于有效状态的订单。' }, { title: '结算周期', copy: '订单完成后进入结算周期，结算完成后计入可提现余额。' }, { title: '异常订单', copy: '退款、撤销或存在争议的订单将暂不参与佣金结算。' }] },
  { key: 'merchant', name: '商家规范', title: '商家入驻与经营规范', intro: '请协助商家如实提交资料，并遵守平台经营和核销要求。', items: [{ title: '资料真实性', copy: '商家应保证营业资质、联系方式等资料真实有效。' }, { title: '订单核销', copy: '应按实际消费情况完成核销，严禁虚假交易。' }, { title: '违规处理', copy: '平台有权对违规账户限制功能或终止合作。' }] },
  { key: 'settlement', name: '结算规范', title: '资金结算与提现规范', intro: '提现申请将根据绑定银行卡与风险校验结果进行处理。', items: [{ title: '银行卡信息', copy: '请使用本人有效银行卡，并妥善保管账户信息。' }, { title: '提现处理', copy: '提交申请后请耐心等待处理，到账时间以银行通知为准。' }, { title: '风险控制', copy: '平台可能对异常交易进行核验或延迟结算。' }] }
]
const current = computed(() => ruleSets.find((item) => item.key === activeKey.value))
usePortalGuard('agent')
</script>

<style lang="scss" scoped>
.sub-page { min-height: 100vh; background: #f7f8fc; color: #27314a; }.nav { display: flex; align-items: center; justify-content: space-between; height: calc(106rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 32rpx 0; background: #fff; box-sizing: border-box; font-size: 31rpx; font-weight: 750; }.nav view, .back { width: 60rpx; }.back { color: #5865f2; font-size: 64rpx; line-height: 1; }.content { padding: 27rpx 34rpx; }.tabs { white-space: nowrap; }.tabs-inner { display: inline-flex; gap: 17rpx; }.tabs text { min-width: 136rpx; padding: 15rpx 18rpx; border-radius: 20rpx; background: #fff; color: #7c879a; text-align: center; font-size: 24rpx; box-sizing: border-box; }.tabs .active { background: #5966f3; color: #fff; font-weight: 700; }.rule-card { margin-top: 27rpx; padding: 32rpx 29rpx; border-radius: 25rpx; background: #fff; box-shadow: 0 12rpx 30rpx rgba(34, 42, 70, .05); }.rule-title, .rule-intro, .rule-item text { display: block; }.rule-title { color: #293550; font-size: 31rpx; font-weight: 750; line-height: 1.45; }.rule-intro { margin-top: 17rpx; color: #7e899b; font-size: 23rpx; line-height: 1.6; }.rule-item { display: flex; gap: 17rpx; margin-top: 29rpx; }.number { display: flex; flex: none; align-items: center; justify-content: center; width: 38rpx; height: 38rpx; border-radius: 12rpx; background: #e9ebff; color: #5966f3; font-size: 20rpx; font-weight: 750; }.rule-item text:first-child { color: #33405c; font-size: 25rpx; font-weight: 700; }.rule-item text:last-child { margin-top: 7rpx; color: #8490a3; font-size: 22rpx; line-height: 1.55; }.notice { display: flex; gap: 12rpx; margin-top: 24rpx; padding: 21rpx 23rpx; border-radius: 17rpx; background: #eef0ff; color: #68749c; font-size: 21rpx; line-height: 1.55; }.notice text:first-child { display: flex; flex: none; align-items: center; justify-content: center; width: 28rpx; height: 28rpx; border-radius: 50%; background: #5966f3; color: #fff; font-size: 18rpx; font-weight: 700; }
</style>
