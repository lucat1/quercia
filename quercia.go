package dev

import (
	"log"
	"path"
	"strings"

	"github.com/lucat1/quercia/shared"
)

var (
	// whether we are running in development mode
	dev = true

	// the html template to render pages
	template = shared.Template

	// the root of the project, where to fetch
	// the manifest and all other files
	root string
)

func init() {
	cwd, err := os.getwd()
	if err != nil {
		panic(err)
	}

	root = path.Join(cwd, "__quercia")
}

func SetDev(d bool) {
	dev = d

	if dev {
		log.Println("INFO: running quercia in development mode")
	}
}

// SetTemplate sets the HTML template used to render the page
// during development mode we have additional checks to see if
// all the variables are present inside the template(we emit warning otherwhise)
func SetTemplate(tmpl string) {
	if dev {
		// do a bunch of checks first
		checks := []string{shared.QuerciaPage}
		for _, check := range checks {
			if !strings.Contains(tmpl, check) {
				log.Println("WARN: the provided templade doesn't include the '" + check + "' placeholder")
			}
		}
	}

	template = tmpl
}

func parseManifest() {

}
