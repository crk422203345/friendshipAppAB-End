<template>
  <view class="page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>商家入驻与协议</text><view /></view>
    <view class="body">
      <merchant-onboarding-progress :current="2" />
      <view class="heading"><text class="eyebrow">STEP 02</text><text class="title">上传经营资质</text><text class="subtitle">请确保照片清晰、完整、无反光</text></view>

      <view class="document-list">
        <view v-for="item in documentTypes" :key="item.key" class="document-card">
          <view class="document-preview" @tap="uploadDocument(item)">
            <image v-if="form.documents[item.key]" :src="form.documents[item.key]" mode="aspectFill" />
            <view v-else class="sample"><text class="sample-icon iconfont" :class="item.icon"></text><text>证件示例</text></view>
          </view>
          <view class="document-content">
            <view class="document-title"><text>{{ item.title }}</text><text class="required">*</text><text v-if="form.documents[item.key]" class="uploaded">✓ 已上传</text></view>
            <text class="document-tip">{{ item.tip }}</text>
            <button class="upload-button" @tap="uploadDocument(item)"><text>{{ form.documents[item.key] ? '↻' : '＋' }}</text>{{ form.documents[item.key] ? '更换照片' : '拍照或上传' }}</button>
          </view>
        </view>
      </view>

      <view v-if="uploadedCount" class="recognition-card">
        <view class="recognition-title"><text class="spark">✦</text><view><text>核对识别信息</text><text>请以证件原件为准补充或修改</text></view></view>
        <view class="field"><text>法人姓名</text><input v-model.trim="form.legalName" maxlength="30" placeholder="请输入法人姓名" /></view>
        <view class="field"><text>法人身份证号</text><input v-model.trim="form.idNumber" maxlength="18" placeholder="请输入 18 位身份证号" /></view>
        <view class="field"><text>银行卡号</text><input v-model.trim="form.bankCardNumber" type="number" maxlength="19" placeholder="请输入结算银行卡号" /></view>
        <view class="field"><text>营业执照编号</text><input v-model.trim="form.licenseNumber" maxlength="30" placeholder="请输入统一社会信用代码" /></view>
      </view>

      <view class="privacy"><text class="privacy-icon">i</text><text>资料仅用于商户实名核验，平台将加密传输与存储</text></view>
      <view v-if="error" class="error"><text>!</text><text>{{ error }}</text></view>
      <button class="primary" @tap="next">保存并继续 <text>→</text></button>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import MerchantOnboardingProgress from '../../components/merchant-onboarding-progress.vue'
import { loadMerchantOnboardingDraft, saveMerchantOnboardingDraft } from '../../composables/use-merchant-onboarding'

const documentTypes = [
  { key: 'legalId', title: '法人身份证', tip: '上传正反面清晰彩色扫描件', icon: 'icon-farenshenfenzhengzhao' },
  { key: 'legalBankCard', title: '法人银行卡', tip: '卡号与持卡人信息清晰可见', icon: 'icon-yinxingqia' },
  { key: 'businessLicense', title: '营业执照', tip: '原件或加盖公章的复印件', icon: 'icon-yingyezhizhao2' },
  { key: 'businessPermit', title: '行业许可证', tip: '食品经营、卫生许可等相关证件', icon: 'icon-yingyezhizhao' }
]
const draft = reactive(loadMerchantOnboardingDraft())
const form = reactive(draft.qualification)
const error = ref('')
const uploadedCount = computed(() => documentTypes.filter(({ key }) => form.documents[key]).length)

onUnload(save)
watch(form, save, { deep: true })

function save() { draft.qualification = form; saveMerchantOnboardingDraft(draft) }
function goBack() { save(); uni.navigateBack() }
function uploadDocument(item) {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: ({ tempFilePaths }) => { form.documents[item.key] = tempFilePaths[0] }
  })
}
function next() {
  error.value = ''
  const missing = documentTypes.find(({ key }) => !form.documents[key])
  if (missing) error.value = `请上传${missing.title}`
  else if (!form.legalName) error.value = '请核对并填写法人姓名'
  else if (!/^\d{17}[\dXx]$/.test(form.idNumber)) error.value = '请输入正确的 18 位法人身份证号'
  else if (!/^\d{16,19}$/.test(form.bankCardNumber)) error.value = '请输入正确的 16–19 位银行卡号'
  else if (!/^[0-9A-Z]{15,20}$/i.test(form.licenseNumber)) error.value = '请输入正确的营业执照编号'
  if (error.value) { uni.pageScrollTo({ scrollTop: 0, duration: 250 }); return }
  save()
  uni.navigateTo({ url: '/pages/merchant/onboarding-settlement' })
}
</script>

