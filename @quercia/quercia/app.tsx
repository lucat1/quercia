import * as React from 'react'

import { ContextData, Context } from './router'

function load(): ContextData {
  const element = document.getElementById('__QUERCIA_DATA__')
  if(element == null) {
    throw new Error('FATAL: Could not load page data')
  }

  return JSON.parse(element.innerHTML)
}

export const App: React.FunctionComponent = () => {
  const [ctx, setCtx] = React.useState<ContextData>({
    loading: false,
    ...load()
  })
  
  const Page = React.useMemo(() => {
    const Page = window.__P[ctx.page]().default

    // give a name to the page only during development
    if(process.env.NODE_ENV === 'development') {
      Page.displayName = `Page<{page: ${ctx.page}}>`
    }

    return Page
  }, [ctx.page])
  
  return(
    <Context.Provider value={[ctx, setCtx]}>
      <Page {...ctx.props} />
    </Context.Provider>
  )
}