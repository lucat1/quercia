import { loader } from 'webpack'
import { sep, extname } from 'path'

import Quercia from '../quercia'

const pageLoader: loader.Loader = function () {
  const pagesFolder = Quercia.getInstance().tasks.structure.paths.pages
  const ext = extname(this.resourcePath)
  const pagePath = JSON.stringify(this.resourcePath)
  const pageName = pagePath.replace(pagesFolder + sep, '').replace(ext, '')

  return `
    (window.__P = window.__P || {})[${pageName}] = function() {
      return require(${pagePath});
    }
  `
}

export default pageLoader
