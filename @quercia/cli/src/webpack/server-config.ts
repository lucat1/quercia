import { sep } from 'path'
import { Configuration } from 'webpack'

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
      libraryTarget: 'commonjs2',
      libraryExport: 'default'
    },
    target: 'node',
    externals: {
      'react': 'commonjs2 react',
      'react-dom': 'commonjs2 react-dom'
    }
  }
}