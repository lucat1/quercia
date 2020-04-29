import { Configuration } from 'webpack'
import eresolve from 'enhanced-resolve'
import { promisify } from 'util'
import Quercia from '../quercia'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any

export default async (base: Configuration): Promise<Configuration> => {
  const polyfills = await resolve(
    Quercia.getInstance().tasks.structure.paths.root,
    '@quercia/cli/dist/webpack/polyfills'
  )

  return {
    ...base,
    entry: {
      polyfills
    }
  }
}
