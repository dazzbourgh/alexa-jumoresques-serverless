import * as props from './env.json'

const def = JSON.parse(JSON.stringify(props.default))

// @ts-ignore
const environment = props[process.env.ENVIRONMENT]

const properties: any = Object.assign(def, environment)
// TODO: replace $ values in properties with env variables
export default properties
