import { join } from 'path'
import sade from 'sade'

import Build from './commands/build'
import Watch from './commands/watch'
import { Args, Flags } from './quercia'

const cli = sade('quercia')

const { version } = require(join(__dirname, '..', 'package.json'))

const defaultArgs: Args = {
  src: '.'
}

const defaultFlags: Flags = {
  debug: false,
  mode: 'development',
  typecheck: true,
  stats: false
}

cli
  .version(`v${version}`)
  .option('-d, --debug', 'print debug messages', defaultFlags.debug as any)
  .option('-m, --mode', 'set the webpack `mode` option', defaultFlags.mode)
  .option(
    '--typecheck',
    'can be set to false to disable typechecking',
    defaultFlags.typecheck as any
  )
  .example('quercia watch')
  .example('quercia build -m=production')

cli
  .command('build [src]')
  .option(
    '-s, --stats',
    'puts webpack stats into `__quercia/stats.json`',
    defaultFlags.stats as any
  )
  .describe('bundle your application to be served from a quercia backend')
  .example('quercia build -m=production')
  .example('quercia build src -m=production')
  .action((src, options: Flags) => {
    new Build(src ? { src } : defaultArgs, {
      ...defaultFlags,
      ...options
    }).run()
  })

cli
  .command('watch [src]')
  .describe(
    'watch for changes inside your application and rebundle the code on every update'
  )
  .example('quercia watch -v')
  .example('quercia watch src')
  .action((src, options: Flags) => {
    new Watch(src ? { src } : defaultArgs, {
      ...defaultFlags,
      ...options
    }).run()
  })

cli.parse(process.argv)
