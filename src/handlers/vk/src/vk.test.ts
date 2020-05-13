import { Polly } from 'aws-sdk'
import { refreshJumoresques } from './vk'
import { promise } from 'common'
import { VkResponse } from './domain';

describe('describe vk handler', () => {
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
    const pollyClient = {
      synthesizeSpeech: jest.fn(() => {
        return promise({
          AudioStream: audioStream
        })
      })
    } as unknown as Polly
    const putToStorageFunction = jest.fn(async (): Promise<void> => await Promise.resolve())
    const awaitedProps = {
      provider: 'aws',
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
    const putToStorageFunctionFactory = {
      create: jest.fn(() => putToStorageFunction)
    }
    const synthesizeGeneralParams = {
      OutputFormat: 'mp3',
      VoiceId: 'Maxim'
    }
    await refreshJumoresques({ pollyClient, synthesizeGeneralParams, awaitedProps, putToStorageFunctionFactory })(vkResponse)
    // @ts-ignore
    expect(putToStorageFunctionFactory.create.mock.calls[0][0].provider).toEqual('aws')
    // @ts-ignore
    expect(putToStorageFunction.mock.calls[0][0]).toEqual(audioStream)
  })
})
