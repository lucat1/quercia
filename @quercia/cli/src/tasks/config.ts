import { Configuration } from 'webpack'

import Task from '../task'
import Structure from './structure'

export default class Config extends Task {
  private structure: Structure = null as any
  private rc: (cfg: Configuration) => Configuration = a => a

  public async execute() {
    this.debug('tasks/config', 'Loading configuration file')
    this.structure = this.quercia.tasks.structure

    // load the configuration file if it exists and set `this.rc` to its value
    if (this.structure.paths.config !== null) {
      const mod = await import(this.structure.paths.config)
      if (typeof mod === 'function') {
        this.rc = mod
      } else if (mod.__esModule && typeof mod.default == 'function') {
        this.rc = mod.default
      } else {
        this.fatal(
          'tasks/config',
          'The configuration file must export a reducer function either as ' +
            '`module.exports` or as `export default`'
        )
      }

      this.log('tasks/config', 'Found configuration file')
    } else {
      this.log('tasks/config', 'No configuration file found')
    }

    this.rc = this.rc // remove
    this.log('tasks/config', 'Generated webpack configuration')
  }
}
