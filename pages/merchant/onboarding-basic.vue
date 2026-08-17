<template>
  <view class="page">
    <view class="topbar"><text class="back" @tap="goBack">‹</text><text>商家入驻与协议</text><view /></view>
    <view class="body">
      <merchant-onboarding-progress :current="1" />
      <view class="heading"><text class="eyebrow">STEP 01</text><text class="title">先认识一下您的店铺</text><text class="subtitle">填写真实经营信息，带 <text class="required">*</text> 为必填项</text></view>

      <view class="card">
        <text class="section-title">门店基础</text>
        <view class="field">
          <text class="label">门店定位 <text class="required">*</text></text>
          <view class="location-row" @tap="chooseLocation"><text class="pin iconfont icon-dingwei"></text><text :class="form.address ? 'value' : 'placeholder'">{{ form.address || '选择或输入门店详细地址' }}</text><text class="locate">定位</text></view>
          <input v-model.trim="form.address" class="manual-input" maxlength="120" placeholder="也可手动输入详细地址" placeholder-class="input-placeholder" />
        </view>
        <view class="field">
          <text class="label">品牌名称 <text class="required">*</text></text>
          <input v-model.trim="form.brandName" class="input" maxlength="50" placeholder="请输入与门店一致的招牌名称" placeholder-class="input-placeholder" />
        </view>
        <view class="field">
          <text class="label">经营品类 <text class="required">*</text></text>
          <picker :range="categories" @change="selectCategory"><view class="picker"><text :class="form.category ? 'value' : 'placeholder'">{{ form.category || '请选择经营品类' }}</text><view class="picker-arrow"><view /></view></view></picker>
        </view>
      </view>

      <view class="card media-card">
        <text class="section-title">店铺环境 <text class="required">*</text></text>
        <text class="section-tip">请上传前厅与厨房实拍图，最多 6 张</text>
        <view class="photo-grid">
          <view v-for="(image, index) in form.environmentImages" :key="image" class="photo-item">
            <image :src="image" mode="aspectFill" />
            <text class="remove" @tap.stop="removeEnvironmentImage(index)">×</text>
            <text class="photo-label">{{ index === 0 ? '前厅环境' : index === 1 ? '厨房环境' : `环境图 ${index + 1}` }}</text>
          </view>
          <view v-if="form.environmentImages.length < 6" class="photo-upload" @tap="chooseEnvironmentImages"><text class="camera">＋</text><text>添加照片</text></view>
        </view>
        <view class="field product-field">
          <text class="label">主营产品 <text class="optional">选填</text></text>
          <input v-model.trim="form.featuredProducts" class="input" maxlength="100" placeholder="如：招牌拿铁、手工披萨" placeholder-class="input-placeholder" />
        </view>
      </view>

      <view v-if="error" class="error"><text>!</text><text>{{ error }}</text></view>
      <button class="primary" @tap="next">保存并继续 <text>→</text></button>
      <text class="draft-tip">内容会自动保存，可随时返回继续填写</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import MerchantOnboardingProgress from '../../components/merchant-onboarding-progress.vue'
import { loadMerchantOnboardingDraft, saveMerchantOnboardingDraft } from '../../composables/use-merchant-onboarding'

const categories = ['餐饮美食', '休闲娱乐', '丽人美业', '生活服务', '酒店民宿', '亲子教育', '零售购物', '其他']
const draft = reactive(loadMerchantOnboardingDraft())
const form = reactive(draft.basic)
const error = ref('')
let ready = false

onLoad(() => { ready = true })
onUnload(save)
watch(form, () => { if (ready) save() }, { deep: true })

