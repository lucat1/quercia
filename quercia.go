package quercia

import (
	"log"
	"os"
	"path"
	"strings"
)

var (
	// whether we are running in development mode
	dev = true

	// the html template to render pages
	template = defaultTemplate

	// the root of the project, where to fetch
	// the manifest and all other files
	root string
)

func init() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal("Could not get working directory " + err.Error())
	}

	root = path.Join(cwd, "__quercia")
}

// SetRoot sets the root folder for the quercia compiled files
// by default it's PWD + "/__quercia"
func SetRoot(path string) {
	root = path
}

// SetDev sets the enviroment into development
// mode based on the given argument
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
		checks := []string{QuerciaPage}
		for _, check := range checks {
			if !strings.Contains(tmpl, check) {
				log.Println("WARN: the provided templade doesn't include the '" + check + "' placeholder")
			}
		}
	}

	template = tmpl
}
