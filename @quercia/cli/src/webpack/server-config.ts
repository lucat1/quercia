import { sep } from 'path'
import { Configuration } from 'webpack'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any
interface T {
  [key: string]: string
}

export default async (base: Configuration): Promise<Configuration> => {
  const entries = base.entry as T
  const entry: T = {}

  for (const key in entries) {
    if (key == 'runtime') continue // ignore the runtime chunk on the server

    const pageName = key.replace('pages' + sep, '')
    entry[pageName] = entries[key]
  }

  return {
    ...base,
    entry,
    output: {
      ...base.output,
      libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: {
      'react': `commonjs2 ${await resolve(__dirname, 'react')}`,
      'react-dom': `commonjs2 ${await resolve(__dirname, 'react-dom')}`,
      '@quercia/quercia': `commonjs2 ${await resolve(
        __dirname,
        '@quercia/quercia'
      )}`,
      '@quercia/runtime': `commonjs2 ${await resolve(
        __dirname,
        '@quercia/runtime'
      )}`
    },
    optimization: {
      // dont optimize/minimize the server bundle
      minimize: false
    }
  }
}
