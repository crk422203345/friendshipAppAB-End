import { onBeforeUnmount, ref } from 'vue'

export function useVerificationCountdown(seconds = 60) {
  const countdown = ref(0)
  const pending = ref(false)
  let timer

  function start() {
    if (countdown.value) return false
    countdown.value = seconds
    clearInterval(timer)
    timer = setInterval(() => {
      countdown.value -= 1
      if (!countdown.value) clearInterval(timer)
    }, 1000)
    return true
  }

  async function execute(request) {
    if (countdown.value || pending.value || typeof request !== 'function') return false
    pending.value = true
    try {
      await request()
      start()
      return true
    } finally {
      pending.value = false
    }
  }

  onBeforeUnmount(() => clearInterval(timer))
  return { countdown, pending, start, execute }
}
