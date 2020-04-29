// Taken from:
// https://github.com/zeit/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js

import 'core-js/modules/es.array.index-of'
import 'core-js/modules/es.array.map'
import 'core-js/modules/es.array.slice'
import 'core-js/modules/es.array.splice'
import 'core-js/modules/es.object.assign'
import 'core-js/modules/es.object.to-string'
import 'core-js/modules/es.promise'
import 'core-js/modules/es.array.concat'
import 'core-js/modules/es.array.filter'
import 'core-js/modules/es.array.from'
import 'core-js/modules/es.array.iterator'
import 'core-js/modules/es.array.reduce'
import 'core-js/modules/es.set'
import 'core-js/modules/es.string.iterator'
import 'core-js/modules/web.dom-collections.iterator'
import 'core-js/modules/es.array.filter'
import 'core-js/modules/es.array.for-each'
import 'core-js/modules/es.array.join'
import 'core-js/modules/es.array.map'
import 'core-js/modules/es.array.splice'
import 'core-js/modules/es.object.keys'
import 'core-js/modules/es.object.to-string'
import 'core-js/modules/es.regexp.to-string'
import 'core-js/modules/web.dom-collections.for-each'

// Specialized Packages:
import 'unfetch/polyfill'
import 'url-polyfill'
import assign from 'object-assign'
Object.assign = assign
