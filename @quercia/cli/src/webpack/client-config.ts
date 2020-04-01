import { Configuration } from 'webpack'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'

import ManifestPlugin from './manifest-plugin'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any

export default async (base: Configuration): Promise<Configuration> => {
  return {
    ...base,
    plugins: [...(base.plugins || []), new ManifestPlugin('client')],
    resolve: {
      alias: {
        // prevent duplicate react versions
        // which causes issues with hooks (react >= 16.8)
        'react': await resolve(process.cwd(), 'react'),
        'react-dom': await resolve(process.cwd(), 'react-dom')
      }
    },
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
