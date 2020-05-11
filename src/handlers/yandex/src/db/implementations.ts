import * as AWS from 'aws-sdk'
import { CacheRequest, CacheService } from './interfaces'

export const dynamoCache: (dynamoClient: AWS.DynamoDB) => CacheService = (dynamoClient: AWS.DynamoDB) => ({
  put: async ({ tableName, item }: CacheRequest) => {
    await dynamoClient.putItem({
      Item: {
        key: { S: item.key },
        value: { S: item.value }
      },
      TableName: tableName
    }).promise()
  }
})
