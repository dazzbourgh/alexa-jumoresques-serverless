import AWS from 'aws-sdk'
import { fetchJumoresques, Jumoresque, mergeText, putObject, textToSpeech } from 'common'
import { AudioStream } from 'aws-sdk/clients/polly'
import properties from 'properties'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties

  const pollyClient = new AWS.Polly({
    region: awaitedProps.aws.region
  })

  const s3Client = new AWS.S3()
  const jumoresques: Jumoresque[] = await fetchJumoresques(awaitedProps.vk.domain)
  const processedJumoresques = jumoresques
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
  const text: string = mergeText(processedJumoresques)
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
