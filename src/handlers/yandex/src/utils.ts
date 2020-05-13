import { CacheRequest, YandexSkillResponse, YandexUploadFileResponse } from 'common'
import { AWSLambdaProxyResponse, DynamoProps, YandexParams } from './interfaces'
import { BinaryFile } from './audio-file'

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

export const uploadLocalFileToYandexDialogs = ({ url, token }: YandexParams, request: any, syncFs: any) => async (filePath: string): Promise<YandexUploadFileResponse> => {
  const formData = { file: syncFs.createReadStream(filePath) }
  return await new Promise<YandexUploadFileResponse>(resolve => request.post({
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'multipart/form-data',
      Authorization: `OAuth ${token}`
    },
    url: url,
    formData: formData
  }, function (err: any, resp: any, body: any) {
    if (err) {
      throw err
    }
    resolve(JSON.parse(body))
  }))
}

export const writeToDisk = (fs: any) => async (binaryFile: BinaryFile): Promise<string> => {
  const path = '/tmp/jumoresques.mp3'
  await fs.writeFile(path, binaryFile)
  return path
}
