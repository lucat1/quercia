# Introduction

Quercia is a framework laveraging the `react` UI library to build monolithic web
applications highly inspired by [`next`](https://nextjs.org). It enables you to
build the backend in your favourite language and talk to the client in an
effortless and familiar way.

## Why?

If you have ever used `next` or `nuxt`(vue counterpart) or `sapper`(svelte
counterpart) you have experienced the great comfort of the good 'ol
filesystem-based routing approach, coming from the examples of monoliths
application writte in languages like php or ruby, but also enjoying the latest
features of web development with cutting edge frameworks like `react` or `vue`.
The aim of quercia is to allow backend or full-stack developers to interact with
these new technologies while still providing a familiar experience.

## How?

With quercia you can write your `pages` routes in a declarativ way just like
with `next` but you also get the added comfort and speed of a backend in another
language, like `Go` for example. This could be a folder structure for a
`Go`-based project for example:

```sh{5,9}
├── __quercia         # this is where your compiled files will live
├── main.go
├── node_modules      # modules from npm
├── package.json
├── pages             # the pages folder holds your react routes
│   ├── _app.tsx      # a wrapper arround every page's element
│   ├── _document.tsx # a custom <html> base template
│   └── index.tsx
└── routes            # the routes folder holds your back-end rendering routes
    └── index.go
```

If you have ever used `next`, `nuxt` or `sapper` this will look very familiar to
you. Also if you have ever wrote code for languages like `php` this will make
you feel at home.

## Differences from [inertia](https://inertiajs.com)

Inertia is a great project, and I myself took a lot of inspiration from their
work, but there are some I whish were different:

- The choiche of using [`larvel-mix`](https://github.com/JeffreyWay/laravel-mix)
  for bundling
- The lack of a `Go` backend, which is the main language I use
- The way that `inertia` requires pages and builds the final bundled application
  (using an `import('./pages/*.js')`)

Also we have some improvements or new features added compared to `Inertia`:

- We support only one UI library which is `react` and offer "syntactic sugar"
  like the `_app` and `_document` pages, as opposed to modifying the
  `template.php` in Inertia
- A `webpack.config.js`-like configuration file(`quercia.config.js`)
- A `next`-like approach to pages bundling using a single chunk for each page,
  enabling more fine-grained optimizations
