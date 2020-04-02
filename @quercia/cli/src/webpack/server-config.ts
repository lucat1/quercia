import { sep } from 'path'
import { Configuration } from 'webpack'

interface T {
  [key: string]: string
}

export default async (base: Configuration): Promise<Configuration> => {
  delete (base.entry as { [key: string]: string })['runtime']

  const entries = base.entry as T
  const entry: T = {}

  for (const key in entries) {
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
