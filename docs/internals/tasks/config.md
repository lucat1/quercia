# Config

The `config` task is used to parse the user-provided configuration (if
available) and generate the webpack config for the `client` and `server`
targets. If [`Structure`](structure)`.paths.config` is not `null` the task tries
to load the configuration file at the resolved path(from the previous task), and
saves its value inside the `rc` property.

## public `Config` data

The `Config Task` implements the `IConfig` interface, which describes all
exported values. The instance is accessible via `quercia.tasks.config`.

<<< @/@quercia/cli/src/tasks/iconfig.ts{13}
