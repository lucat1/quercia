import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

export interface PageData {
  loading: boolean
  page: string
  props: Object
  script?: string
  prerender?: PrerenderData
}

export type RequestedPageData = Required<PageData>

export interface PrerenderData {
  content: string
  head: string
}

// cheks if the requested page is available/loaded in
// the global `window.__P` object
export function isLoaded(page: string) {
  return window.__P && typeof window.__P[page] === 'function'
}

let parsed = false

// loads and parses the initial script element for render data
export function loadScript(): PageData {
  warning(!parsed, "Called `parseScript` more than once. Shouldn't happen")

  const element = document.querySelector('script#__QUERCIA_DATA__')
  invariant(
    element,
    `Couldn't find an element with selector: 'script#__QUERCIA_DATA__'`
  )

  return parse(element.innerHTML)
}

// parses the json input and pretty-prints errors during development
export function parse(data: string): PageData {
  // during development catch json parsing errors
  if (__DEV__) {
    try {
      return JSON.parse(data)
    } catch (err) {
      console.groupCollapsed('Error while parsing json payload:')
      console.info(data)
      console.error(err)
      console.groupEnd()
    }
  }

  return JSON.parse(data)
}

// sends a request to the given url
export async function req(
  url: string,
  method: 'GET' | 'POST'
): Promise<PageData> {
  const req = await fetch(url, {
    method,
    headers: {
      'X-Quercia': '1'
    }
  })

  const data = parse(await req.text())

  // do a bunch of checks on the new page's data
  warning(data.prerender?.content, "The page didn't include any prerender data")
  invariant(data.script, "The response didn't include a script url")

  return data
}

// loads a script at the given url
export function reqScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => res()
    script.onerror = () => rej()
    document.body.appendChild(script)
  })
}
