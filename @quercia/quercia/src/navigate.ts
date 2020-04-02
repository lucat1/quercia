import invariant from 'tiny-invariant'

import { ContextValue, ContextData, PrerenderData } from './router'

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
  return window.__P && typeof window.__P[page] === 'function'
}

// load loads a script for the new page
function load(src: string): Promise<void> {
  return new Promise((res, rej) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => res()
    script.onerror = () => rej()
    document.body.appendChild(script)
  })
}

// empty is an empty-state prerender data
const empty: PrerenderData = {
  content: '',
  head: ''
}

export const navigate = async (
  url: string,
  [ctx, setCtx]: ContextValue,
  replace = false
) => {
  if (replace) {
    history.replaceState(null, '', url)
  } else {
    history.pushState(null, '', url)
  }

  setCtx({
    ...ctx,
    loading: true,
    prerender: empty
  })

  try {
    const data = await req(url)
    setCtx({
      ...data,
      loading: true
    })

    if (data.script && !isLoaded(data.page)) {
      // TODO: bump progress
      await load(data.script)
    }

    setCtx({
      ...data,
      loading: false,
      prerender: empty
    })
  } catch (err) {
    invariant(false, `Could not route to '${url}': ${err}`)
  }
}

export default navigate
