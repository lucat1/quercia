import * as React from 'react'
import warning from 'tiny-warning'

import { useRouter } from '@quercia/quercia'

const Empty: React.FunctionComponent = () => {
  warning(
    false,
    'This component should never render, you might be facing a network error'
  )

  return null
}

if (__DEV__) {
  Empty.displayName = '!Empty!'
}

const Prerender: React.FunctionComponent = props => {
  return <div {...props} />
}

if (__DEV__) {
  Prerender.displayName = 'Prerender'
}

export type usePage = <T = any>() => [React.ElementType<T>, T, boolean]

// usePage is an hook used internally to get the page instance
// and the props of the page. Should not be used by any external application
export const usePage: usePage = () => {
  const [router] = useRouter()

  const shouldPrerender = router.loading && router.prerender?.content != ''
  const Page = React.useMemo(() => {
    // dont even try to fetch the page wile loading
    // return a mock component which should never be rendered
    if (shouldPrerender) return Empty

    const Page = window.__P[router.page]().default

    // give a name to the page only during development
    if (__DEV__) {
      Page.displayName = `Page<{page: ${router.page}}>`
    }

    return Page
  }, [router.page, router.loading])

  return [
    shouldPrerender ? Prerender : Page,
    shouldPrerender
      ? ({
          dangerouslySetInnerHTML: { __html: router.prerender?.content || '' }
        } as any)
      : router.props,
    shouldPrerender
  ]
}
