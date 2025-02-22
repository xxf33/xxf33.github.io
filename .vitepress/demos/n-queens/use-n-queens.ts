import { computed, ref, watchEffect, type Ref } from 'vue'
import { useTimestamp, useWebWorkerFn } from '@vueuse/core'
import { nQueens$4 } from './solutions'

export function useNQueensSolutions(inputN: Ref<number>) {
  const boardN = ref(inputN.value)

  const isCalculating = ref(false)
  const timestamp = useTimestamp()
  const timer = ref(0)
  let prevTimer = 0
  let startTimestamp = 0

  watchEffect(() => {
    if (isCalculating.value) {
      timer.value = timestamp.value - startTimestamp
    }
  })

  const solutions = ref<number[][]>([])
  const solutionIndex = ref(1)
  const solutionLength = computed(() => solutions.value.length)
  const activeSolution = computed(
    () => solutions.value[solutionIndex.value - 1] || []
  )

  function updateSolutionIndex(newValue = solutionIndex.value + 1) {
    const current = solutionIndex.value
    const maximin = solutionLength.value
    if (newValue === maximin + 1 && current === maximin) {
      solutionIndex.value = 1
    } else if (newValue === 0 && current === 1) {
      solutionIndex.value = maximin
    } else {
      solutionIndex.value = Math.max(1, Math.min(maximin, newValue))
    }
  }

  const { workerFn } = useWebWorkerFn(
    // TODO: use transferable objects to avoid copying the array
    (n: number) => JSON.stringify(nQueens$4(n)),
    { localDependencies: [nQueens$4] }
  )

  async function tryCalculate() {
    if (isCalculating.value) {
      return
    }
    isCalculating.value = true
    startTimestamp = timestamp.value
    try {
      const res = await workerFn(inputN.value)
      solutions.value = JSON.parse(res)
      boardN.value = inputN.value
      prevTimer = timer.value
      updateSolutionIndex(solutionIndex.value)
    } catch (err) {
      console.error(err)
      inputN.value = boardN.value
      timer.value = prevTimer
    } finally {
      isCalculating.value = false
    }
  }

  return {
    boardN,
    timer,
    isCalculating,
    solutionIndex,
    solutionLength,
    activeSolution,
    updateSolutionIndex,
    tryCalculate,
  }
}
