import { join } from 'path'
import { promises as fs } from 'fs'
import * as glob from 'fast-glob'

import { getPackages } from './packages'

async function main() {
  const pkgs = await getPackages()

  let count = 0
  for (const pkg of pkgs) {
    for (const ext of ['js', 'd.ts', 'map', 'tsbuildinfo']) {
      const matches = await glob(join(pkg.dir, 'dist', `**/*.${ext}`))
      for (const match of matches) {
        await fs.unlink(match)
        count++
        console.log(`removed ${match.replace(pkg.dir + '/', '')}`)
      }
    }
  }

  console.log(`Removed ${count} files`)
}

main()
