import { join, isAbsolute, sep, extname } from 'path'
import polka from 'polka'
import serve from 'serve-static'

import Logger from '@quercia/logger'

import { Args, Flags } from '.'
import { exists, readdir } from './fs'
import middleware from './middleware'
import makeHandler from './handler'

export default class QMock {
  private root: string
  private mocks: string
  public quercia: string
  private static instance: QMock
  private static logger: Logger

  public static getInstance() {
    return this.instance
  }

  public static getLogger() {
    return this.logger
  }

  private debug: Logger['debug']
  private info: Logger['info']
  private success: Logger['success']
  private error: Logger['error']

  constructor({ src }: Args, { debug }: Flags) {
    QMock.instance = this
    // compute the root folder of the projects
    this.root = isAbsolute(src) ? src : join(process.cwd(), src)
    this.mocks = join(this.root, 'mocks')
    this.quercia = join(this.root, '__quercia')
    QMock.logger = new Logger(debug)

    // alias logger methods
    this.debug = QMock.logger.debug.bind(QMock.logger)
    this.info = QMock.logger.info.bind(QMock.logger)
    this.success = QMock.logger.success.bind(QMock.logger)
    this.error = QMock.logger.error.bind(QMock.logger)
  }

  public async run() {
    this.debug('qmock', 'root:', this.root, 'mocks:', this.mocks)

    if (!(await exists(this.mocks))) {
      this.error(
        'qmock',
        'the `mocks` folder does not exist. please check your src argument'
      )
    }

    if (!(await exists(this.quercia))) {
      this.error(
        'qmock',
        'the `__quercia` folder does not exist. please check your src argument'
      )
    }

    const mocks = await readdir(this.mocks)
    this.debug('qmock', 'mocks:', mocks)
    if (mocks.length === 0) {
      this.error('qmock', 'no mocks defined inside the `mocks` folder')
    }

    const routes = mocks
      .map(mock => '/' + mock.replace(this.mocks + sep, ''))
      .map(path => path.replace(extname(path), ''))
      .map(url => (url == '/index' ? '/' : url))

    this.debug('qmock/server', 'routes:', routes)
    this.info(
      'qmock/server',
      'found',
      routes.length,
      'route' + (routes.length !== 1 ? 's' : '')
    )

    const server = polka()
      .use(middleware)
      .use(serve(this.quercia) as any)
    for (const route of routes) {
      this.debug('qmock/server', 'registered route', route)
      server.get(route, makeHandler(mocks[routes.indexOf(route)]) as any)
    }

    server.listen(3000, ((err: Error) => {
      err
        ? this.error('qmock/server', 'error while trying to listen on :3000')
        : this.success('qmock/server', 'listening on :3000')
    }) as any)
  }
}
