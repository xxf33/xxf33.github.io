type GroupMarkdownsFn = (
  items: MarkdownMetaList
) => Map<string, MarkdownMetaList>
type SortCompareFn = (
  a: MarkdownMetaOrderList[number],
  b: MarkdownMetaOrderList[number]
) => number

export function getSortedMarkdowns(source: MarkdownMetaList, key: string) {
  let groupFn: GroupMarkdownsFn
  let sortFn: SortCompareFn | undefined
  if (key === 'timeline') {
    groupFn = groupedByTimeline
    sortFn = (a, b) => Number(b.label) - Number(a.label)
  } else if (key === 'tags') {
    groupFn = groupedByTag
    sortFn = (a, b) => b.items.length - a.items.length
  } else {
    groupFn = groupedByCategory
  }
  const arr = mapToArray(groupFn(source))
  if (sortFn) {
    arr.sort(sortFn)
  }
  return arr
}

function groupedByTimeline(
  source: MarkdownMetaList,
  map: Map<string, MarkdownMetaList> = new Map()
) {
  source.forEach(item => {
    const y = item.date.slice(0, 4)
    map.set(y, [...(map.get(y) || []), item])
  })
  return map
}

function groupedByCategory(
  source: MarkdownMetaList,
  map: Map<string, MarkdownMetaList> = new Map()
) {
  source.forEach(item => {
    const { category = '未分类' } = item
    map.set(category, [...(map.get(category) || []), item])
  })
  return map
}

function groupedByTag(
  source: MarkdownMetaList,
  map: Map<string, MarkdownMetaList> = new Map()
) {
  source.forEach(item => {
    const tags = item.tags
    if (tags?.length) {
      tags.forEach(tag => {
        map.set(tag, [...(map.get(tag) || []), item])
      })
    }
  })
  return map
}

function mapToArray(map: Map<string, MarkdownMetaList>): MarkdownMetaOrderList {
  return Array.from(map, ([label, items]) => ({ label, items }))
}
