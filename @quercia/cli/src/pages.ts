import { sep, extname } from 'path'

import Quercia from '.'
import { readdir } from './fs'

// loadPages fetches the pages to be compiled with webpack
export async function loadPages() {
  const paths = await readdir(Quercia.pages)
  for (const path of paths) {
    const key =
      'pages/' +
      path.replace(Quercia.pages + sep, '').replace(extname(path), '')

    Quercia.entries[key] = `${Quercia.loader}!${path}`
  }
}
