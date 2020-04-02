import Quercia from './quercia'

import Structure from './tasks/structure'
import Config from './tasks/config'
import Build from './tasks/build'
import Watch from './tasks/watch'
import Compile from './tasks/compile'
import Prerender from './tasks/prerender'

import Logger from './logger'

export default class Task {
  protected quercia: Quercia
  protected logger: Logger

  protected debug: Logger['debug']
  protected log: Logger['log']
  protected error: Logger['error']
  protected fatal: Logger['fatal']

  constructor(instance: Quercia) {
    this.quercia = instance
    this.logger = instance.logger

    // simplified logger methods
    this.debug = this.logger.debug
    this.log = this.logger.log
    this.error = this.logger.error
    this.fatal = this.logger.fatal
  }

  public async execute() {}
}

export interface Tasks {
  structure: Structure
  config: Config
  builder: Compile & (Build | Watch)
  prerender: Prerender
}
