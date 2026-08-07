import { onBeforeUnmount, ref } from 'vue'

export function useVerificationCountdown(seconds = 60) {
  const countdown = ref(0)
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

  onBeforeUnmount(() => clearInterval(timer))
  return { countdown, start }
}
