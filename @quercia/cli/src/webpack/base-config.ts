import { Configuration } from 'webpack'
import { join } from 'path'

import Quercia from '../quercia'

// config returns the default webpack configuration, one for each
export default (server: boolean): Configuration => {
  const {
    buildID,
    parsedFlags: { mode }
  } = Quercia.getInstance()

  const {
    pages,
    paths: { runtime, root }
  } = Quercia.getInstance().tasks.structure

  return {
    devtool: mode == 'development' ? 'inline-source-map' : false,
    output: {
      filename: '[name].js',
      path: join(root, '__quercia', buildID, server ? 'server' : 'client'),
      publicPath: '/__quercia/'
    },
    entry: {
      runtime,
      ...pages
    }
  }
}
