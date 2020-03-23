import { Plugin, Compiler, compilation } from 'webpack'
import { RawSource } from 'webpack-sources'

interface Assets {
  [key: string]: string | Assets
}

function getHash(chunk: compilation.Chunk): string {
  return (chunk.contentHash as { [key: string]: string })['javascript']
}

export default class ManifestPlugin implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('QuerciaManifest', compilation => {
      const chunks: compilation.Chunk[] = compilation.chunks
      const assets: Assets = { pages: {} }
      const pages = assets.pages as Assets

      for (const chunk of chunks) {
        // handle pages chunks
        if (chunk.name.startsWith('pages/')) {
          const key = chunk.name.replace('pages/', '')
          pages[key] =
            chunk.name + '-' + getHash(chunk) + '.js'
          continue
        }

        // handle normal chunks
        if (['webpack-runtime', 'vendor', 'runtime'].includes(chunk.name)) {
          assets[chunk.name] =
            chunk.name + '-' + getHash(chunk) + '.js'
        }
      }

      assets.pages = pages
      compilation.assets['manifest.json'] = new RawSource(
        JSON.stringify(assets, null, 2)
      )
    })
  }
}
