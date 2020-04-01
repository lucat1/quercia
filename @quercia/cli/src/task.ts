import Quercia from './quercia'

import Structure from './tasks/structure'
import Config from './tasks/config'
import Build from './tasks/build'
import Watch from './tasks/watch'
import Prerender from './tasks/prerender'

import Logger from './logger'

export default class Task {
  protected quercia: Quercia
  protected logger: Logger

  protected log: Logger['log']
  protected debug: Logger['debug']
  protected fatal: Logger['fatal']

  constructor(instance: Quercia) {
    this.quercia = instance
    this.logger = instance.logger

    // simplified logger methods
    this.debug = this.logger.debug
    this.log = this.logger.log
    this.fatal = this.logger.fatal
  }

  public async execute() {}
}

export interface Tasks {
  structure: Structure
  config: Config
  builder: Build | Watch
  prerender: Prerender
}
