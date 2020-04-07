import * as React from 'react'
import { renderToStaticMarkup as toString } from 'react-dom/server'

import { HeadContext, HeadUpdater, HeadState } from '@quercia/quercia'

import Prerender from '../tasks/prerender'

export default async function render(
  task: Prerender,
  path: string
): Promise<[[string, string], [string, string]]> {
  try {
    // mod is the output of `require`, so we also check if the
    // `default` field is availabe, otherwhise fallback to `module.exports`
    const component = await task.load(path)

    const rndr = (h: React.ReactElement<any>): [string, string] => {
      let _head: HeadState = []
      const handler: HeadUpdater = state => (_head = state)
      const content = toString(
        <HeadContext.Provider value={handler}>{h}</HeadContext.Provider>
      )

      return [
        `<head count="${_head.length}">${toString(_head as any)}</head>`,
        content
      ]
    }

    return [
      rndr(<task.App Component={component} pageProps={{}} prerender />),
      rndr(<task.DefaultApp Component={component} pageProps={{}} prerender />)
    ]
  } catch (err) {
    const val: [string, string] = [
      '<title>Error while prerendering the page</title>',
      `<div>
      <h2>Error while prerendering page <code>${path}</code></h2>
      <code><pre>
        ${err.stack}
      </pre></code>
      <script>debugger</script>
    </div>`
    ]

    return [val, val]
  }
}
