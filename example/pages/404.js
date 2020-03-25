import * as React from 'react'
import { usePrerender } from '@quercia/quercia'

export default ({ path }) => {
  const isPrerener = usePrerender()
  if(isPrerener) {
    return React.createElement('div', null, `pre rendering of a 404 page`)
  }

  return React.createElement('div', null, `404 - Not found! -- URL ${path}`)
}
