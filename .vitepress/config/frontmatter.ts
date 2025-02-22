import notesJson from '../data/notes.json'
import postsJson from '../data/posts.json'

export function injectFrontmatter(relativePath: string) {
  if (
    !relativePath.startsWith('notes/') &&
    !relativePath.startsWith('posts/')
  ) {
    return
  }
  const isNotes = relativePath.startsWith('notes/')
  const fileUrl = `/${relativePath.replace(/\.md$/, '')}`
  return {
    ...getMarkdownData(fileUrl, isNotes ? notesJson : postsJson),
    key: isNotes ? 'notes' : 'posts',
  }
}

function getMarkdownData(fileUrl: string, items: MarkdownMetaList) {
  const index = items.findIndex(({ link }) => link === fileUrl)
  if (index === -1) {
    return
  }
  const getPrevNext = (i: number) => ({
    link: items[i].link,
    text: items[i].title,
  })
  return {
    prev: index > 0 ? getPrevNext(index - 1) : void 0,
    next: index < items.length - 1 ? getPrevNext(index + 1) : void 0,
    lastUpdatedTime: items[index].lastUpdatedTime,
  }
}
