import { Command, flags } from '@oclif/command'
import { IConfig } from '@oclif/config'
import { AsyncParallelHook, AsyncSeriesHook } from 'tapable'
import uid from 'uid'

import Structure from './tasks/structure'
import Config from './tasks/config'
import Prerender from './tasks/prerender'

import Logger from './logger'
import { Tasks } from 'task'

// Shared class for both the build and watch command
// Shared steps:
// - flags = parsing command line flags
// - structure = reading the directory structure(pages, config)
// - configure = generating the webpack configurtion
// - build     = either watching or building
// - prerender = prerendering pages(run on every change in watch mode)

export default class Quercia extends Command {
  public static getInstance(): Quercia {
    return Quercia.instance
  }
  private static instance: Quercia

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    Quercia.instance = this
  }

  public hooks = {
    // called as the first hook available, before any logic is executed by quercia
    beforeFlags: new AsyncParallelHook(['quercia']),

    // called after the flags/args have been parsed
    afterFlags: new AsyncParallelHook(['quercia']),

    // called afeter the structure task has been executed
    // it can be used as a beforeConfig
    afterStructure: new AsyncSeriesHook(['quercia', 'structure']),

    // called after the custom configuration(if any) has been executed
    afterConfig: new AsyncSeriesHook(['quercia', 'config']),

    // called after the build process has ended with the webpack stats
    build: new AsyncSeriesHook(['quercia', 'stats']),

    // called before starting the webpack watcher
    beforeWatch: new AsyncSeriesHook(['quercia']),

    // called after every watch cycle has completed
    watch: new AsyncSeriesHook(['quercia', 'watcher']),

    // called after the compilation has ended
    afterWatch: new AsyncSeriesHook(['quercia', 'stats']),

    // called before we start the prerender task (every new change in watch mode)
    beforePrerender: new AsyncSeriesHook(['quercia']),

    // called after the prerender task has ended (every new change in watch mode)
    afterPrerender: new AsyncSeriesHook(['quercia', 'prerender']),

    // called after the manifest files have been written
    manifest: new AsyncSeriesHook(['quercia'])
  }

  public static flags = {
    help: flags.help({ char: 'h' }),
    version: flags.version({ char: 'v' }),
    mode: flags.string({
      char: 'm',
      default: 'development',
      options: ['development', 'production'],
      description: 'set the webpack `mode` option'
    }),
    debug: flags.boolean({
      char: 'd',
      default: false,
      description: 'print debug messages'
    })
  }

  public static args = [
    {
      name: 'src',
      required: true,
      description: 'the application source path',
      default: '.'
    }
  ]

  public logger = new Logger(this)
  public buildID = uid(5)

  public tasks: Tasks = {
    structure: new Structure(this),
    config: new Config(this),
    builder: null as any,
    prerender: new Prerender(this)
  }

  // arguments and flags parsed, with some sane defaults
  public parsedArgs: { [key: string]: any } = {}
  public parsedFlags: { mode: 'production' | 'development'; debug: boolean } = {
    mode: 'development',
    debug: false
  }

  public async run() {
    // TODO: Load extensions

    await this.hooks.beforeFlags.promise(this)

    const { args, flags } = this.parse(Quercia)
    this.parsedArgs = args
    this.parsedFlags = flags as any // to fix mode -> 'production' | 'development'

    await this.hooks.afterFlags.promise(this)

    await this.tasks.structure.execute()
    await this.hooks.afterStructure.promise(this, this.tasks.structure)

    await this.tasks.config.execute()
    await this.hooks.afterConfig.promise(this, this.tasks.config)

    // From here on its custom code based on the watch/build command
  }
}
