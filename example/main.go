package main

import (
	"fmt"
	"net/http"

	"github.com/lucat1/quercia"
)

func main() {
	quercia.Init("__quercia", false)
	f := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/":
			quercia.Render(w, r, "index", quercia.Props{})
		case "/test":
			quercia.Render(w, r, "nested/test", quercia.Props{})

		default:
			quercia.Render(w, r, "404", quercia.Props{
				"path": r.URL.Path,
			})
		}
	})

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", quercia.Middleware(f))
}
