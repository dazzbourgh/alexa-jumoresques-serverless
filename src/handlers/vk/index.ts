import fetchJumoresques from '../../common/util/vk/fetch-jumoresques'
import { Jumoresque } from '../../common/domain/domain'
import textToSpeech from '../../common/util/aws/polly/text-to-speech'
import AWS from 'aws-sdk'
import { putObject } from '../../common/util/aws/s3/s3'
import properties from '../../common/props/properties'
import { AudioStream } from 'aws-sdk/clients/polly'
import { mergeText } from '../../common/util/generic/generic-utils'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties

  const pollyClient = new AWS.Polly({
    region: awaitedProps.aws.region
  })

  const s3Client = new AWS.S3()
  const jumoresques: Jumoresque[] = await fetchJumoresques(awaitedProps.vk.domain)
  const text: string = mergeText(jumoresques)
  const audio: AudioStream = await textToSpeech(pollyClient)({
    OutputFormat: awaitedProps.aws.polly.outputFormat,
    VoiceId: awaitedProps.aws.polly.voice,
    Text: text
  })
  await putObject(s3Client)({
    Bucket: awaitedProps.aws.s3.bucketName,
    Key: awaitedProps.aws.s3.key,
    Body: audio
  })
}
