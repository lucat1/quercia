import { join, sep } from 'path'
import { promises as fs } from 'fs'

import Quercia from '.'

// loadRc loads the `quercia.config.js` file if available
export async function loadRc() {
  const path = await findRc()
  if (path == null) {
    return // no configuration, skip this step
  }

  console.log('Using config at: ', path.replace(Quercia.root + sep, ''))
}

async function findRc(): Promise<string | null> {
  const files = ['quercia.config.js', 'querciarc.js', '.querciarc']
  for (const file of files) {
    const path = join(Quercia.root, file)

    try {
      const stats = await fs.stat(path)
      if (stats.isFile()) {
        return path
      }
    } catch (err) {} // ignore errors
  }

  return null
}
