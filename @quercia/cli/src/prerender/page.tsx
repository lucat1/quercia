export interface Page<T extends Object = any> {
  Component: React.ElementType<T>

  getInitialProps(props: T): Promise<T & any>
}

const fieldsOfInterest = ['getInitialProps']

async function loadPage(path: string) {
  const page: Page = { Component: () => null, getInitialProps: async v => v }
  const mod = await import(path)

  if (mod.default) {
    // support modern `export default`
    page.Component = mod.default
  } else {
    // support `module.exports =` or `exports =` or `export =`
    page.Component = mod
  }

  for (const key in Object.keys(mod)) {
    if (fieldsOfInterest.includes(key)) {
      page[key as keyof Page] = mod[key]
    }
  }

  return page
}

export default loadPage
