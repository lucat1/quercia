import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { render } from 'react-dom'

import { Router } from '@quercia/quercia'
import { Wrapper } from './app'
import { Header } from './header'

export { AppProps, DocumentProps } from './props'
export { QuerciaHead, QuerciaMount, QuerciaScripts } from './document'

let Root: React.FunctionComponent = () => (
  <Header>
    <Router>
      <Wrapper />
    </Router>
  </Header>
)

if (typeof window !== 'undefined') {
  if (__DEV__) {
    Root = hot(Root)
    Root.displayName = 'hot(Root)'
  }

  render(<Root />, document.getElementById('__quercia'))
}
