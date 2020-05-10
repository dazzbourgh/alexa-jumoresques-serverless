import { putObject, getObject } from './util/aws/s3/s3'
import { textToSpeech, PartialSynthesizeSpeechInput } from './util/aws/polly/text-to-speech'
import { toText, noAttachments, shorterThan1500Characters, byLikesDescending, concatAudioBuffers } from './util/generic/generic-utils'
import { promise } from './util/test/promise'
import { putValueToDynamo, getValueFromDynamo } from './util/aws/dynamo/dynamo'

export * from './util/vk'

export * from './domain'

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
  concatAudioBuffers,
  putValueToDynamo,
  getValueFromDynamo
}
