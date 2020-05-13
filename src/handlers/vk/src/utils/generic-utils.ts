import { AudioStream } from 'aws-sdk/clients/polly'
import { Item } from '../domain'

export const noAttachments = (item: Item): boolean => item.attachments === undefined

export const shorterThan1500Characters = (item: Item): boolean => item.text.length < 1500

export const byLikesDescending = (item1: Item, item2: Item): number => item2.likes.count - item1.likes.count

export const toText = (item: Item): string => item.text

export const concatAudioBuffers = (prev: AudioStream, cur: AudioStream): AudioStream => Buffer.concat([prev as Uint8Array, cur as Uint8Array])
