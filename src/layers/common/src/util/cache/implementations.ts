import { CacheFactory, CacheService } from './interfaces'
import * as AWS from 'aws-sdk'
import { Props } from '../../domain'

export interface AWSRegionProps { region: string }

const dynamoCache: (awsRegionProps: AWSRegionProps) => CacheService = (awsRegionProps) => ({
  put: async ({ tableName, item }) => {
    const dynamoClient = new AWS.DynamoDB(awsRegionProps)
    await dynamoClient.putItem({
      Item: {
        key: { S: item.key },
        value: { S: item.value }
      },
      TableName: tableName
    }).promise()
  },
  get: async ({ tableName, item }) => {
    const dynamoClient = new AWS.DynamoDB(awsRegionProps)
    const response = await dynamoClient.getItem({
      TableName: tableName,
      Key: {
        key: { S: item.key }
      }
    }).promise()
    const result = response?.Item?.value.S
    if (result === undefined) throw new Error(`${JSON.stringify(item)} not found in table ${tableName}`)
    return result
  }
})

export const cacheFactory: CacheFactory = {
  createCache: (props: Props) => {
    switch (props.provider) {
      case 'aws':
      default:
        return dynamoCache(props.aws)
    }
  }
}
