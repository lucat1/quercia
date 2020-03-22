import { ContextData, ContextValue } from './router'

async function req(url: string) {
  const req = await fetch(url, {
    headers: {
      'X-Quercia': '1'
    }
  })
  return await req.json() as ContextData
}

function isLoaded(page: string) {
  return Object.keys(window.__P).includes(page)
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

export const navigate = async (url: string, [ctx, setCtx]: ContextValue) => {
  if(process.env.NODE_ENV === 'development') {
    console.log(`navigating to: ${url}`)
  }

  history.pushState(null, '', url)
  setCtx({
    ...ctx,
    loading: true
  })

  try {
    const data = await req(url)

    if(data.script && !isLoaded(data.page)) {
      // TODO: bump progress
      await load(data.script)
    }

    setCtx({
      ...data,
      loading: false
    })
  } catch(err) {
    console.error(`Could not route to '${url}': ${err}`)
  }
}

export default navigate