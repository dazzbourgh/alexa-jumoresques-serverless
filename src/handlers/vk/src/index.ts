import properties from 'properties'
import { Dependencies, refreshJumoresques } from './vk'
import { putToStorageFunctionFactory } from './storage'
import { fetchVkWall } from './wall'
import { VkResponse } from './domain'
import { ttsServiceFactory } from './tts'

export const handler = async (): Promise<void> => {
  const awaitedProps = await properties
  const dependencies: Dependencies = {
    ttsServiceFactory,
    putToStorageFunctionFactory,
    awaitedProps
  }
  const vkResponse: VkResponse = await fetchVkWall(awaitedProps)
  await refreshJumoresques(dependencies)(vkResponse)
}
