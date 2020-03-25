import invariant from 'tiny-invariant'

import { ContextData } from './router'

// load loads the data from the script tag in the server rendered page
export function load(): ContextData {
  const element = document.getElementById('__QUERCIA_DATA__')
  invariant(element, 'FATAL: Could not load page data')

  return JSON.parse(element.innerHTML)
}

export async function req(url: string): Promise<ContextData> {
  const req = await fetch(url, {
    headers: {
      'X-Quercia': '1'
    }
  })

  const data: ContextData = await req.json()
  invariant(data.script, 'The response didn\t include a script url')
  return data
}

// isLoaded cheks if the requested page is available/loaded in
// the global `window.__P` object
export function isLoaded(page: string) {
  return Object.keys(window.__P).includes(page)
}