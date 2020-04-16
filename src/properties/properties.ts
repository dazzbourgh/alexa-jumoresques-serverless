import props from '../common/env.json'
import prepareProperties from './prepare-properties'

const def = JSON.parse(JSON.stringify(props.default))

// @ts-ignore
const environment = props[process.env.ENVIRONMENT]

export const properties = prepareProperties(Object.assign(def, environment))
