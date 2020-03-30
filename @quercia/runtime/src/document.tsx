import * as React from 'react'
import invariant from 'tiny-invariant'

const msg =
  'should only be used inside `_document`, and therefore only rendered in the backend'

export const QuerciaHead: React.FunctionComponent = ({ children }) => {
  invariant(typeof window == 'undefined', `<QuerciaHead> ${msg}`)

  return (
    <>
      {children}
      __QUERCIA__HEAD__
    </>
  )
}

export const QuerciaMount: React.FunctionComponent = _ => {
  invariant(typeof window == 'undefined', `<QuerciaMount> ${msg}`)

  return <div id='__quercia' />
}

export const QuerciaScripts: React.FunctionComponent = _ => {
  invariant(typeof window == 'undefined', `<QuerciaScripts> ${msg}`)

  return <>__QUERCIA__SCRIPTS__</>
}
