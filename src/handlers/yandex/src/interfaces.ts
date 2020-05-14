import { YandexUploadFileResponse, BinaryFile } from 'common'

export interface AWSLambdaProxyResponse {
  isBase64Encoded: boolean
  headers: { [key: string]: string }
  statusCode: number
  body: string
}

export interface YandexParams {
  url: string
  token: string
}

export interface YandexDialogsUploaderConfig {
  writeToDisk: (file: BinaryFile) => Promise<string>
  upload: (filePath: string) => Promise<YandexUploadFileResponse>
}

export interface DynamoProps {
  tableName: string
  mp3Id: string
}
