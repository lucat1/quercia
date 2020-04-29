import * as React from 'react'

import {
  HeadContext,
  HeadUpdater,
  HeadState,
  HeadElement
} from '@quercia/quercia'
import { FunctionComponent } from 'react'

const DOMAttributeNames: any = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
}

const toDOM = ({ type, props }: React.ReactElement<any, string>) => {
  const el = document.createElement(type)

  // map props to attributes
  Object.keys(props || {}).map(p => {
    // ignore edge cases or unwanted props
    if (
      !props.hasOwnProperty(p) ||
      props[p] === undefined ||
      p === 'children' ||
      p === 'dangerouslySetInnerHTML'
    )
      return

    const attr = DOMAttributeNames[p] || p.toLowerCase()
    el.setAttribute(attr, props[p])
  })

  // handle custom html code or children
  const { children, dangerouslySetInnerHTML } = props
  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || ''
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : children.join('')
  }

  return el
}

const updateElements = (type: string, components: HeadState) => {
  const head = document.head
  const count = parseInt(document.head.getAttribute('data-count') || '0')
  const oldTags: HTMLElement[] = []

  for (let i = 0; i < count; i++) {
    const ele = head.childNodes[i] as HTMLElement
    if (ele.tagName.toLowerCase() === type) {
      oldTags.push(ele)
    }
  }

  const newTags = components.map(toDOM).filter(newTag => {
    for (let k = 0; k < oldTags.length; k++) {
      const oldTag = oldTags[k]
      if (oldTag.isEqualNode(newTag)) {
        oldTags.splice(k, 1)
        return false
      }
    }
    return true
  })

  oldTags.forEach(t => head.removeChild(t))
  newTags.forEach(t => head.prepend(t))
  head.setAttribute(
    'data-count',
    (count - oldTags.length + newTags.length).toString()
  )
}

const updateTitle = (titleComponent: HeadElement | null) => {
  let title = ''
  if (titleComponent) {
    const { children } = titleComponent.props
    title = typeof children === 'string' ? children : children.join('')
  }
  if (title !== document.title) document.title = title
}

const updateHead: HeadUpdater = state => {
  // ignore empty heads
  if (!state) return

  const tags: { [key: string]: HeadState } = {}

  // divide elements by their tag name
  state.forEach(h => {
    const type = h.type as string

    const components = tags[type] || []
    components.push(h)
    tags[type] = components
  })

  updateTitle(tags.title ? tags.title[0] : null)
  ;['meta', 'base', 'link', 'style', 'script'].forEach(type => {
    updateElements(type, tags[type] || [])
  })
}

export const Header: FunctionComponent = ({ children }) => {
  return (
    <HeadContext.Provider value={updateHead}>{children}</HeadContext.Provider>
  )
}

if (process.env.NODE_ENV === 'development') {
  Header.displayName = 'HeadManager'
}
