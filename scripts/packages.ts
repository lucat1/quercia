import { getPackages as get, Package } from '@manypkg/get-packages'

let cache: Package[] = null

export async function getPackages(): Promise<Package[]> {
  if(cache != null) {
    return cache
  }

  const { tool, packages } = await get(process.cwd())
  const pkgs = packages.filter(pkg => !pkg.packageJson.private)
  console.log(`found ${pkgs.length} packages (tool: ${tool})`)
  
  for(const pkg of pkgs) {
    console.log(`\t${pkg.packageJson.name}`)
  }
  console.log('')

  cache = pkgs
  return pkgs
}