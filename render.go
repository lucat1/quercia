package quercia

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Props is the data given to the rendered page
type Props = map[string]interface{}

type pageData struct {
	Page   string `json:"page"`
	Props  Props  `json:"props"`
	Script string `json:"script"`
}

// Render renders a template in react with the given props
func Render(w http.ResponseWriter, r *http.Request, page string, props Props) {
	// render the template if we have a normal request
	if r.Header.Get("X-Quercia") == "" {
		renderTemplate(w, r, page, props)
		return
	}

	data, err := json.Marshal(pageData{
		Page:   page,
		Props:  props,
		Script: "/__quercia/" + LoadedManifest.Pages[page],
	})
	if err != nil {
		panic(err)
	}

	// render only the json data if we got a quercia request
	w.Header().Add("Content-Type", "application/json")
	w.Write(data)
}

func renderTemplate(w http.ResponseWriter, r *http.Request, page string, props Props) {
	data, err := json.Marshal(pageData{
		Page:  page,
		Props: props,
	})
	if err != nil {
		panic(err)
	}

	pageSrc := LoadedManifest.Pages[page]
	webpack := Cache[LoadedManifest.Webpack]
	vendor, runtime := LoadedManifest.Vendor, LoadedManifest.Runtime

	res := strings.Replace(template, "__INSERT_QUERCIA_DATA__", string(data), 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_WEBPACK_RUNTIME__", string(webpack), 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_VENDOR__", vendor, 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_PAGE__", pageSrc, 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_RUNTIME__", runtime, 1)

	w.Header().Add("Content-Type", "text/html")
	w.Write([]byte(res))
}
