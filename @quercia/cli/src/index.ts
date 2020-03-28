import { Command, flags } from '@oclif/command'
import { sync as resolve } from 'enhanced-resolve'
import { join } from 'path'

import { loadRc } from './rc'
import { loadPages } from './pages'
import { mkdir } from './fs'
import { config, pconfig } from './config'
import { watch, build } from './build'
import { prerender } from './prerender'

export default class Quercia extends Command {
  public static description = 'bundle your application'
  public static args = []

  public static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    watch: flags.boolean({
      char: 'w',
      default: false
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
  public static runtime = resolve(Quercia.root, '@quercia/runtime')

  // list of pages files to be used as webpack inputs
  public static entries: { [key: string]: string } = {}

  async run() {
    const { flags } = this.parse(Quercia)

    await loadRc()

    await loadPages(Quercia.pages)

    await mkdir(Quercia.quercia)

    this.log(`running in ${flags.watch ? 'watch' : 'build'}/${flags.mode}`)

    const cfg = config(flags.mode, 'web')
    if (flags.watch) {
      await watch(cfg)
    } else {
      await build(cfg)

      const pConfig = pconfig(flags.mode)
      await build(pConfig)
      await prerender()
    }
  }

  async catch(err: Error) {
    this.log('Fatal error during the building process')
    this.error(err, { exit: 1 })
  }
}