<style lang="scss" scoped>
.page{min-height:100vh;background:#f3f7f5;color:#193b32}.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;height:calc(98rpx + env(safe-area-inset-top));padding:env(safe-area-inset-top) 30rpx 0;border-bottom:1rpx solid #e5ece9;background:rgba(255,255,255,.96);box-sizing:border-box;font-size:30rpx;font-weight:750}.topbar view,.back{width:58rpx}.back{color:#14795e;font-size:58rpx;line-height:1}.body{max-width:700rpx;margin:0 auto;padding:0 30rpx calc(50rpx + env(safe-area-inset-bottom))}.heading{padding:27rpx 10rpx 28rpx}.eyebrow,.title,.subtitle,.document-tip,.recognition-title text,.privacy text{display:block}.eyebrow{color:#16a77e;font-size:19rpx;font-weight:800;letter-spacing:2rpx}.title{margin-top:10rpx;color:#153d32;font-size:39rpx;font-weight:800}.subtitle{margin-top:10rpx;color:#83948e;font-size:23rpx}.document-list{display:flex;flex-direction:column;gap:18rpx}.document-card{display:flex;gap:24rpx;padding:24rpx;border:1rpx solid #dfe8e4;border-radius:24rpx;background:#fff;box-shadow:0 12rpx 34rpx rgba(30,77,64,.045)}.document-preview{flex:none;width:174rpx;height:151rpx;overflow:hidden;border-radius:16rpx;background:#f1f5f3}.document-preview image{width:100%;height:100%}.sample{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;color:#9aa8a3;font-size:19rpx}.sample-icon{margin-bottom:7rpx;color:#b2bcb8;font-size:49rpx}.document-content{display:flex;flex:1;flex-direction:column;min-width:0}.document-title{display:flex;align-items:center;color:#28493f;font-size:27rpx;font-weight:750}.required{margin-left:4rpx;color:#ed655d}.uploaded{margin-left:auto;color:#13a87f;font-size:19rpx;font-weight:650}.document-tip{margin-top:8rpx;color:#8b9a95;font-size:20rpx}.upload-button{width:100%;margin-top:auto;border:1rpx dashed #72cdb3;border-radius:12rpx;background:#f1fbf7;color:#118565;font-size:22rpx;font-weight:650;line-height:59rpx}.upload-button::after{border:0}.upload-button text{margin-right:7rpx}.recognition-card{margin-top:23rpx;padding:28rpx;border:1rpx solid #dfe8e4;border-radius:24rpx;background:#fff}.recognition-title{display:flex;align-items:center;gap:15rpx;margin-bottom:8rpx}.recognition-title text:first-child{color:#284c42;font-size:26rpx;font-weight:750}.recognition-title text:last-child{margin-top:5rpx;color:#94a29d;font-size:19rpx;font-weight:400}.spark{display:flex;align-items:center;justify-content:center;width:51rpx;height:51rpx;border-radius:15rpx;background:#e1f8f0;color:#16a77e;font-size:26rpx}.field{margin-top:21rpx}.field>text{display:block;margin-bottom:10rpx;color:#415d55;font-size:21rpx}.field input{height:76rpx;padding:0 22rpx;border:1rpx solid #e0e8e5;border-radius:14rpx;background:#f9fbfa;color:#243f37;font-size:24rpx}.privacy{display:flex;align-items:flex-start;gap:14rpx;margin:23rpx 0;padding:21rpx 22rpx;border:1rpx solid #d2eee5;border-radius:17rpx;background:#eaf9f4;color:#3b7665;font-size:21rpx;line-height:1.5}.privacy-icon{display:flex!important;flex:none;align-items:center;justify-content:center;width:30rpx;height:30rpx;border:2rpx solid #2b9e7e;border-radius:50%;font-size:19rpx;font-weight:800}.error{display:flex;align-items:center;gap:13rpx;margin:0 4rpx 20rpx;padding:19rpx 22rpx;border-radius:14rpx;background:#fff0ef;color:#c7514c;font-size:22rpx}.error text:first-child{display:flex;align-items:center;justify-content:center;width:29rpx;height:29rpx;border:2rpx solid #e1605a;border-radius:50%;font-weight:800}.primary{width:100%;border-radius:18rpx;background:linear-gradient(135deg,#0f9b75,#20bb8d);color:#fff;font-size:28rpx;font-weight:700;line-height:96rpx;box-shadow:0 14rpx 28rpx rgba(17,158,119,.2)}.primary::after{border:0}.primary text{margin-left:10rpx}
.page{overflow-x:hidden}.body{width:100%;box-sizing:border-box}
</style>
