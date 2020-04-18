import { Jumoresque } from '../..'
import { Item } from '../../domain/domain'

export function mergeText (jumoresques: Jumoresque[]): string {
  return jumoresques.reduce((prev, cur) => `${prev}\n\n${cur.text}`, '')
}

export const noAttachments = (item: Item): boolean => item.attachments === undefined
