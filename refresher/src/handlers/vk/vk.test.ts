import { Polly, S3 } from 'aws-sdk'
import { refreshJumoresques } from './vk'
import { VkResponse, promise } from 'common'

describe('vk handler', () => {
  test('should refresh jumoresques', async () => {
    const vkResponse: VkResponse = {
      response: {
        count: 1,
        items: [
          {
            id: 1,
            date: 1,
            is_pinned: 0,
            text: 'some text',
            likes: {
              count: 10
            }
          }
        ]
      }
    }
    const audioStream = 'stream'
    const polly = {
      synthesizeSpeech: jest.fn(() => {
        return promise({
          AudioStream: audioStream
        })
      })
    } as unknown as Polly
    const s3 = {
      putObject: jest.fn(() => promise({}))
    } as unknown as S3
    const properties = {
      vk: {
        domain: 'jumoreski'
      },
      aws: {
        s3: {
          bucketName: 'bucket',
          key: 'jumoresques.mp3'
        }
      }
    }
    await refreshJumoresques(polly, {
      OutputFormat: 'mp3',
      VoiceId: 'Maxim'
    }, s3, properties)(vkResponse)
    // @ts-ignore
    expect(s3.putObject.mock.calls[0][0].Body).toEqual(audioStream)
  })
})
