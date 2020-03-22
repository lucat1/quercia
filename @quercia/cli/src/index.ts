import { Command, flags } from '@oclif/command'
import { join } from 'path'

import { mkdir } from './fs'
import { loadPages } from './pages'
import { config } from './config'
import { watch, build } from './build'

export default class Quercia extends Command {
  public static description = 'bundle your application'
  public static args = []

  public static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    watch: flags.boolean({ 
      char: 'w',
      default: true
    }),
    mode: flags.enum<'production' | 'development'>({
      char: 'm',
      options: ['production', 'development'],
      default: 'development',
      description: 'the webpack compilation mode'
    })
  }

  public static root = process.cwd()
  public static pages = join(Quercia.root, 'pages')
  public static quercia = join(Quercia.root, '__quercia')

  // the runtime entrypoint for webpack
  public static runtime = require.resolve('@quercia/runtime')

  // list of pages files to be used as webpack inputs
  public static entries: { [key: string]: string } = {}

  async run() {
    const { flags } = this.parse(Quercia)
    
    await mkdir(Quercia.quercia)

    await loadPages(Quercia.pages)

    this.log(`running in ${flags.watch ? 'watch' : 'build'}/${flags.mode}`)

    const cfg = config(flags.mode)
    if(flags.watch) {
      watch(cfg)
    } else {
      build(cfg)
    }
  }

  async catch(err: Error) {
    this.log('Fatal error during the building process')
    this.error(err, { exit: 1 })
  }
}