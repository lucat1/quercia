import * as React from 'react'

import { usePage } from './page'

export interface AppProps<T = any> {
  Component: React.ElementType<T>
  pageProps: T
  prerender: boolean
}

const DefaultApp: React.FunctionComponent<AppProps> = ({
  Component,
  pageProps
}) => <Component {...pageProps} />

if (__DEV__) {
  DefaultApp.displayName = 'DefaultApp'
}

// Wrapper wraps around the App component and returns either the default
// one or the custom one giving them the appropriate props
export const Wrapper: React.FunctionComponent = () => {
  const [Component, props, prerender] = usePage()

  let App: React.ElementType<AppProps> = DefaultApp
  if (window.__P['_app']) {
    App = window.__P['_app']().default as any
  }

  return <App Component={Component} pageProps={props} prerender={prerender} />
}

if (__DEV__) {
  Wrapper.displayName = 'AppWrapper'
}

export default Wrapper
