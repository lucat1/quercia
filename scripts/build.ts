import { getPackages } from './packages'
import { spawn } from './spawn'

async function main() {
  const pkgs = await getPackages()
  for (const pkg of pkgs) {
    await spawn('build', pkg)
  }
}

main()
