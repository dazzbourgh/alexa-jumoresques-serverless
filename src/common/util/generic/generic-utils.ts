import { Item } from '../../domain/domain'

export const noAttachments = (item: Item): boolean => item.attachments === undefined

export const shorterThan1500Characters = (item: Item): boolean => item.text.length < 1500

export const byLikesDescending = (item1: Item, item2: Item): number => item2.likes.count - item1.likes.count

export const toText = (item: Item): string => item.text
