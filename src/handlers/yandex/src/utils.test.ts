import { toItem, toYandexResponse } from './utils'
import { CacheRequest, YandexSkillResponse, YandexUploadFileResponse } from 'common'
import { uploadLocalFileToYandexDialogs, writeToDisk } from './audio-file'

describe('yandex utils', () => {
  test('mapper toYandexResponse', async () => {
    const result = toYandexResponse('id123')(Promise.resolve('mp3Id'))
    const expected: YandexSkillResponse = {
      response: {
        end_session: true,
        text: 'А вот и свежие юморески',
        tts: '<speaker audio="dialogs-upload/id123/mp3Id.opus">'
      },
      version: '1.0'
    }
    await expect(result).resolves.toEqual(expected)
  })
  test('mapper toItem', async () => {
    const expected: CacheRequest = {
      tableName: 'table',
      item: {
        key: 'mp3Id',
        value: 'someValue'
      }
    }
    const tableName = 'table'
    const mp3Id = 'mp3Id'
    expect(toItem({ tableName, mp3Id })('someValue')).toEqual(expected)
  })
  test('should write mp3 file to local dir', async () => {
    const fs = {
      writeFile: jest.fn((path, binaryFile) => {})
    }
    const file = 'some file'
    await writeToDisk(fs)(file)
    expect(fs.writeFile).toBeCalledWith('/tmp/jumoresques.mp3', file)
  })
  test('should upload to yandex dialogs', async () => {
    const response: YandexUploadFileResponse = {
      sound: {
        id: '123',
        error: '',
        originalName: '',
        size: 123,
        skillId: 'skillId'
      }
    }
    const request = {
      post: (params: any, callback: (err: any, resp: any, body: any) => void) => {
        callback(null, null, JSON.stringify(response))
      }
    }
    const syncFs = { createReadStream: jest.fn() }
    const yandexParams = { url: 'http://abc.de', token: 'atoken' }
    const filePath = '/tmp/file.mp3'
    const result = await uploadLocalFileToYandexDialogs(yandexParams, request, syncFs)(filePath)
    expect(result.sound.id).toEqual('123')
    expect(syncFs.createReadStream).toBeCalledWith(filePath)
  })
})
