import AWS from 'aws-sdk'
import { AudioStream } from 'aws-sdk/clients/polly'

type SynthesizeFunction = (text: string, index: number) => Promise<AudioStream>;
export interface PartialSynthesizeSpeechInput {
  OutputFormat: string
  VoiceId: string
}

export const textToSpeech = (pollyClient: AWS.Polly, params: PartialSynthesizeSpeechInput): SynthesizeFunction =>
  async (text): Promise<AudioStream> => {
    const result = await pollyClient.synthesizeSpeech({
      ...params,
      Text: `${text}`
    }).promise()
    // a hack to make types resolve
    return result.AudioStream as unknown as AudioStream
  }
