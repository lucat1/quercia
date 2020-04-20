import Quercia, { Args, Flags } from '../quercia'

import WatchTask from '../tasks/watch'
import { Tasks } from '../task'

export default class Watch extends Quercia {
  constructor(args: Args, flags: Flags) {
    super('watch', args, flags)
  }

  public tasks: Tasks = {
    ...this.tasks,
    builder: new WatchTask(this)
  }

  public async run() {
    await super.run()

    await this.hooks.beforeWatch.promise(this)

    // with watch we let the task handle everything, event
    // hooks calls, because they are repeated over time, as webpack
    // rebundles the application
    await this.tasks.builder.execute()

    await this.hooks.afterWatch.promise(this)
  }
}
