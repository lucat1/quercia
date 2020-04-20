import { loader } from 'webpack'
import { sync as resolve } from 'enhanced-resolve'
import { parseQuery } from 'loader-utils'

interface Query {
  name: string
  dev: boolean
}

const pageLoader: loader.Loader = function () {
  const query = parseQuery(this.resourceQuery) as Query

  // add `exclude-loader` and `page-hot-loader` (only during dev mode)
  const pagePath = JSON.stringify(
    `${resolve(process.cwd(), '@quercia/cli/dist/webpack/exclude-loader')}${
      query.dev
        ? '!' +
          resolve(process.cwd(), '@quercia/cli/dist/webpack/page-hot-loader')
        : ''
    }!${this.resourcePath}`
  )

  return `
    (window.__P = window.__P || {})[${JSON.stringify(
      query.name
    )}] = function() {
      return require(${pagePath});
    }
  `
}

export default pageLoader
