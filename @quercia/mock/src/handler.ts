import { extname } from 'path'
import { RequestHandler, Request, Response } from 'polka'

import QMock from './qmock'
import render from './render'

export default function handle(file: string) {
  return async function (req, res) {
    // clear node require cache
    if (require.cache[file]) {
      delete require.cache[file]
    }

    const ext = extname(file)
    let json: { page: string } = { page: 'null' }
    switch (ext) {
      case '.json':
        try {
          json = require(file)
        } catch (err) {
          QMock.getLogger().warning(
            'handler',
            'error while serving json mock:\n',
            QMock.getLogger().prettyError('warning', err)
          )
          res.end('internal error. Check your console')
          return
        }
        break

      case '.js':
        let fn: <T = Object | string>(
          req: Request,
          res: Response
        ) => Promise<T> | T

        const mod = await import(file)
        if (typeof mod === 'function') {
          fn = mod
        } else if (
          typeof mod === 'object' &&
          typeof mod.default === 'function'
        ) {
          fn = mod.default
        } else {
          QMock.getLogger().warning(
            'handler',
            'error while exectuing mocking function:\n',
            QMock.getLogger().prettyError(
              'warning',
              new TypeError(
                'The file `' +
                  file +
                  '` does not export a function.\n' +
                  'If you want to export an object use the `.json` extension'
              )
            )
          )
          res.end('internal error. Check your console')
          return
        }

        const result = await fn(req, res)
        if (result && !res.writableEnded) {
          json = typeof result === 'object' ? result : JSON.parse(result)
        }
        break

      default:
        res.end('invalid file extension `' + ext + '`')
    }

    try {
      res.end(await render(json.page, JSON.stringify(json)))
    } catch (e) {
      QMock.getLogger().warning(
        'render',
        'error while rendering:\n',
        QMock.getLogger().prettyError('warning', e)
      )
      res.end('Error while rendering. please check the console')
    }
  } as RequestHandler<Request>
}
