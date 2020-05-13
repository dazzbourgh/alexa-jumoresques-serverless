import AWS from 'aws-sdk'
import properties from 'properties'
import { Dependencies, refreshJumoresques } from './vk'
import { putToStorageFunctionFactory } from './storage'
import { fetchVkWall } from './wall'
import { VkResponse } from './domain'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties
  const pollyClient = new AWS.Polly({
    region: awaitedProps.aws.region
  })
  const synthesizeGeneralParams = {
    OutputFormat: awaitedProps.aws.polly.outputFormat,
    VoiceId: awaitedProps.aws.polly.voice
  }
  const dependencies: Dependencies = {
    pollyClient,
    putToStorageFunctionFactory,
    synthesizeGeneralParams,
    awaitedProps
  }
  const vkResponse: VkResponse = await fetchVkWall(awaitedProps)
  await refreshJumoresques(dependencies)(vkResponse)
}
