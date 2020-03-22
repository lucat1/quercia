import * as webpack from 'webpack'
import { sync as resolve } from 'enhanced-resolve'

import ManifestPlugin from './webpack/manifest-plugin'
import ProgressPlugin from './webpack/progress-plugin'
import { entries, entry, quercia } from '.'

// config configures the webpack bundler
export function config(): webpack.Configuration {
  const mode = 'development'

  return {
    mode,
    output: {
      path: quercia,
      filename: '[name]-[contenthash].js',
      publicPath: '/__quercia/'
    },
    entry: {
      runtime: entry,
      ...entries
    },
    resolve: {
      alias: {
        // prevent duplicate react versions
        'react': resolve(process.cwd(), 'react'),
        'react-dom': resolve(process.cwd(), 'react-dom')
      }
    },
    plugins: [
      new ManifestPlugin(),
      new ProgressPlugin()
    ],
    optimization: {
      runtimeChunk: {
        name: _ => `webpack-runtime`
      },
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          runtime: {
            test: /node_modules/,
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
