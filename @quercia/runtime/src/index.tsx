import * as React from 'react'
import { render } from 'react-dom'

import { Router } from '@quercia/quercia'
import { Wrapper } from './app'
import { Header } from './header'

export { AppProps } from './app'
export { QuerciaHead, QuerciaMount, QuerciaScripts } from './document'

render(
  <Header>
    <Router>
      <Wrapper />
    </Router>
  </Header>,
  document.getElementById('__quercia')
)
