import { Configuration } from 'webpack'
import getPort from 'get-port'

import Task from '../task'
import Structure from './structure'
import IConfig, { Reducer, PReducer, Target } from './iconfig'

import basecfg from '../webpack/base-config'
import clientcfg from '../webpack/client-config'
import servercfg from '../webpack/server-config'
import polyfillscfg from '../webpack/polyfills-config'

export default class Config extends Task implements IConfig {
  private structure: Structure = null as any
  public rc: Reducer | PReducer = data => data.config

  public client: Configuration = null as any
  public server: Configuration = null as any
  public polyfills: Configuration = null as any

  public hmr: number = -1

  public async execute() {
    this.debug('tasks/config', 'Loading configuration file')
    this.structure = this.quercia.tasks.structure

    if (this.quercia.command === 'watch') {
      this.hmr = await getPort()
    }

    // load the configuration file if it exists and set `this.rc` to its value
    if (this.structure.paths.config !== null) {
      const mod = await import(this.structure.paths.config)
      if (typeof mod === 'function') {
        this.rc = mod
      } else if (typeof mod === 'object' && typeof mod.default === 'function') {
        this.rc = mod.default
      } else {
        this.error(
          'tasks/config',
          'the configuration file must export a reducer function either as ' +
            '`module.exports` or as `export default`'
        )
      }
    }

    this.client = await this.must('client')
    this.server = await this.must('server')
    this.polyfills = await this.must('polyfills')

    this.success('tasks/config', 'generated webpack configuration')
  }

  private async must(target: Target): Promise<Configuration> {
    const base = basecfg(target)
    let internal: Configuration
    switch (target) {
      case 'server':
        internal = await servercfg(base)
        break

      case 'client':
        internal = await clientcfg(base)
        break

      case 'polyfills':
        internal = await polyfillscfg(base)
        break

      default:
        this.error(
          'tasks/config',
          'invalid configuration target (can only be: server, client, polyfills)'
        )
        internal = null as any
    }
    let final: Configuration = null as any

    try {
      final = await this.rc({
        target,
        config: internal,
        buildID: this.quercia.buildID,
        mode: this.quercia.flags.mode
      })
    } catch (err) {
      this.error(
        'tasks/config',
        'while executing your configuration file:\n' +
          this.logger.prettyError('error', err)
      )
    }

    if (typeof final !== 'object') {
      this.error(
        'tasks/config',
        "the configuration you provided doesn't " +
          'return a valid webpack configuration object. Expected `object`, got `' +
          typeof final +
          '`'
      )
    }

    return final
  }
}
