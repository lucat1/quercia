import Compile, { MultiStats } from './compile'

export default class Build extends Compile {
  public async execute() {
    await super.execute()

    this.log('tasks/build', 'Building the application')

    this.stats = await new Promise<MultiStats>(res => {
      ;(this.compiler as any).run((err: Error, stats: MultiStats) => {
        for (const stat of stats.stats) {
          if (err) {
            this.fatal(
              'tasks/build',
              'Error while running webpack in build mode:\n',
              err
            )
          }

          if (stat.hasErrors()) {
            for (const err of stat.compilation.errors) {
              const index = stat.compilation.errors.indexOf(err) + 1
              const length = stat.compilation.errors.length
              this.error(
                'tasks/build',
                `Error ${index} of ${length} while running webpack in build mode:\n`,
                err
              )
            }

            this.quercia.exit(1)
          }
        }

        res(stats)
      })
    })

    await this.quercia.hooks.build.promise(this.quercia, this.stats)
  }
}
