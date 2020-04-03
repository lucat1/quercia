# `@quercia/cli`

This package is available on `npm` and contains the compiler command line
interface. It depends on both the client side libraries: `@quercia/runtime` and
`@quercia/quercia`. Its job is to handle the tasks of the build/watch process.

It contains only two subcommands: `watch` and `build`. They both execute the
`webpack` api in order to compile client and server side bundles for your
application. This process is split in several steps, called `task`s.

## List

List of tasks:
([github](https://github.com/lucat1/quercia/tree/master/@quercia/cli/src/tasks))

- [`structure`](tasks/structure)
- [`config`](tasks/config)
- `builder`: either one of [`build`](tasks/build) or [`watch`](tasks/watch)
- [`prerender`](tasks/prerender)

## Order

The tasks are executed in the order listed above. Between each task a bunch of
hooks are called, to give additional plugins access to the `quercia` compiler
API. Plugins can modify the configuration, change tasks logic, anything
essentially. We decided to use `tapable` for the hooks api as it's familiar for
people who are used to write `webpack` plugins, and after all the `cli` package
is a compiler just like webpack.

Head over to the [hooks](/internals/hooks) section for more information about
plugin development and hooks order.
