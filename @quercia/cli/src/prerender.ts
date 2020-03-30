import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { sync as resolve } from 'enhanced-resolve'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Quercia from '.'
import { mkdir } from './fs'

interface Manifest {
  prerender: {
    [key: string]: string
  }
  pages: {
    [key: string]: string
  }
}

async function loadManifest(path: string): Promise<Manifest> {
  const data = await fs.readFile(path)

  return JSON.parse(data.toString())
}

// clearNodeCache clears the node requre cache, useful during development
// mode when we might prerender a module multiple times (and wanna reload the source)
function clearNodeCache(path: string) {
  if (require.cache[path]) {
    delete require.cache[path]
  }
}

// render renders to string a component, cathing also eventual
// errors, in which case we render an error page(statically)
async function render(path: string): Promise<string> {
  try {
    const mod: React.FunctionComponent = await import(path)

    return renderToStaticMarkup(React.createElement(mod, null))
  } catch (err) {
    return `<div>
      <h2>Error while prerendering page in a <code>nodejs</code> environment</h2>
      <code><pre>
        ${err.stack}
      </pre></code>
      <script>debugger</script>
    </div>`
  }
}

async function addToManifest(results: Manifest['prerender']) {
  const path = join(Quercia.quercia, 'manifest.json')

  // get the previous data
  const manifest = await loadManifest(path)
  // add the new data
  manifest.prerender = results
  // write the result to the disk
  await fs.writeFile(path, JSON.stringify(manifest, null, 2))
}

export async function prerender(): Promise<void> {
  const prerenderDir = join(Quercia.quercia, 'prerender')
  const serverDir = join(Quercia.quercia, 'server')
  const results: Manifest['prerender'] = {}
  const { pages } = await loadManifest(join(serverDir, 'manifest.json'))

  for (const page in pages) {
    console.log(`prerendering pages/${page}`)
    const modulePath = resolve(serverDir, './' + pages[page])

    clearNodeCache(modulePath)
    results[page] = await render(modulePath)
  }

  // recreate it and populate it with the html contents
  await mkdir(prerenderDir)
  for (const page in results) {
    if (page == '_document') {
      await fs.writeFile(join(Quercia.quercia, 'template.html'), results[page])
      delete results[page]
      continue
    }

    const pageWithHash =
      pages[page].replace('.js', '').replace('pages/', '') + '.json'

    const dir = dirname(pageWithHash)
    if (dir != '.') {
      await mkdir(join(prerenderDir, dir))
    }

    const obj = {
      head: '',
      content: results[page]
    }
    await fs.writeFile(join(prerenderDir, pageWithHash), JSON.stringify(obj))
    results[page] = join('prerender', pageWithHash)
  }

  await addToManifest(results)
}
