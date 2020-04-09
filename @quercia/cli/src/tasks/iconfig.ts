import { Configuration } from 'webpack'

// the arguments used to call the function exported from the config file
export interface ConfigurationArgument {
  config: Configuration
  isServer: boolean
  buildID: string
  mode: 'production' | 'development'
}

// two types for the possible configuration export value
export type Reducer = (data: ConfigurationArgument) => Configuration
export type PReducer = (data: ConfigurationArgument) => Promise<Configuration>

export default interface IConfig {
  // the function exported from the `quercia.config.js` file
  rc: Reducer | PReducer

  // the webpack client and server configurations
  client: Configuration
  server: Configuration
}
