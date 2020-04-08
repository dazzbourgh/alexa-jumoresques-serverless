import * as AWS from 'aws-sdk'
import properties from '../../../../props/properties'

const region: string = properties.aws.region
const pollyClient = new AWS.Polly({
  region
})

export default async function textToSpeech (text: string): Promise<Buffer> {
  const params: AWS.Polly.Types.SynthesizeSpeechInput = {
    Text: text,
    OutputFormat: properties.polly.outputFormat,
    VoiceId: properties.aws.polly.voice
  }

  return await new Promise<Buffer>((resolve, reject) => {
    pollyClient.synthesizeSpeech(params, (err, data) => {
      if (typeof err !== 'undefined') {
        reject(err)
      } else {
        if (data.AudioStream instanceof Buffer) {
          resolve(data.AudioStream)
        }
      }
    })
  })
}
