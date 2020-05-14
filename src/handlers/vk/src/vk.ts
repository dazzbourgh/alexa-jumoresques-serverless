import {
  Props
} from 'common'
import { PutToStorageFunctionFactory } from './storage'
import { VkResponse } from './domain'
import {
  byLikesDescending,
  concatAudioBuffers,
  noAttachments,
  shorterThan1500Characters,
  toText
} from './utils/generic-utils'
import { TtsServiceFactory } from './tts'

type JumoresquePipeline = (vkResponse: VkResponse) => void

export interface Dependencies {
  ttsServiceFactory: TtsServiceFactory
  awaitedProps: Props
  putToStorageFunctionFactory: PutToStorageFunctionFactory
}

export const refreshJumoresques = ({
  ttsServiceFactory,
  awaitedProps,
  putToStorageFunctionFactory
}: Dependencies): JumoresquePipeline => async (vkResponse: VkResponse) => {
  const putToStorage = putToStorageFunctionFactory.create(awaitedProps)
  const audios = await Promise.all(
    vkResponse.response.items
      .filter(noAttachments)
      .filter(shorterThan1500Characters)
      .sort(byLikesDescending)
      .slice(0, 5)
      .map(toText)
      .map(ttsServiceFactory.createTtsService(awaitedProps).toSpeech))
  const mergedAudio = audios.reduce(concatAudioBuffers)
  await putToStorage(mergedAudio)
}
