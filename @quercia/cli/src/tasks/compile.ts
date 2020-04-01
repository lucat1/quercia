import webpack, { MultiCompiler, Stats } from 'webpack'

import Task from '../task'

export interface MultiStats {
  stats: Stats[]
  hash: string
}

export default class Compile extends Task {
  protected compiler: MultiCompiler = null as any
  protected stats: MultiStats | null = null

  public async execute() {
    this.debug(
      'tasks/compile',
      'Assembling compiler (shared between build and watch)'
    )

    const cfg = [
      this.quercia.tasks.config.client,
      this.quercia.tasks.config.server
    ]

    this.compiler = webpack(cfg)
  }
}
