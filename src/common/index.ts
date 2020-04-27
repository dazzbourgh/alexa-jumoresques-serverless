import { putObject, getObject } from './util/aws/s3/s3'
import { fetchVkWall } from './util/vk/fetch-vk-wall'
import { VkResponse, Jumoresque, DynamoItem, YandexUploadFileResponse, S3Notification, YandexSkillRequest, YandexSkillResponse } from './domain/domain'
import { textToSpeech, PartialSynthesizeSpeechInput } from './util/aws/polly/text-to-speech'
import { toText, noAttachments, shorterThan1500Characters, byLikesDescending, concatAudioBuffers } from './util/generic/generic-utils'
import { promise } from './util/test/promise'
import { uploadFileToYandexDialogs } from './util/yandex/yandex'
import { putValueToDynamo, getValueFromDynamo } from './util/aws/dynamo/dynamo'

export {
  putObject,
  getObject,
  fetchVkWall,
  VkResponse,
  Jumoresque,
  DynamoItem,
  YandexUploadFileResponse,
  S3Notification,
  YandexSkillRequest,
  YandexSkillResponse,
  textToSpeech,
  PartialSynthesizeSpeechInput,
  byLikesDescending,
  noAttachments,
  uploadFileToYandexDialogs,
  shorterThan1500Characters,
  toText,
  promise,
  concatAudioBuffers,
  putValueToDynamo,
  getValueFromDynamo
}
