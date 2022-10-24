import { createServer } from 'http'
import { NextHandleFunction } from 'connect'
import hmr, { EventStream } from 'webpack-hot-middleware'

import IWatch from './iwatch'
import Compile, { MultiStats } from './compile'

export default class Watch extends Compile implements IWatch {
  public prev: string = ''
  public middleware: NextHandleFunction & EventStream = null as any

  private _calls = 0

  public async execute() {
    await super.execute()

    this.middleware = hmr(this.compiler.compilers[0], {
      path: '/hmr',
      heartbeat: 10 * 1000,
      log: false
    })
    this.hmr()

    this.info('tasks/watch', 'watching for changes inside the application')
    this.compiler.watch(
      {},
      async (err, stats) => {
        console.log("CALLED")
        if (err || !stats) {
          this.error(
            'tasks/watch',
            'while running webpack in watch mode:\n' +
            this.logger.prettyError('error', err || 'No stats object provided')
          )
          return
        }

        for (const stat of stats.stats) {
          if (!stat.hasErrors())
            continue

          for (const err of stat.compilation.errors) {
            const index = stat.compilation.errors.indexOf(err) + 1
            const length = stat.compilation.errors.length
            this.warning(
              'tasks/watch',
              `error ${index} of ${length} while running webpack in watch mode:\n` +
              this.logger.prettyError('warning', err)
            )
          }
        }
        console.log("before shouldStop")

        // don't execute further if we have any errors
        if (stats.stats.some(stat => stat.hasErrors())) {
          this.success('tasks/watch', 'errors while compiling')
          return
        }
        console.log("afetr shouldStop")

        this._calls++

        // prevent prerenders from being called twice
        console.log("before prev == hash")
        if (this.prev == stats.hash) return
        this.prev = stats.hash

        this.success('tasks/watch', 'compiled the application')

        // avoid calling twice when the server library also gets recompiled
        if (this._calls % 2 == 0 || this._calls == 1) {
          await this.quercia.hooks.watch.promise(this, stats)
          await this.afterBuild()
        }
      }
    )
  }

  private hmr() {
    this.info(
      'tasks/watch',
      `hmr listening on :${this.quercia.tasks.config.hmr}`
    )

    createServer((req, res) => {
      this.middleware(req, res, err => {
        res.statusCode = 400
        res.end(`Bad request${err ? '\n' + err : ''}`)
      })
    }).listen(this.quercia.tasks.config.hmr)
  }
}
