import { linkFactory } from './link'

describe('Bucket link factory', () => {
  test('should create link to file based on provider', () => {
    const link = linkFactory.createLink({
      provider: 'aws',
      aws: {
        s3: {
          bucketName: 'bucket',
          key: 'file.mp3'
        }
      }
    })
    expect(link).toEqual('https://bucket.s3-us-west-1.amazonaws.com/file.mp3')
  })
})
