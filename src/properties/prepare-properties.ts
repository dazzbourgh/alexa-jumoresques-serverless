import AWS from 'aws-sdk'

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

const awsSecretReplacer: ReplacingFunction = async (obj, key) => {
  const regex = /^#([a-zA-Z/_]+).([a-zA-Z/_])/
  const initValue = obj[key] as string
  const match = regex.exec(initValue)
  if (match !== null) {
    const client = new AWS.SecretsManager({
      // todo: replace dynamically
      region: 'us-west-1'
    })
    const secret = await client.getSecretValue({ SecretId: match[1] }).promise()
    const secretValue = secret.SecretString
    if (secretValue === undefined) {
      throw new Error(`No AWS secret found for key: ${initValue}`)
    }
    obj[key] = JSON.parse(secret.SecretString as string)[match[2]]
    return true
  }
  return false
}

const replacers: ReplacingFunction[] = [environmentVariableReplacingFunction, awsSecretReplacer]

export default async function prepare (obj: any): Promise<any> {
  for (const key of Object.keys(obj)) {
    const field = obj[key]
    if (typeof field === 'object') {
      await prepare(field)
    } else {
      for (const replacer of replacers) {
        const result = await replacer(obj, key)
        if (result) break
      }
    }
  }
  return await Promise.resolve(obj)
}
