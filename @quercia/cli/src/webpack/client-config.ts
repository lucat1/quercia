import { Configuration } from 'webpack'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'
import { sep } from 'path'

import ManifestPlugin from './manifest-plugin'
import Quercia from '../quercia'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any

interface T {
  [key: string]: string
}

export default async (base: Configuration): Promise<Configuration> => {
  const loader = await resolve(
    Quercia.getInstance().tasks.structure.paths.root,
    '@quercia/cli/dist/webpack/page-loader'
  )

  const entries = base.entry as T
  const entry: T = {}

  for (const key in entries) {
    // ignore the runtime chunk
    if (key == 'runtime') {
      entry[key] = entries[key]
      continue
    }

    const pageName = key.replace('pages' + sep, '')
    entry[key] = `${loader}!${entries[key]}?name=${pageName}`
  }

  return {
    ...base,
    entry,
    target: 'web',
    plugins: [
      ...(base.plugins || []),
      new ManifestPlugin(Quercia.getInstance())
    ],
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
