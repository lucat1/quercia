import { Middleware } from 'polka'
import { IncomingMessage } from 'http'
import { performance } from 'perf_hooks'

import QMock from './qmock'

const middleware: Middleware<IncomingMessage> = (req, _, next) => {
  const start = performance.now()
  next && next()
  const elapsed = performance.now() - start
  QMock.getLogger().info(
    'middleware',
    `${req.method} ${req.url} took ${elapsed}ms`
  )
}

export default middleware