function save() { draft.basic = form; saveMerchantOnboardingDraft(draft) }
function goBack() { save(); uni.navigateBack() }
function selectCategory(event) { form.category = categories[Number(event.detail.value)] }
function chooseLocation() {
  uni.chooseLocation({
    success: ({ address, name, latitude, longitude }) => {
      form.address = [address, name].filter(Boolean).join(' ')
      form.latitude = latitude
      form.longitude = longitude
    },
    fail: (reason) => { if (!String(reason.errMsg || '').includes('cancel')) uni.showToast({ title: '暂未获取定位，请手动填写地址', icon: 'none' }) }
  })
}
function chooseEnvironmentImages() {
  uni.chooseImage({
    count: 6 - form.environmentImages.length,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: ({ tempFilePaths }) => { form.environmentImages.push(...tempFilePaths) }
  })
}
function removeEnvironmentImage(index) { form.environmentImages.splice(index, 1) }
function next() {
  error.value = ''
  if (!form.address) error.value = '请填写门店详细地址'
  else if (!form.brandName || form.brandName.length < 2) error.value = '品牌名称需填写 2–50 个字符'
  else if (!form.category) error.value = '请选择经营品类'
  else if (form.environmentImages.length < 2) error.value = '请至少上传前厅与厨房两张环境照片'
  if (error.value) { uni.pageScrollTo({ scrollTop: 0, duration: 250 }); return }
  save()
  uni.navigateTo({ url: '/pages/merchant/onboarding-qualification' })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f3f7f5; color: #183b32; }.topbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; height: calc(98rpx + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 30rpx 0; border-bottom: 1rpx solid #e5ece9; background: rgba(255,255,255,.96); box-sizing: border-box; font-size: 30rpx; font-weight: 750; }.topbar view,.back{width:58rpx}.back{color:#14795e;font-size:58rpx;line-height:1}.body{max-width:700rpx;margin:0 auto;padding:0 30rpx calc(50rpx + env(safe-area-inset-bottom))}.heading{padding:27rpx 10rpx 28rpx}.eyebrow,.title,.subtitle,.section-title,.section-tip,.label,.draft-tip{display:block}.eyebrow{color:#16a77e;font-size:19rpx;font-weight:800;letter-spacing:2rpx}.title{margin-top:10rpx;color:#153d32;font-size:39rpx;font-weight:800}.subtitle{margin-top:10rpx;color:#83948e;font-size:23rpx}.required{color:#ee6a61}.optional{margin-left:8rpx;color:#a1afa9;font-size:20rpx;font-weight:400}.card{margin-bottom:22rpx;padding:30rpx;border:1rpx solid #e2eae7;border-radius:26rpx;background:#fff;box-shadow:0 14rpx 38rpx rgba(29,78,64,.055)}.section-title{font-size:29rpx;font-weight:780}.section-tip{margin-top:8rpx;color:#8a9a95;font-size:21rpx}.field{margin-top:27rpx}.label{margin-bottom:13rpx;color:#3a554d;font-size:23rpx;font-weight:650}.input,.picker,.location-row,.manual-input{height:86rpx;border:1rpx solid #dfe7e4;border-radius:16rpx;background:#f9fbfa;box-sizing:border-box;font-size:25rpx}.input,.manual-input{padding:0 24rpx}.manual-input{width:100%;height:70rpx;margin-top:10rpx;border-style:dashed;background:#fff;font-size:23rpx}.picker,.location-row{display:flex;align-items:center;padding:0 23rpx}.location-row{gap:12rpx}.pin{color:#11a67e;font-size:31rpx}.value{flex:1;color:#24493f;font-size:25rpx}.placeholder,.input-placeholder{flex:1;color:#a5b0ac;font-size:24rpx}.locate{color:#0f9873;font-size:23rpx;font-weight:700}.chevron{color:#75867f;font-size:35rpx}.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16rpx;margin-top:23rpx}.photo-item,.photo-upload{position:relative;height:178rpx;border-radius:17rpx;box-sizing:border-box}.photo-item image{width:100%;height:100%;border-radius:17rpx}.photo-label{position:absolute;right:0;bottom:0;left:0;padding:8rpx;border-radius:0 0 17rpx 17rpx;background:rgba(18,49,41,.66);color:#fff;text-align:center;font-size:18rpx}.remove{position:absolute;top:-11rpx;right:-9rpx;display:flex;align-items:center;justify-content:center;width:36rpx;height:36rpx;border:4rpx solid #fff;border-radius:50%;background:#263d37;color:#fff;font-size:25rpx}.photo-upload{display:flex;flex-direction:column;align-items:center;justify-content:center;border:2rpx dashed #b8d4ca;background:#f4fbf8;color:#588277;font-size:20rpx}.camera{margin-bottom:7rpx;color:#19a77f;font-size:42rpx;line-height:1}.product-field{margin-top:31rpx}.error{display:flex;align-items:center;gap:13rpx;margin:0 4rpx 20rpx;padding:19rpx 22rpx;border-radius:14rpx;background:#fff0ef;color:#c7514c;font-size:22rpx}.error text:first-child{display:flex;align-items:center;justify-content:center;width:29rpx;height:29rpx;border:2rpx solid #e1605a;border-radius:50%;font-weight:800}.primary{width:100%;border-radius:18rpx;background:linear-gradient(135deg,#0f9b75,#20bb8d);color:#fff;font-size:28rpx;font-weight:700;line-height:96rpx;box-shadow:0 14rpx 28rpx rgba(17,158,119,.2)}.primary::after{border:0}.primary text{margin-left:10rpx}.draft-tip{margin-top:18rpx;color:#96a49f;text-align:center;font-size:20rpx}
.page{overflow-x:hidden}.body{width:100%;box-sizing:border-box}.picker-arrow{display:flex;flex:none;align-items:center;justify-content:center;width:50rpx;height:50rpx;border-radius:14rpx;background:#e9f7f2}.picker-arrow view{width:13rpx;height:13rpx;margin-top:-7rpx;border-right:3rpx solid #0e8c69;border-bottom:3rpx solid #0e8c69;transform:rotate(45deg)}
</style>
