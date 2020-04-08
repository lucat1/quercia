import * as React from 'react'
import warning from 'tiny-warning'

import { useRouter } from './router'

const Empty: React.FunctionComponent = () => {
  warning(
    false,
    'The <Empty /> component should never render, you might be facing a network error'
  )

  return null
}

if (__DEV__) {
  Empty.displayName = '!Empty!'
}

export type UsePage<T extends Object = any> = () => [
  React.ElementType<T>,
  T,
  boolean
]

export const usePrerender = () => {
  return typeof window === 'undefined'
}

// usePage is an hook used internally to get the page instance
// and the props of the page. Should not be used by any external application
export const usePage: UsePage = () => {
  const router = useRouter()

  const Page = React.useMemo(() => {
    // dont even try to fetch the page component wile loading
    // return a mock component which should never be rendered
    if (router.loading) return Empty

    const Page = window.__P[router.page]().default

    // give a name to the page only during development
    if (__DEV__) {
      Page.displayName = `Page<{page: ${router.page}}>`
    }

    return Page
  }, [router.page])

  return [Page, router.props, router.loading]
}
