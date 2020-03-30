import { sep, extname, basename } from 'path'

import Quercia from '.'
import { readdir } from './fs'

const EXCLUDE = ['_app', '_document']

// loadPages fetches the pages to be compiled with webpack
export async function loadPages() {
  const paths = await readdir(Quercia.pages)
  for (const path of paths) {
    let stop = false
    for (const excl of EXCLUDE) {
      if (basename(path).startsWith(excl)) {
        Quercia.internals[EXCLUDE.indexOf(excl)] = path
        stop = true
      }
    }
    if (stop) continue

    const key =
      'pages/' +
      path.replace(Quercia.pages + sep, '').replace(extname(path), '')

    Quercia.entries[key] = `${Quercia.loader}!${path}`
  }
}
