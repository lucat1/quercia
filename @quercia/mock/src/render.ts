import { join } from 'path'
import { promises as fs } from 'fs'

import QMock from './qmock'

interface Manifest {
  pages: {
    [key: string]: string[]
  }
  prerender: {
    [key: string]: string
  }

  vendor: {
    'runtime': string
    'vendor': string
    'webpack-runtime': string
    'polyfills': string
  }
}

export default async function render(page: string, json: string) {
  // step 1: read the manifest
  const quercia = QMock.getInstance().quercia
  const manifest: Manifest = await import(join(quercia, 'manifest.json'))
  if (!manifest.pages[page] || !manifest.prerender[page]) {
    return new Error('Invalid page name (not defined in the manifest)')
  }

  const template = await fs.readFile(join(quercia, manifest.prerender[page]))

  const scripts = `
    <script id="__QUERCIA_DATA__" type="application/json" crossorigin="anonymous">${json}</script>
    <script nomodule src="${manifest.vendor.polyfills}"></script>
    <script src="${manifest.vendor['webpack-runtime']}"></script>
    <script src="${manifest.vendor.vendor}"></script>
    ${
      manifest.pages._app
        ? `<script src="${manifest.pages._app}"></script>`
        : ''
    }
    <script src="${manifest.pages[page]}"></script>
    <script src="${manifest.vendor.runtime}"></script>
  `

  return template.toString().replace('__QUERCIA__SCRIPTS__', scripts)
}
