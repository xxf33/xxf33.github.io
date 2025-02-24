import { ofetch } from 'ofetch'

export async function requestRemoteImag(w = 720, h = 720) {
  const blob = await ofetch(`https://picsum.photos/${w}/${h}`)
  return URL.createObjectURL(blob)
}

export function splitImageAsync(
  dataUrl: string,
  w: number,
  h: number,
  options?: { imageType?: string; quality?: number }
) {
  return new Promise<string[]>((resolve, reject) => {
    const img = new Image()
    img.src = dataUrl
    img.onerror = error => {
      const msg = error instanceof Event ? error.type : error
      reject(new Error(`图片加载失败: ${msg}`))
    }
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const tw = Math.floor(img.width / w)
        const th = Math.floor(img.height / h)
        canvas.width = tw
        canvas.height = th
        const promises = Array.from({ length: h }, (_, y) =>
          Array.from(
            {
              length: w,
            },
            (_, x) => {
              ctx?.drawImage(img, x * tw, y * th, tw, th, 0, 0, tw, th)
              return canvas.toDataURL(options?.imageType, options?.quality)
            }
          )
        ).flat()
        URL.revokeObjectURL(dataUrl)
        resolve(promises)
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    }
  })
}
