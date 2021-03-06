# @quercia/cli

## 0.5.4

### Patch Changes

- chore: bump dependecy to fix security vulnerability

## 0.5.3

### Patch Changes

- fix: chunk splitting

## 0.5.2

### Patch Changes

- fix: improve chunk splitting

## 0.5.1

### Patch Changes

- fix: increase lib target threshold

## 0.5.0

### Minor Changes

- feat: reproducible chunk hashes on libs/shared modules

## 0.4.1

### Patch Changes

- feat(cli): swap out buildID for chunk hashes

## 0.4.0

### Minor Changes

- [`4e68520`](https://github.com/lucat1/quercia/commit/4e68520cb1d420178bcac3f2b24d44d391fb0409)
  Thanks [@lucat1](https://github.com/lucat1)! - perf(all): change webpack
  optimization and properly load polyfills with babel

* [`4bd612e`](https://github.com/lucat1/quercia/commit/4bd612e207bfe93730b5cd9d1c1e2c3ed8d2da5d)
  Thanks [@lucat1](https://github.com/lucat1)! - add babel plugins to exclude
  ssg calls and improve hooks destructing

### Patch Changes

- [`2d75a47`](https://github.com/lucat1/quercia/commit/2d75a475b59fd48f6fc36f3ff4670d176bb7d889)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): include object-assing
  in all bundles with react

* [`65fa14b`](https://github.com/lucat1/quercia/commit/65fa14b6c5c742f8994f30fee439075f5d0f8b21)
  Thanks [@lucat1](https://github.com/lucat1)! - build(all): removed
  tiny-(warning|invariant) and fixed dev mode vendor chunk

- [`f55920f`](https://github.com/lucat1/quercia/commit/f55920f860bf76c5b2e827f62184f1c8b4a51698)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): remove Quercia\*
  exports from runtime as they are not used on the client side

* [`34aafd6`](https://github.com/lucat1/quercia/commit/34aafd6b4b7b6516da2a6d8536a37fae30f3d1a5)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): escape errors during
  prerender to be embedded in html

- [`82cf3e1`](https://github.com/lucat1/quercia/commit/82cf3e134f76bf9792abb3b3401cb1c8c406026c)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): properly update
  prerender during dev mode and only execute once

* [`c68575f`](https://github.com/lucat1/quercia/commit/c68575f224ec538391f28cb49bed27148cbbddea)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): dont bundle
  \_document in the client app

- [`fa25e53`](https://github.com/lucat1/quercia/commit/fa25e5343c8b54cec99189e4db909cbdee080aff)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): improve webpack
  split chunk config

* [`44aefb8`](https://github.com/lucat1/quercia/commit/44aefb812f2286caf670da8df30c455035815c03)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): add hmr only in watch
  mode

- [`03f7a6b`](https://github.com/lucat1/quercia/commit/03f7a6b0dfb3dac641023940dd2ed79069bfb178)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): improved babel
  optmization, removes ssg-only code with conditional ifs

* [`bace27d`](https://github.com/lucat1/quercia/commit/bace27d416923dcb7b91cc6a8aa760f363361af1)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(polyfills): build as a
  separate config

- [`745f3d6`](https://github.com/lucat1/quercia/commit/745f3d61dafde97e400013a6e1675b2ab2e075a5)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): split logging into a
  separate package

* [`114c8cd`](https://github.com/lucat1/quercia/commit/114c8cd0f30bdbb1cec53463578b557cbb915b0e)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): restrict
  react-hot-loader inclusion

- [`9f11770`](https://github.com/lucat1/quercia/commit/9f11770b30e3be84cc57133a0f54f6c91b132cc9)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): prerender on firstime
  in dev mode

- Updated dependencies
  [[`65fa14b`](https://github.com/lucat1/quercia/commit/65fa14b6c5c742f8994f30fee439075f5d0f8b21),
  [`4e68520`](https://github.com/lucat1/quercia/commit/4e68520cb1d420178bcac3f2b24d44d391fb0409),
  [`4bd612e`](https://github.com/lucat1/quercia/commit/4bd612e207bfe93730b5cd9d1c1e2c3ed8d2da5d)]:
  - @quercia/runtime@0.3.0
  - @quercia/logger@0.0.2

## 0.4.0-next.15

### Patch Changes

- [`c68575f`](https://github.com/lucat1/quercia/commit/c68575f224ec538391f28cb49bed27148cbbddea)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): dont bundle
  \_document in the client app

## 0.4.0-next.14

### Patch Changes

- feat(cli): split logging into a separate package

## 0.4.0-next.13

### Patch Changes

- [`f55920f`](https://github.com/lucat1/quercia/commit/f55920f860bf76c5b2e827f62184f1c8b4a51698)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): remove Quercia\*
  exports from runtime as they are not used on the client side
- Updated dependencies []:
  - @quercia/runtime@0.2.5-next.5

## 0.4.0-next.12

### Patch Changes

- build(all): removed tiny-(warning|invariant) and fixed dev mode vendor chunk

- Updated dependencies []:
  - @quercia/runtime@0.3.0-next.4

## 0.4.0-next.11

### Patch Changes

- [`44aefb8`](https://github.com/lucat1/quercia/commit/44aefb812f2286caf670da8df30c455035815c03)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): add hmr only in watch
  mode

## 0.4.0-next.10

### Patch Changes

- [`114c8cd`](https://github.com/lucat1/quercia/commit/114c8cd0f30bdbb1cec53463578b557cbb915b0e)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): restrict
  react-hot-loader inclusion

## 0.4.0-next.9

### Patch Changes

- [`fa25e53`](https://github.com/lucat1/quercia/commit/fa25e5343c8b54cec99189e4db909cbdee080aff)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): improve webpack
  split chunk config

## 0.4.0-next.8

### Patch Changes

- [`03f7a6b`](https://github.com/lucat1/quercia/commit/03f7a6b0dfb3dac641023940dd2ed79069bfb178)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): improved babel
  optmization, removes ssg-only code with conditional ifs

## 0.3.9-next.7

### Patch Changes

- Updated dependencies []:
  - @quercia/runtime@0.2.5-next.3

## 0.4.0-next.6

### Minor Changes

- add babel plugins to exclude ssg calls and improve hooks destructing

### Patch Changes

- Updated dependencies []:
  - @quercia/runtime@0.3.0-next.2

## 0.4.0-next.5

### Patch Changes

- fix(cli): prerender on firstime in dev mode

## 0.4.0-next.4

### Patch Changes

- [`82cf3e1`](https://github.com/lucat1/quercia/commit/82cf3e134f76bf9792abb3b3401cb1c8c406026c)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): properly update
  prerender during dev mode and only execute once

## 0.4.0-next.3

### Patch Changes

- [`2d75a47`](https://github.com/lucat1/quercia/commit/2d75a475b59fd48f6fc36f3ff4670d176bb7d889)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): include object-assing
  in all bundles with react

## 0.4.0-next.2

### Patch Changes

- [`bace27d`](https://github.com/lucat1/quercia/commit/bace27d416923dcb7b91cc6a8aa760f363361af1)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(polyfills): build as a
  separate config

- Updated dependencies []:
  - @quercia/runtime@0.2.5-next.1

## 0.4.0-next.1

### Patch Changes

- [`34aafd6`](https://github.com/lucat1/quercia/commit/34aafd6b4b7b6516da2a6d8536a37fae30f3d1a5)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): escape errors during
  prerender to be embedded in html

## 0.4.0-next.0

### Minor Changes

- [`4e68520`](https://github.com/lucat1/quercia/commit/4e68520cb1d420178bcac3f2b24d44d391fb0409)
  Thanks [@lucat1](https://github.com/lucat1)! - perf(all): change webpack
  optimization and properly load polyfills with babel

### Patch Changes

- Updated dependencies
  [[`4e68520`](https://github.com/lucat1/quercia/commit/4e68520cb1d420178bcac3f2b24d44d391fb0409)]:
  - @quercia/runtime@0.3.0-next.0

## 0.3.8

### Patch Changes

- [`152a56a`](https://github.com/lucat1/quercia/commit/152a56a6627603ef16818b4f01142ccc85e72d9a)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): properly handle
  promise rejections and prettify errors

* [`9c7aeb1`](https://github.com/lucat1/quercia/commit/9c7aeb15ae7353af680f52a3bae9283803c104ad)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): beautify ts-checker
  errors

- [`8e3bad8`](https://github.com/lucat1/quercia/commit/8e3bad89eef66ddcdb57d26824570f1b1bf29cf2)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): pretty logging

## 0.3.7

### Patch Changes

- [`f207291`](https://github.com/lucat1/quercia/commit/f20729199dca10865263f1b82a1733243e23bf10)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): add -s flag to
  output webpack stats

* [`4bb9646`](https://github.com/lucat1/quercia/commit/4bb96465a9eab74e59171978443e12ca03c3b93e)
  Thanks [@lucat1](https://github.com/lucat1)! - chore(all): add repository url
  and bugs issue tracker url

* Updated dependencies
  [[`4bb9646`](https://github.com/lucat1/quercia/commit/4bb96465a9eab74e59171978443e12ca03c3b93e)]:
  - @quercia/runtime@0.2.4

## 0.3.6

### Patch Changes

- [`5197c38`](https://github.com/lucat1/quercia/commit/5197c385af11ab65de8b08400144468fd7c96f0e)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(all): include async/await
  helpers, they cannot be imported from nodejs

- Updated dependencies
  [[`5197c38`](https://github.com/lucat1/quercia/commit/5197c385af11ab65de8b08400144468fd7c96f0e)]:
  - @quercia/runtime@0.2.3

## 0.3.5

### Patch Changes

- [`896fbd4`](https://github.com/lucat1/quercia/commit/896fbd4744387f555a45b289df25f7c486177698)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(all): don't execute babel
  on node_modules(revert last update) and make all packages depend on a
  lightweight async/await implementation
- Updated dependencies
  [[`896fbd4`](https://github.com/lucat1/quercia/commit/896fbd4744387f555a45b289df25f7c486177698)]:
  - @quercia/runtime@0.2.2

## 0.3.4

### Patch Changes

- [`773a81b`](https://github.com/lucat1/quercia/commit/773a81b895149f9456b2320b242e03af6f8c397a)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): transform async/await
  in node modules during production

## 0.3.3

### Patch Changes

- [`a10899f`](https://github.com/lucat1/quercia/commit/a10899fd2b9446e1ad258d9543ddfd916f8edc12)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): don't include babel's
  react-hot-loader in production, move from tsdx to preconstruct for smaller
  builds with babel
- Updated dependencies
  [[`a10899f`](https://github.com/lucat1/quercia/commit/a10899fd2b9446e1ad258d9543ddfd916f8edc12)]:
  - @quercia/runtime@0.2.1

## 0.3.2

### Patch Changes

- [`198ddf2`](https://github.com/lucat1/quercia/commit/198ddf2814b84d662d8550c4b7be95eb15c01f29)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): Add typescript
  typechecking when a `tsconfig.json` file is available

## 0.3.1

### Patch Changes

- [`a9b53c6`](https://github.com/lucat1/quercia/commit/a9b53c60e7513f530f9bdaff9bad4858da74dc62)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): add support for
  async/await via babel by default

## 0.3.0

### Minor Changes

- [`6094a1d`](https://github.com/lucat1/quercia/commit/6094a1d7132052578bde5143c1c68c4a11cf5f2c)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli, runtime): add
  react-hot-loader

### Patch Changes

- [`622b90c`](https://github.com/lucat1/quercia/commit/622b90c122c10f129f07dd25f93db5c527a7d952)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): Only add HMR in
  development mode

- Updated dependencies
  [[`6094a1d`](https://github.com/lucat1/quercia/commit/6094a1d7132052578bde5143c1c68c4a11cf5f2c)]:
  - @quercia/runtime@0.2.0

## 0.2.4

### Patch Changes

- [`e65855f`](https://github.com/lucat1/quercia/commit/e65855f741758c1de22220e8953f35641f21c7db)
  Thanks [@lucat1](https://github.com/lucat1)! - fix(cli): add dependency on
  sade

## 0.2.3

### Patch Changes

- [`d5cfe74`](https://github.com/lucat1/quercia/commit/d5cfe746346cfeab3193f826579551905e1f7fd4)
  Thanks [@lucat1](https://github.com/lucat1)! - feat(cli): remove oclif, make
  the cli smaller. Now using `sade`

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
