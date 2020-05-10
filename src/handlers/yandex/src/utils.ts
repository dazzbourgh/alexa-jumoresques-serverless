import { getObject, getValueFromDynamo, putValueToDynamo, S3Details } from 'common'
import AWS from 'aws-sdk'

interface AWSCacheParams {
  tableName: string
  mp3Id: string
}

export function cacheValue ({ tableName, mp3Id }: AWSCacheParams): (value: string) => Promise<void> {
  return async (value: string) => {
    const dynamoClient = new AWS.DynamoDB()
    await putValueToDynamo(dynamoClient, tableName)({
      key: mp3Id,
      value: value
    })
  }
}

export function getCachedValue ({ tableName, mp3Id }: AWSCacheParams): () => Promise<string | undefined> {
  return async () => {
    const dynamoClient = new AWS.DynamoDB()
    return await getValueFromDynamo(dynamoClient, tableName)(mp3Id)
  }
}

export async function getAudioFile (s3: S3Details): Promise<AWS.S3.Body> {
  const s3Client = new AWS.S3()
  const response = await getObject(s3Client)({
    Bucket: s3.bucket.name,
    Key: s3.object.key
  })
  return response.Body as AWS.S3.Body
}
