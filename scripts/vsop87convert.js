/**
 * converts VSOP87 data to js
 */

'use strict'

const fs = require('fs')
const path = require('path')
const serialize = require('serialize-to-js').serializeToModule
const {VSOP} = require('../lib/vsop87')

const config = {
  attic: path.resolve(__dirname, '../attic'),
  dirname: path.resolve(__dirname, '../data')
}

// planet names in VSOP87 files
const planets = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune'
]
const type = 'B'

main()

function main () {
  planets.forEach(function (planet) {
    convertPlanet(planet)
  })
}

function filename (planet) {
  return path.resolve(config.dirname,
    'vsop87' + type + planet + '.js'
  )
}

function convertPlanet (planet) {
  console.log('converting ' + planet)
  var v = new VSOP(planet, config.attic, {type: type})
  v.loadSync()
  var o = v.getData()
  o.name = planet
  var data = serialize(o, {})
  fs.writeFileSync(filename(planet), data, 'utf8')
}
