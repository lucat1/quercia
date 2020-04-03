import { Configuration } from 'webpack'

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

  public async execute() {
    this.debug('tasks/config', 'Loading configuration file')
    this.structure = this.quercia.tasks.structure

    // load the configuration file if it exists and set `this.rc` to its value
    if (this.structure.paths.config !== null) {
      const mod = await import(this.structure.paths.config)
      if (typeof mod === 'function') {
        this.rc = mod
      } else if (typeof mod === 'object' && typeof mod.default === 'function') {
        this.rc = mod.default
      } else {
        this.fatal(
          'tasks/config',
          'The configuration file must export a reducer function either as ' +
            '`module.exports` or as `export default`'
        )
      }
    }

    this.client = await this.must(false)
    this.server = await this.must(true)

    this.log('tasks/config', 'Generated webpack configuration')
  }

  private async must(isServer: boolean): Promise<Configuration> {
    const internal = isServer
      ? await servercfg(basecfg(isServer))
      : await clientcfg(basecfg(isServer))

    let final: Configuration = null as any
    try {
      final = await this.rc({ isServer, config: internal })
    } catch (err) {
      this.fatal(
        'tasks/config',
        'Error while executing your configuration file:\n' + err.stack
      )
    }

    if (typeof final !== 'object') {
      this.fatal(
        'tasks/config',
        "The configuration you provided doesn't " +
          'return a valid webpack configuration object. Expected `object`, got `' +
          typeof final +
          '`'
      )
    }

    return final
  }
}
