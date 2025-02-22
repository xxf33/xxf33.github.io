import { execSync } from 'node:child_process'
import process from 'node:process'
import fs from 'node:fs'
import matter from 'gray-matter'
import { glob } from 'tinyglobby'

const NormalizedCwd = process.cwd().replace(/\\/g, '/')
const DefaultFromDir = `${NormalizedCwd}/pages`
const DefaultSaveDir = `${NormalizedCwd}/.vitepress/data`

const lastUpdatedTimeCache = new Map()

async function markdownExporter(cwd) {
  const files = await glob(`**/*.md`, { cwd })
  await getLastUpdatedTimes(files, cwd)
  return files
    .map(filepath => {
      const fullPath = `${cwd}/${filepath}`
      const { data, excerpt, content } = matter.read(fullPath, {
        excerpt_separator: '<!--more-->',
      })
      const { date, title, description, cover, category, tags } = data
      if (!date) {
        return void 0
      }
      return {
        dir: filepath.split('/')[0],
        link: `/${filepath.replace(/\.md$/, '')}`,
        lastUpdatedTime: lastUpdatedTimeCache.get(fullPath) ?? new Date(date),
        date: new Date(date),
        title,
        description: description ?? formatDescription(excerpt, 100),
        cover: cover ?? content.match(/(?<=!\[.*]\()(.+)(?=\))/g) ?? void 0,
        category,
        tags,
      }
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .reduce(
      (acc, curr) => {
        const { dir, ...rest } = curr
        acc[dir] ? acc[dir].push(rest) : (acc[dir] = [rest])
        return acc
      },
      { notes: [], posts: [] }
    )
}

async function getLastUpdatedTimes(files, cwd) {
  const uncachedFiles = files.filter(
    f => !lastUpdatedTimeCache.has(`${cwd}/${f}`)
  )
  if (uncachedFiles.length === 0) {
    return
  }
  try {
    const cmd = `git -C "${cwd}" log --pretty="format:%H %ci" --name-only --all`
    const output = execSync(cmd, { encoding: 'utf-8' })
    const entries = output.split('\n\n')
    const baseDirName = cwd.split('/').pop()
    const basePattern = new RegExp(`^${baseDirName}/`)

    for (const entry of entries) {
      const [commitInfo, ...files] = entry.split('\n')
      const [, dateStr] = commitInfo.split(' ')
      const date = new Date(dateStr.trim())

      files.forEach(file => {
        const normalizedFile = file.replace(basePattern, '')
        const fullPath = `${cwd}/${normalizedFile}`
        if (!lastUpdatedTimeCache.has(fullPath)) {
          lastUpdatedTimeCache.set(fullPath, date)
        }
      })
    }
  } catch (error) {
    console.error('Failed to get git history:', error)
  }
}

function formatDescription(excerpt, limit) {
  if (!excerpt) {
    return
  }
  let ret = excerpt.replace(/!\[(.*?)]\((.*?)\)/g, '').replace(/[\n\r]/g, '')
  if (limit && ret.length > limit) {
    ret = `${ret.slice(0, limit)}...`
  }
  return ret
}

function saveToJson(items, saveDir) {
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true })
  }
  Object.keys(items).forEach(key => {
    const saveTo = `${saveDir}/${key}.json`
    fs.writeFileSync(saveTo, JSON.stringify(items[key], null, 2))
  })
}

function main(fromDir = DefaultFromDir, saveDir = DefaultSaveDir) {
  markdownExporter(fromDir)
    .then(res => saveToJson(res, saveDir))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

main()
