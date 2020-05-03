import { Body } from 'aws-sdk/clients/s3'
import * as fs from 'fs'
import axios from 'axios'
import { YandexUploadFileResponse } from '../..'

export function uploadFileToYandexDialogs (properties: any): (filename: string, audio: Body) => Promise<YandexUploadFileResponse> {
  return async (filename: string, audio: Body): Promise<YandexUploadFileResponse> => {
    await new Promise((resolve, reject) => {
      fs.writeFile(`/tmp/${filename}`, audio, (err) => {
        if (err !== null) {
          reject(err)
        }
      })
    })
    return await axios.post(properties.yandex.postUri, null, {
      headers: {
        Host: 'https://dialogs.yandex.net',
        Authorization: `OAuth ${properties.yandex.token}`,
        'Content-Type': 'multipart/form-data',
        'Content-Disposition': `form-data; name="file"; filename="/tmp/${filename}"`
      }
    })
  }
}