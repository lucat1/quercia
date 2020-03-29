import { sep, extname } from 'path'

import Quercia from '.'
import { readdir } from './fs'

// loadPages fetches the pages to be compiled with webpack
export async function loadPages(root: string) {
  const paths = await readdir(root)
  paths.forEach(path => {
    const key =
      'pages/' + path.replace(root + sep, '').replace(extname(path), '')

    Quercia.entries[key] = path
  })
}
