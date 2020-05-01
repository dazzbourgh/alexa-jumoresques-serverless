import AWS from 'aws-sdk'
import {
  byLikesDescending,
  noAttachments,
  PartialSynthesizeSpeechInput,
  putObject,
  shorterThan1500Characters,
  textToSpeech,
  toText,
  VkResponse,
  concatAudioBuffers
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
      .map(textToSpeech(pollyClient, synthesizeGeneralParams)))
  const mergedAudio = audios.reduce(concatAudioBuffers)
  await putObject(s3Client)({
    Bucket: props.aws.s3.bucketName,
    Key: props.aws.s3.key,
    Body: mergedAudio,
    ACL: 'public-read'
  })
}
