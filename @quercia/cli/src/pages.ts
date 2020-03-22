import { extname } from 'path'

import Quercia from '.'
import { readdir } from './fs'

export const loader = require.resolve('./webpack/page-loader.js')

// loadPages fetches the pages to be compiled with webpack
export async function loadPages(root: string) {
  const paths = await readdir(root)
  paths.forEach(path => {
    const key =
      'pages/' + path.replace(root + '/', '').replace(extname(path), '')

    Quercia.entries[key] = loader + '!' + path
  })
}
