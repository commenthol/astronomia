var deltat = require('./deltat.js')
var earth = require('./vsop87Bearth.js')
var jupiter = require('./vsop87Bjupiter.js')
var mars = require('./vsop87Bmars.js')
var mercury = require('./vsop87Bmercury.js')
var neptune = require('./vsop87Bneptune.js')
var saturn = require('./vsop87Bsaturn.js')
var uranus = require('./vsop87Buranus.js')
var venus = require('./vsop87Bvenus.js')
var earthD = require('./vsop87Dearth.js')
var jupiterD = require('./vsop87Djupiter.js')
var marsD = require('./vsop87Dmars.js')
var mercuryD = require('./vsop87Dmercury.js')
var neptuneD = require('./vsop87Dneptune.js')
var saturnD = require('./vsop87Dsaturn.js')
var uranusD = require('./vsop87Duranus.js')
var venusD = require('./vsop87Dvenus.js')
var elpMppDe = require('./elpMppDe.js')
var elpMppDe = require('./elpMppDe.js')
var elpMppDeFull = require('./elpMppDeFull.js')

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
  vsop87Dearth: earthD,
  vsop87Djupiter: jupiterD,
  vsop87Dmars: marsD,
  vsop87Dmercury: mercuryD,
  vsop87Dneptune: neptuneD,
  vsop87Dsaturn: saturnD,
  vsop87Duranus: uranusD,
  vsop87Dvenus: venusD,
  elpMppDe: elpMppDe,
  elpMppDeFull: elpMppDeFull,
}
