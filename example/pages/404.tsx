import * as React from 'react'
import { usePrerender } from '@quercia/quercia'

export default ({ path }: { path: string }) => {
  const isPrerener = usePrerender()
  if (isPrerener) {
    return <div>pre rendering of a 404 page</div>
  }

  return <div>404 - Not found! -- URL {path}</div>
}
