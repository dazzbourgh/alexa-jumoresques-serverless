import AWS from 'aws-sdk'
import { AudioStream, SynthesizeSpeechInput } from 'aws-sdk/clients/polly'

export function textToSpeech (pollyClient: AWS.Polly): (params: SynthesizeSpeechInput) => Promise<AudioStream> {
  return async (params) => {
    const result = await pollyClient.synthesizeSpeech(params).promise()
    // a hack to make types resolve
    return result.AudioStream as unknown as AudioStream
  }
}
