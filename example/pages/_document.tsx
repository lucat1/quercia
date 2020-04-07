import * as React from 'react'
import { QuerciaHead, QuerciaScripts, QuerciaMount } from '@quercia/runtime'

export default () => (
  <html>
    <head>
      <QuerciaHead />
      <meta name='viewport' content='width=device-width' />
    </head>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = () => {
  console.log('called')
}
