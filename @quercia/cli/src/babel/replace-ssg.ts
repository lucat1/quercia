import * as types from '@babel/types'
import { Visitor, NodePath } from '@babel/traverse'

export interface Options {
  value: boolean
}

interface Ctx {
  cache: Map<string, string[]>
}

interface Plugin {
  name: string
  visitor: Visitor<Ctx>

  pre(this: Ctx): void
}

export default function ({ types: t }: { types: typeof types }): Plugin {
  return {
    name: 'replace-ssg',
    pre() {
      this.cache = new Map<string, string[]>()
    },
    visitor: {
      ImportDeclaration(
        path: NodePath<types.ImportDeclaration>,
        { filename }: { filename: string }
      ) {
        // ignore other modules
        if (path.node.source.value !== '@quercia/quercia') return

        for (const spec of path.node.specifiers) {
          // ignore default imports and namespaces imports
          if (!t.isImportSpecifier(spec)) continue

          if (spec.imported.name !== 'SSG') continue

          const name = spec.local.name
          // we surely have an `SSG` import from `@quercia/quercia` now
          // so we add/create it in the set
          if (this.cache.has(filename)) {
            const prev = this.cache.get(filename) as string[]
            this.cache.set(filename, prev.concat(name))
          } else {
            this.cache.set(filename, [name])
          }
        }
      },
      Identifier(
        path: NodePath<types.Identifier>,
        { filename, opts }: { filename: string; opts: Options }
      ) {
        // return if we don't have the required import in this file
        if (!this.cache.has(filename)) return
        const names = this.cache.get(filename) as string[]

        // ignore not imported idetifiers
        if (!names.includes(path.node.name)) return

        // ignore indetifiers inside importss
        if (t.isImportSpecifier(path.parent)) return

        // check again that the value has been imported and not redeclared
        const binding = path.scope.getBinding(path.node.name)
        // not an import, redeclared. Ignore
        if (!binding || binding.kind !== 'module') return

        // we can proceed with the replacement
        path.replaceWith(t.booleanLiteral(opts.value))
      }
    } as any
  }
}
