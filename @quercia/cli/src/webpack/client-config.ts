import { Configuration, HotModuleReplacementPlugin } from 'webpack'
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

  const {
    tasks: { config }
  } = Quercia.getInstance()

  // check for the hot module replacement availability
  let hmr = ''
  if (config.hmr != -1) {
    const url = `http://localhost:${config.hmr}/hmr`
    hmr = `webpack-hot-middleware/client?path=${url}`
  }

  for (const key in entries) {
    // ignore the runtime and _document chunks
    if (key == '_document') continue

    if (key == 'runtime') {
      // enable the `webpack-hot-middleware` during development
      entry[key] = hmr != '' ? ([hmr, entries[key]] as any) : entries[key]

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
      new ManifestPlugin(Quercia.getInstance()),
      new HotModuleReplacementPlugin()
    ],
    resolve: {
      alias: {
        // prevent duplicate react versions
        // which causes issues with hooks (react >= 16.8)
        'react': await resolve(process.cwd(), 'react'),
        'react-dom': await resolve(process.cwd(), 'react-dom'),
        '@quercia/quercia': await resolve(process.cwd(), '@quercia/quercia'),
        '@quercia/runtime': await resolve(process.cwd(), '@quercia/runtime')
      }
    },
    optimization: {
      ...base.optimization,
      usedExports: true,
      runtimeChunk: {
        name: 'webpack-runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 2,
        cacheGroups: {
          runtime: {
            test: /(node_modules|@quercia\/quercia)/,
            name: 'vendor',
            priority: -10
          }
        }
      }
    }
  }
}
