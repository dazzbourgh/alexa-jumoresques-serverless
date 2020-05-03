import AWS from 'aws-sdk'
import { PutItemInput } from 'aws-sdk/clients/dynamodb'
import { DynamoItem } from '../../..'

export function putValueToDynamo (dynamoClient: AWS.DynamoDB, tableName: string): (item: DynamoItem) => Promise<void> {
  return async (item: DynamoItem): Promise<void> => {
    const dynamoRequest: PutItemInput = {
      Item: {},
      TableName: tableName
    }
    dynamoRequest.Item[item.key] = { S: item.value }
    await dynamoClient.putItem(dynamoRequest).promise()
  }
}

export function getValueFromDynamo (dynamoClient: AWS.DynamoDB, tableName: string): (key: string) => Promise<string | undefined> {
  return async (key: string): Promise<string | undefined> => (await dynamoClient.getItem({
    TableName: tableName,
    Key: {
      key: { S: key }
    }
  }).promise()).Item?.value.S
}
