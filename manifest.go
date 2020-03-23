package quercia

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path"
)

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

// manifestType is the type for the parsed manifest
type manifestType map[string]interface{}

var (
	// used in production, we only wanna parse the manifest once
	parsed   bool
	manifest manifestType

	// in production we cache all js modules
	// in memory for faster serving of content
	assets map[string][]byte
)

func loadManifest() {
	src, err := read(path.Join(root, "manifest.json"))
	if err != nil {
		log.Fatal("Could not parse manfiest " + err.Error())
	}

	// clear the previous manifest, if any
	manifest = manifestType{}
	err = json.Unmarshal(src, &manifest)
	if err != nil {
		log.Fatal("Could not parse manifest.json " + err.Error())
	}

	if !dev {
		// cache all webpack outputs in memory
		for key, value := range manifest {
			if key == "pages" {
				_pages := manifest[key].(map[string]interface{})
				for k, v := range _pages {
					assets[k] = must(read(path.Join(root, v.(string))))
				}
			}

			assets[key] = must(read(path.Join(root, value.(string))))
		}
	}
}

func must(res []byte, err error) []byte {
	if err != nil {
		log.Fatal("Could not read asset/page file " + err.Error())
	}

	return res
}
