import assert from 'assert'
import {mars, data, planetposition} from '..'

function toFixed (num, pos) {
  return parseFloat(num.toFixed(pos), 10)
}

describe('#mars', function () {
  it('physical()', function () {
  // Example 42.a, p. 291
    var e = new planetposition.Planet(data.earth)
    var m = new planetposition.Planet(data.mars)
    var re = mars.physical(2448935.500683, e, m)
    var DE = re[0]
    var DS = re[1]
    var ω = re[2]
    var P = re[3]
    var Q = re[4]
    var d = re[5]
    var k = re[6]
    var q = re[7]
    var res = [
      toFixed(DE * 180 / Math.PI, 2),
      toFixed(DS * 180 / Math.PI, 2),
      toFixed(ω * 180 / Math.PI, 2),
      toFixed(P * 180 / Math.PI, 2),
      toFixed(Q * 180 / Math.PI, 2),
      toFixed(d * 180 / Math.PI * 60 * 60, 2), // display as arc sec
      toFixed(k, 4),
      toFixed(q * 180 / Math.PI * 60 * 60, 2) // display as arc sec
    ]
    var exp = [
      +12.44, // DE
      -2.76, // DS
      111.55, // ω
      347.64, // P
      279.91, // Q
      10.75, // d
      0.9012, // k
      1.06 // q
    ]
    assert.deepEqual(res, exp)
  })
})
