---
'@quercia/cli': patch
---

fix(cli): don't split common chunks in a `default` shared library, would cause
errors because it does not get loaded in the go backend
