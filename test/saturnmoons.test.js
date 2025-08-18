/* eslint key-spacing: 0 */

import assert from 'assert'
import float from './support/float.js'
import { saturnmoons, planetposition } from '../src/index.js'
import data from '../data/index.js'

describe('#saturnmoons', function () {
  function comp (res, exp) {
    assert.strictEqual(float(res.x).toFixed(3), exp.x)
    assert.strictEqual(float(res.y).toFixed(3), exp.y)
    assert.strictEqual(float(res.z).toFixed(3), exp.z)
  }

  describe('positions()', function () {
    // Example 46.a, p. 334.0
    const earth = new planetposition.Planet(data.vsop87Bearth)
    const saturn = new planetposition.Planet(data.vsop87Bsaturn)
    const pos = saturnmoons.positions(2451439.50074, earth, saturn)
    const exp = [
      { x:  +3.102, y: -0.204, z: +0.295 },
      { x:  +3.823, y: +0.318, z: -0.833 },
      { x:  +4.027, y: -1.061, z: +2.545 },
      { x:  -5.365, y: -1.148, z: +3.004 },
      { x:  -0.972, y: -3.136, z: +8.080 },
      { x: +14.568, y: +4.738, z: -12.755 },
      { x: -18.001, y: -5.328, z: +15.121 },
      { x: -48.760, y: +4.137, z: +32.738 }
    ]

    pos.forEach(function (p, i) {
      it('' + i, function () {
        comp(pos[i], exp[i])
      })
    })

    it('rhea', function () {
      // only for Moon Rhea
      comp(pos[saturnmoons.rhea], exp[4])
    })
  })
})
