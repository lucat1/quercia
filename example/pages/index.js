import * as React from 'react'
import Link from '@quercia/quercia/link'

export default () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Link, { to: 'test' }, 'test'),
    React.createElement(Link, { to: 'thats-a-404' }, '404')
  )
