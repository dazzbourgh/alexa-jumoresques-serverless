import AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'

export function putObject (s3Client: AWS.S3): (params: PutObjectRequest) => Promise<void> {
  return async (params: PutObjectRequest) => {
    await s3Client.putObject(params).promise()
  }
}
