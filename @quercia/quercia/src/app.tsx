import * as React from 'react'
import warning from 'tiny-warning'

import { ContextData, Router } from './router'
import { load } from './load'

const EmptyComponent = () => {
  warning(false, 'This component should never render, you might be facing a network error')

  return null
}

export const App: React.FunctionComponent = () => {
  const [ctx, setCtx] = React.useState<ContextData>({
    loading: false,
    ...load(),
  })

  const shouldPrerender = ctx.loading && ctx.prerender != ''
  const Page = React.useMemo(() => {
    // dont even try to fetch the page wile loading
    if(shouldPrerender) return EmptyComponent

    const Page = window.__P[ctx.page]().default

    // give a name to the page only during development
    if (__DEV__) {
      Page.displayName = `Page<{page: ${ctx.page}}>`
    }

    return Page
  }, [ctx.page, ctx.loading])

  return (
    <Router value={[ctx, setCtx]}>
      {shouldPrerender
        ? <div dangerouslySetInnerHTML={{ __html: ctx.prerender || '' }} />
        : <Page {...ctx.props} />
      }
    </Router>
  )
}
