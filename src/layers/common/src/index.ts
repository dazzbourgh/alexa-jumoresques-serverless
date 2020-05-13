import { putObject, getObject } from './util/aws/s3/s3'
import { textToSpeech, PartialSynthesizeSpeechInput } from './util/aws/polly/text-to-speech'
import { toText, noAttachments, shorterThan1500Characters, byLikesDescending, concatAudioBuffers } from './util/generic/generic-utils'
import { promise } from './util/test/promise'

export * from './util/vk'

export * from './domain'
export * from './util/cache'

export {
  putObject,
  getObject,
  textToSpeech,
  PartialSynthesizeSpeechInput,
  byLikesDescending,
  noAttachments,
  shorterThan1500Characters,
  toText,
  promise,
  concatAudioBuffers
}
