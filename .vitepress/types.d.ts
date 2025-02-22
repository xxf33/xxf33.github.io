declare interface MarkdownMeta {
  link: string
  date: string
  title: string
  description?: string
  cover?: string[]
  category?: string
  tags?: string[]
  lastUpdatedTime?: string
}

declare type MarkdownMetaList = Array<MarkdownMeta>
declare type MarkdownMetaOrderList = Array<{
  label: string
  items: MarkdownMetaList
}>

declare type NotesView = 'timeline' | 'category' | 'tags'
