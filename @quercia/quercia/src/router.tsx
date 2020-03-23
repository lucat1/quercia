import * as React from 'react'
import warning from 'tiny-warning'
import navigate from './navigate'

export interface ContextData {
  loading: boolean
  page: string
  script?: string
  props: Object
}

export type ContextValue = [
  ContextData,
  React.Dispatch<React.SetStateAction<ContextData>>
]

export const Context = React.createContext<ContextValue>([
  {
    loading: false,
    page: '',
    props: {},
  },
  () => warning(false, 'Tried setting the Router context from outside the Context.Provider')
])

export const useRouter = () => React.useContext(Context)

// give a name to the context only during development
if (__DEV__) {
  Context.displayName = 'RotuerContext'
}

export const Router = (props: React.ProviderProps<ContextValue>) => {
  React.useEffect(() => {
    const handler = () => {
      window.history.replaceState
      navigate(window.location.pathname, props.value, true)
    }

    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  })

  return <Context.Provider {...props} />
}
