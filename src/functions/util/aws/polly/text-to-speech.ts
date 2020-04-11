import * as AWS from 'aws-sdk'
import { AudioStream, SynthesizeSpeechInput } from 'aws-sdk/clients/polly'

export default function textToSpeech (pollyClient: AWS.Polly): (params: SynthesizeSpeechInput) => Promise<AudioStream> {
  return async (params) => {
    const result = await pollyClient.synthesizeSpeech(params).promise()
    return result.AudioStream
  }
}
