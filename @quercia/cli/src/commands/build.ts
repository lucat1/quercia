import Quercia, { Args, Flags } from '../quercia'

import BuildTask from '../tasks/build'
import { Tasks } from '../task'

export default class Build extends Quercia {
  constructor(args: Args, flags: Flags) {
    super('build', args, flags)
  }

  public tasks: Tasks = {
    ...this.tasks,
    builder: new BuildTask(this)
  }

  public async run() {
    await super.run()

    await this.tasks.builder.execute()
    await this.hooks.build.promise(
      this,
      (this.tasks.builder as BuildTask).stats
    )

    await this.tasks.builder.afterBuild()
  }
}
