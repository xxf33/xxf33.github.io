import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { ofetch } from 'ofetch'

// GitHub: owner/repo
const DefaultEndPoints = [
  'vuejs/core',
  'vuejs/vitepress',
  'vueuse/vueuse',
  'unocss/unocss',

  'type-challenges/type-challenges',
  'sindresorhus/type-fest',
  'total-typescript/ts-reset',
]

const DefaultSaveTo = fileURLToPath(
  new URL('../.vitepress/data/repos.json', import.meta.url)
)

async function fetchGitRepoData(endPoint) {
  const res = await ofetch(`https://api.github.com/repos/${endPoint}`, {
    headers: {
      Accept: 'application/vnd.github.v4+json',
    },
  })
  return {
    timestamp: Date.now(),
    key: endPoint,
    avatar_url: res?.owner.avatar_url,
    html_url: res.html_url,
    description: res.description,
    language: res.language,
    stargazers_count: res.stargazers_count,
    forks_count: res.forks_count,
    pushed_at: res.pushed_at,
  }
}

function main(endPoints, saveTo) {
  const dir = path.dirname(saveTo)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const oldData = fs.existsSync(saveTo)
    ? JSON.parse(fs.readFileSync(saveTo, 'utf-8'))
    : {}
  const newData = endPoints.reduce((acc, endPoint) => {
    acc[endPoint] = oldData[endPoint] || {}
    return acc
  }, {})

  Promise.allSettled(endPoints.map(fetchGitRepoData))
    .then(items => {
      items.forEach(result => {
        if (result.status === 'fulfilled') {
          const { key, ...rest } = result.value
          newData[key] = rest
        }
      })
      fs.writeFileSync(saveTo, JSON.stringify(newData, undefined, 2))
    })
    .catch(error => {
      console.error('Error fetching GitHub repository data:', error)
      process.exit(1)
    })
}

main(DefaultEndPoints, DefaultSaveTo)
