import {
  ApiGatewayResponse,
  CacheConfig,
  cacheFactory,
  getFromCache,
  LambdaEvent,
  mapToCacheRequest,
  Props,
  putToCache,
  YandexUploadFileResponse
} from 'common'
import properties from 'properties'
import {
  toItem,
  toLambdaProxyResponse,
  toYandexResponse
} from './utils'
import request from 'request'
import {
  audioDownloadFunctionFactory,
  audioFileDetails,
  AudioFileOperationsConfig,
  audioUploadFunction,
  downloadAudioFile,
  mapAWSLambdaEvent,
  uploadAudioFile
} from './audio-file'

export const upload = async (event: LambdaEvent): Promise<void> => {
  const awaitedProps = await properties
  const audioFileConfig: AudioFileOperationsConfig<LambdaEvent> = createAwsAudioConfig(awaitedProps)
  const cacheConfig: CacheConfig = createCacheConfig(awaitedProps)
  const uploadResponse: YandexUploadFileResponse = await audioFileDetails(event)
    .flatMap(downloadAudioFile)
    .flatMap(uploadAudioFile)
    .run(audioFileConfig)
  await mapToCacheRequest(uploadResponse.sound.id)
    .flatMap(putToCache)
    .run(cacheConfig)
}

export const playSound = async (): Promise<ApiGatewayResponse> => {
  const awaitedProps = await properties
  const cacheConfig: CacheConfig = createCacheConfig(awaitedProps)
  return await mapToCacheRequest()
    .flatMap(getFromCache)
    .map(toYandexResponse(awaitedProps.yandex.id))
    .map(toLambdaProxyResponse)
    .run(cacheConfig)
}

const createAwsAudioConfig =
    (awaitedProps: Props): AudioFileOperationsConfig<LambdaEvent> =>
      ({
        map: mapAWSLambdaEvent,
        download: audioDownloadFunctionFactory.createFunction(awaitedProps.provider).run(awaitedProps.aws),
        upload: audioUploadFunction(request, awaitedProps.yandex)
      })

const createCacheConfig = (props: Props): CacheConfig => ({
  mapper: toItem(props.aws.dynamo),
  service: cacheFactory.createCache(props.provider).run(props.aws)
})
