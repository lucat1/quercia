# The `go` library

::: warning

This library requires `go >= 1.13` in order to be installed. It is shipped with
the native `go modules` feature, and we offer no official support for other
package managers.

:::

The generated documentation is available on
[`pkg.go.dev`](https://pkg.go.dev/github.com/lucat1/quercia).

## Installation

To get this library run this command inside the root of your monolith
application(where your `go.mod` is located):

```sh
go get -u github.com/lucat1/quercia
```

## Usage

Here is a minimal webserver example:

```go
package main

import (
	"fmt"
	"net/http"

	"github.com/lucat1/quercia"
)

func main() {
	dir := http.Dir("./__quercia")

	// serve the static files from the __quercia directory
	http.Handle("/__quercia/", http.StripPrefix("/__quercia/", http.FileServer(dir)))

	// not mandatory, but most of the times recomended.
	//
	// this sets the folder that quercia uses to fetch the `manifest.json` and
	// the prerendered files from. It defaults to `__quercia` but could not be correct
	quercia.SetDir(dir)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// render the `index` page with the given props
		// props can also be `nil` if no props are required
		quercia.Render(w, r, "index", quercia.Props{
		"message": "Hello World!",
		})
	})

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", nil)
}
```

## Exported methods

### `quercia.SetDir`

Set the `http.Dir` to be used when rendering to read the `manifest.json` files
and the `prerendered` folder. It is set to `__quercia` relative to the runtime
directory by default, but you should always set this to the same value of your
`http.Static` middleware. This method is also useful for those bundling the
output directory in their go binary, as these libraries ofter provide a struct
implementing `http.Dir`. See [pkger](https://github.com/markbates/pkger) if you
wanna go down that path.

### `quercia.Render`

Renders a page from the `manifest.json` with the given props. The props
_could_(not mandatory) be of type `quercia.Props` but that's just a syntactic
sugar for saying `map[string]interface{}`.

### `quercia.Redirect`

Performs a redirect to another url and page, with some props. If the request is
a custom `X-Quercia` request we handle it via JSON, otherwhise we just send a
`302` temprary redirect http status pointing to the new URL.
