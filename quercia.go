package quercia

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

const (
	// header to denote that the request should be answered with json
	querciaHeader = "X-Quercia"

	// the prefix used for HTTP requests and filesystem out folder
	querciaPrefix = "/__quercia/"

	// html placeholders
	querciaHead      = "__QUERCIA__HEAD__"
	querciaPrerender = "__QUERCIA_PRERENDER__"
	querciaScripts   = "__QUERCIA__SCRIPTS__"

	// html and json mime types (required for the two kinds of renders we can do)
	htmlMime = "text/html; charset=utf-8"
	jsonMime = "application/json"

	tmpl = `
		<html>
			<head>__QUERCIA__HEAD__</head>
			<body>
				<div id="__quercia">__QUERCIA_PRERENDER__</div>
				__QUERCIA__SCRIPTS__
			</body>
		</html>
	`
)

var (
	// the http directory used to fetch the manifest.json file
	// can be set using SetDir (has to be most of the times)
	dir = http.Dir("." + querciaPrefix)

	// template is a stripped and optimized version of `tmpl`
	template = strings.Replace(strings.Replace(tmpl, "\n", "", -1), "\t", "", -1)
)

// struct describing the `manifest.json`
type manifest struct {
	Pages     map[string]string `json:"pages"`
	Vendor    map[string]string `json:"vendor"`
	Prerender map[string]string `json:"prerender"`
}

// struct describing the `prerener` value inside jsonRenderData
type prerenderData struct {
	Partial [2]string `json:"partial"`
	Full    [2]string `json:"full"`
}

// struct describing the data inside a template render
type renderData struct {
	Page  string      `json:"page"`
	Props interface{} `json:"props"`
}

// struct describing the data inside a json render
type jsonRenderData struct {
	renderData

	Script    string    `json:"script"`
	Prerender [2]string `json:"prerender"`
}

// Props is the type for the data structure to give quercia renderer
// in order to give data to the react application
//
// This type is not mandatory. You can safely use your existing/custom structs
type Props map[string]interface{}

// SetDir sets the directory the quercia renderer will
// use to fetch the data for assets urls (aka rendering)
func SetDir(d http.Dir) {
	dir = d
}

// readFile reads a file using from the `http.Dir` at the requested path
// this helper is used in lots of places, among with loadManfiest, loadTemplate, loadPrerender
func readFile(path string) ([]byte, error) {
	file, err := dir.Open(path)
	if err != nil {
		return nil, err
	}

	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	return data, nil
}

// readJSONFile reads a file using the `readFile` api and puts its contents
// into the given `v` arguments, which should be a json serializable struct
func readJSONFile(path string, v interface{}) error {
	data, err := readFile(path)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(data, v); err != nil {
		return err
	}

	return nil
}

// loadManifest loads the quercia manifest and has 3 main failure points
// failures are not allowed, the manifest is the minimum requirement for
// page rendering and therefore we will panic if some of there operations fail
// failure points:
// - dir.Open fails, file does not exist
// - ioutil.ReadAll cannot read the file, I/O error
// - json.Unmarshal fails, the json is corrupted
func loadManfiest() manifest {
	var man manifest
	if err := readJSONFile("manifest.json", &man); err != nil {
		panic(err)
	}

	return man
}

// loadTemplate tries to load the `template.html` file if
// it exists, otherwhise falls back to the included `template` const
func loadTemplate() string {
	data, err := readFile("template.html")
	if err != nil {
		return template
	}

	return string(data)
}

// script returns an HTML script element linked to the provided url
func script(src string) string {
	return `<script src="` + querciaPrefix + src + `"></script>`
}

// stringify turns a struct into a json string and handles marshaling(encoding)
// errors gracefully
func stringify(data interface{}) []byte {
	json, err := json.Marshal(data)
	if err != nil {
		json = []byte(`{"error":"` + err.Error() + `"}`)
	}

	return json
}

// data returns an HTML script element containing the JSON encoded data
func data(data interface{}) string {
	json := stringify(data)

	return `<script id="__QUERCIA_DATA__" type="application/json" crossorigin="anonymous">` + string(json) + `</script>`
}

func loadPrerender(man manifest, page string) (data prerenderData) {
	// the page is not prerendered for some reason
	if man.Prerender[page] == "" {
		return
	}

	// read from the filesystem the prerendered data
	if err := readJSONFile(man.Prerender[page], &data); err != nil {
		return
	}

	// if we don't have any errors we can safely return the data
	// and be confident we have read it
	return
}

// handles roughly the errors following the missing of a requested page to be rendered
func failOnUnkownPage(man manifest, page string) {
	// if the page url does not exist we will panic
	// this is not handled gracefully because it should
	// be caught at development time and never happen in production
	if man.Pages[page] == "" {
		panic("The requested page `" + page + "` is not defined inside the manifest")
	}
}

// Render renders the requested page with the given props. It also appens to the
// template the prerendered data of the page if available. If the request contains
// the `X-Quercia` header the page will return a json respose carrying the props
// for the next page render, the script url and a prerendered string of the next page
// to be displayed while loading the script (and its possible dependencies) by the client
func Render(w http.ResponseWriter, r *http.Request, page string, props interface{}) {
	// just skip to the json rendering (read above)
	if r.Header.Get(querciaHeader) != "" {
		renderJSON(w, r, page, props)
		return
	}

	manifest := loadManfiest()
	template := loadTemplate()
	prerender := loadPrerender(manifest, page)

	failOnUnkownPage(manifest, page)

	// alias all required filds for easy access
	// there are all urls to javascript files
	webpack := manifest.Vendor["webpack-runtime"]
	vendor := manifest.Vendor["vendor"]
	runtime := manifest.Vendor["runtime"]

	// the page source
	pageSrc := manifest.Pages[page]

	// construct the data to be put inside the script tag (json encoded)
	rdata := renderData{
		Page:  page,
		Props: props,
	}

	// begin building the scripts
	scripts := data(rdata)
	scripts += script(webpack)
	scripts += script(vendor)

	// if we have a custom _app we should use it
	if manifest.Pages["_app"] != "" {
		scripts += script(manifest.Pages["_app"])
	}

	scripts += script(pageSrc)
	scripts += script(runtime)

	// replace head, prerender and scripts sections
	template = strings.Replace(template, querciaHead, prerender.Full[0], 1)
	template = strings.Replace(template, querciaPrerender, prerender.Full[1], 1)
	template = strings.Replace(template, querciaScripts, scripts, 1)

	w.Header().Add("Content-Type", htmlMime)
	w.Write([]byte(template))
}

// renders a page in json. We just provide the page props, the script url,
// the prerendered data of the page and nothing more
func renderJSON(w http.ResponseWriter, r *http.Request, page string, props interface{}) {
	manifest := loadManfiest()
	prerender := loadPrerender(manifest, page)

	failOnUnkownPage(manifest, page)

	json := stringify(jsonRenderData{
		renderData: renderData{
			Page:  page,
			Props: props,
		},
		Prerender: prerender.Partial,
		Script:    querciaPrefix + manifest.Pages[page],
	})

	w.Header().Add("Content-Type", jsonMime)
	w.Write(json)
}
