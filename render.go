package quercia

import (
	"encoding/json"
	"net/http"
	"path"
	"strings"
)

// Props is the data given to the rendered page
type Props = map[string]interface{}

type pageData struct {
	Page      string `json:"page"`
	Props     Props  `json:"props"`
	Script    string `json:"script"`
	Prerender string `json:"prerender"`
}

// Render renders a template in react with the given props
func Render(w http.ResponseWriter, r *http.Request, page string, props Props) {
	// in production only parse the manifest once
	// in development on reach render request
	if !parsed || dev {
		loadManifest()
	}

	// render the template if we have a normal request
	if r.Header.Get("X-Quercia") == "" {
		renderTemplate(w, r, page, props)
		return
	}

	pages := manifest["pages"].(map[string]interface{})
	prerenders := manifest["prerender"].(map[string]interface{})
	data, err := json.Marshal(pageData{
		Page:      page,
		Props:     props,
		Script:    "/__quercia/" + pages[page].(string),
		Prerender: string(assets[prerenders[page].(string)]),
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

	pages := manifest["pages"].(map[string]interface{})
	pageSrc := pages[page]
	webpack := assets[manifest["webpack-runtime"].(string)]
	vendor, runtime := manifest["vendor"].(string), manifest["runtime"].(string)

	// during development we should load the webpack
	// loader on every request
	if len(webpack) == 0 && dev {
		file := manifest["webpack-runtime"].(string)
		webpack = must(read(path.Join(root, file)))
	}

	res := strings.Replace(template, "__INSERT_QUERCIA_DATA__", string(data), 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_WEBPACK_RUNTIME__", string(webpack), 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_VENDOR__", vendor, 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_PAGE__", pageSrc.(string), 1)
	res = strings.Replace(res, "__INSERT_QUERCIA_RUNTIME__", runtime, 1)

	w.Header().Add("Content-Type", "text/html")
	w.Write([]byte(res))
}
