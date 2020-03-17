package quercia

import (
	"net/http"
	"path"
	"strings"
)

// Middleware handles the serving of the static website assets
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		url := strings.Replace(r.URL.Path, "/__quercia/", "", 1)

		if len(Cache[url]) != 0 {
			switch path.Ext(url) {
			case "js":
				w.Header().Set("Content-Type", "application/javascript")

			case "css":
				w.Header().Set("Content-Type", "text/css")

			case "wasm":
				w.Header().Set("Content-Type", "application/wasm")
			}

			w.Write(Cache[url])
		} else {
			next.ServeHTTP(w, r)
		}
	})
}
