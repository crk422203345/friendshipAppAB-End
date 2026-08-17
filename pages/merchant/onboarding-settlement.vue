<template>
  <view class="page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>商家入驻与协议</text><view /></view>
    <view class="body">
      <merchant-onboarding-progress :current="3" />
      <view class="heading"><text class="eyebrow">STEP 03</text><text class="title">绑定收款结算账户</text><text class="subtitle">账户信息将用于门店订单结算</text></view>

      <view class="card">
        <text class="section-title">账户类型</text>
        <view class="type-tabs">
          <view :class="{ active: form.accountType === 'business' }" @tap="changeType('business')"><text>企业对公账户</text><text>适用于企业商户</text></view>
          <view :class="{ active: form.accountType === 'personal' }" @tap="changeType('personal')"><text>法人个人银行卡</text><text>适用于个体商户</text></view>
        </view>

        <view class="field"><text class="label">开户银行 <text class="required">*</text></text><picker :range="banks" @change="selectBank"><view class="picker"><text :class="form.bankName ? 'value' : 'placeholder'">{{ form.bankName || '请选择开户银行' }}</text><view class="picker-arrow"><view /></view></view></picker></view>
        <view class="field"><text class="label">银行卡号 <text class="required">*</text></text><view class="card-number"><input v-model.trim="form.accountNumber" type="number" maxlength="19" placeholder="请输入 16–19 位银行卡号" /><text class="iconfont icon-yinxingqia" @tap="scanBankCard"></text></view></view>
        <view v-if="form.bankCardImage" class="bank-image"><image :src="form.bankCardImage" mode="aspectFill" /><view><text>银行卡照片已上传</text><text @tap="scanBankCard">重新拍摄</text></view></view>
        <view class="fee-tip"><text>i</text><text>平台将按订单规则收取服务费用，实际费率以签署协议为准。</text></view>
      </view>

      <view class="agreement-row" @tap="toggleAgreement"><text class="checkbox" :class="{ checked: form.agreed }">{{ form.agreed ? '✓' : '' }}</text><text>我已阅读并同意签署</text><text class="link" @tap.stop="showAgreement = true">《商户收付通服务协议》</text></view>
      <view v-if="error" class="error"><text>!</text><text>{{ error }}</text></view>
      <button class="primary" :disabled="submitting" :loading="submitting" @tap="submit">完成验证</button>
      <text class="secure">信息已加密保护，仅用于账户核验</text>
    </view>

    <view v-if="showAgreement" class="modal" @tap="showAgreement = false">
      <view class="agreement-sheet" @tap.stop>
        <view class="sheet-handle" />
        <view class="sheet-title"><text>商户收付通服务协议</text><text @tap="showAgreement = false">×</text></view>
        <scroll-view scroll-y class="agreement-content">
          <text class="agreement-date">更新日期：2026 年 8 月</text>
          <text class="agreement-heading">一、服务说明</text><text>本协议用于约定商户使用平台收款、订单结算及相关技术服务时的权利与义务。商户应确保提交的主体、经营及结算资料真实、合法、有效。</text>
          <text class="agreement-heading">二、账户与结算</text><text>平台根据订单状态与约定结算周期，将可结算款项支付至商户绑定的银行账户。因账户信息错误造成的延迟，由商户及时修改并重新核验。</text>
          <text class="agreement-heading">三、服务费用</text><text>平台可按照订单金额及已公示的计费规则收取服务费用。具体费率、结算周期和退款处理方式以商户确认的业务规则为准。</text>
          <text class="agreement-heading">四、信息保护</text><text>平台将依法采取合理安全措施保护商户资料，仅在履行本协议、监管核验与风险控制所需范围内处理相关信息。</text>
          <text class="agreement-heading">五、特别提示</text><text>请在签署前完整阅读本协议。如对条款存在疑问，请先联系平台支持人员。</text>
        </scroll-view>
        <button @tap="acceptAgreement">已阅读并同意</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import MerchantOnboardingProgress from '../../components/merchant-onboarding-progress.vue'
import { loadMerchantOnboardingDraft, saveMerchantOnboardingDraft } from '../../composables/use-merchant-onboarding'

