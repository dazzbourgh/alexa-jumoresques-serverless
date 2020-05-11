import { ApiGatewayResponse, S3Notification } from 'common'
import { YandexSkillResponse } from './model'
import properties from 'properties'
import { getAudioFile, getCachedValue, uploadFileToYandexDialogs } from './utils'
import AWS from 'aws-sdk'
import { dynamoCache, putToCache } from './db'

export const upload = async (event: any): Promise<void> => {
  const awaitedProps = await properties
  const dynamoClient = new AWS.DynamoDB({ region: awaitedProps.aws.region })
  const body: S3Notification = JSON.parse(event.Records[0].body)
  const s3 = body.Records[0].s3
  const mp3File = await getAudioFile(s3)
  const uploadResponse = await uploadFileToYandexDialogs(awaitedProps.yandex)(s3.object.key, mp3File)
  await putToCache({
    tableName: awaitedProps.aws.dynamo.tableName,
    item: {
      key: awaitedProps.aws.dynamo.mp3Id,
      value: uploadResponse.sound.id
    }
  })(dynamoCache(dynamoClient))
}

export const playSound = async (): Promise<ApiGatewayResponse> => {
  const awaitedProps = await properties
  const mp3Id = await getCachedValue(awaitedProps.aws)()
  const body: YandexSkillResponse = {
    response: {
      end_session: true,
      text: 'А вот и свежие юморески',
      tts: `<speaker audio="dialogs-upload/${awaitedProps.yandex.id}/${mp3Id}.opus">`
    },
    version: '1.0'
  }
  return {
    isBase64Encoded: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode: 200,
    body: JSON.stringify(body)
  }
}
