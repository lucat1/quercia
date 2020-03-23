import { spawn as childSpawn } from 'child_process'
import { Package } from '@manypkg/get-packages'

export async function spawn(script: string, pkg: Package) {
  const child = childSpawn('yarn', [script], { cwd: pkg.dir })

  for (const _pipe of ['stdout', 'stderr']) {
    // whether the previous data ended with a \n
    let nl = true
    const pipe: 'stdout' | 'stderr' = _pipe as any
    child[pipe].on('data', (_data: Buffer) => {
      const data = _data.toString()
      if (nl) {
        process[pipe].write(`${pkg.packageJson.name} ~ ${data}`)
        nl = false
      } else {
        process[pipe].write(data)
        if (data.endsWith('\n')) {
          nl = true
        }
      }
    })
  }
  process.stdin.pipe(child.stdin)
}
