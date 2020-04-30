import * as types from '@babel/types'
import traverse, { Visitor } from '@babel/traverse'

const REMOVE = ['getInitialProps']

export default function ({
  types: t
}: {
  types: typeof types
}): { visitor: Visitor<{}>; name: string } {
  return {
    name: 'remove-funcs',
    visitor: {
      Program(path) {
        traverse(path.node, {
          ExportNamedDeclaration(path) {
            // ignore exports without declarations
            if (
              !path.node.declaration ||
              t.isClassDeclaration(path.node.declaration)
            )
              return

            let exportedName = ''
            if (t.isFunctionDeclaration(path.node.declaration)) {
              // don't handle `export default function` we don't care about that
              if (path.node.declaration.id) {
                exportedName = path.node.declaration.id.name
              }
            }

            if (t.isVariableDeclaration(path.node.declaration)) {
              // don't even try to handle multiple values exported at once
              // we only wanna check for single values like `getInitialProps`
              if (path.node.declaration.declarations.length !== 1) {
                return
              }

              const decl = path.node.declaration.declarations[0]
              // only accept named exports, not arrays or whatever
              if (!t.isIdentifier(decl.id)) {
                return
              }

              exportedName = decl.id.name
            }

            // remove the `export const` declaration
            if (REMOVE.includes(exportedName)) {
              path.remove()
            }
          }
        })
      }
    }
  }
}
