import { Plugin, Compiler } from 'webpack'
import { sep } from 'path'

import Quercia from '..'

export default class ProgressPlugin implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap('QuerciaProgress', factory => {
      factory.hooks.module.tap('QuerciaProgressFactory', module => {
        const path: string = module.resource
        let file: { type: 'src' | 'module', path: string }

        if(/node_modules/.test(path)) {
          let final // the processed path
          // node_modules module
          const module = path.replace(/^(.*?)\/node_modules\//, '')
          if(module.startsWith('@')) {
            // scoped module
            const parts = module.split(sep)
            final = parts[0] + '/' + parts[1]
          } else {
            final = module.split(sep)[0]
          }

          file = { type: 'module', path: final }
        } else {
          // module outside of the node_modules folder
          file = {
            type: 'src',
            path: path.replace(Quercia.root + '/', '')
          }
        }

        console.log(file)
      })
    })
  }
}