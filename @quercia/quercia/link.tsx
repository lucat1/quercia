import * as React from 'react'

import navigate from './navigate'
import { useRouter } from './router'

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>, 
  HTMLAnchorElement
>

export interface LinkProps extends AnchorProps {
  to: string
}

export const Link: React.FunctionComponent<LinkProps> = ({ to, children, ...props }) => {
  const [router, setRouter] = useRouter()

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(to, [router, setRouter])
  }
  
  return <a {...props} onClick={onClick} href={to}>{children}</a>
}

export default Link