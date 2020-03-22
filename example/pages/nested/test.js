import * as React from 'react'
import Link from '@quercia/quercia/link'

export default () =>
  React.createElement(
    'div',
    null,
    React.createElement(Link, { to: '/' }, 'amazing link'),
    React.createElement(Link, { to: '/test' }, 'test')
  )
