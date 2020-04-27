import AWS from 'aws-sdk'
import { PutObjectRequest, GetObjectRequest, GetObjectOutput } from 'aws-sdk/clients/s3'

export function putObject (s3Client: AWS.S3): (params: PutObjectRequest) => Promise<void> {
  return async (params: PutObjectRequest) => {
    await s3Client.putObject(params).promise()
  }
}

export function getObject (s3Client: AWS.S3): (params: GetObjectRequest) => Promise<GetObjectOutput> {
  return async (params: GetObjectRequest) => await s3Client.getObject(params).promise()
}
