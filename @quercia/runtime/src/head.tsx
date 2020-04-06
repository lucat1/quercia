import * as React from 'react'
import { render } from 'react-dom'

import { HeadContext, HeadUpdater } from '@quercia/quercia'
import { FunctionComponent } from 'react'

const updateHead: HeadUpdater = state => {
  // ignore empty heads
  if (!state) return

  render(state, document.head)
}

export const Header: FunctionComponent = ({ children }) => {
  return (
    <HeadContext.Provider value={updateHead}>{children}</HeadContext.Provider>
  )
}

if (__DEV__) {
  Header.displayName = 'HeadManager'
}
