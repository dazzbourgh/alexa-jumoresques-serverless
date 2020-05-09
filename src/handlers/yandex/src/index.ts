import {
  S3Notification,
  uploadFileToYandexDialogs,
  YandexSkillRequest,
  YandexSkillResponse
} from 'common'
import properties from 'properties'
import { cacheValue, getAudioFile, getCachedValue } from './utils'

export const upload = async (event: any): Promise<void> => {
  const awaitedProps = await properties
  const body: S3Notification = JSON.parse(event.Records[0].body)
  const s3 = body.Records[0].s3
  const mp3File = getAudioFile(s3)
  const uploadResponse = await uploadFileToYandexDialogs(awaitedProps)(s3.object.key, mp3File)
  await cacheValue(awaitedProps)(uploadResponse.sound.id)
}

export const playSound = async (request: YandexSkillRequest): Promise<YandexSkillResponse> => {
  const awaitedProps = await properties
  const mp3Id = await getCachedValue(awaitedProps)()
  return {
    response: {
      end_session: true,
      text: 'А вот и свежие юморески',
      tts: `<speaker audio="dialogs-upload/${mp3Id}/${awaitedProps.s3.key}.opus">`
    },
    version: '1.0'
  }
}
