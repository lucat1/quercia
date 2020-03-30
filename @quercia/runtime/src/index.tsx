import * as React from 'react'
import { render } from 'react-dom'

import { Router } from '@quercia/quercia'
import { Wrapper } from './app'

export { AppProps } from './app'
export { QuerciaHead, QuerciaMount, QuerciaScripts } from './document'

if (typeof window !== 'undefined') {
  render(
    <Router>
      <Wrapper />
    </Router>,
    document.getElementById('__quercia')
  )
}
