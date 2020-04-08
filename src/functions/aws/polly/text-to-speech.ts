import * as AWS from 'aws-sdk'

const region: string = process.env.REGION
const pollyClient = new AWS.Polly({
  region
})

export default async function textToSpeech (text: string): Promise<Buffer> {
  const params: AWS.Polly.Types.SynthesizeSpeechInput = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Maxim'
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
