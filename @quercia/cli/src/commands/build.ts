import Quercia from '../quercia'

import BuildTask from '../tasks/build'
import { Tasks } from '../task'

export default class Build extends Quercia {
  public description =
    'bundle your application to be served from a quercia backend'

  public tasks: Tasks = {
    ...this.tasks,
    builder: new BuildTask(this)
  }

  public async run() {
    await super.run()

    await this.tasks.builder.execute()
    await this.hooks.build.promise(this, this.tasks.builder)

    await this.hooks.beforePrerender.promise(this)
    await this.tasks.prerender.execute()
    await this.hooks.afterPrerender.promise(this, this.tasks.prerender)

    await this.tasks.builder.writeManfiest()
    await this.hooks.manifest.promise(this)
  }
}
