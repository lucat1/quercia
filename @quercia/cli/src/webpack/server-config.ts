import { Configuration } from 'webpack'

export default async (base: Configuration): Promise<Configuration> => {
  delete (base.entry as { [key: string]: string })['runtime']

  return {
    ...base,
    target: 'node',
    externals: {
      'react': 'commonjs2 react',
      'react-dom': 'commonjs2 react-dom'
    }
  }
}
