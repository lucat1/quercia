import {
  Configuration,
  HotModuleReplacementPlugin,
  NormalModuleReplacementPlugin
} from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'
import { sep } from 'path'
import uid from 'uid'

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

  const noop = await resolve(
    Quercia.getInstance().tasks.structure.paths.root,
    '@quercia/cli/dist/webpack/noop'
  )

  const entries = base.entry as T
  const entry: T = {}

  const {
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
    // ignore the runtime and _document chunks
    if (key == '_document') continue

    if (key == 'runtime') {
      // enable the `webpack-hot-middleware` during development
      entry[key] = hmr != '' ? ([hmr, entries[key]] as any) : entries[key]

      continue
    }

    const pageName = key.replace('pages' + sep, '')
    entry[key] = `${loader}!${entries[key]}?name=${pageName}&dev=${
      mode === 'development'
    }`
  }

  return {
    ...base,
    entry,
    target: 'web',
    plugins: [
      ...(base.plugins || []),
      new ManifestPlugin(Quercia.getInstance()),
      new NormalModuleReplacementPlugin(
        /core-js/,
        (resource: { context: string; request: string }) => {
          if (!resource.context.endsWith('polyfill.js')) {
            resource.request = noop
          }
        }
      )
    ]
      .concat(mode === 'development' ? new HotModuleReplacementPlugin() : [])
      .concat(
        structure.paths.tsconfig && typecheck
          ? new ForkTsCheckerWebpackPlugin({
              tsconfig: structure.paths.tsconfig,
              logger: {
                info: (...args) =>
                  logger.info('webpack/ts-type-checker', ...args),
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
                warn: err =>
                  logger.warning(
                    'webpack/ts-type-checker',
                    'type warning from `ts-checker`\n' +
                      logger.prettyError('warning', new TypeError(err))
                  )
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
        'react-dom': await resolve(
          process.cwd(),
          // use `@hot-loader/react-dom` during development to improve hot reloading
          mode === 'development' ? '@hot-loader/react-dom' : 'react-dom'
        ),
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
          polyfills: {
            chunks: 'all',
            name: 'polyfills',
            test: /core-js|unfetch|url-polyfill|object-assign/,
            priority: 50
          },
          vendor: {
            chunks: 'all',
            name: 'vendor',
            //test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|object-assign|preact|@quercia\/(quercia|cli)|core-js|babel-plugin-transform-async-to-promises|react-hot-loader|@hot-loader|tiny-(invariant|warning))[\\/]/,
            test: /(react|react-dom|scheduler|prop-types|object-assign|preact|@quercia\/(quercia|cli)|core-js|babel-plugin-transform-async-to-promises|react-hot-loader|@hot-loader|tiny-(invariant|warning))/,
            priority: 40,
            enforce: true
          },
          lib: {
            test: (module: { size: Function; identifier: Function }) =>
              module.size() > 160000 &&
              /node_modules[/\\]/.test(module.identifier()),

            name: () => `lib-${uid(7)}`,
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          },
          commons: { name: 'commons', minChunks: 4, priority: 20 },
          shared: {
            name: () => `shared-${uid(7)}`,
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
