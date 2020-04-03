import eresolve from 'enhanced-resolve'
import { join, sep, extname } from 'path'
import { promisify } from 'util'

import Task from '../task'
import { exists, readdir } from '../fs'

import IStructure, { Paths, Pages } from './istructure'

const resolve: (root: string, mod: string) => Promise<string> = promisify(
  eresolve
) as any

export default class Structure extends Task implements IStructure {
  // only used during existance checking
  private _paths: Readonly<Paths> = {
    root: process.cwd(),
    get pages() {
      return join(this.root, 'pages')
    },
    get config() {
      return join(this.root, 'quercia.config.js')
    },
    get runtime() {
      // should never be called
      return eresolve.sync(this.root, '@quercia/runtime')
    }
  }

  // the list of paths used by quercia
  public paths: Paths = {} as any

  // list of pages inside the `$ROOT/pages` folder
  public pages: Pages = {}

  public async execute() {
    this.debug('tasks/structure', 'Parsing project structure')
    this.paths.root = join(process.cwd(), this.quercia.parsedArgs.src)

    // check if the root exists. This is mandatory and will fail otherwhise
    if (!(await exists(this.paths.root))) {
      this.fatal(
        'tasks/structure',
        'The requested `src` directory does not exist'
      )
    }

    // check for the existance of other secondary files/folder
    const keys: Array<keyof Paths> = Object.keys(this._paths) as any
    for (const key of keys) {
      // ignore this.paths.root as we have already checked it
      if (key == 'root' || key == 'runtime') continue

      const path = this._paths[key] as string
      this.paths[key] = (await exists(path)) ? path : null
    }

    // set runtime separately cause it has to be resolved with `enhanced-resolve`
    try {
      this.paths.runtime = await resolve(this.paths.root, '@quercia/runtime')
    } catch (err) {
      this.fatal(
        'tasks/structure',
        'Could not find the `@quercia/runtime` package. Your `node_modules` ' +
          'folder is most lickely corrupted. Try reinstalling the npm modules'
      )
    }

    this.debug(
      'tasks/structure',
      'found paths (null means non-existing)',
      this.paths
    )

    if (this.paths.pages === null) {
      this.fatal(
        'tasks/structure',
        "Your project doesn't contain a `pages` " +
          ' folder. The compiler will abort'
      )
      return // useless, but makes typescript happy as below `this.paths.pages` is a string
    }

    const files = await readdir(this.paths.pages)
    for (const file of files) {
      this.pages[this.rel(file)] = file
    }

    this.debug('tasks/structure', 'found pages', this.pages)
    this.log('tasks/structure', 'Loaded project structure')
  }

  // returns the name of a page relatively to the `this.paths.pages` folder
  private rel(path: string): string {
    return path
      .replace((this.paths.root as string) + sep, '')
      .replace(sep, '/') // make paths web-compatible on windows where sep=\
      .replace(extname(path), '')
  }
}
