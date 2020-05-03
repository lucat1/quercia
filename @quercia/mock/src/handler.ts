import { extname } from 'path'
import { RequestHandler, Request, Response } from 'polka'
import QMock from './qmock'

export default function handle(file: string) {
  return async function (req, res) {
    // clear node require cache
    if (require.cache[file]) {
      delete require.cache[file]
    }

    const ext = extname(file)
    switch (ext) {
      case '.json':
        try {
          const mod = require(file)
          res.end(JSON.stringify(mod))
        } catch (err) {
          QMock.getLogger().warning(
            'handler',
            'error while serving json mock:\n',
            QMock.getLogger().prettyError('warning', err)
          )
          res.end('internal error. Check your console')
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
          res.end(typeof result === 'object' ? JSON.stringify(result) : result)
        }
        break

      default:
        res.end('invalid file extension `' + ext + '`')
    }
  } as RequestHandler<Request>
}
