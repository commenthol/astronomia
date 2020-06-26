var deltat = require('./deltat.js')
var earth = require('./vsop87Bearth.js')
var jupiter = require('./vsop87Bjupiter.js')
var mars = require('./vsop87Bmars.js')
var mercury = require('./vsop87Bmercury.js')
var neptune = require('./vsop87Bneptune.js')
var saturn = require('./vsop87Bsaturn.js')
var uranus = require('./vsop87Buranus.js')
var venus = require('./vsop87Bvenus.js')

module.exports = {
  deltat: deltat,
  earth: earth,
  jupiter: jupiter,
  mars: mars,
  mercury: mercury,
  neptune: neptune,
  saturn: saturn,
  uranus: uranus,
  venus: venus,
  vsop87Bearth: earth,
  vsop87Bjupiter: jupiter,
  vsop87Bmars: mars,
  vsop87Bmercury: mercury,
  vsop87Bneptune: neptune,
  vsop87Bsaturn: saturn,
  vsop87Buranus: uranus,
  vsop87Bvenus: venus,
}
