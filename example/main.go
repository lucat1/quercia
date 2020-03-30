package main

import (
	"fmt"
	"net/http"

	"github.com/lucat1/quercia"
)

func main() {
	dir := http.Dir("./__quercia")
	http.Handle("/__quercia/", http.StripPrefix("/__quercia/", http.FileServer(dir)))

	// !!! required in most cases !!!
	// quercia.SetDir(dir)
	// !!! required in most cases !!!

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		quercia.Render(w, r, "nested/test", nil)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		quercia.Render(w, r, "404", nil)
	})

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", nil)
}
