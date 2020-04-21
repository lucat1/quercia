import * as React from 'react'

export interface AppProps<T = any> {
  Component: React.ElementType<T>
  pageProps: T
  prerender: boolean
}

export interface DocumentProps {
  renderPage(): string
}
