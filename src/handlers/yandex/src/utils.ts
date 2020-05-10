import { getObject, getValueFromDynamo, putValueToDynamo, S3Details } from 'common'
import AWS from 'aws-sdk'
import { YandexUploadFileResponse } from './model'
import oldFs, { promises as fs } from 'fs'
import request from 'request'

interface AWSCacheParams {
  tableName: string
  mp3Id: string
}

export function cacheValue ({ tableName, mp3Id }: AWSCacheParams): (value: string) => Promise<void> {
  return async (value: string) => {
    const dynamoClient = new AWS.DynamoDB()
    await putValueToDynamo(dynamoClient, tableName)({
      key: mp3Id,
      value: value
    })
  }
}

export function getCachedValue ({ tableName, mp3Id }: AWSCacheParams): () => Promise<string | undefined> {
  return async () => {
    const dynamoClient = new AWS.DynamoDB()
    return await getValueFromDynamo(dynamoClient, tableName)(mp3Id)
  }
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
