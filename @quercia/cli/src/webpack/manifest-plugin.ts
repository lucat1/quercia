import { Plugin, Compiler, compilation } from 'webpack'
import { join } from 'path'

import Quercia from '../quercia'
import Manifest, { VendorChunk } from './manifest'

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
        // handle pages chunks
        if (chunk.name.startsWith('pages/')) {
          const key = chunk.name.replace('pages/', '')
          assets.pages[key] = join(
            this.quercia.buildID,
            'client',
            chunk.name + '.js'
          )
          continue
        }

        // handle normal chunks
        const vendors: VendorChunk[] = [
          'webpack-runtime',
          'vendor',
          'runtime',
          'polyfills'
        ]
        if (vendors.includes(chunk.name as VendorChunk)) {
          const name = chunk.name as VendorChunk
          assets.vendor[name] = join(
            this.quercia.buildID,
            'client',
            chunk.name + '.js'
          )
        }
      }

      this.quercia.tasks.builder.manifest = assets
    })
  }
}
