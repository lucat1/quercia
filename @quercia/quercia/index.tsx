import * as React from 'react'
import { render } from 'react-dom'

import { App } from './app'

declare global {
  interface Window {
    __P: { 
      [key: string]: () => {
        default: React.FunctionComponent<any>
      } 
    }
  }
}

render(
  <App />,
  document.getElementById('__quercia')
)