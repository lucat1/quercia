import Quercia from './quercia'

import Structure from './tasks/structure'
import Config from './tasks/config'
import Build from './tasks/build'
import Watch from './tasks/watch'
import Compile from './tasks/compile'
import Prerender from './tasks/prerender'

import Logger from '@quercia/logger'

export default class Task {
  protected quercia: Quercia
  protected logger: Logger

  protected debug: Logger['debug']
  protected info: Logger['info']
  protected success: Logger['success']
  protected warning: Logger['warning']
  protected error: Logger['error']

  constructor(instance: Quercia) {
    this.quercia = instance
    this.logger = instance.logger

    // simplified logger methods
    this.debug = this.logger.debug.bind(this.logger)
    this.info = this.logger.info.bind(this.logger)
    this.success = this.logger.success.bind(this.logger)
    this.warning = this.logger.warning.bind(this.logger)
    this.error = this.logger.error.bind(this.logger)
  }

  public async execute() {}
}

export interface Tasks {
  structure: Structure
  config: Config
  builder: Compile & (Build | Watch)
  prerender: Prerender
}
