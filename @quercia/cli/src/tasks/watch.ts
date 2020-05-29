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
    ;(this.compiler as any).watch(
      null,
      async (err: Error, stats: MultiStats) => {
        if (err) {
          this.error(
            'tasks/watch',
            'while running webpack in watch mode:\n' +
              this.logger.prettyError('error', err)
          )
        }

        let shouldStop = false
        for (const stat of stats.stats) {
          if (stat.hasErrors()) {
            for (const err of stat.compilation.errors) {
              const index = stat.compilation.errors.indexOf(err) + 1
              const length = stat.compilation.errors.length
              this.warning(
                'tasks/watch',
                `error ${index} of ${length} while running webpack in watch mode:\n` +
                  this.logger.prettyError('warning', err)
              )
            }

            shouldStop = true
          }
        }

        // don't execute further if we have any errors
        if (shouldStop) {
          this.success('tasks/watch', 'errors while compiling')
          return
        }

        this._calls++

        // prevent prerenders from beings called twice
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
