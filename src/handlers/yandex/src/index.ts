import {
  ApiGatewayResponse,
  audioDownloadFunctionFactory,
  audioFileDetails,
  AudioFileOperationsConfig,
  BinaryFile,
  CacheConfig,
  cacheFactory,
  downloadAudioFile,
  getFromCache,
  LambdaEvent,
  mapAWSLambdaEvent,
  mapToCacheRequest,
  Props,
  putToCache,
  uploadAudioFile,
  YandexUploadFileResponse
} from 'common'
import properties from 'properties'
import { toItem, toLambdaProxyResponse, toYandexResponse } from './utils'

export const upload = async (event: LambdaEvent): Promise<void> => {
  const awaitedProps = await properties
  const audioFileConfig: AudioFileOperationsConfig<LambdaEvent> = {
    map: mapAWSLambdaEvent,
    download: audioDownloadFunctionFactory.createFunction('aws').run(awaitedProps.aws),
    // todo: decompose to a sequence of actions
    upload: async (file: BinaryFile): Promise<YandexUploadFileResponse> => ({} as unknown as YandexUploadFileResponse)
  }
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
    .map(toYandexResponse(awaitedProps))
    .map(toLambdaProxyResponse)
    .run(cacheConfig)
}

const createCacheConfig = (props: Props): CacheConfig => ({
  mapper: toItem(props.aws.dynamo),
  service: cacheFactory.createCache('aws').run(props.aws)
})
