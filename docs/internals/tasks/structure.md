# Structure

This is the first task executed during the build/watch compilation process. Its
job is to map the structure of the project, locating the `root` of the
application, the `pages` folder, the `runtime` import path and all available
pages to be compiled.

## public `Structure` data

The `Structure Task` implements the `IStructure`, which describes all exported
values. The task holds the **absolute** paths used by all other compiler tasks
and external plugins.

The value is held inside the `Structure` instance. In a plugin you would access
it from `quercia.tasks.structure`

<<< @/@quercia/cli/src/tasks/istructure.ts{12}
