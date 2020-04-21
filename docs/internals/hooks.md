# Hooks

The `@quercia/cli` uses the `tapable` library for creating `hooks` via which you
can interact with the building process and modify configuration, add
functionality(even in a blocking manner).

The hooks are defined inside the `quercia.ts` file in the source directory of
the `@quercia/cli` module. Here's the code itself, which also includes helpful
comments about the time-of-execution of each and every hook.

::: tip

The relevant lines are highlighted

:::

<<< @/@quercia/cli/src/quercia.ts{46-80}
