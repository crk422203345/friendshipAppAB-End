import { computed, ref } from 'vue'
import { normalizeExternalUrl, openExternalUrl } from '../core/external-link'
import { getAppConfig, unwrap } from '../services/agent'

export function useLegalConsent() {
  const agreed = ref(false)
  const serviceAgreementUrl = ref('')
  const privacyPolicyUrl = ref('')
  const loading = ref(false)
  const error = ref('')
  const available = computed(() => Boolean(serviceAgreementUrl.value && privacyPolicyUrl.value))

  function normalizeLegalUrl(value) {
    const url = normalizeExternalUrl(value)
    return /^https:\/\//i.test(url) ? url : ''
  }

  async function loadLegalLinks() {
    loading.value = true
    error.value = ''
    agreed.value = false
    try {
      const data = unwrap(await getAppConfig()) || {}
      serviceAgreementUrl.value = normalizeLegalUrl(data.service_agreement_url || data.serviceAgreementUrl)
      privacyPolicyUrl.value = normalizeLegalUrl(data.privacy_policy_url || data.privacyPolicyUrl)
      if (!available.value) throw new Error('服务协议或隐私政策地址不可用')
    } catch (exception) {
      serviceAgreementUrl.value = ''
      privacyPolicyUrl.value = ''
      error.value = exception.message || '协议加载失败'
    } finally {
      loading.value = false
    }
  }

  function toggleAgreement() {
    if (loading.value) return
    if (!available.value) {
      uni.showToast({ title: error.value || '协议暂不可用，请重试', icon: 'none' })
      return
    }
    agreed.value = !agreed.value
  }

  function openLegalDocument(type) {
    const url = type === 'privacy' ? privacyPolicyUrl.value : serviceAgreementUrl.value
    if (!openExternalUrl(url)) uni.showToast({ title: '协议链接暂不可用', icon: 'none' })
  }

  return { agreed, available, loading, error, loadLegalLinks, openLegalDocument, toggleAgreement }
}
