import { PluginObj, types, NodePath } from '@babel/core'

const REMOVE = [
  'getInitialProps',
  'QuerciaHead',
  'QuerciaMount',
  'QuerciaScripts'
]

export default function({
  types: t
}: {
  types: typeof types
}): PluginObj<any> {
  return {
    name: 'remove-funcs',
    visitor: {
      Program(path) {
        path.traverse({
          ExportNamedDeclaration(path) {
            // ignore exports without declarations
            if (
              (!path.node.declaration && path.node.specifiers.length === 0) ||
              t.isClassDeclaration(path.node.declaration)
            ) {
              return
            }

            if (t.isFunctionDeclaration(path.node.declaration)) {
              // don't handle `export default function` we don't care about that
              if (path.node.declaration.id) {
                const { name } = path.node.declaration.id
                if (REMOVE.includes(name)) {
                  path.remove()
                  return
                }
              }
            }

            const declaration = path.get('declaration') as NodePath<
              types.VariableDeclaration
            >
            if (t.isVariableDeclaration(declaration.node)) {
              const decls = declaration.get('declarations') as NodePath<
                types.VariableDeclarator
              >[]
              for (const decl of decls) {
                // only accept named exports, not arrays or whatever
                if (!t.isIdentifier(decl.node.id)) {
                  continue
                }

                if (REMOVE.includes(decl.node.id.name)) {
                  decl.remove()
                }
              }
            }

            // handle specifiers for multiple named exports
            // note that path.node could be null after the previous removal so
            // we check that first
            if (path.node && path.node.specifiers) {
              const specs = path.get('specifiers') as NodePath<
                types.ExportSpecifier
              >[]
              for (const spec of specs) {
                if (!t.isIdentifier(spec.node.exported)) {
                  return
                }

                if (REMOVE.includes(spec.node.exported.name)) {
                  spec.remove()
                }
              }
            }
          }
        })
      }
    }
  }
}
