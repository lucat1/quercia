import {
  Configuration,
  HotModuleReplacementPlugin,
  NormalModuleReplacementPlugin
} from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'
import { sep } from 'path'
import { createHash } from 'crypto'

import ManifestPlugin from './manifest-plugin'
import Quercia from '../quercia'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve.create({ mainFields: ['module', 'main'] })
) as any

interface T {
  [key: string]: string
}

export default async (base: Configuration): Promise<Configuration> => {
  const loader = await resolve(
    Quercia.getInstance().tasks.structure.paths.root,
    '@quercia/cli/dist/webpack/page-loader'
  )

  const noop = await resolve(
    Quercia.getInstance().tasks.structure.paths.root,
    '@quercia/cli/dist/webpack/noop'
  )

  const entries = base.entry as T
  const entry: T = {}

  const {
    command,
    tasks: { config, structure },
    flags: { mode, typecheck },
    logger
  } = Quercia.getInstance()

  // check for the hot module replacement availability
  let hmr = ''
  if (config.hmr != -1) {
    const url = `http://localhost:${config.hmr}/hmr`
    hmr = `webpack-hot-middleware/client?path=${url}`
  }

  for (const key in entries) {
    // ignore the _document chunks
    if (key == 'pages/_document') continue

    if (key == 'runtime') {
      // enable the `webpack-hot-middleware` during development
      entry[key] = hmr != '' ? ([hmr, entries[key]] as any) : entries[key]
      continue
    }

    const pageName = key.replace('pages' + sep, '')
    entry[key] = `${loader}!${entries[key]}?name=${pageName}&dev=${
      config.hmr != -1
      }`
  }

  // function used to generate names based on reproducible hashes of content
  const name = (base: string) => (module: {
    type: string
    libIdent?: Function
  }): string => {
    if (!module.libIdent) {
      logger.error(
        'webpack/client-config',
        'invalid output module type(lib): `' + module.type + '`'
      )
      return ''
    }

    return (
      base +
      createHash('sha1')
        .update(module.libIdent({ context: structure.paths.root }))
        .digest('hex')
        .substr(0, 8)
    )
  }

  return {
    ...base,
    entry,
    output: {
      ...base.output,
      filename:
        config.hmr != -1 ? '[name].[hash].js' : '[name].[contenthash:8].js'
    },
    target: 'web',
    plugins: [
      ...(base.plugins || []),
      new ManifestPlugin(Quercia.getInstance()),
      new NormalModuleReplacementPlugin(/core-js|unfetch|url-polyfill/, noop)
    ]
      .concat(config.hmr != -1 ? [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'whm' } })] : [])
      .concat(
        structure.paths.tsconfig && typecheck
          ? new ForkTsCheckerWebpackPlugin({
            typescript: {
              configFile: structure.paths.tsconfig
            },
            async: command == 'watch',
            devServer: command == 'watch' && mode == 'development',
            logger: {
              log: message =>
                logger.info('webpack/ts-type-checker', message),
              error: err => {
                // only fail during builds (keep alive during watch)
                // if the hmr is enabled we are clearly in watch mode
                const level = config.hmr ? 'warning' : 'error'

                logger[level](
                  'webpack/ts-type-checker(error)',
                  'type error from `ts-checker`\n' +
                  logger.prettyError(level, new TypeError(err))
                )
              },
            }
          })
          : []
      ),
    resolve: {
      ...base.resolve,
      mainFields: ['browser', 'module', 'main'],
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
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            name: 'vendor',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|object-assign|preact|@quercia\/(quercia|cli)|core-js|babel-plugin-transform-async-to-promises|html-entities)[\\/]/,
            priority: 40,
            enforce: true
          },
          lib: {
            test: (module: { size: Function; identifier: Function }) =>
              module.size() > 100000 /* 100kb */ &&
              /node_modules[/\\]/.test(module.identifier()),

            name: name('lib-'),
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          },
          commons: {
            name: 'commons',
            minChunks: Math.max(Math.ceil(Object.keys(structure.pages).length / 2), 1),
            priority: 20
          },
          shared: {
            name: name('shared-'),
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true
          }
        },
        maxInitialRequests: 25,
        minSize: 20000
      }
    }
  }
}
