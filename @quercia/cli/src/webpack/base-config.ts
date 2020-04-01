import { Configuration } from 'webpack'
import { join } from 'path'

import Quercia from '../quercia'

// config returns the default webpack configuration, one for each
export default (isServer: boolean): Configuration => {
  const {
    buildID,
    parsedFlags: { mode }
  } = Quercia.getInstance()

  const {
    pages,
    paths: { runtime, root }
  } = Quercia.getInstance().tasks.structure

  return {
    mode,
    devtool: mode == 'development' ? 'inline-source-map' : false,
    output: {
      filename: '[name].js',
      path: join(root, '__quercia', buildID, isServer ? 'server' : 'client'),
      publicPath: '/__quercia/'
    },
    entry: {
      runtime,
      ...pages
    }
  }
}
