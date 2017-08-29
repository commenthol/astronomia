/* global describe, it */

var assert = require('assert')

var mars = require('..').mars
var planetposition = require('..').planetposition

function toFixed (num, pos) {
  return parseFloat(num.toFixed(pos), 10)
}

describe('#mars', function () {
  it('physical()', function () {
  // Example 42.a, p. 291
    var e = new planetposition.Planet(planetposition.earth)
    var m = new planetposition.Planet(planetposition.mars)
    var re = mars.physical(2448935.500683, e, m)
    var DE = re[0]
    var DS = re[1]
    var gw = re[2]
    var P = re[3]
    var Q = re[4]
    var d = re[5]
    var k = re[6]
    var q = re[7]
    var res = [
      toFixed(DE * 180 / Math.PI, 2),
      toFixed(DS * 180 / Math.PI, 2),
      toFixed(gw * 180 / Math.PI, 2),
      toFixed(P * 180 / Math.PI, 2),
      toFixed(Q * 180 / Math.PI, 2),
      toFixed(d * 180 / Math.PI * 60 * 60, 2), // display as arc sec
      toFixed(k, 4),
      toFixed(q * 180 / Math.PI * 60 * 60, 2) // display as arc sec
    ]
    var exp = [
      +12.44, // DE
      -2.76,  // DS
      111.55, // gw
      347.64, // P
      279.91, // Q
      10.75,  // d
      0.9012, // k
      1.06    // q
    ]
    assert.deepEqual(res, exp)
  })
})
