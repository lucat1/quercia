import * as React from 'react'
import invariant from 'tiny-invariant'

type Child = Exclude<React.ReactElement, boolean | null | undefined>
type Children = Child[]

export type HeadElement = React.ReactElement<any, string>
export type HeadState = HeadElement[]
export type HeadUpdater = (elements: HeadState) => void

export const HeadContext = React.createContext<HeadUpdater>(() =>
  invariant(false, 'Rendered <Head /> outside of its provider')
)

const allChildren = new Set<Children>()

// checks that the elements we render are only those usable inside of a header
// and also truns flatens React.Fragments: concats the list of children of the
// fragment into the previous(return value)
const flatten = (prev: Children, curr: Child): Children => {
  // ignore custom components
  if (typeof curr === 'string' || typeof curr === 'number') {
    return prev
  }

  // flatten React.Fragment(s)
  if (curr.type === React.Fragment) {
    const children = React.Children.toArray(curr.props.children) as Children

    return prev.concat(children.reduce(flatten, []))
  }

  return prev.concat(curr)
}

const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp']

// makes sure every element inside the head is unique
// taken from https://github.com/zeit/next.js/blob/canary/packages/next/next-server/lib/head.tsx#L57
// all credits to zeit and Nextjs contributors
function unique() {
  const keys = new Set()
  const tags = new Set()
  const metaTypes = new Set()
  const metaCategories: { [metatype: string]: Set<string> } = {}

  return (h: Child) => {
    let unique = true

    if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
      const key = h.key.slice(h.key.indexOf('$') + 1)
      if (keys.has(key)) {
        unique = false
      } else {
        keys.add(key)
      }
    }

    switch (h.type) {
      case 'title':
      case 'base':
        if (tags.has(h.type)) {
          unique = false
        } else {
          tags.add(h.type)
        }
        break

      case 'meta':
        METATYPES.map(metatype => {
          if (!h.props.hasOwnProperty(metatype)) return

          if (metatype === 'charSet') {
            if (metaTypes.has(metatype)) {
              unique = false
            } else {
              metaTypes.add(metatype)
            }
          } else {
            const category = h.props[metatype]
            const categories = metaCategories[metatype] || new Set()
            if (categories.has(category)) {
              unique = false
            } else {
              categories.add(category)
              metaCategories[metatype] = categories
            }
          }
        })
        break
    }

    return unique
  }
}

// emit calls the handler function from the context with the flattened
// tree of react elements to be rendered
const emit = (fn: HeadUpdater) => {
  // manipulate the set to make it into a 1-level flat array only containing
  // string-based(the `type`) react elements to be rendered inside the document.head
  const result = Array.from(allChildren)
    .reduce((prev, curr) => prev.concat(curr), [] as Children)
    .reduce(flatten, [])
    // reverse so we check the uniqueness of the items from the last
    // and so inside `unique` we can ditch previous values as they'll
    // just be the nodes from the previous renders
    .reverse()
    .filter(unique())
    .reverse()
    .map((c: React.ReactElement<any>, i: number) =>
      React.cloneElement(c, { key: i })
    ) as HeadState

  fn(result)
}

const add = (fn: HeadUpdater, children: Children) => {
  allChildren.add(children)
  emit(fn)
}

const del = (fn: HeadUpdater, children: Children) => {
  allChildren.delete(children)
  emit(fn)
}

export const Head: React.FunctionComponent = ({ children }) => {
  const fn = React.useContext(HeadContext)
  const elements = React.Children.toArray(children) as Children
  React.useEffect(() => {
    add(fn, elements)

    return () => del(fn, elements)
  })

  // on the server useEffect won't ever be called so we just trigger an upadt
  // at render time. The data will be then sent to the context handler
  if (typeof window === 'undefined') {
    add(fn, elements)
  }

  return null
}
