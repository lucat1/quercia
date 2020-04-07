import { join, sep, dirname } from 'path'
import { promises as fs } from 'fs'

import * as React from 'react'

import {
  AppProps,
  QuerciaHead,
  QuerciaScripts,
  QuerciaMount
} from '@quercia/runtime'

import Task from '../task'
import { mkdirp } from '../fs'
import render from '../prerender/render'

export default class Prerender extends Task {
  public input: string = ''
  public output: string = ''

  // the <App /> component, given a default value
  public App = ({ Component, pageProps }: AppProps) => (
    <Component {...pageProps} />
  )
  // the default value of the <App /> component
  public DefaultApp = this.App

  // the <Document /> component, given a default value
  public Document = () => (
    <html>
      <QuerciaHead>
        <meta name='viewport' content='width=device-width' />
      </QuerciaHead>
      <body>
        <QuerciaMount />
        <QuerciaScripts />
      </body>
    </html>
  )
  // the default value of the <Document /> component
  public DefaultDocument = this.Document

  public async execute() {
    this.debug('tasks/prerender', 'Prerendering all pages')

    const root = join(
      this.quercia.tasks.structure.paths.root,
      '__quercia',
      this.quercia.buildID
    )
    // the `server` webpack output folder (ex. __quercia/<id>/server)
    this.input = join(root, 'server')

    // the `prerender` output folder (ex. __quercia/<id>/prerender)
    this.output = join(root, 'prerender')
    await mkdirp(this.output)

    const pages = Object.keys(this.quercia.tasks.structure.pages)

    if (pages.includes('pages/_app')) {
      this.debug('tasks/prerender', 'Found a custom _app, loading it')

      // If the user has defined a custom _app we wanna load that one for prerendering
      this.App = (await this.load(join(this.input, '_app.js'))) as any
    }

    if (pages.includes('pages/_document')) {
      this.debug('tasks/prerender', 'Found a custom _document, loading it')

      // If the user has defined a custom _app we wanna load that one for prerendering
      this.Document = (await this.load(join(this.input, '_document.js'))) as any
    }

    let count = 0
    const EXCLUDES = ['pages/_app', 'pages/_document']
    for (let page of pages) {
      if (EXCLUDES.includes(page)) continue

      page = page.replace('pages' + sep, '')
      const src = join(this.input, page)
      const destination = join(this.output, page + '.html')

      // render the compnent with react-dom/server
      const output = await render(this, src)

      await mkdirp(dirname(destination))
      await fs.writeFile(destination, output)

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
    // clear the nodejs require cache
    this.clear(path)

    // require the module
    const mod = await import(path)
    return (mod.default || mod) as React.FunctionComponent
  }

  // clears the node require cache
  public clear(path: string) {
    if (require.cache[path]) {
      delete require.cache[path]
    }
  }
}