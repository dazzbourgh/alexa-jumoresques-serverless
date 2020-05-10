import { getValueFromDynamo, putValueToDynamo } from './dynamo'
import { DynamoItem, promise } from '../../../index'
import AWS from 'aws-sdk'

describe('DynamoDB util functions', () => {
  const tableName = 'TestTable'
  const testVal = 'some-val'
  const key = 'jumoresques.mp3'
  const mockClient = {
    putItem: jest.fn(() => promise()),
    getItem: jest.fn(() => {
      return promise({
        Item: {
          value: {
            S: testVal
          }
        }
      })
    })
  } as unknown as AWS.DynamoDB
  test('should upload key/value pair to dynamo', async () => {
    const item: DynamoItem = {
      key: key,
      value: 'some-val'
    }
    await putValueToDynamo(mockClient, tableName)(item)
    // @ts-ignore
    const argument = mockClient.putItem.mock.calls[0][0]
    expect(argument.Item.key.S).toBe(item.key)
    expect(argument.Item.value.S).toBe(item.value)
    expect(argument.TableName).toBe(tableName)
  })
  test('should get from dynamo', async () => {
    const result = await getValueFromDynamo(mockClient, tableName)(key)
    // @ts-ignore
    const argument = mockClient.getItem.mock.calls[0][0]
    expect(argument.TableName).toBe(tableName)
    expect(argument.Key.key.S).toBe(key)
    expect(result).toBe(testVal)
  })
})
