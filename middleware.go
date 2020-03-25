package quercia

import (
	"net/http"
	"path"
)

var handler http.Handler = nil

// Middleware handles the serving of the static website assets
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// during development just use a static file server
		// from the native go implementation
		if dev {
			if handler == nil {
				fs := http.FileServer(http.Dir(root))
				handler = http.StripPrefix("/__quercia/", fs)
			}

			if isQuercia(r.URL.Path) {
				handler.ServeHTTP(w, r)
				return
			}

			next.ServeHTTP(w, r)
			return
		}

		// during production serve the assets cached in memory
		if !isQuercia(r.URL.Path) {
			// if the url is not a quercia path we just move on
			next.ServeHTTP(w, r)
			return
		}

		path := r.URL.Path[11:]

		if len(assets[path]) == 0 {
			// if it's not a cached file we just go to the next handler
			next.ServeHTTP(w, r)
			return
		}

		writeWithMime(w, assets[path], path)
	})
}

func isQuercia(url string) bool {
	return len(url) > 12 && url[:11] == "/__quercia/"
}

func writeWithMime(w http.ResponseWriter, data []byte, file string) {
	switch path.Ext(file) {
	case "js":
		w.Header().Set("Content-Type", "application/javascript")

	case "css":
		w.Header().Set("Content-Type", "text/css")

	case "wasm":
		w.Header().Set("Content-Type", "application/wasm")
	}

	w.Write(data)
}
