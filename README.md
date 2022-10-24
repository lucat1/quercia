<p align="center">
  <b>quercia</b><br>
  A modern approach to monolith applications based on react
</p>

<p align="center">
  <!-- @quercia/runtime size -->
  <a href="https://bundlephobia.com/result?p=@quercia/runtime">
    <img src="https://badgen.net/bundlephobia/minzip/@quercia/runtime"
      alt="@quercia/runtime size" />
  </a>
  <!-- Discord chat -->
  <a href="https://discord.gg/CBZKbf">
    <img src="https://img.shields.io/discord/702086867776045166"
      alt="Discord chat" />
  </a>
</p>

<a href="https://unsplash.com/photos/tLSu12Rv1jQ"><img  src="https://images.unsplash.com/photo-1568654792529-d6f9f8a1c231?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" align="right" alt="An oakwood tree"  width="400px"></a>

`quercia` is a javascript framework based on the [react](https://reactjs.org)
view library inspired by other popular options like `nextjs`. The aim of the
project is to enable the amazing DX of these aforementioned tools while using a
non-javascript backend, such as Go, Ruby or PHP.

#### features:

- filesystem-based page routing

- zero-config support for modern JS and typescript

- pages are statically rendered at build time (SSG)

- dev mode with HMR and React Fast Refresh

- lightweight and extensible client-side routing

- any language with a JSON parser can be used to render a `quercia` page

#### current backends:

- `go` - inside this repository

> if you'd like to create a backend for your language of choice you can follow
> the guides in the `internal` section in our docs, or join our Discord server
> and get some help there!

#### quick start

If you want to get a quercia app up and running go ahead and clone one of our
examples with [degit](https://github.com/Rich-Harris/degit).

```sh
$ npx degit lucat1/quercia-examples/basic # or `basic-ts` or `with-preact`
```

These examples don't require any backend code, as they use the `@quercia/mock`
library to serve the application from sample data defined in the `mocks`
folders. This way even front-end developers, whithout any knowledge of the
backend code, can develop a quercia application. You can learn more about the
mocking system in the docs.

#### setup

You can read our documentation on [netlify](https://zen-benz-446b1a.netlify.com)
for a quick introduction and setup instruction. For any question feel free to
join our Discord server and ask there.

#### why `quercia`?

_quercia_ is the italian word for `oak tree`. The branches of an oak might
resemble what your monolith application structure looks like on the filesystem.
