import props from './env.test.json'
import invalidProps from './env.invalid.json'
import expectedProps from './env.expected.json'
import prepareProperties from '../../src/props/prepare-properties'

process.env.ENV_VAR = 'someVal'

test('should replace $ values with environment variables', () => {
  expect(prepareProperties(props)).toEqual(expectedProps)
})

test('should fail if neither env variable nor default value provided', () => {
  expect(() => prepareProperties(invalidProps)).toThrow()
})
