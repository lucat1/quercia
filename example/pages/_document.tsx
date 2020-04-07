import * as React from 'react'
import { QuerciaHead, QuerciaScripts, QuerciaMount } from '@quercia/runtime'

interface DocumentProps {}

export default () => (
  <html>
    <QuerciaHead>
      <meta name='viewport' content='width=device-width' />
    </QuerciaHead>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = () => {
  console.log('called')
}
