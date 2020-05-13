import { putObject, getObject } from './util/aws/s3/s3'
import { textToSpeech, PartialSynthesizeSpeechInput } from './util/aws/polly/text-to-speech'
import { promise } from './util/test/promise'

export * from './domain'
export * from './util/cache'

export {
  putObject,
  getObject,
  textToSpeech,
  PartialSynthesizeSpeechInput,
  promise
}
