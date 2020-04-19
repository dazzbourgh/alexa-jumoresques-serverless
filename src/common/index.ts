import { putObject } from './util/aws/s3/s3'
import { fetchVkWall } from './util/vk/fetch-vk-wall'
import { VkResponse, Jumoresque } from './domain/domain'
import { toSpeech, PartialSynthesizeSpeechInput } from './util/aws/polly/text-to-speech'
import { toText, noAttachments, shorterThan1500Characters, byLikesDescending } from './util/generic/generic-utils'

export {
  putObject,
  fetchVkWall,
  VkResponse,
  Jumoresque,
  toSpeech,
  PartialSynthesizeSpeechInput,
  byLikesDescending,
  noAttachments,
  shorterThan1500Characters,
  toText
}
