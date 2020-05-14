import { AudioFileDetails, AWSRegionProps, LambdaEvent, YandexUploadFileResponse, BinaryFile, Props } from 'common'
import {
  AudioDownloadFunction,
  AudioDownloadFunctionFactory,
  AudioUploadFunction,
  FunctionEventMapper, MapperFactory
} from './interfaces'
import AWS from 'aws-sdk'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import { YandexParams } from '../interfaces'

const mapAWSLambdaEvent: FunctionEventMapper<LambdaEvent> = (evt: LambdaEvent): AudioFileDetails => JSON.parse(evt.Records[0].body).Records[0].s3

export const mapperFactory: MapperFactory = {
  createMapper: (props: Props): FunctionEventMapper<any> => {
    switch (props.provider) {
      case 'aws':
        return mapAWSLambdaEvent
      default:
        return mapAWSLambdaEvent
    }
  }
}

export const audioDownloadFunctionFactory: AudioDownloadFunctionFactory = {
  createFunction: (props) => {
    switch (props.platform) {
      case 'aws':
      default: return s3AudioDownloadFunction(props.aws)
    }
  }
}

export const audioUploadFunction: (request: any, fs: any, syncFs: any, { url, token }: YandexParams) => AudioUploadFunction =
    (request, fs, syncFs, { url, token }) => async mp3File => {
      const path = await writeToDisk(fs)(mp3File)
      return await uploadLocalFileToYandexDialogs({ url, token }, request, syncFs)(path)
    }

const s3AudioDownloadFunction: (awsRegionProps: AWSRegionProps) => AudioDownloadFunction =
    (awsRegionProps: AWSRegionProps) => async (details: AudioFileDetails) => {
      const s3Client = new AWS.S3(awsRegionProps)
      const response: GetObjectOutput = await s3Client.getObject({
        Key: details.object.key,
        Bucket: details.bucket.name
      }).promise()
      if (response.Body === undefined) throw new Error(`${details.object.key} is not found in bucket ${details.bucket.name}`)
      return response.Body as BinaryFile
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
