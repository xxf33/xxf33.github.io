import { defineComponent, watch } from 'vue'
import confetti, { type Options } from 'canvas-confetti'

export default defineComponent(
  (props: { passed: boolean }) => {
    watch(
      () => props.passed,
      v => v && setTimeout(congrats, 500)
    )
    return () => null
  },
  { props: ['passed'] }
)

function congrats() {
  const defaults = {
    particleCount: 50,
    origin: { y: 0.8 },
    gravity: 0.75,
    ticks: 600,
  } satisfies Options

  const configs = [
    { spread: 26, startVelocity: 25 },
    { spread: 60, startVelocity: 30, decay: 0.95 },
    { spread: 100, startVelocity: 35, decay: 0.95, scalar: 0.9 },
    { spread: 120, startVelocity: 25, decay: 0.95, scalar: 1.2 },
    { spread: 120, startVelocity: 35, decay: 0.94 },
  ] satisfies Options[]

  configs.forEach(config => {
    confetti({
      ...defaults,
      ...config,
    })
  })
}
