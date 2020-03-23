package prod

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path"
)

// Manifest is a go struct mimiking `__quercia/manifest.json`
type Manifest struct {
	Pages   map[string]string `json:"pages"`
	Webpack string            `json:"webpack-runtime"`
	Runtime string            `json:"runtime"`
	Vendor  string            `json:"vendor"`
}

var (
	// LoadedManifest is the latest loaded manifest file
	LoadedManifest Manifest

	// Cache is the cache of the manifest files
	Cache = map[string][]byte{}

	// Path is the path to the `__quercia` folder
	Path string

	// Dev tells if the renderer is running in development mode
	Dev bool
)

// Init initializes the quercia renderer. You should provide
// the proper path to your `__quercia` folder and the vool
// to enable/disable the development mode(false -> production)
func Init(path string, dev bool) error {
	Path = path
	Dev = dev

	if dev {
		// dont load anything, everything gets reloaded
		// on each request during development
		return nil
	}

	if err := parseManifest(); err != nil {
		return err
	}

	if err := loadInMemory(); err != nil {
		return err
	}

	return nil
}

func parseManifest() error {
	bytes, err := read(path.Join(Path, "manifest.json"))
	if err != nil {
		return err
	}

	return json.Unmarshal(bytes, &LoadedManifest)
}

func loadInMemory() error {
	webpack, err := read(path.Join(Path, LoadedManifest.Webpack))
	if err != nil {
		return err
	}
	Cache[LoadedManifest.Webpack] = webpack

	runtime, err := read(path.Join(Path, LoadedManifest.Runtime))
	if err != nil {
		return err
	}
	Cache[LoadedManifest.Runtime] = runtime

	vendor, err := read(path.Join(Path, LoadedManifest.Vendor))
	if err != nil {
		return err
	}
	Cache[LoadedManifest.Vendor] = vendor

	for _, page := range LoadedManifest.Pages {
		bytes, err := read(path.Join(Path, page))
		if err != nil {
			return err
		}
		Cache[page] = bytes
	}

	return nil
}

// read reads a file from the fs
func read(path string) (bytes []byte, err error) {
	file, err := os.Open(path)
	if err != nil {
		return
	}

	bytes, err = ioutil.ReadAll(file)
	if err != nil {
		return
	}

	return bytes, nil
}
