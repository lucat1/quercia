# @quercia/cli

## 0.2.2

### Patch Changes

- [`8751c53`](https://github.com/lucat1/quercia/commit/8751c5388c878088164436d7932fd2af640f8270)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): properly use the
  `src` argument

* [`fac2492`](https://github.com/lucat1/quercia/commit/fac24925292215844ed02795812389d49c9858fd)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli) fix HMR update path

- [`ce2d464`](https://github.com/lucat1/quercia/commit/ce2d46464f8448cfed11df9182ec199be220236d)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): add hot module
  replacement in watch mode

## 0.2.1

### Patch Changes

- [`83b1559`](https://github.com/lucat1/quercia/commit/83b15594a3d38292128c5e0221e267337e9b98fb)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): disable quirks mode
  during prerender

## 0.2.0

### Minor Changes

- [`9e2ef3b`](https://github.com/lucat1/quercia/commit/9e2ef3b520121b6dae517e9e5ff49ca4bfa1850e)
  Thanks [@lucat1](https://github.com/lucat1)! - breaking(cli): Prevent extra
  shared modules to be created. Only accept the vendor module and a single
  module for each page

## 0.1.8

### Patch Changes

- [`a1dc812`](https://github.com/lucat1/quercia/commit/a1dc81281c66cb4e49f9c875dfc5149d6681e57f)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): don't split common
  chunks in a `default` shared library, would cause errors because it does not
  get loaded in the go backend

## 0.1.7

### Patch Changes

- [`ff5d9f5`](https://github.com/lucat1/quercia/commit/ff5d9f543bb152fdf0d878ad3651372cbcd0ef36)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): publish update
  properly

## 0.1.6

### Patch Changes

- [`da8ca7c`](https://github.com/lucat1/quercia/commit/da8ca7c66d29d188b856a2780819f32dca77abc4)
  Thanks [@lucat1](https://github.com/lucat1)! - chore(cli): Provide `buildID`
  and `mode` to the configuration function

## 0.1.5

### Patch Changes

- [`d496751`](https://github.com/lucat1/quercia/commit/d496751f4ec5c43678694428164a986406a337b7)
  Thanks [@lucat1](https://github.com/lucat1)! - chore(cli): make all node
  module dependencies external

## 0.1.4

### Patch Changes

- [`56d8e96`](https://github.com/lucat1/quercia/commit/56d8e9672b8c087d89f1f4cad994583863f38068)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): resolve to absolute
  paths more modules and use a less-strict configuration for terser

* [`fa8abcb`](https://github.com/lucat1/quercia/commit/fa8abcb49d5980091d29debff33fcbfa8cdd4bf6)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): during the ssr build
  resolve react and other dependecies to an absolute path

- [`a07c562`](https://github.com/lucat1/quercia/commit/a07c562a08e3510414620ef5de8611cb63079822)
  Thanks [@lucat1](https://github.com/lucat1)! - internal(cli): fix a typo in
  the function name. May break plugin API

## 0.1.3

### Patch Changes

- [`07128b7`](https://github.com/lucat1/quercia/commit/07128b720fcfe9423da6f143f4b9350d1c00ff69)
  Thanks [@lucat1](https://github.com/lucat1)! - Properly generate
  oclif.manifest.json

## 0.1.2

### Patch Changes

- [`9ceec35`](https://github.com/lucat1/quercia/commit/9ceec3568a3d7956d5a4b249f62266bf6157cdae)
  [#1](https://github.com/lucat1/quercia/pull/1) Thanks
  [@lucat1](https://github.com/lucat1)! - Include a fix for the oclif
  manifest.json file

## 0.1.1

### Patch Changes

- [`cfeef9b`](https://github.com/lucat1/quercia/commit/cfeef9b5c1af180a250e76653a5efb6562f4dbda)
  Thanks [@lucat1](https://github.com/lucat1)! - Changed changesets
  configuration

- Updated dependencies
  [[`cfeef9b`](https://github.com/lucat1/quercia/commit/cfeef9b5c1af180a250e76653a5efb6562f4dbda)]:
  - @quercia/runtime@0.1.1

## 0.1.0

### Minor Changes

- 554cd70: Initial release

### Patch Changes

- Updated dependencies [554cd70]
  - @quercia/runtime@0.1.0
