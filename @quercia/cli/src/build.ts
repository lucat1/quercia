import * as webpack from 'webpack'
import { sync as resolve } from 'enhanced-resolve'

// webpack compiler related variables
export const entry = resolve(process.cwd(), '@quercia/runtime')

// build builds the webpack bundle
export function build(config: webpack.Configuration): Promise<webpack.Stats> {
  return new Promise((res, rej) => {
    const compiler = webpack(config)
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        return rej(err || stats.compilation.errors)
      }

      res(stats)
    })
  })
}

export async function watch(config: webpack.Configuration) {
  const compiler = webpack(config)
  compiler.watch({}, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err ? [err] : stats.compilation.errors)
    }
  })
}
