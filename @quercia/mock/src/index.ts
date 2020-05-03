import { join } from 'path'
import sade from 'sade'

import QMock from './qmock'

const { version } = require(join(__dirname, '..', 'package.json'))

export interface Args {
  src: string
}

const defaultArgs: Args = {
  src: '.'
}

export interface Flags {
  debug: boolean
}

const defaultFlags: Flags = {
  debug: false
}

sade('qmock [src]')
  .version(`v${version}`)
  .describe('Mock a quercia application via json or programmatic usage')
  .option('-d, --debug', 'print debug messages', defaultFlags.debug as any)
  .example('qmock')
  .example('qmock my_mocks_folder')
  .action((src, options) => {
    new QMock(src ? { src } : defaultArgs, {
      ...defaultFlags,
      ...options
    }).run()
  })
  .parse(process.argv)
