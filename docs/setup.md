# Setup

Trough this section we're going to cover how to setup a quercia project either
from scratch or how integrate it into an existing project.

## Pre requirements

As outlined in the [Introduction](/) the project is built upon `react` and
`webpack` so these are some minimum requirements:

- `node >= 10`
- Either [`npm`](https://www.npmjs.com/) or [`yarn`](https://yarnpkg.com/)

For the backend we will offer various libraries, but for now we only support
`Go`, you should also install so`go >= 1.13`(this version is required for its
native module support)

## Installation

The library is available from `npm` under the `@quercia` organization. To
package your pages you'll need to install the `cli` package, which holds the
compiler and also the client-side runtime libraries `@quercia/quercia` and
`@quercia/runtime`. To get it run one of these two commands:

We also install `react` and `react-dom` as quercia doesn't ship with a fixed
version of react but gives you the option to use your favourite. Do note tough
that quercia depends on the `hooks` api and therefore requires at least
`react >= 16.8`

```sh
npm install -S -D @quercia/cli
npm install -S react ract-dom
```

or if you prefer to sue `yarn`:

```sh
yarn add -D @quercia/cli
yarn add react ract-dom
```

## Project structure

To setup the basic project structure we'll need to create a few folders first:

```sh
mkdir pages routes
```

You'll also want to add these two scripts to your `package.json` so that you can
run the `quercia` command line from `npm` or `yarn`:

```json
{
  "scripts": {
    "dev": "quercia -w",
    "build": "quercia -m=production"
  }
}
```

And lastly we'll also create an `index.jsx` page inside `pages`. For the sake of
this example we'll render an `Hello World!` inside a `<div>`:

```tsx
import * as React from 'react'

export default () => <div>Hello World!</div>
```

::: tip

quercia by default supports `typescript` and modern javascript via `babel`'s
`preset-env` and `typescript` presets. Also `jsx` syntax is available thanks to
the `react` preset.

:::

## Final steps

Now that you have a basic example set-up you can run the development server
with:

`npm run dev` or `yarn dev`

and bundle the application for production with:

`npm run build` or `yarn buid`

The quercia dev environment will now be setup, so you can start rendering your
pages form the backend of your choice. For example you read the
[`go` backend docs](/backends/go).
