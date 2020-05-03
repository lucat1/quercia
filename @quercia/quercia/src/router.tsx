import * as React from 'react'

import mitt, { MittHandler, MittEmitter } from './mitt'
import { loadScript, reqScript, req, PageData, isLoaded } from './load'

// the react router context
export const RouterContext = React.createContext<PageData>(null as any)

export interface IRouterEmitter extends MittEmitter {
  emit(event: 'n', data: NavigatePayload): void
  on(event: 'n', handler: NavigateHandler): void
}

// the router event emitter, used to handle navigate calls even outside of the react tree
export const RouterEmitter: IRouterEmitter = mitt()

// access the router data inside a react funciton component
export const useRouter = () => React.useContext(RouterContext)

// the navigate event name
export const NAVIGATE = 'n'

// the navigate event payload
export type NavigatePayload = {
  type: 'push' | 'replace'
  method: 'GET' | 'POST'
  url: string
  options?: RequestInit
}

// the navigate event handler
export type NavigateHandler = MittHandler<NavigatePayload>

if (process.env.NODE_ENV === 'development') {
  RouterContext.displayName = 'RouterContext'
}

// internal helper to route to an another route and update the state during this process
// steps:
// - 1: call history.[action + State]() and set the context to loading
// - 2: fetch the data from the backend and set the prerendering data in context
// - 3: load the script and properly render the new page
async function routeTo(
  navigation: NavigatePayload,
  data: PageData,
  setData: React.Dispatch<React.SetStateAction<PageData>>
) {
  // @ts-ignore we know this works, it can only call `pushState` or `replaceState`
  history[navigation.type + 'State'](null, '', navigation.url)

  // tell the router that we are loading a new page
  setData(Object.assign({}, data, { loading: true }))

  const newData: PageData & { redirect?: string } = await req(
    navigation.url,
    navigation.method,
    navigation.options
  )

  if (newData.redirect) {
    history.replaceState(null, '', newData.redirect)
    delete newData.redirect
  }

  if (!isLoaded(newData.page)) {
    const scripts = newData.scripts || []

    // load all the required scripts *in the right order*
    await new Promise((res, rej) => {
      let i = 0

      const fn = (): any => {
        if (i >= scripts.length) {
          return res()
        }

        return reqScript(scripts[i++])
          .then(fn)
          .catch(rej)
      }

      fn()
    })
  }

  setData(Object.assign({}, newData, { loading: false }))
}

export const Router: React.FunctionComponent = ({ children }) => {
  // navigate holds the data used to query the server. It starts as null
  // because at first we recieve the data from the initial script rendered in the backend
  const [navigation, navigate] = React.useState<NavigatePayload | null>(null)
  const [data, setData] = React.useState<PageData>(loadScript())

  React.useMemo(() => {
    // dont fetch anything, the data has already been loaded with
    // `loadScript` because this is the first render
    if (navigation === null) {
      return
    }

    // this logic is executed when we have to route to another page
    routeTo(navigation, data, setData)
  }, [navigation])

  // listen to `navigate` events from the event emitter
  // listen to `popstate` events from the window
  React.useEffect(() => {
    const handler = () => {
      RouterEmitter.emit(NAVIGATE, {
        method: 'GET',
        type: 'replace',
        url: window.location.pathname
      })
    }

    RouterEmitter.on(NAVIGATE, navigate)
    window.addEventListener('popstate', handler)
    return () => {
      RouterEmitter.off(NAVIGATE, navigate)
      window.removeEventListener('popstate', handler)
    }
  })

  return (
    <RouterContext.Provider value={data}>{children}</RouterContext.Provider>
  )
}

if (process.env.NODE_ENV === 'development') {
  Router.displayName = 'Router'
}
