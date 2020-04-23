import { PartialSynthesizeSpeechInput, promise, textToSpeech } from '../../..'
import { Polly } from 'aws-sdk'

describe('text to speech function', () => {
  test('should use AWS SDK to transform text to speech', async () => {
    const textText = 'text text'
    const audioStream = 'stream'
    const mockPolly = {
      synthesizeSpeech: jest.fn(() => promise({
        AudioStream: audioStream
      }))
    } as unknown as Polly
    const result = await textToSpeech(mockPolly, {} as unknown as PartialSynthesizeSpeechInput)(textText, 0)
    // @ts-ignore
    expect(mockPolly.synthesizeSpeech.mock.calls[0][0].Text).toEqual(textText)
    expect(result).toEqual(audioStream)
  })
})
