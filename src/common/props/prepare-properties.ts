const regex = /^\$([a-zA-Z_]+)(\s+\|\|\s+(.*))?/

export default function prepare (obj: any): void {
  for (const key of Object.keys(obj)) {
    const field = obj[key]
    if (typeof field === 'object') {
      prepare(field)
    } else {
      const stringField = field as string
      const match = regex.exec(stringField)
      if (match != null) {
        const envValue = process.env[match[1]]
        if (typeof envValue === 'undefined' || envValue === '') {
          const defaultValue = match[3]
          if (typeof defaultValue === 'undefined') {
            throw new Error(`Environment variable or default value expected for field: ${key}`)
          }
          obj[key] = defaultValue
        } else {
          obj[key] = envValue
        }
      }
    }
  }
  return obj
}
