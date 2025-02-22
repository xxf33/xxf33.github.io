import { withBase } from 'vitepress'

const DefaultNotesPathPrefix = '/notes/'

export function getNotesLink(
  view: NotesView,
  tag?: string,
  prefix = DefaultNotesPathPrefix
) {
  let url = `${prefix}#view=${view}`
  if (view === 'tags' && tag) {
    url = `${url}&tag=${tag}`
  }
  return decodeURIComponent(withBase(url))
}

export function getNotesLinkByTag(tag: string) {
  return getNotesLink('tags', tag)
}

export function parseNotesUrlHash(hash: string) {
  const params = new URLSearchParams(hash.slice(1))
  const view = params.get('view')
  const tag = params.get('tag')
  return view === 'tags' && tag
    ? {
        view,
        tag: decodeURIComponent(tag),
      }
    : {
        view: view || 'timeline',
      }
}
