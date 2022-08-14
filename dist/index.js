
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./axette.cjs.production.min.js')
} else {
  module.exports = require('./axette.cjs.development.js')
}
