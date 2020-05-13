import AWS from 'aws-sdk'
import {
  PartialSynthesizeSpeechInput,
  Props, textToSpeech
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

type JumoresquePipeline = (vkResponse: VkResponse) => void

export interface Dependencies {
  pollyClient: AWS.Polly
  synthesizeGeneralParams: PartialSynthesizeSpeechInput
  awaitedProps: Props
  putToStorageFunctionFactory: PutToStorageFunctionFactory
}

export const refreshJumoresques = ({
  pollyClient,
  synthesizeGeneralParams,
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
      .map(textToSpeech(pollyClient, synthesizeGeneralParams)))
  const mergedAudio = audios.reduce(concatAudioBuffers)
  await putToStorage(mergedAudio)
}
