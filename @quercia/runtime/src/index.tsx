import * as React from 'react'
import { render } from 'react-dom'

import { Router } from '@quercia/quercia'
import { Wrapper } from './wrapper'

export { AppProps } from './wrapper'

render(
  <Router>
    <Wrapper />
  </Router>,
  document.getElementById('__quercia')
)
