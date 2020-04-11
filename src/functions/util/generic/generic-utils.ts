import { Jumoresque } from '../../../domain/domain'

export function mergeText (jumoresques: Jumoresque[]): string {
  return jumoresques
    .sort((a, b) => a.likes - b.likes)
    .slice(0, 5)
    .reduce((prev, cur) => `${prev}\n\n${cur.text}`, '')
}
