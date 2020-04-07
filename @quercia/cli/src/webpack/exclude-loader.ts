import { loader } from 'webpack'

import { parse } from 'acorn'
import { generate } from 'astring'
import { walk } from 'estree-walker'
import { Program, ExportNamedDeclaration } from 'estree'

const REMOVE = ['getInitialProps']

const excludeLoader: loader.Loader = function (content) {
  const program: Program = parse(content.toString(), {
    sourceType: 'module'
  }) as any
  walk(program, {
    enter(node) {
      if (node.type === 'ExportNamedDeclaration') {
        const stmt = node as ExportNamedDeclaration
        // ignore exports without declarations
        if (!stmt.declaration) return

        // ignore class exports
        if (stmt.declaration.type === 'ClassDeclaration') return

        let exportedName = ''
        if (stmt.declaration.type === 'FunctionDeclaration') {
          // don't handle `export default function` we don't care about that
          if (stmt.declaration.id) {
            exportedName = stmt.declaration.id.name
          }
        }

        if (stmt.declaration.type === 'VariableDeclaration') {
          // don't even try to handle multiple values exported at once
          // we only wanna check for single values like `getInitialProps`
          if (stmt.declaration.declarations.length !== 1) {
            return
          }

          const decl = stmt.declaration.declarations[0]
          // only accept named exports, not arrays or whatever
          if (decl.id.type !== 'Identifier') {
            return
          }

          exportedName = decl.id.name
        }

        // remove the `export const` declaration
        if (REMOVE.includes(exportedName)) {
          this.remove()
        }
      }
    }
  })

  return generate(program)
}

export default excludeLoader
