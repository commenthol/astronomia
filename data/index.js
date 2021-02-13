var deltat = require('./deltat.js')
var earth = require('./vsop87Bearth.js')
var jupiter = require('./vsop87Bjupiter.js')
var mars = require('./vsop87Bmars.js')
var mercury = require('./vsop87Bmercury.js')
var neptune = require('./vsop87Bneptune.js')
var saturn = require('./vsop87Bsaturn.js')
var uranus = require('./vsop87Buranus.js')
var venus = require('./vsop87Bvenus.js')
var vsop87Dearth = require('./vsop87Dearth.js')
var vsop87Djupiter = require('./vsop87Djupiter.js')
var vsop87Dmars = require('./vsop87Dmars.js')
var vsop87Dmercury = require('./vsop87Dmercury.js')
var vsop87Dneptune = require('./vsop87Dneptune.js')
var vsop87Dsaturn = require('./vsop87Dsaturn.js')
var vsop87Duranus = require('./vsop87Duranus.js')
var vsop87Dvenus = require('./vsop87Dvenus.js')
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
  vsop87Dearth: vsop87Dearth,
  vsop87Djupiter: vsop87Djupiter,
  vsop87Dmars: vsop87Dmars,
  vsop87Dmercury: vsop87Dmercury,
  vsop87Dneptune: vsop87Dneptune,
  vsop87Dsaturn: vsop87Dsaturn,
  vsop87Duranus: vsop87Duranus,
  vsop87Dvenus: vsop87Dvenus,
  elpMppDe: elpMppDe,
  elpMppDeFull: elpMppDeFull,
}
