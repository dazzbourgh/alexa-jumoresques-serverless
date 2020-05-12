import { AudioFileDetails, LambdaEvent } from '../../domain'
import { AudioDownloadFunction, AudioDownloadFunctionFactory, BinaryFile } from './interfaces'
import { Reader } from 'monet'
import { AWSRegionProps } from '../cache'
import AWS from 'aws-sdk'
import { GetObjectOutput } from 'aws-sdk/clients/s3'

export const mapAWSLambdaEvent = (evt: LambdaEvent): AudioFileDetails => JSON.parse(evt.Records[0].body).Records[0].s3

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

export const audioDownloadFunctionFactory: AudioDownloadFunctionFactory = {
  createFunction: (platform) => Reader(props => {
    switch (platform) {
      default: return s3AudioDownloadFunction(props)
    }
  })
}
