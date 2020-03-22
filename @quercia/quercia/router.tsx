import * as React from 'react'
import navigate from './navigate'

export interface ContextData {
  loading: boolean
  page: string
  script?: string
  props: Object
}

export type ContextValue = [ContextData, React.Dispatch<React.SetStateAction<ContextData>>]

export const Context = React.createContext<ContextValue>([
  {
    loading: false,
    page: '',
    props: {}
  },
  process.env.NODE_ENV === 'development'
    ? () => { throw new TypeError('Tried setting the Router context from outside the Context.Provider') }
    : null as any
])

export const useRouter = () => React.useContext(Context)

// give a name to the context only during development
if(process.env.NODE_ENV === 'development') {
  Context.displayName = 'RotuerContext'
}

export const Router = (props: React.ProviderProps<ContextValue>) => {
  React.useEffect(() => {
    const handler = () => {
      navigate(window.location.pathname, props.value)
    }

    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  })

  return(
    <Context.Provider {...props} />
  )
}