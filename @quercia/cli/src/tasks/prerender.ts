import { join, sep, dirname } from 'path'
import { promises as fs } from 'fs'

import * as React from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'

import { AppProps } from '@quercia/runtime'

import Task from '../task'
import { mkdirp } from '../fs'

export default class Prerender extends Task {
  // default implementation of the <App /> component
  private App = ({ Component, pageProps }: AppProps) =>
    React.createElement(Component, pageProps)

  public async execute() {
    this.debug('tasks/prerender', 'Prerendering all pages')

    const root = join(
      this.quercia.tasks.structure.paths.root,
      '__quercia',
      this.quercia.buildID
    )
    // the `server` webpack output folder (ex. __quercia/<id>/server)
    const input = join(root, 'server')

    // the `prerender` output folder (ex. __quercia/<id>/prerender)
    const output = join(root, 'prerender')
    await fs.mkdir(output)

    const pages = Object.keys(this.quercia.tasks.structure.pages)

    if (pages.includes('_app')) {
      this.debug('tasks/prerender', 'Found a custom _app, loading it')

      // If the user has defined a custom _app we wanna load that one for prerendering
      this.App = (await this.load(join(input, '_app.js'))) as any
    }

    let count = 0
    const EXCLUDES = ['pages/_app', 'pages/_document']
    for (let page of pages) {
      if (EXCLUDES.includes(page)) continue

      page = page.replace('pages' + sep, '')
      const src = join(input, page)
      const destination = join(output, page + '.html')

      // clear the nodejs require cache
      this.clear(src)

      // render the compnent with react-dom/server
      const data = await this.render(src)

      await mkdirp(dirname(destination))
      await fs.writeFile(destination, data)

      this.quercia.tasks.builder.manifest.prerender[page] = join(
        this.quercia.buildID,
        'prerender',
        page + '.html'
      )
      count++
    }

    this.log('tasks/prerender', `Prerendered ${count} pages`)
  }

  private async load(path: string): Promise<React.FunctionComponent> {
    const mod = await import(path)
    return (mod.default || mod) as React.FunctionComponent
  }

  private async render(path: string): Promise<string> {
    try {
      // mod is the output of `require`, so we also check if the
      // `default` field is availabe, otherwhise fallback to `module.exports`
      const component = await this.load(path)

      return render(
        React.createElement(this.App, {
          Component: component,
          pageProps: {},
          prerender: true
        })
      )
    } catch (err) {
      return `<div>
        <h2>Error while prerendering page <code>${path}</code></h2>
        <code><pre>
          ${err.stack}
        </pre></code>
        <script>debugger</script>
      </div>`
        .replace('\t', '')
        .replace('\n', '')
    }
  }

  // clears the node require cache
  private clear(path: string) {
    if (require.cache[path]) {
      delete require.cache[path]
    }
  }
}
