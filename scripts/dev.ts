import { spawn } from 'child_process'

import { getPackages } from './packages'

async function main() {
  const pkgs = await getPackages()
  for(const pkg of pkgs) {
    const child = spawn('yarn', ['dev'], {
      cwd: pkg.dir
    })

    for(const pipe of ['stdout', 'stderr']) {
      // whether the previous data ended with a \n
      let nl = true
      child[pipe].on('data', (_data: Buffer) => {
        const data = _data.toString()
        if(nl) {
          process[pipe].write(`${pkg.packageJson.name} ~ ${data}`)
          nl = false
        } else {
          process[pipe].write(data)
          if(data.endsWith('\n')) {
            nl = true
          }
        }
      })
    }
    process.stdin.pipe(child.stdin)
  }
}

main()