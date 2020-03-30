import * as React from 'react'
import invariant from 'tiny-invariant'

const msg =
  'should only be used inside `_document`, and therefore only rendered in the backend'

export const QuerciaHead: React.FunctionComponent = ({ children }) => {
  invariant(typeof window == 'undefined', `<QuerciaHead> ${msg}`)

  return (
    <>
      __QUERCIA__HEAD__
      {children}
    </>
  )
}

export const QuerciaMount: React.FunctionComponent = _ => {
  invariant(typeof window == 'undefined', `<QuerciaMount> ${msg}`)

  return <div id='__quercia'>__QUERCIA_PRERENDER__</div>
}

export const QuerciaScripts: React.FunctionComponent = _ => {
  invariant(typeof window == 'undefined', `<QuerciaScripts> ${msg}`)

  return <>__QUERCIA__SCRIPTS__</>
}
