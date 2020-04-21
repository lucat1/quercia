# `@quercia/runtime`

This package is only bundled internally in each and every build of a quercia
application. It is used to bootstrap the app shell on the client side and
handles components such as page routing and head management.

The API surface is non-existant, and this module should **never** be imported
outside of the `_document` and `_app` pages. In these pages it can be used to
overwrite default functionality, such as the document markup or the `_app` which
essentially wraps up every page.

## Exported Fields

The module consists mainly of react components and two typescript `interface`s
holding the default props for the default `<App />` and `<Document />`
components.

### QuerciaHead

It's a react component used to render the `<head>` html element and can recieve
children to be inserted statically before the prerender and render phases.

### QuerciaMount

It's yet another react component but does not accept any children/props. Its
only job is to render a `<div>` where the react application will be rendered.

### QuerciaScripts

It's yet another react component but does not accept any children/props. Its
only job is to render a placeholder (`__QUERCIA__SCRIPTS__`) where scripts will
be inserted by the backend at render time on the server.

### DocumentProps & AppProps

There two interfaces are the default props recieved by these components both at
prerender and render time(on the server and on the client).

<<< @/@quercia/runtime/src/props.ts
