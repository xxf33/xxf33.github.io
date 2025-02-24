import type { DefaultTheme } from 'vitepress'
import { formatDate } from '@vueuse/core'
import { getSortedMarkdowns } from '../theme/utils/sort'
import emojiJson from '../data/emoji.json'
import postsJson from '../data/posts.json'
import notesJson from '../data/notes.json'

export const sidebar: DefaultTheme.Sidebar = {
  '/posts': [
    {
      text: '🔍 目录',
      link: '/posts/archive',
    },
    ...createSidebarForPosts(postsJson),
  ],
  '/notes': [
    {
      text: '🔍 目录',
      link: '/notes/archive',
    },
    ...createSidebarForNotes(notesJson),
  ],
}

function createSidebarForNotes(notes: MarkdownMetaList) {
  const categories = emojiJson.categories
  return getSortedMarkdowns(notes, 'category').map(({ label, items }) => ({
    collapsed: true,
    text: `${categories[label as keyof typeof categories] ?? ''} ${label}`,
    items: items.map(({ title, link }) => ({
      text: title,
      link,
    })),
  }))
}

function createSidebarForPosts(posts: MarkdownMetaList) {
  const currentYear = new Date().getFullYear()
  return getSortedMarkdowns(posts, 'timeline').map(({ label, items }) => {
    const yyyy = Number(label)
    return {
      collapsed: yyyy !== currentYear,
      text: `${getZodiacEmoji(yyyy)} ${yyyy}`,
      items: items.map(({ title, link, date }) => ({
        link,
        text: `${title} <span style="float: right;font-size: 0.875em">${formatDate(
          new Date(date),
          'M.D'
        )}</span>`,
      })),
    }
  })

  function getZodiacEmoji(year: number) {
    let index = (year - 2020) % 12
    if (index < 0) {
      index += 12
    }
    return emojiJson.zodiac[index]
  }
}
