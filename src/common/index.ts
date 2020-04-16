import { putObject } from './util/aws/s3/s3'
import { textToSpeech } from './util/aws/polly/text-to-speech'
import { mergeText } from './util/generic/generic-utils'
import { fetchJumoresques } from './util/vk/fetch-jumoresques'
import { VkResponse, Jumoresque } from './domain/domain'

export {
  putObject,
  textToSpeech,
  mergeText,
  fetchJumoresques,
  VkResponse,
  Jumoresque
}
