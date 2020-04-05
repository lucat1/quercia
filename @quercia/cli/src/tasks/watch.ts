import Compile, { MultiStats } from './compile'

export default class Watch extends Compile {
  private prev: string = ''

  public async execute() {
    await super.execute()

    this.log('tasks/watch', 'Watching for changes inside the application')
    ;(this.compiler as any).watch(
      null,
      async (err: Error, stats: MultiStats) => {
        for (const stat of stats.stats) {
          if (err) {
            this.fatal(
              'tasks/watch',
              'Fatal error while running webpack in watch mode:\n',
              err.message || err.stack || err
            )
          }

          if (stat.hasErrors()) {
            for (const err of stat.compilation.errors) {
              const index = stat.compilation.errors.indexOf(err) + 1
              const length = stat.compilation.errors.length
              this.error(
                'tasks/watch',
                `Error ${index} of ${length} while running webpack in watch mode:\n`,
                err.message || err.stack || err
              )
            }

            return
          }
        }

        // prevent prerenders from beings called twice
        if (this.prev == stats.hash) return
        this.prev = stats.hash

        this.log('tasks/watch', 'Successfully compiled the application')
        await this.quercia.hooks.watch.promise(this, stats)

        await this.afetrBuild()
      }
    )
  }
}
