import * as React from 'react'

import { useRouter } from './router'

const Empty: React.FunctionComponent = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'The <Empty /> component should never render, you might be facing a network error'
    )
  }

  return null
}

if (process.env.NODE_ENV === 'development') {
  Empty.displayName = '!Empty!'
}

export type UsePage<T extends Object = any> = () => [
  React.ElementType<T>,
  T,
  boolean
]

export const SSG = typeof window === 'undefined'

// usePage is an hook used internally to get the page instance
// and the props of the page. Should not be used by any external application
export const usePage: UsePage = () => {
  // return empty values during prerender as we don't have access to the router
  if (SSG) {
    return [() => null, {}, false]
  }
  const router = useRouter()

  const Page = React.useMemo(() => {
    // dont even try to fetch the page component wile loading
    // return a mock component which should never be rendered
    if (router.loading) return Empty

    const Page = window.__P[router.page]().default

    // give a name to the page only during development
    if (process.env.NODE_ENV === 'development') {
      Page.displayName = `Page<{page: ${router.page}}>`
    }

    return Page
  }, [router.page])

  return [Page, router.props, router.loading]
}
