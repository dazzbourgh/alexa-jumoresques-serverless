import { CacheRequest, YandexSkillResponse } from 'common'
import { AWSLambdaProxyResponse, DynamoProps } from './interfaces'

export const toYandexResponse = (id: string) => async (mp3Id: Promise<string | undefined>): Promise<YandexSkillResponse> => ({
  response: {
    end_session: true,
    text: 'А вот и свежие юморески',
    tts: `<speaker audio="dialogs-upload/${id}/${await mp3Id}.opus">`
  },
  version: '1.0'
})

export const toLambdaProxyResponse = async (yandexResponse: Promise<YandexSkillResponse>): Promise<AWSLambdaProxyResponse> => ({
  isBase64Encoded: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  statusCode: 200,
  body: JSON.stringify(yandexResponse)
})

export const toItem = ({ tableName, mp3Id }: DynamoProps) => (value?: string): CacheRequest => {
  const item: { [key: string]: string } = {
    key: mp3Id
  }
  const cacheRequest = {
    tableName: tableName,
    item: item
  }
  if (value !== undefined) cacheRequest.item.value = value
  return cacheRequest
}
