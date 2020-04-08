import * as AWS from 'aws-sdk'
import { GetObjectRequest } from 'aws-sdk/clients/s3'

const bucketName = process.env.BUCKET_NAME
const s3Client = new AWS.S3()

export default async function getFromS3 (key: string): Promise<any> {
  const params: GetObjectRequest = {
    Bucket: bucketName,
    Key: key
  }

  return await new Promise<any>((resolve, reject) => s3Client.getObject(params, (err, data) => {
    if (typeof err !== 'undefined') {
      reject(err)
    } else {
      resolve(data)
    }
  }))
}