const banks = ['工商银行', '农业银行', '中国银行', '建设银行', '交通银行', '招商银行', '浦发银行', '中信银行', '民生银行', '平安银行', '其他银行']
const draft = reactive(loadMerchantOnboardingDraft())
const form = reactive(draft.settlement)
const error = ref('')
const submitting = ref(false)
const showAgreement = ref(false)

onUnload(save)
watch(form, save, { deep: true })

function save() { draft.settlement = form; saveMerchantOnboardingDraft(draft) }
function goBack() { save(); uni.navigateBack() }
function changeType(type) {
  if (form.accountType === type) return
  form.accountType = type
  form.bankName = ''
  form.accountNumber = ''
  form.bankCardImage = ''
}
function selectBank(event) { form.bankName = banks[Number(event.detail.value)] }
function scanBankCard() {
  uni.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['camera', 'album'], success: ({ tempFilePaths }) => { form.bankCardImage = tempFilePaths[0] } })
}
function toggleAgreement() { form.agreed = !form.agreed }
function acceptAgreement() { form.agreed = true; showAgreement.value = false }
function submit() {
  error.value = ''
  if (!form.bankName) error.value = '请选择开户银行'
  else if (!/^\d{16,19}$/.test(form.accountNumber)) error.value = '请输入正确的 16–19 位银行卡号'
  else if (!form.bankCardImage) error.value = '请拍摄或上传银行卡照片用于核验'
  else if (!form.agreed) { showAgreement.value = true; error.value = '请阅读并同意商户收付通服务协议' }
  if (error.value) return
  submitting.value = true
  draft.status = 'reviewing'
  draft.submittedAt = new Date().toISOString()
  draft.rejectionReasons = []
  save()
  setTimeout(() => uni.reLaunch({ url: '/pages/merchant/onboarding-result' }), 450)
}
</script>

