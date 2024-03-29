import webpack, { MultiCompiler, Stats } from 'webpack'
import { join } from 'path'
import { promises as fs } from 'fs'

import Task from '../task'
import Manifest from '../webpack/manifest'

export interface MultiStats {
  stats: Stats[]
  hash: string
}

export default class Compile extends Task {
  protected compiler: MultiCompiler = null as any
  public stats: MultiStats | null = null

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
      // this.quercia.tasks.config.server,
      // this.quercia.tasks.config.polyfills
    ]

    this.compiler = webpack(cfg)
  }

  // holds repetitive calls that happen after the build has been successful
  public async afterBuild() {
    console.log("afterBuild")
    await this.quercia.hooks.beforePrerender.promise(this.quercia)

    await this.quercia.tasks.prerender.execute()

    await this.quercia.hooks.afterPrerender.promise(
      this,
      this.quercia.tasks.prerender
    )

    await this.writeManfiest()
    await this.quercia.hooks.manifest.promise(this)
  }

  // writes the manifest to `__quercia/manifest.json`
  public async writeManfiest() {
    this.debug('tasks/compile', 'Writing manifest files')

    const data = JSON.stringify(
      this.manifest,
      null,
      this.quercia.flags.mode == 'production' ? 0 : 2
    )

    const path = join(this.quercia.tasks.structure.paths.root, '__quercia')
    await fs.writeFile(join(path, 'manifest.json'), data)

    this.success('tasks/compile', 'wrote manifest files')
  }
}
