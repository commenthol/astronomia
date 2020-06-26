import assert from 'assert'
import float from './support/float.js'
import { mars, data, planetposition } from '..'

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
      float(DE * 180 / Math.PI).toFixed(2),
      float(DS * 180 / Math.PI).toFixed(2),
      float(ω * 180 / Math.PI).toFixed(2),
      float(P * 180 / Math.PI).toFixed(2),
      float(Q * 180 / Math.PI).toFixed(2),
      float(d * 180 / Math.PI * 60 * 60).toFixed(2), // display as arc sec
      float(k).toFixed(4),
      float(q * 180 / Math.PI * 60 * 60).toFixed(2) // display as arc sec
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
    assert.deepStrictEqual(res, exp)
  })
})
