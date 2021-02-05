/**
 * converts VSOP87 data to js
 */

'use strict'

const fs = require('fs')
const path = require('path')
const serialize = require('serialize-to-module')
const { VSOP } = require('../lib/vsop87')

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
let type = 'B'
main()

type = 'D'
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
  const v = new VSOP(planet, config.attic, { type: type })
  v.loadSync()
  const o = v.getData()
  o.name = planet
  o.type = type
  const data = serialize(o, {})
  fs.writeFileSync(filename(planet), data, 'utf8')
}
