import * as React from 'react'
import { Context } from '@quercia/quercia/router'
/*
export default () => React.createElement('div', null,
  React.createElement(Link, { to: '/nested/test' }, 'test'),
  React.createElement(Link, { to: '/dada' }, '404')
)*/

export default () => {
  const [ctx] = React.useState('test')

  return ctx
}