import * as React from 'react'
import { AppProps } from '@quercia/runtime'
import { CacheProvider } from '@emotion/core'
import createCache from '@emotion/cache'

const cache = createCache()

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <CacheProvider value={cache}>
      <h1>We also got a custom app</h1>
      <Component {...pageProps} />
    </CacheProvider>
  )
}

App.displayName = 'CustomApp'

export default App
