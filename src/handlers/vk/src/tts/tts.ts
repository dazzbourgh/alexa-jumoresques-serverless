import { BinaryFile, Props } from 'common'
import AWS from 'aws-sdk'

export interface TtsService {
  toSpeech: (text: string) => Promise<BinaryFile>
}

export interface TtsServiceFactory {
  createTtsService: (props: Props) => TtsService
}

const pollyService: (props: Props) => TtsService = (props: Props) => {
  const synthesizeGeneralParams = {
    OutputFormat: props.aws.polly.outputFormat,
    VoiceId: props.aws.polly.voice
  }
  const pollyClient = new AWS.Polly({
    region: props.aws.region
  })
  return {
    toSpeech: async text => {
      const result = await pollyClient.synthesizeSpeech({
        ...synthesizeGeneralParams,
        Text: `${text}`
      }).promise()
      // a hack to make types resolve
      return result.AudioStream as unknown as BinaryFile
    }
  }
}

export const ttsServiceFactory: TtsServiceFactory = {
  createTtsService: (props: Props): TtsService => {
    switch (props.provider) {
      default: return pollyService(props)
    }
  }
}
