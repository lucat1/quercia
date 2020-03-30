import { join } from 'path'
import { promises as fs } from 'fs'

// mkdir creates a folder at the given path if ti does
// not exist. Erorrs if the path is a file
export async function mkdir(path: string) {
  try {
    const stat = await fs.stat(path)
    if (stat.isFile()) {
      console.error('File at `' + path + '` should be a folder!')
      process.exit(1)
    }
  } catch (_) {
    await fs.mkdir(path)
  }
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

// rm removes the given folder/file
export async function rm(path: string) {
  const stat = await fs.stat(path)
  if (stat.isFile()) {
    return await fs.unlink(path)
  }

  // recursively remove all child folders/files
  const children = await fs.readdir(path)
  await Promise.all(children.map(child => rm(join(path, child))))
  await fs.rmdir(path)
}
