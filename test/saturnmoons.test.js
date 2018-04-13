/* eslint key-spacing: 0 */

import assert from 'assert'
import {saturnmoons, planetposition, data} from '..'

describe('#saturnmoons', function () {
  function comp (res, exp) {
    assert.equal(res.x.toFixed(3), exp.x)
    assert.equal(res.y.toFixed(3), exp.y)
  }

  describe('positions()', function () {
    // Example 46.a, p. 334.0
    var earth = new planetposition.Planet(data.vsop87Bearth)
    var saturn = new planetposition.Planet(data.vsop87Bsaturn)
    var pos = saturnmoons.positions(2451439.50074, earth, saturn)
    var exp = [
      { x:  +3.102, y: -0.204 },
      { x:  +3.823, y: +0.318 },
      { x:  +4.027, y: -1.061 },
      { x:  -5.365, y: -1.148 },
      { x:  -0.972, y: -3.136 },
      { x: +14.568, y: +4.738 },
      { x: -18.001, y: -5.328 },
      { x: -48.760, y: +4.137 }
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
