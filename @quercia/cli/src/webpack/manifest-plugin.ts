import { Plugin, Compiler, compilation } from 'webpack'
import { RawSource } from 'webpack-sources'

export default class ManifestPlugin implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('QuerciaManifest', compilation => {
      const chunks: compilation.Chunk[] = compilation.chunks
      const assets = {
        pages: {},
      }

      for (const chunk of chunks) {
        // handle pages chunks
        if (chunk.name.startsWith('pages/')) {
          const key = chunk.name.replace('pages/', '')
          assets.pages[key] =
            chunk.name + '-' + chunk.contentHash['javascript'] + '.js'
          continue
        }

        // handle normal chunks
        if (['webpack-runtime', 'vendor', 'runtime'].includes(chunk.name)) {
          assets[chunk.name] =
            chunk.name + '-' + chunk.contentHash['javascript'] + '.js'
        }
      }

      compilation.assets['manifest.json'] = new RawSource(
        JSON.stringify(assets, null, 2)
      )
    })
  }
}
