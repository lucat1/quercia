import * as types from '@babel/types'
import traverse, { Visitor } from '@babel/traverse'

// taken from:
// https://github.com/developit/babel-plugin-optimize-hook-destructuring/blob/29c84a7523645bd381b71ab668fd624068a876d4/index.js
// slightly modified to better fit quercia

// matches any hook-like (the default)
// const isHook = /^use[A-Z]/

// matches only built-in hooks provided by React et al (and quercia -> Router, Page)
const isBuiltInHook = /^use(Callback|Context|DebugValue|Effect|ImperativeHandle|LayoutEffect|Memo|Reducer|Ref|State|Page|Router)$/

const notEmpty = <T>(value: T | null): value is T => value !== null

export default function ({
  types: t
}: {
  types: typeof types
}): { visitor: Visitor<{}>; name: string } {
  // if specified, options.lib is a list of libraries that provide hook functions
  const libs = ['react', 'preact/hooks', '@quercia/quercia']

  return {
    name: 'optimize-hooks',
    visitor: {
      Program(path) {
        traverse(path.node, {
          CallExpression(path) {
            // ignore calls outside of variable declarations
            if (!t.isVariableDeclarator(path.parent)) return

            // skip function calls where the return value is not Array-destructured:
            if (!t.isArrayPattern(path.parent.id)) return

            // ignore non-identifiers calls
            if (!t.isIdentifier(path.node.callee)) return

            // name of the (hook) function being called:
            const hookName = path.node.callee.name as string

            if (libs) {
              const binding = path.scope.getBinding(hookName)
              // not an import
              if (!binding || binding.kind !== 'module') return

              const parent = binding.path.parent as types.ImportDeclaration
              const specifier = parent.source.value

              // not a valid library to import a hook from
              if (!libs.some(lib => lib === specifier)) return
            }

            // only match function calls with names that look like a hook
            if (!isBuiltInHook.test(hookName)) return

            path.parent.id = t.objectPattern(
              path.parent.id.elements
                .filter(notEmpty)
                .map((element, i) =>
                  t.objectProperty(t.numericLiteral(i), element)
                )
            )
          }
        })
      }
    }
  }
}
