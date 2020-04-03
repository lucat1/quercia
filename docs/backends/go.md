# The `go` library

::: warning

This library requires `go >= 1.13` in order to be installed. It is shipped with
the native `go modules` feature, and we offer no official support for other
package managers.

:::

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
