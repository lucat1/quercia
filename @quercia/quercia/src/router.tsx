import * as React from 'react'
import warning from 'tiny-warning'

import navigate from './navigate'
import load from './load'

export interface ContextData {
  loading: boolean
  page: string
  props: Object
  script?: string
  prerender?: PrerenderData
}

export interface PrerenderData {
  content: string
  head: string
}

export type ContextValue = [
  ContextData,
  React.Dispatch<React.SetStateAction<ContextData>>
]

export const Context = React.createContext<ContextValue>([
  {
    loading: false,
    page: '',
    props: {}
  },
  () =>
    warning(
      false,
      'Tried setting the Router context from outside the Context.Provider'
    )
])

export const useRouter = () => React.useContext(Context)

// give a name to the context only during development
if (__DEV__) {
  Context.displayName = 'RouterContext'
}

export const Router: React.FunctionComponent<{}> = ({ children }) => {
  const state = React.useState<ContextData>({
    loading: false,
    ...load()
  })

  React.useEffect(() => {
    const handler = () => {
      window.history.replaceState
      navigate(window.location.pathname, state, true)
    }

    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  })

  return <Context.Provider value={state}>{children}</Context.Provider>
}
