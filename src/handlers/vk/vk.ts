import AWS from 'aws-sdk'
import {
  PartialSynthesizeSpeechInput, toSpeech, putObject, VkResponse,
  byLikesDescending,
  noAttachments,
  shorterThan1500Characters,
  toText
} from 'common'
type JumoresquePipeline = (vkResponse: VkResponse) => void

export const refreshJumoresques = (pollyClient: AWS.Polly,
  synthesizeGeneralParams: PartialSynthesizeSpeechInput,
  s3Client: AWS.S3,
  props: any): JumoresquePipeline => async (vkResponse: VkResponse) => {
  const audios = await Promise.all(
    vkResponse.response.items
      .filter(noAttachments)
      .filter(shorterThan1500Characters)
      .sort(byLikesDescending)
      .slice(0, 5)
      .map(toText)
      .map(toSpeech(pollyClient, synthesizeGeneralParams)))
  for (let i = 0; i < audios.length; i++) {
    await putObject(s3Client)({
      Bucket: props.aws.s3.bucketName,
      Key: `${i}-${props.aws.s3.key}`,
      Body: audios[i]
    })
  }
}
