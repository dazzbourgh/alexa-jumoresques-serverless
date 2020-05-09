import { getObject, getValueFromDynamo, putValueToDynamo } from 'common'
import AWS from 'aws-sdk'
import { S3Details } from 'common/dist/domain/domain'

export function cacheValue (awaitedProps: any): (value: string) => Promise<void> {
  return async (value: string) => {
    const dynamoClient = new AWS.DynamoDB()
    await putValueToDynamo(dynamoClient, awaitedProps.aws.dynamo.tableName)({
      key: awaitedProps.aws.dynamo.mp3Id,
      value: value
    })
  }
}

export function getCachedValue (awaitedProps: any): () => Promise<string | undefined> {
  return async () => {
    const dynamoClient = new AWS.DynamoDB()
    return await getValueFromDynamo(dynamoClient, awaitedProps.dynamo.tableName)(awaitedProps.dynamo.mp3Id)
  }
}

export async function getAudioFile (s3: S3Details): Promise<AWS.S3.GetObjectOutput> {
  const s3Client = new AWS.S3()
  return await getObject(s3Client)({
    Bucket: s3.bucket.name,
    Key: s3.object.key
  })
}
