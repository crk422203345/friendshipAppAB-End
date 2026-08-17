const DRAFT_KEY = 'merchant-onboarding-draft-v1'

const initialDraft = {
  status: 'draft',
  inviteCode: '',
  basic: {
    address: '',
    latitude: null,
    longitude: null,
    brandName: '',
    category: '',
    environmentImages: [],
    featuredProducts: ''
  },
  qualification: {
    documents: {},
    legalName: '',
    idNumber: '',
    bankCardNumber: '',
    licenseNumber: ''
  },
  settlement: {
    accountType: 'business',
    bankName: '',
    accountNumber: '',
    bankCardImage: '',
    agreed: false
  },
  rejectionReasons: [],
  submittedAt: ''
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeDraft(saved = {}) {
  return {
    ...clone(initialDraft),
    ...saved,
    basic: { ...initialDraft.basic, ...(saved.basic || {}) },
    qualification: { ...initialDraft.qualification, ...(saved.qualification || {}), documents: { ...(saved.qualification?.documents || {}) } },
    settlement: { ...initialDraft.settlement, ...(saved.settlement || {}) },
    rejectionReasons: Array.isArray(saved.rejectionReasons) ? saved.rejectionReasons : []
  }
}

export function loadMerchantOnboardingDraft() {
  const saved = uni.getStorageSync(DRAFT_KEY)
  const draft = mergeDraft(saved && typeof saved === 'object' ? saved : {})
  draft.inviteCode = draft.inviteCode || uni.getStorageSync('merchant-pending-invite') || ''
  return draft
}

export function saveMerchantOnboardingDraft(draft) {
  const value = mergeDraft(draft)
  value.updatedAt = new Date().toISOString()
  uni.setStorageSync(DRAFT_KEY, value)
  return value
}

export function clearMerchantOnboardingDraft() {
  uni.removeStorageSync(DRAFT_KEY)
}

export { DRAFT_KEY }
