import * as webpack from 'webpack'
import { join } from 'path'
import { sync as resolve } from 'enhanced-resolve'

import ManifestPlugin from './webpack/manifest-plugin'

import Quercia from '.'

// config configures the webpack bundler
export function config(
  mode: 'production' | 'development',
  target: webpack.Configuration['target']
): webpack.Configuration {
  const entries: { [key: string]: string } = {}
  for (const key in Quercia.entries) {
    entries[key] = Quercia.loader + '?path=' + Quercia.entries[key]
  }

  return {
    mode,
    target,
    devtool: mode == 'development' ? 'source-map' : false,
    output: {
      path: Quercia.quercia,
      filename: '[name]-[contenthash].js',
      publicPath: '/__quercia/'
    },
    entry: {
      runtime: Quercia.runtime,
      ...Quercia.entries
    },
    resolve: {
      alias: {
        // prevent duplicate react versions
        react: resolve(process.cwd(), 'react'),
        'react-dom': resolve(process.cwd(), 'react-dom')
      }
    },
    plugins: [new ManifestPlugin()],
    optimization: {
      runtimeChunk: {
        name: _ => `webpack-runtime`
      },
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          runtime: {
            test: /(node_modules|@quercia\/quercia)/,
            name: 'vendor',
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}

// pconfig returns a modified version of the configuration
// with some fields edited to allow for server side rendering
export function pconfig(
  mode: 'production' | 'development'
): webpack.Configuration {
  const base = config(mode, 'node')

  // change the output path
  base.output = {
    ...base.output,
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
    path: join(Quercia.quercia, 'server')
  }

  // remove the runtime entry, its not needed on the server side
  const entries = base.entry as { [key: string]: string }
  for (const key in entries) {
    if (key == 'runtime') {
      delete entries[key]
      continue
    }

    entries[key] = entries[key].replace(`${Quercia.loader}!`, '')
  }
  base.entry = entries

  // remove any optimization and chunk-splitting option
  if (base.optimization) base.optimization = {}

  base.externals = {
    react: 'commonjs2 react',
    'react-dom': 'commonjs2 react-dom'
  }

  return base
}
