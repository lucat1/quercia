import { loader } from 'webpack'
import { extname } from 'path'

import Quercia from '..'

const pageLoader: loader.Loader = function() {
  const ext = extname(this.resourcePath)
  const pagePath = JSON.stringify(this.resourcePath)
  const pageName = pagePath.replace(Quercia.pages + '/', '').replace(ext, '')
  
  return `
    (window.__P = window.__P || {})[${pageName}] = function() {
      return require(${pagePath});
    }
  `
}

export default pageLoader