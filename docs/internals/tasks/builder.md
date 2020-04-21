# Builder

The builder task can be either the [watch](#watch) or the [build](task). The key
difference is that `watch` runs the webpack compiler in watch mode, watching for
changes and enabling `hot-loading` capabilities. Here we'll analyze their APIs
in greater detail:

## Watch

Spins up the `webpack` compiler in watch mode and uses a configuration built for
speed and DX experience, focusing on live reloading and speed of bundling. The
`Watch Task\ implements the`IWatch`interface, which describes all exported values. The instance is accessible via`quercia.tasks.watch`.

<<< @/@quercia/cli/src/tasks/iwatch.ts
