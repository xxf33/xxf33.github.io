export function arrayShuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function bindMethod<T extends (...args: any[]) => any>(
  method: T,
  context: ThisParameterType<T>
) {
  return (...args: Parameters<T>): ReturnType<T> => method.apply(context, args)
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
