import * as React from 'react'
import { renderToStaticMarkup as toString } from 'react-dom/server'

import { HeadContext, HeadUpdater, HeadState } from '@quercia/quercia'

// renders a react component and extracts any headers available
const extract = (h: React.ReactElement<any>): [number, string, string] => {
  let _head: HeadState = []
  const handler: HeadUpdater = state => (_head = state)
  const content = toString(
    <HeadContext.Provider value={handler}>{h}</HeadContext.Provider>
  )

  return [_head.length, toString(_head as any), content]
}

export default extract
