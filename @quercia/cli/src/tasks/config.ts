import { Configuration } from 'webpack'
import getPort from 'get-port'

import Task from '../task'
import Structure from './structure'
import IConfig, { Reducer, PReducer } from './iconfig'

import basecfg from '../webpack/base-config'
import clientcfg from '../webpack/client-config'
import servercfg from '../webpack/server-config'

export default class Config extends Task implements IConfig {
  private structure: Structure = null as any
  public rc: Reducer | PReducer = data => data.config

  public client: Configuration = null as any
  public server: Configuration = null as any

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

    this.client = await this.must(false)
    this.server = await this.must(true)

    this.success('tasks/config', 'generated webpack configuration')
  }

  private async must(isServer: boolean): Promise<Configuration> {
    const internal = isServer
      ? await servercfg(basecfg(isServer))
      : await clientcfg(basecfg(isServer))

    let final: Configuration = null as any
    try {
      final = await this.rc({
        isServer,
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
