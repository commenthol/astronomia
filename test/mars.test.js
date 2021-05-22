import assert from 'assert'
import float from './support/float.js'
import { mars, planetposition } from '../src/index.js'
import data from '../data/index.js'

describe('#mars', function () {
  it('physical()', function () {
  // Example 42.a, p. 291
    const e = new planetposition.Planet(data.earth)
    const m = new planetposition.Planet(data.mars)
    const re = mars.physical(2448935.500683, e, m)
    const DE = re[0]
    const DS = re[1]
    const ω = re[2]
    const P = re[3]
    const Q = re[4]
    const d = re[5]
    const k = re[6]
    const q = re[7]
    const res = [
      float(DE * 180 / Math.PI).toFixed(2),
      float(DS * 180 / Math.PI).toFixed(2),
      float(ω * 180 / Math.PI).toFixed(2),
      float(P * 180 / Math.PI).toFixed(2),
      float(Q * 180 / Math.PI).toFixed(2),
      float(d * 180 / Math.PI * 60 * 60).toFixed(2), // display as arc sec
      float(k).toFixed(4),
      float(q * 180 / Math.PI * 60 * 60).toFixed(2) // display as arc sec
    ]
    const exp = [
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
