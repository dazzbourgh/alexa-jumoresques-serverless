import { getObject, S3Details } from 'common'
import AWS from 'aws-sdk'
import { YandexSkillResponse, YandexUploadFileResponse } from './model'
import oldFs, { promises as fs } from 'fs'
import request from 'request'

interface AWSLambdaProxyResponse {
  isBase64Encoded: boolean
  headers: { [key: string]: string }
  statusCode: number
  body: string
}

export async function getAudioFile (s3: S3Details): Promise<AWS.S3.Body> {
  const s3Client = new AWS.S3()
  const response = await getObject(s3Client)({
    Bucket: s3.bucket.name,
    Key: s3.object.key
  })
  return response.Body as AWS.S3.Body
}

export interface YandexParams {
  url: string
  token: string
}

type YandexUploader = (filename: string, audio: AWS.S3.Body) => Promise<YandexUploadFileResponse>

type RequestAPI = request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;

function createYandexUploader (request: RequestAPI): (properties: YandexParams) => YandexUploader {
  return ({ url, token }) => async (filename: string, audio: AWS.S3.Body): Promise<YandexUploadFileResponse> => {
    const path = `/tmp/${filename}`
    await fs.writeFile(path, audio)
    return await upload(request)(path, url, token)
  }
}

export const uploadFileToYandexDialogs = createYandexUploader(request)

function upload (request: RequestAPI): (filename: string, url: string, token: string) => Promise<YandexUploadFileResponse> {
  return async (filename: string, url: string, token: string): Promise<YandexUploadFileResponse> => {
    const formData = { file: oldFs.createReadStream(filename) }
    return await new Promise(resolve => request.post({
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
}

export const toYandexResponse = (props: any) => async (mp3Id: Promise<string | undefined>): Promise<YandexSkillResponse> => ({
  response: {
    end_session: true,
    text: 'А вот и свежие юморески',
    tts: `<speaker audio="dialogs-upload/${props.yandex.id}/${await mp3Id}.opus">`
  },
  version: '1.0'
})
export const toLambdaProxyResponse = async (yandexResponse: Promise<YandexSkillResponse>): Promise<AWSLambdaProxyResponse> => ({
  isBase64Encoded: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  statusCode: 200,
  body: JSON.stringify(yandexResponse)
})
