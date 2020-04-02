import { loader } from 'webpack'
import { parseQuery } from 'loader-utils'

interface Query {
  name: string
}

const pageLoader: loader.Loader = function () {
  const query = parseQuery(this.resourceQuery) as Query
  const pagePath = JSON.stringify(this.resourcePath)

  return `
    (window.__P = window.__P || {})[${JSON.stringify(
      query.name
    )}] = function() {
      return require(${pagePath});
    }
  `
}

export default pageLoader
