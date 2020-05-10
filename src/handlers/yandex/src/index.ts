import { ApiGatewayResponse, S3Notification } from 'common'
import { YandexSkillResponse } from './model'
import properties from 'properties'
import { cacheValue, getAudioFile, getCachedValue, uploadFileToYandexDialogs } from './utils'

export const upload = async (event: any): Promise<void> => {
  const awaitedProps = await properties
  const body: S3Notification = JSON.parse(event.Records[0].body)
  const s3 = body.Records[0].s3
  const mp3File = await getAudioFile(s3)
  const uploadResponse = await uploadFileToYandexDialogs(awaitedProps.yandex)(s3.object.key, mp3File)
  await cacheValue(awaitedProps.aws)(uploadResponse.sound.id)
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
