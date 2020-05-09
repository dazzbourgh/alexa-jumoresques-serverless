import { Body } from 'aws-sdk/clients/s3'
import * as fs from 'fs'
import { AxiosStatic } from 'axios'
import { YandexUploadFileResponse } from '../..'

interface YandexParams {
  url: string
  token: string
}

export function createYandexUploader (axios: AxiosStatic): (properties: YandexParams) => (filename: string, audio: Body) => Promise<YandexUploadFileResponse> {
  return ({ url, token }) => async (filename: string, audio: Body): Promise<YandexUploadFileResponse> => {
    await new Promise((resolve, reject) => {
      fs.writeFile(`/tmp/${filename}`, audio, (err) => {
        if (err !== null) {
          reject(err)
        }
      })
    })
    return await axios.post(url, null, {
      headers: {
        Host: 'https://dialogs.yandex.net',
        Authorization: `OAuth ${token}`,
        'Content-Type': 'multipart/form-data',
        'Content-Disposition': `form-data; name="file"; filename="/tmp/${filename}"`
      }
    })
  }
}
