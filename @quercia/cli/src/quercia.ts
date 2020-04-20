import { AsyncParallelHook, AsyncSeriesHook } from 'tapable'
import uid from 'uid'

import Structure from './tasks/structure'
import Config from './tasks/config'
import Prerender from './tasks/prerender'

import Logger from './logger'
import { Tasks } from 'task'

export interface Args {
  src: string
}

export interface Flags {
  mode: 'development' | 'production'
  debug: boolean
  typecheck: boolean
}

// Shared class for both the build and watch command
// Shared steps:
// - flags = parsing command line flags
// - structure = reading the directory structure(pages, config)
// - configure = generating the webpack configurtion
// - build     = either watching or building
// - prerender = prerendering pages(run on every change in watch mode)

export default class Quercia {
  public static getInstance(): Quercia {
    return Quercia.instance
  }
  private static instance: Quercia

  public args: Args
  public flags: Flags
  public command: 'build' | 'watch'

  constructor(command: 'build' | 'watch', args: Args, flags: Flags) {
    Quercia.instance = this
    this.command = command
    this.args = args
    this.flags = flags
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
    watch: new AsyncSeriesHook(['quercia', 'stats']),

    // called after the compilation has ended
    afterWatch: new AsyncSeriesHook(['quercia']),

    // called before we start the prerender task (every new change in watch mode)
    beforePrerender: new AsyncSeriesHook(['quercia']),

    // called after the prerender task has ended (every new change in watch mode)
    afterPrerender: new AsyncSeriesHook(['quercia', 'prerender']),

    // called after the manifest files have been written
    manifest: new AsyncSeriesHook(['quercia'])
  }

  public logger = new Logger(this)
  public buildID = uid(5)

  public tasks: Tasks = {
    structure: new Structure(this),
    config: new Config(this),
    builder: null as any,
    prerender: new Prerender(this)
  }

  public exit(code: number) {
    process.exit(code)
  }

  public async run() {
    // TODO: Load extensions
    await this.hooks.beforeFlags.promise(this)

    await this.hooks.afterFlags.promise(this)

    await this.tasks.structure.execute()
    await this.hooks.afterStructure.promise(this, this.tasks.structure)

    await this.tasks.config.execute()
    await this.hooks.afterConfig.promise(this, this.tasks.config)

    // From here on its custom code based on the watch/build command
  }
}
