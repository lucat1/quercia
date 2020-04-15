import * as React from 'react'
import { renderToStaticMarkup as toString } from 'react-dom/server'
import { join } from 'path'

import { AppProps, DocumentProps } from '@quercia/runtime'

import loadPage, { Page } from './page'
import extract from './extract'

import Prerender from '../tasks/prerender'

function handleError(err: Error, path: string): [number, string, string] {
  return [
    1,
    '<title>Error while prerendering the page</title>',
    `<div>
    <h2>Error while prerendering page <code>${path}</code></h2>
    <code><pre>
      ${err.stack}
    </pre></code>
    <script>debugger</script>
  </div>`
  ]
}

async function renderPage(
  task: Prerender,
  path: string
): Promise<[number, string, string]> {
  let body: [number, string, string]
  try {
    // clear the node require cache
    task.clear(path)

    const page = await loadPage(path)
    const props: AppProps = {
      Component: page.Component,
      pageProps: await page.getInitialProps({}),
      prerender: true
    }

    body = extract(<task.App {...props} />)
  } catch (err) {
    body = handleError(err, path)
  }

  return body
}

async function renderWithDocument(
  task: Prerender,
  path: string
): Promise<string> {
  const [nHead, head, body] = await renderPage(task, path)
  let documentProps: DocumentProps = { renderPage: () => body }

  let page: Page<DocumentProps> = {
    Component: task.Document,
    getInitialProps: async v => v
  }
  // if we have a custom component we should load it to chec if it has
  // custom `getInitialProps` or such methods
  if (task.Document != task.DefaultDocument) {
    page = await loadPage(join(task.input, '_document.js'))
  }

  const props = await page.getInitialProps(documentProps)
  return (
    '<!DOCTYPE html>' +
    toString(<page.Component {...props} />)
      .replace('__QUERCIA__HEAD__COUNT__', nHead.toString())
      .replace('__QUERCIA__HEAD__', head)
      .replace('__QUERCIA_PRERENDER__', body)
  )
}

export default renderWithDocument