<style lang="scss" scoped>
.page{min-height:100vh;background:#f3f7f5;color:#193b32}.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;height:calc(98rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 30rpx 0;border-bottom:1rpx solid #e5ece9;background:rgba(255,255,255,.96);box-sizing:border-box;font-size:30rpx;font-weight:750}.topbar view,.back{width:58rpx}.back{color:#14795e;font-size:58rpx;line-height:1}.body{max-width:700rpx;margin:0 auto;padding:0 30rpx calc(50rpx + env(safe-area-inset-bottom))}.heading{padding:27rpx 10rpx 28rpx}.eyebrow,.title,.subtitle,.section-title,.label,.fee-tip text,.secure,.agreement-content text{display:block}.eyebrow{color:#16a77e;font-size:19rpx;font-weight:800;letter-spacing:2rpx}.title{margin-top:10rpx;color:#153d32;font-size:39rpx;font-weight:800}.subtitle{margin-top:10rpx;color:#83948e;font-size:23rpx}.card{padding:30rpx;border:1rpx solid #dfe8e4;border-radius:26rpx;background:#fff;box-shadow:0 14rpx 38rpx rgba(29,78,64,.055)}.section-title{font-size:28rpx;font-weight:780}.type-tabs{display:grid;grid-template-columns:1fr 1fr;gap:15rpx;margin-top:20rpx}.type-tabs>view{display:flex;flex-direction:column;align-items:center;padding:23rpx 10rpx;border:2rpx solid #e2e9e6;border-radius:17rpx;color:#536b64}.type-tabs>view.active{border-color:#23b68b;background:#effbf7;color:#11785c;box-shadow:inset 0 0 0 1rpx #23b68b}.type-tabs text{display:block}.type-tabs text:nth-child(2){margin-top:7rpx;font-size:22rpx;font-weight:700}.type-tabs text:last-child{margin-top:5rpx;color:#92a09b;font-size:18rpx}.type-icon{font-size:30rpx}.field{margin-top:27rpx}.label{margin-bottom:12rpx;color:#3a554d;font-size:23rpx;font-weight:650}.required{color:#ed655d}.picker,.card-number{display:flex;align-items:center;height:86rpx;padding:0 23rpx;border:1rpx solid #dfe7e4;border-radius:16rpx;background:#f9fbfa;box-sizing:border-box}.value{flex:1;color:#24493f;font-size:25rpx}.placeholder{flex:1;color:#a5b0ac;font-size:24rpx}.chevron{color:#75867f;font-size:35rpx}.card-number input{flex:1;font-size:25rpx}.card-number>text{padding:15rpx;color:#139a75;font-size:30rpx}.bank-image{display:flex;align-items:center;gap:16rpx;margin-top:16rpx;padding:15rpx;border-radius:15rpx;background:#f3f8f6}.bank-image image{width:92rpx;height:61rpx;border-radius:8rpx}.bank-image text{display:block;color:#587169;font-size:20rpx}.bank-image text:last-child{margin-top:5rpx;color:#129675}.fee-tip{display:flex;gap:12rpx;margin-top:23rpx;padding:18rpx;border-radius:14rpx;background:#f5f8f7;color:#73857f;font-size:20rpx;line-height:1.5}.fee-tip text:first-child{display:flex;flex:none;align-items:center;justify-content:center;width:27rpx;height:27rpx;border:2rpx solid #7f918b;border-radius:50%;font-size:17rpx}.agreement-row{display:flex;align-items:flex-start;flex-wrap:wrap;margin:26rpx 4rpx;color:#6d817a;font-size:21rpx;line-height:32rpx}.checkbox{display:inline-flex;align-items:center;justify-content:center;width:32rpx;height:32rpx;margin-right:10rpx;border:2rpx solid #9baba5;border-radius:7rpx;box-sizing:border-box}.checkbox.checked{border-color:#12a27a;background:#12a27a;color:#fff}.link{color:#0d9470}.error{display:flex;align-items:center;gap:13rpx;margin:0 4rpx 20rpx;padding:19rpx 22rpx;border-radius:14rpx;background:#fff0ef;color:#c7514c;font-size:22rpx}.error text:first-child{display:flex;align-items:center;justify-content:center;width:29rpx;height:29rpx;border:2rpx solid #e1605a;border-radius:50%;font-weight:800}.primary{width:100%;border-radius:18rpx;background:linear-gradient(135deg,#0f9b75,#20bb8d);color:#fff;font-size:28rpx;font-weight:700;line-height:96rpx;box-shadow:0 14rpx 28rpx rgba(17,158,119,.2)}.primary[disabled]{opacity:.6}.primary::after{border:0}.secure{margin-top:18rpx;color:#96a49f;text-align:center;font-size:20rpx}.modal{position:fixed;z-index:30;right:0;bottom:0;left:0;display:flex;align-items:flex-end;height:100vh;background:rgba(14,35,29,.48)}.agreement-sheet{width:100%;padding:16rpx 32rpx calc(30rpx + env(safe-area-inset-bottom));border-radius:32rpx 32rpx 0 0;background:#fff;box-sizing:border-box}.sheet-handle{width:70rpx;height:7rpx;margin:0 auto 20rpx;border-radius:7rpx;background:#d8dfdc}.sheet-title{display:flex;align-items:center;justify-content:space-between;color:#203f36;font-size:29rpx;font-weight:750}.sheet-title text:last-child{padding:0 8rpx;color:#86948f;font-size:43rpx;font-weight:300}.agreement-content{height:610rpx;margin:24rpx 0;color:#5c7069;font-size:22rpx;line-height:1.8}.agreement-date{color:#95a29e}.agreement-heading{margin-top:20rpx;color:#264a3f;font-weight:750}.agreement-sheet button{border-radius:16rpx;background:#12a47b;color:#fff;font-size:27rpx;font-weight:700;line-height:88rpx}.agreement-sheet button::after{border:0}
.page{overflow-x:hidden}.body{width:100%;box-sizing:border-box}.picker-arrow{display:flex;flex:none;align-items:center;justify-content:center;width:50rpx;height:50rpx;border-radius:14rpx;background:#e9f7f2}.picker-arrow view{width:13rpx;height:13rpx;margin-top:-7rpx;border-right:3rpx solid #0e8c69;border-bottom:3rpx solid #0e8c69;transform:rotate(45deg)}
</style>
