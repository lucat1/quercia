import { Configuration } from 'webpack'
import { join } from 'path'
import isCI from 'is-ci'
import Terser from 'terser-webpack-plugin'

import Quercia from '../quercia'
import { Target } from '../tasks/iconfig'

import optimizeHooks from '../babel/optimize-hooks'
import removeFuncs from '../babel/remove-funcs'

// config returns the default webpack configuration, one for each
export default (target: Target): Configuration => {
  const {
    buildID,
    flags: { mode, stats }
  } = Quercia.getInstance()

  const {
    pages,
    paths: { runtime, root }
  } = Quercia.getInstance().tasks.structure

  const out = join(root, '__quercia', buildID, target)

  return {
    mode,

    // enable stats output when requested
    profile: stats,
    parallelism: stats ? 1 : undefined,
    stats: stats
      ? {
          modules: true
        }
      : undefined,

    devtool: mode == 'development' ? 'inline-source-map' : false,
    output: {
      filename: '[name].js',
      path: out,
      publicPath: '/__quercia/' + buildID + '/' + target + '/'
    },
    entry: {
      runtime,
      ...pages
    },
    resolve: {
      extensions: ['.js', '.jsx', '.mjs', '.json', '.ts', '.tsx'],
      mainFields: ['module', 'main']
    },
    module: {
      rules: [
        {
          test: /\.m?[t|j]sx?$/,
          include: path => {
            // absolutely always compile quercia modules which are written in modern js
            if (/@quercia\/(quercia|runtime)/.test(path)) {
              return true
            }

            return !/node_modules/.test(path)
          },
          use: {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: [
                [
                  '@babel/preset-env',
                  {
                    exclude: [
                      '@babel/plugin-transform-regenerator',
                      '@babel/plugin-transform-typeof-symbol'
                    ],
                    loose: true,
                    targets: {
                      browsers: ['last 2 versions', 'IE >= 9']
                    }
                  }
                ],
                '@babel/preset-typescript',
                '@babel/preset-react'
              ],
              plugins: ([
                [
                  'transform-async-to-promises',
                  {
                    // share code between files (only on the client-side)
                    externalHelpers: target === 'client'
                  }
                ]
              ] as any)
                .concat(target !== 'server' ? [optimizeHooks, removeFuncs] : [])
                .concat(
                  mode === 'development' ? ['react-hot-loader/babel'] : []
                )
            }
          }
        }
      ]
    },
    optimization: {
      minimize: mode === 'production' && target !== 'server',
      minimizer:
        mode === 'production' && target !== 'server'
          ? [
              new Terser({
                parallel: !isCI,
                cache: true,
                extractComments: {
                  condition: /^\**!|@preserve|@license|@cc_on/i,
                  filename: () => 'LICENSE.txt',
                  banner: file => {
                    return `LICENSE(s) at ${file.replace(
                      join(root, '__quercia', ''),
                      ''
                    )}`
                  }
                },
                terserOptions: {
                  compress: true,
                  output: {
                    comments: false
                  }
                }
              })
            ]
          : []
    }
  }
}
