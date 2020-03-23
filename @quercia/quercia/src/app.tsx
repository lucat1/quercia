import * as React from 'react'

import { ContextData, Router } from './router'
import { load } from './load'

export const App: React.FunctionComponent = () => {
  const [ctx, setCtx] = React.useState<ContextData>({
    loading: false,
    ...load(),
  })

  const Page = React.useMemo(() => {
    const Page = window.__P[ctx.page]().default

    // give a name to the page only during development
    if (__DEV__) {
      Page.displayName = `Page<{page: ${ctx.page}}>`
    }

    return Page
  }, [ctx.page])

  return (
    <Router value={[ctx, setCtx]}>
      <Page {...ctx.props} />
    </Router>
  )
}
