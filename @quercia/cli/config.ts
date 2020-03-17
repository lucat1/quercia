import * as webpack from 'webpack'

import ManifestPlugin from './manifest-plugin'
import { entries, entry, quercia } from '.'

// config configures the webpack bundler
export function config(): webpack.Configuration {
  return {
    mode: 'development', // 'production',
    entry: {
      ...entries,
      runtime: entry
    },
    output: {
      path: quercia,
      filename: '[name]-[contenthash].js',
      publicPath: '/__quercia/'
    },
    plugins: [
      new ManifestPlugin()
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          runtime: {
            test: /node_modules/,
            name: 'vendor',
            reuseExistingChunk: true,
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
