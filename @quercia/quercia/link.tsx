import * as React from 'react'

import navigate from './navigate'
import { Context } from './router'

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>, 
  HTMLAnchorElement
>

export interface LinkProps extends AnchorProps {
  to: string
}

export const Link: React.FunctionComponent<LinkProps> = ({ to, children, ...props }) => {
  const ctx = React.useContext(Context)
  
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(to, ctx)
  }
  
  return <a {...props} onClick={onClick} href={to}>{children}</a>
}

export default Link