import { promises as fs } from 'fs'
import { join } from 'path'

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
              err.message || err.stack || err
            )
          }

          if (stat.hasErrors()) {
            for (const err of stat.compilation.errors) {
              const index = stat.compilation.errors.indexOf(err) + 1
              const length = stat.compilation.errors.length
              this.error(
                'tasks/build',
                `Error ${index} of ${length} while running webpack in build mode:\n`,
                err.message || err.stack || err
              )
            }

            this.quercia.exit(1)
          }
        }

        res(stats)
      })
    })

    // after a successfull build save the webpack stats when requested
    if (this.quercia.flags.stats) {
      await fs.writeFile(
        join(
          this.quercia.tasks.structure.paths.root,
          '__quercia',
          'stats.json'
        ),
        JSON.stringify(this.stats.stats[0].toJson('normal'))
      )
      this.log('tasks/build', 'Saved webpack stats')
    }

    this.log('tasks/build', 'Successfully compiled the application')
  }
}
