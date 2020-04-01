import { promises as fs } from 'fs'

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.stat(path)
    return true
  } catch (_) {
    return false
  }
}
