import { YandexUploadFileResponse } from '../..'
import fs from 'fs'
import AWS from 'aws-sdk'
import request from 'request'

export interface YandexParams {
  url: string
  token: string
}

type YandexUploader = (filename: string, audio: AWS.S3.Body) => Promise<YandexUploadFileResponse>

type RequestAPI = request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;

export function createYandexUploader (request: RequestAPI): (properties: YandexParams) => YandexUploader {
  return ({ url, token }) => async (filename: string, audio: AWS.S3.Body): Promise<YandexUploadFileResponse> => {
    const path = `/tmp/${filename}`
    await writeFileToDisk(path, audio)
    return await upload(request)(path, url, token)
  }
}

async function writeFileToDisk (path: string, audio: AWS.S3.Body): Promise<void> {
  await new Promise((resolve, reject) => {
    fs.writeFile(path, audio, (err) => {
      if (err !== null) {
        reject(err)
      }
    })
  })
}

function upload (request: RequestAPI): (filename: string, url: string, token: string) => Promise<YandexUploadFileResponse> {
  return async (filename: string, url: string, token: string): Promise<YandexUploadFileResponse> => {
    const formData = { file: fs.createReadStream(filename) }
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
      resolve(body)
    }))
  }
}
