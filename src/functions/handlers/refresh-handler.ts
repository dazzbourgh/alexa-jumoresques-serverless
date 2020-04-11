import fetchJumoresques from '../util/vk/fetch-jumoresques'
import { Jumoresque } from '../../domain/domain'
import textToSpeech from '../util/aws/polly/text-to-speech'
import AWS from 'aws-sdk'
import { putObject } from '../util/aws/s3/s3'
import properties from '../../props/properties'
import { AudioStream } from 'aws-sdk/clients/polly'
import { mergeText } from '../util/generic/generic-utils'

const pollyGenericParams = {
  OutputFormat: properties.aws.polly.outputFormat,
  VoiceId: properties.aws.polly.voice
}

const s3GenericParams = {
  Bucket: properties.aws.s3.bucketName,
  Key: properties.aws.s3.key
}

const pollyClient = new AWS.Polly({
  region: properties.aws.region
})

const s3Client = new AWS.S3()

export const handler = async (): Promise<void> => {
  const jumoresques: Jumoresque[] = await fetchJumoresques(properties.vk.domain)
  const text: string = mergeText(jumoresques)
  const audio: AudioStream = await textToSpeech(pollyClient)({
    ...pollyGenericParams,
    Text: text
  })
  await putObject(s3Client)({
    ...s3GenericParams,
    Body: audio
  })
}
