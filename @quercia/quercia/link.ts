import * as React from 'react'

export const Link = ({ to, children }) =>
  React.createElement('a', { href: to }, ...children)

export default Link