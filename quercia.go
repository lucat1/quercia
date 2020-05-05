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

	// html placeholder
	querciaScripts = "__QUERCIA__SCRIPTS__"

	// html and json mime types (required for the two kinds of renders we can do)
	htmlMime = "text/html; charset=utf-8"
	jsonMime = "application/json"
)

var (
	// the http directory used to fetch the manifest.json file
	// can be set using SetDir (has to be most of the times)
	dir = http.Dir("." + querciaPrefix)
)

// struct describing the `manifest.json`
type manifest struct {
	Pages     map[string][]string `json:"pages"`
	Vendor    map[string]string   `json:"vendor"`
	Prerender map[string]string   `json:"prerender"`
}

// struct describing the data inside a template render
type renderData struct {
	Page  string      `json:"page"`
	Props interface{} `json:"props"`
}

// struct describing the data inside a json render
type jsonRenderData struct {
	renderData

	Scripts  []string `json:"scripts"`
	Redirect string   `json:"redirect"`
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
func loadTemplate(path string) string {
	data, err := readFile(path)
	if err != nil {
		return "404 - Could not fetch template for page `" + path + "`"
	}

	return string(data)
}

// script returns an HTML script element linked to the provided url
func script(src string) string {
	return `<script src="` + querciaPrefix + src + `"></script>`
}

// scripts generates multiple script imports
func scripts(srcs []string) string {
	res := ""
	for _, src := range srcs {
		res += script(src)
	}

	return res
}

// prefixes a slice of strings all with the same prefix
func prefix(pref string, srcs []string) []string {
	res := []string{}
	for _, src := range srcs {
		res = append(res, pref+src)
	}

	return res
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

// handles roughly the errors following the missing of a requested page to be rendered
func failOnUnkownPage(man manifest, page string) {
	// if the page url does not exist we will panic
	// this is not handled gracefully because it should
	// be caught at development time and never happen in production
	if len(man.Pages[page]) == 0 {
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
		renderJSON(w, r, "", page, props)
		return
	}

	manifest := loadManfiest()

	failOnUnkownPage(manifest, page)

	// alias all required filds for easy access
	// there are all urls to javascript files
	polyfills := manifest.Vendor["polyfills"]
	webpack := manifest.Vendor["webpack-runtime"]
	vendor := manifest.Vendor["vendor"]
	runtime := manifest.Vendor["runtime"]

	// the page source
	pageSrc := manifest.Pages[page]
	templateSrc := manifest.Prerender[page]

	// load the prerendered page template
	template := loadTemplate(templateSrc)

	// construct the data to be put inside the script tag (json encoded)
	rdata := renderData{
		Page:  page,
		Props: props,
	}

	// begin building the scripts
	_scripts := data(rdata)
	_scripts += `<script nomodule src="` + querciaPrefix + polyfills + `"></script>`
	_scripts += script(webpack)
	_scripts += script(vendor)

	// if we have a custom _app we should use it
	if len(manifest.Pages["_app"]) != 0 {
		_scripts += scripts(manifest.Pages["_app"])
	}

	_scripts += scripts(pageSrc)
	_scripts += script(runtime)

	// replace scripts sections
	template = strings.Replace(template, querciaScripts, _scripts, 1)

	w.Header().Add("Content-Type", htmlMime)
	w.Write([]byte(template))
}

// renders a page in json. We just provide the page props, the script url,
// the prerendered data of the page and nothing more
func renderJSON(w http.ResponseWriter, r *http.Request, redirect string, page string, props interface{}) {
	manifest := loadManfiest()

	failOnUnkownPage(manifest, page)

	json := stringify(jsonRenderData{
		renderData: renderData{
			Page:  page,
			Props: props,
		},
		Scripts:  prefix(querciaPrefix, manifest.Pages[page]),
		Redirect: redirect,
	})

	w.Header().Add("Content-Type", jsonMime)
	w.Write(json)
}

// Redirect redirects the request to another page. If the request has been made
// by an HTML client you may aswell just use `http.Redirect` but this is wraps
// arround the native go api and also handles the JSON-based requests that the
// quercia client may send. If there quest does NOT contain the `X-Quercia` header
// we just use a default Redriect, otherwhise we answer with JSON and the
// transition is handled by the client in javascript
//
// If you want a normal redirect ignoring JSON requests you could use the `http.Redirect`
// or pass `""`(an empty string) as the `page` parameter ex. `quercia.Redirect(w, r, "/test", "", nil)`
func Redirect(w http.ResponseWriter, r *http.Request, url string, page string, props interface{}) {
	// redirect if the request is not json-based
	if r.Header.Get(querciaHeader) == "" {
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)
		return
	}

	if page != "" {
		renderJSON(w, r, url, page, props)
	}
}
