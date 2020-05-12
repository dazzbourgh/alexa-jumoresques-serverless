import {
  ApiGatewayResponse,
  CacheConfig,
  cacheFactory,
  CacheRequest,
  getFromCache,
  mapToCacheRequest,
  putToCache,
  S3Notification
} from 'common'
import properties from 'properties'
import { getAudioFile, toLambdaProxyResponse, toYandexResponse, uploadFileToYandexDialogs } from './utils'

interface DynamoProps { tableName: string, mp3Id: string }
const toItem = ({ tableName, mp3Id }: DynamoProps) => (value?: string): CacheRequest => {
  const item: {[key: string]: string} = {
    key: mp3Id
  }
  const cacheRequest = {
    tableName: tableName,
    item: item
  }
  if (value !== undefined) cacheRequest.item.value = value
  return cacheRequest
}

export const upload = async (event: any): Promise<void> => {
  const awaitedProps = await properties
  const body: S3Notification = JSON.parse(event.Records[0].body)
  const s3 = body.Records[0].s3
  const mp3File = await getAudioFile(s3)
  const uploadResponse = await uploadFileToYandexDialogs(awaitedProps.yandex)(s3.object.key, mp3File)
  const cacheConfig: CacheConfig = {
    mapper: toItem(awaitedProps.aws.dynamo),
    service: cacheFactory.createCache('aws').run(awaitedProps.aws)
  }
  await mapToCacheRequest(uploadResponse.sound.id)
    .flatMap(putToCache)
    .run(cacheConfig)
}

export const playSound = async (): Promise<ApiGatewayResponse> => {
  const awaitedProps = await properties
  const cacheConfig: CacheConfig = {
    mapper: toItem(awaitedProps.aws.dynamo),
    service: cacheFactory.createCache('aws').run(awaitedProps.aws)
  }
  return await mapToCacheRequest()
    .flatMap(getFromCache)
    .map(toYandexResponse(awaitedProps))
    .map(toLambdaProxyResponse)
    .run(cacheConfig)
}
