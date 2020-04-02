import webpack, { MultiCompiler, Stats } from 'webpack'

import Task from '../task'
import Manifest from '../webpack/manifest'

export interface MultiStats {
  stats: Stats[]
  hash: string
}

export default class Compile extends Task {
  protected compiler: MultiCompiler = null as any
  protected stats: MultiStats | null = null

  private _manifest: Manifest = {} as any

  public get manifest(): Manifest {
    return this._manifest
  }

  public set manifest(manifest: Manifest) {
    this._manifest = manifest
    this.debug('tasks/compile', 'Updated manifest', this._manifest)
  }

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
