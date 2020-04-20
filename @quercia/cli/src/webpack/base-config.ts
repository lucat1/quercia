import { Configuration } from 'webpack'
import { join } from 'path'
import isCI from 'is-ci'
import Terser from 'terser-webpack-plugin'

import Quercia from '../quercia'

// config returns the default webpack configuration, one for each
export default (isServer: boolean): Configuration => {
  const {
    buildID,
    flags: { mode }
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
        '/__quercia/' + buildID + '/' + (isServer ? 'server' : 'client') + '/'
    },
    entry: {
      runtime,
      ...pages
    },
    optimization: {
      minimize: mode === 'production' && !isServer,
      minimizer:
        mode === 'production' && !isServer
          ? [
              new Terser({
                parallel: !isCI,
                cache: true,
                extractComments: {
                  condition: /^\**!|@preserve|@license|@cc_on/i,
                  filename: () => 'LICENSE.txt',
                  banner: file => {
                    return `LICENSE(s) at ${file.replace(
                      join(root, '__quercia', ''),
                      ''
                    )}`
                  }
                },
                terserOptions: {
                  compress: true,
                  output: {
                    comments: false
                  }
                }
              })
            ]
          : []
    }
  }
}
