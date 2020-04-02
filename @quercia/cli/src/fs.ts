import { promises as fs } from 'fs'
import { join } from 'path'

// returns true if a file/folder exists
export async function exists(path: string): Promise<boolean> {
  try {
    await fs.stat(path)
    return true
  } catch (_) {
    return false
  }
}

// recursively create a directory and its parents(if they dont exist)
export async function mkdirp(folder: string) {
  if (await exists(folder)) {
    return
  }

  const stack = []
  let _folder = folder
  while ((_folder = join(_folder, '..'))) {
    if (await exists(_folder)) {
      break
    }

    stack.push(_folder)
  }

  for (const path of stack.reverse()) {
    await fs.mkdir(path)
  }

  await fs.mkdir(folder)
}

// readdir reads a directory recursively
export async function readdir(folder: string): Promise<string[]> {
  const files = await fs.readdir(folder)
  const result = await Promise.all(
    files.map(async file => {
      const path = join(folder, file)
      if (!(await fs.stat(path)).isFile()) {
        return await readdir(path)
      }

      return path
    })
  )

  return result.flat()
}
