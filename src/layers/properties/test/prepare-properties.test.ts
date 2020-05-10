import props from './env.test.json'
// import invalidProps from './env.invalid.json'
import expectedProps from './env.expected.json'
import { assembleProperties } from '../src/properties'
import AWS from 'aws-sdk'
import { promise } from 'common'

describe('properties preparing function', () => {
  test('should replace $ values with environment variables', async () => {
    const secretsManager = {
      getSecretValue: jest.fn(() => promise({
        SecretString: `{
          "token": "${expectedProps.vk.token}"
        }`
      }))
    } as unknown as AWS.SecretsManager
    await expect(assembleProperties('test', secretsManager, process.env.FUNCTION_NAME as string)(props))
      .resolves.toEqual(expectedProps)
  })

  // todo: revive test
  // test('should fail if neither env variable nor default value provided', async () => {
  //   await expect(prepare(invalidProps)).rejects.toEqual(new Error('Environment variable or default value expected for field: missingEnvVar'))
  // })
})
