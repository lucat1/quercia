import invariant from 'tiny-invariant'

import { ContextData } from './router'

export function load(): ContextData {
  const element = document.getElementById('__QUERCIA_DATA__')
  invariant(element, 'FATAL: Could not load page data')

  return JSON.parse(element.innerHTML)
}