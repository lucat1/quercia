import * as webpack from 'webpack'
import { sync as resolve } from 'enhanced-resolve'

import ManifestPlugin from './webpack/manifest-plugin'

import Quercia from '.'

// config configures the webpack bundler
export function config(mode: 'production' | 'development'): webpack.Configuration {
  return {
    mode,
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
        'react': resolve(process.cwd(), 'react'),
        'react-dom': resolve(process.cwd(), 'react-dom')
      }
    },
    plugins: [
      new ManifestPlugin()
    ],
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
