import * as webpack from 'webpack'
import { join, extname } from 'path'
import { promises as fs } from 'fs'

import { config } from './config'

export const root = process.cwd()
export const pages = join(root, 'pages')
export const quercia = join(root, '__quercia')

// webpack compiler related variables
export const entry = require.resolve('@quercia/quercia')
export const loader = require.resolve('./page-loader.js')
export const entries: { [key: string]: string } = {}

// mkdir creates a folder at the given path if ti does
// not exist. Erorrs if the path is a file
async function mkdir(path: string) {
  try {
    const stat = await fs.stat(path)
    if(stat.isFile()) {
      console.error('File at `' + path + '` should be a folder!')
      process.exit(1)
    }
  } catch(_) {
    try {
      await fs.mkdir(path)
    } catch(err) {
      console.error('Could not create needed folder at `' + path + '`')
      process.exit(1)
    }
  }
}

// readdir reads a directory recursively
async function readdir(folder: string): Promise<string[]> {
  const files = await fs.readdir(folder)
  const result = await Promise.all(files.map(async file => {
    const path = join(folder, file)
    if(!(await fs.stat(path)).isFile()) {
      return await readdir(path)
    }
    
    return path
  }))

  return result.flat()
}

// setupFolders creates the output folders for the quercia bundler
async function setupFolders() {
  await mkdir(quercia)
  console.info('Setup folders')
}

// setupEntries fetches the pages to be compiled with webpack
async function setupEntries() {
  try {
    const paths = await readdir(pages)
    paths.forEach(path => {
      const key = 'pages/' + path
        .replace(pages + '/', '')
        .replace(extname(path), '')

      entries[key] = loader + '!' + path
    })
  } catch(err) {
    console.log('Could not fetch pages:\n' + err)
    process.exit(1)
  }
}

// build builds the webpack bundle
function build(): Promise<webpack.Stats> {
  return new Promise((res, rej) => {
    const compiler = webpack(config())
    compiler.run((err, stats) => {
      if(err || stats.hasErrors()) {
        return rej(err || stats.compilation.errors)
      }

      res(stats)
    })
  })
}

async function main() {
  await setupFolders()
  await setupEntries()
  try {
    await build()
  } catch(err) { console.error(err) }
}

// execute the program
main()