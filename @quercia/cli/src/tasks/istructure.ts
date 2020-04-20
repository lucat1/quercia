export interface Pages {
  [key: string]: string
}

export interface Paths {
  root: string
  pages: string | null
  config: string | null
  tsconfig: string | null
  runtime: string
}

export default interface IStructure {
  // paths used by the quercia compiler
  paths: Paths

  // list of pages to be bundled
  pages: Pages
}
