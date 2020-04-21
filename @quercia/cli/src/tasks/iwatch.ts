import { NextHandleFunction } from 'connect'
import { EventStream } from 'webpack-hot-middleware'

export default interface IConfig {
  // the previous webpack compilation hash
  // useful for invalidating some logic on changes
  prev: string

  // the HMR middleware used to serve requests on the dev port
  middleware: NextHandleFunction & EventStream
}
