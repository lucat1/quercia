import * as React from 'react'

const msg =
  'should only be used inside `_document`, and therefore only rendered in the backend'

export const QuerciaHead: React.FunctionComponent = ({ children }) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      console.error(`<QuerciaHead> ${msg}`)
    }
  }

  return (
    <head data-count='__QUERCIA__HEAD__COUNT__'>
      __QUERCIA__HEAD__
      {children}
    </head>
  )
}

export const QuerciaMount: React.FunctionComponent = _ => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      console.error(`<QuerciaMount> ${msg}`)
    }
  }

  return <div id='__quercia'>__QUERCIA_PRERENDER__</div>
}

export const QuerciaScripts: React.FunctionComponent = _ => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      console.error(`<QuerciaScripts> ${msg}`)
    }
  }

  return <>__QUERCIA__SCRIPTS__</>
}
