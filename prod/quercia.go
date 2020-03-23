package dev

import (
	"log"
	"strings"

	"github.com/lucat1/quercia/shared"
)

var template = shared.Template

// SetTemplate sets the HTML template used to render the page
func SetTemplate(tmpl string) {
	template = tmpl
}
