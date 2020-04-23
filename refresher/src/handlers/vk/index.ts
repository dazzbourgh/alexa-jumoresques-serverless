import AWS from 'aws-sdk'
import properties from 'properties'
import { refreshJumoresques } from './vk'
import { fetchVkWall, VkResponse } from 'common'
import axios from 'axios'
import * as env from '../../../env.json'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties(env)
  const pollyClient = new AWS.Polly({
    region: awaitedProps.aws.region
  })
  const synthesizeGeneralParams = {
    OutputFormat: awaitedProps.aws.polly.outputFormat,
    VoiceId: awaitedProps.aws.polly.voice
  }
  const s3Client = new AWS.S3()
  const vkResponse: VkResponse = await fetchVkWall(axios, awaitedProps)
  await refreshJumoresques(pollyClient, synthesizeGeneralParams, s3Client, awaitedProps)(vkResponse)
}
