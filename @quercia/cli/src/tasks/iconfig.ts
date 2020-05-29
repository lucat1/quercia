import { Configuration } from 'webpack'

// the arguments used to call the function exported from the config file
export interface ConfigurationArgument {
  config: Configuration
  target: Target
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
  // hmr is the port on which the HMR server listens on.
  // the port is `-1` when we are in build mode or HMR is disabled
  hmr: number
}

export type Target = 'client' | 'server' | 'polyfills'
