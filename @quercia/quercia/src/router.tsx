import * as React from 'react'
import warning from 'tiny-warning'
import invariant from 'tiny-invariant'

import navigate from './navigate'

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

// load loads the data from the script tag in the server rendered page
export function load(): ContextData {
  const element = document.getElementById('__QUERCIA_DATA__')
  invariant(element, 'FATAL: Could not load page data')

  return JSON.parse(element.innerHTML)
}

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
