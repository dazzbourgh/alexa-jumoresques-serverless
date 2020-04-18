import { Jumoresque } from '../..'

export function mergeText (jumoresques: Jumoresque[]): string {
  return jumoresques
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
    .reduce((prev, cur) => `${prev}\n\n${cur.text}`, '')
}
