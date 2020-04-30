import {
  getObject, getValueFromDynamo,
  putValueToDynamo,
  S3Notification,
  uploadFileToYandexDialogs,
  YandexSkillRequest,
  YandexSkillResponse
} from 'common'
import AWS from 'aws-sdk'
import properties from 'properties'

export const upload = async (event: any): Promise<void> => {
  const awaitedProps = await properties
  const s3Client = new AWS.S3()
  const body: S3Notification = JSON.parse(event.Records[0].body)
  const s3 = body.Records[0].s3
  const dynamoClient = new AWS.DynamoDB()
  const mp3File = await getObject(s3Client)({
    Bucket: s3.bucket.name,
    Key: s3.object.key
  })
  const uploadResponse = await uploadFileToYandexDialogs(awaitedProps)(s3.object.key, mp3File)
  await putValueToDynamo(dynamoClient, awaitedProps.aws.dynamo.tableName)({
    key: awaitedProps.aws.dynamo.mp3Id,
    value: uploadResponse.sound.id
  })
}

export const playSound = async (request: YandexSkillRequest): Promise<YandexSkillResponse> => {
  const awaitedProps = await properties
  const dynamoClient = new AWS.DynamoDB()
  const mp3Id = await getValueFromDynamo(dynamoClient, awaitedProps.dynamo.tableName)(awaitedProps.dynamo.mp3Id)
  return {
    response: {
      end_session: true,
      text: 'А вот и свежие юморески',
      tts: `<speaker audio="dialogs-upload/${mp3Id}/${awaitedProps.s3.key}.opus">`
    },
    version: '1.0'
  }
}
