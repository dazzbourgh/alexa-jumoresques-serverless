import { byLikesDescending, noAttachments, shorterThan1500Characters, toText } from './generic-utils'
import { Item } from 'src/common/domain/domain'

describe('util functions', () => {
  test('should filter posts by attachments', () => {
    expect(noAttachments({} as unknown as Item)).toBe(true)
    expect(noAttachments({ attachments: [] } as unknown as Item)).toBe(false)
  })
  test('should filter posts by text length', () => {
    expect(shorterThan1500Characters({ text: 'short' } as unknown as Item)).toBe(true)
    expect(shorterThan1500Characters({ text: 'a'.padEnd(1500, 'long') } as unknown as Item)).toBe(false)
  })
  test('should sort by likes', () => {
    const item1 = { likes: { count: 1 } }
    const item2 = { likes: { count: 2 } }
    expect(byLikesDescending(item1 as Item, item2 as Item)).toEqual(1)
  })
  test('should transform item to text', () => {
    const text = 'short'
    const item = { text: text }
    expect(toText(item as Item)).toBe(text)
  })
})
