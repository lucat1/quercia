import * as React from 'react'
import { AppProps } from '@quercia/runtime'

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <h1>We also got a custom app</h1>
      <Component {...pageProps} />
    </>
  )
}

App.displayName = 'CustomApp'

export default App
