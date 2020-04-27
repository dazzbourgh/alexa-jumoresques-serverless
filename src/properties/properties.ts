import initialProps from './env.json'
import AWS from 'aws-sdk'
import * as _ from 'lodash'

type ReplacingFunction = (obj: any, key: string) => Promise<boolean>

const environmentVariableReplacingFunction: ReplacingFunction = async (obj, key) => {
  const envRegex = /^\$([a-zA-Z_]+)(\s+\|\|\s+(.*))?/
  const initValue = obj[key]
  const match = envRegex.exec(initValue)
  if (match !== null) {
    const variableName = match[1]
    const variableValue = process.env[variableName]
    if (variableValue !== undefined) {
      obj[key] = variableValue
      return true
    } else {
      const defaultValue = match[3]
      if (defaultValue !== undefined) {
        obj[key] = defaultValue
        return true
      } else {
        throw new Error(`Environment variable or default value expected for field: ${key}`)
      }
    }
  }
  return false
}

const awsSecretReplacer: (secretManager: AWS.SecretsManager) => ReplacingFunction = secretManager => async (obj, key) => {
  const regex = /^#([a-zA-Z/:\-_0-9]+).([a-zA-Z/_]+)$/
  const initValue = obj[key] as string
  const match = regex.exec(initValue)
  if (match !== null) {
    const params = { SecretId: match[1] }
    const secret = await secretManager.getSecretValue(params)
      .promise()
    const secretValue = secret.SecretString
    if (secretValue === undefined) {
      throw new Error(`No AWS secret found for key: ${initValue}`)
    }
    obj[key] = JSON.parse(secretValue)[match[2]]
    return true
  }
  return false
}

function prepare (replacingFunctions: ReplacingFunction[]): (obj: any) => Promise<any> {
  return async (obj: any) => {
    for (const key of Object.keys(obj)) {
      const field = obj[key]
      if (typeof field === 'object') {
        await prepare(replacingFunctions)(field)
      } else {
        for (const replacer of replacingFunctions) {
          const result = await replacer(obj, key)
          if (result) break
        }
      }
    }
    return await Promise.resolve(obj)
  }
}

export function assembleProperties (environment: string, secretsManager: AWS.SecretsManager, functionName: string): (props: any) => Promise<any> {
  return async (props: any) => {
    let combinedProps = JSON.parse(JSON.stringify(props.generic.default || {}))
    combinedProps = _.merge(combinedProps, props.generic[environment] || {})
    combinedProps = _.merge(combinedProps, props[functionName].default || {})
    combinedProps = _.merge(combinedProps, (props[functionName] || {})[environment] || {})
    const replacers: ReplacingFunction[] = [environmentVariableReplacingFunction, awsSecretReplacer(secretsManager)]
    return await prepare(replacers)(combinedProps)
  }
}

async function getProperties (props: any): Promise<any> {
  // @ts-ignore
  const environment = props[process.env.ENVIRONMENT]
  const secretsManager = new AWS.SecretsManager({
    // @ts-ignore
    region: props.generic[environment].region
  })
  return await assembleProperties(environment, secretsManager, process.env.FUNCTION_NAME as string)(props)
}

export const properties = getProperties(initialProps)
