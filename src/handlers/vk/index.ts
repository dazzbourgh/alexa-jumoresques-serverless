import AWS from 'aws-sdk'
import { fetchVkWall, putObject, VkResponse } from 'common'
import properties from 'properties'
import {
  byLikesDescending,
  noAttachments,
  shorterThan1500Characters, toText
} from '../../common/util/generic/generic-utils'
import { toSpeech } from '../../common/util/aws/polly/text-to-speech'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties
  const pollyClient = new AWS.Polly({
    region: awaitedProps.aws.region
  })
  const synthesizeGeneralParams = {
    OutputFormat: awaitedProps.aws.polly.outputFormat,
    VoiceId: awaitedProps.aws.polly.voice
  }
  const s3Client = new AWS.S3()

  const vkResponse: VkResponse = await fetchVkWall(awaitedProps.vk.domain)
  const audios = vkResponse.response.items
    .filter(noAttachments)
    .filter(shorterThan1500Characters)
    .sort(byLikesDescending)
    .slice(0, 5)
    .map(toText)
    .map(await toSpeech(pollyClient, synthesizeGeneralParams))
  for (let i = 0; i < audios.length; i++) {
    await putObject(s3Client)({
      Bucket: awaitedProps.aws.s3.bucketName,
      Key: `${i}-${awaitedProps.aws.s3.key}`,
      Body: audios[i]
    })
  }
}
