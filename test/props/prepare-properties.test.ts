import props from './env.test.json'
import invalidProps from './env.invalid.json'
import expectedProps from './env.expected.json'
import prepare from '../../src/common/props/prepare-properties'

describe('properties preparing function', () => {
  test('should replace $ values with environment variables', async () => {
    await expect(prepare(props)).resolves.toEqual(expectedProps)
  })

  test('should fail if neither env variable nor default value provided', async () => {
    await expect(prepare(invalidProps)).rejects.toEqual(new Error('Environment variable or default value expected for field: missingEnvVar'))
  })
})
