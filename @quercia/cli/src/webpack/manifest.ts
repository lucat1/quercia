export default interface Manifest {
  pages: {
    [key: string]: string[]
  }

  prerender: {
    [key: string]: string
  }

  vendor: {
    [Key in VendorChunk]: string
  }
}

export type VendorChunk = 'webpack-runtime' | 'vendor' | 'runtime' | 'polyfills'
