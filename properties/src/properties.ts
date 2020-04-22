import prepareProperties from './prepare-properties'

// @ts-ignore
const environment = props[process.env.ENVIRONMENT]

export const properties = (file: any) => prepareProperties(Object.assign(JSON.parse(JSON.stringify(file.default)), environment))
