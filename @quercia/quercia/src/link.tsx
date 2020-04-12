import * as React from 'react'

import { RouterEmitter, NAVIGATE, NavigatePayload } from './router'

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export interface LinkProps extends AnchorProps {
  to: string
  method?: 'GET' | 'POST'
}

export function navigate(
  url: string,
  method: NavigatePayload['method'] = 'GET',
  options?: RequestInit
) {
  RouterEmitter.emit(NAVIGATE, {
    url,
    method,
    type: 'push',
    options: options
  })
}

export const Link: React.FunctionComponent<LinkProps> = ({
  to,
  children,
  method,
  ...props
}) => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(to, method)
  }

  return (
    <a {...props} onClick={onClick} href={to}>
      {children}
    </a>
  )
}

export default Link
