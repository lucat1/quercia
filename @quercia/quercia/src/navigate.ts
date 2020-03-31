import invariant from 'tiny-invariant'

import { ContextValue, PrerenderData } from './router'
import { req, isLoaded } from './load'

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
