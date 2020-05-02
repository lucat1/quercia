export interface PageData {
  loading: boolean
  page: string
  props: Object
  scripts?: string[]
}

export type RequestedPageData = Required<PageData>

export type PrerenderData = [string, string]

// cheks if the requested page is available/loaded in
// the global `window.__P` object
export function isLoaded(page: string) {
  return window.__P && typeof window.__P[page] === 'function'
}

// loads and parses the initial script element for render data
export function loadScript(): PageData {
  const element = document.querySelector('script#__QUERCIA_DATA__')
  if (element == null) {
    console.error(`Couldn't find 'script#__QUERCIA_DATA__'`)
  }

  return parse((element as Element).innerHTML)
}

// parses the json input and pretty-prints errors during development
export function parse(data: string): PageData {
  // during development catch json parsing errors
  if (process.env.NODE_ENV === 'development') {
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
  method: 'GET' | 'POST',
  options?: RequestInit
): Promise<PageData> {
  const req = await fetch(url, {
    ...options,
    method,
    headers: {
      ...(options && (options.headers || {})),
      'X-Quercia': '1'
    }
  })

  const data = parse(await req.text())

  // check if we recieved a string url. This is mandatory
  if (!data.scripts) {
    console.error("The response didn't include any scripts url")
  }

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
