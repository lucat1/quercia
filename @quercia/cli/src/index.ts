import { Command, flags } from '@oclif/command'
import { sync as resolve } from 'enhanced-resolve'
import { join } from 'path'
import { Configuration } from 'webpack'

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

  // the webpack loader for pages files
  public static loader = resolve(__dirname, './webpack/page-loader.js')

  // rc is the function exported by the configuration file
  // used to edit the webpack configuration
  public static rc: ((cfg: Configuration) => Configuration) | null = null

  // list of pages files to be used as webpack inputs
  public static entries: { [key: string]: string } = {}

  async run() {
    const { flags } = this.parse(Quercia)

    await loadRc()

    await loadPages(Quercia.pages)

    await mkdir(Quercia.quercia)

    this.log(`running in ${flags.watch ? 'watch' : 'build'}/${flags.mode}`)

    let cfg = config(flags.mode, 'web')
    let pcfg = pconfig(flags.mode)
    // execute the config wrapper if we have it
    if (Quercia.rc) {
      try {
        cfg = Quercia.rc(cfg)
        pcfg = Quercia.rc(pcfg)
      } catch (err) {
        throw new Error('Error while executing config:\n' + err)
      }
    }

    if (flags.watch) {
      await watch(cfg)
    } else {
      await build(cfg)

      // on build prerender pages
      await build(pcfg)
      await prerender()
    }
  }

  async catch(errors: Error[]) {
    this.log('Fatal error during the building process')
    if (!(errors instanceof Array)) {
      this.error(errors, { exit: 1 })
    }

    for (const err of errors) {
      this.error(err)
    }

    this.exit(1)
  }
}
