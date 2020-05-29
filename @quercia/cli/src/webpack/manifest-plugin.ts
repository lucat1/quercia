import { Plugin, Compiler, compilation } from 'webpack'
import { join } from 'path'

import Quercia from '../quercia'
import Manifest, { VendorChunk } from './manifest'

const vendors: VendorChunk[] = [
  'webpack-runtime',
  'vendor',
  'runtime',
  'polyfills'
]

export default class ManifestPlugin implements Plugin {
  private quercia: Quercia

  constructor(quercia: Quercia) {
    this.quercia = quercia
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('QuerciaManifest', compilation => {
      const chunks: compilation.Chunk[] = compilation.chunks
      const assets: Manifest = {
        pages: {},
        prerender: {},
        vendor: {} as any
      }

      for (const chunk of chunks) {
        // handle normal chunks
        if (vendors.includes(chunk.name as VendorChunk)) {
          // ignore empty chunks
          if (chunk.files.length === 0) return

          const name = chunk.name as VendorChunk
          assets.vendor[name] = join('client', chunk.files[0])
        }
      }

      for (const [, e] of compilation.entrypoints.entries()) {
        const entry = e as compilation.Chunk

        // ignroe non-pages entries
        if (!/pages\//.test(entry.name)) {
          continue
        }

        const key = entry.name.replace('pages/', '')
        assets.pages[key] = []
        const depends: string[] = (entry as any).getFiles()

        for (const dep of depends) {
          if (Object.values(assets.vendor).some(value => value.includes(dep))) {
            continue
          }

          assets.pages[key].push(join('client', dep))
        }
      }

      assets.vendor.polyfills = join('polyfills', 'polyfills.js')
      this.quercia.tasks.builder.manifest = assets
    })
  }
}
