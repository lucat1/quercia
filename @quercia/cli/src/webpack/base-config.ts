import { Configuration } from 'webpack'
import { join } from 'path'
import isCI from 'is-ci'
import Terser from 'terser-webpack-plugin'

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

  const out = join(root, '__quercia', buildID, isServer ? 'server' : 'client')

  return {
    mode,
    devtool: mode == 'development' ? 'inline-source-map' : false,
    output: {
      filename: '[name].js',
      path: out,
      publicPath:
        '/__quercia/' + buildID + '/' + (isServer ? 'server' : 'client')
    },
    entry: {
      runtime,
      ...pages
    },
    optimization: {
      minimize: mode === 'production',
      minimizer:
        mode === 'production'
          ? [
              new Terser({
                parallel: !isCI,
                extractComments: {
                  condition: /^\**!|@preserve|@license|@cc_on/i,
                  filename: () => join(out, 'LICENSE.txt'),
                  banner: file => {
                    return `LICENSE at ${file}`
                  }
                },
                terserOptions: {
                  compress: true,
                  mangle: {
                    properties: true
                  }
                }
              })
            ]
          : []
    }
  }
}