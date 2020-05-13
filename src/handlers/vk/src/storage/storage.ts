import { Props } from 'common'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'

export type PutToStorageFunction = (object: any) => Promise<void>
export interface PutToStorageFunctionFactory {
  create: (props: Props) => PutToStorageFunction
}

const s3PutToStorageFunction: (props: Props) => PutToStorageFunction = (props: Props) => {
  const s3Client = new AWS.S3(props.aws.region)
  return async (object: any) => {
    const params: PutObjectRequest = {
      Bucket: props.aws.s3.bucketName,
      Key: props.aws.s3.key,
      Body: object,
      ACL: 'public-read'
    }
    await s3Client.putObject(params).promise()
  }
}

export const putToStorageFunctionFactory: PutToStorageFunctionFactory = {
  create: (props: Props) => {
    switch (props.provider) {
      case 'aws':
      default:
        return s3PutToStorageFunction(props)
    }
  }
}
