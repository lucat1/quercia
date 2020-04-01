import * as eresolve from 'enhanced-resolve'
import { promisify } from 'util'

import Quercia from '../quercia'
import ManifestPlugin from './manifest-plugin'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any

// config returns the default webpack configuration, one for each
export default async () => {
  const { mode } = Quercia.getInstance().parsedFlags
  const {
    pages,
    paths: { runtime }
  } = Quercia.getInstance().tasks.structure

  return {
    devtool: mode == 'development' ? 'inline-source-map' : false,
    output: {
      filename: '[name].js',
      publicPath: '/__quercia/'
    },
    entry: {
      runtime,
      ...pages
    },
    resolve: {
      alias: {
        // prevent duplicate react versions
        // which causes issues with hooks (react >= 16.8)
        react: await resolve(process.cwd(), 'react'),
        'react-dom': await resolve(process.cwd(), 'react-dom')
      }
    },
    plugins: [new ManifestPlugin('../manifest.json')],
    optimization: {
      runtimeChunk: {
        name: () => 'webpack-runtime'
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
