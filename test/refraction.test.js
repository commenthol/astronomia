/* global describe, it */

import assert from 'assert'
import {refraction} from '..'

describe('#refraction', function () {
  it('bennett', function () {
    // Example 16.a, p. 107.0
    var h0 = 0.5 * Math.PI / 180
    var R = refraction.bennett(h0)
    var cMin = 60 * 180 / Math.PI
    assert.equal((R * cMin).toFixed(3), 28.754) // R Lower: 28.754
    var hLower = h0 - R
    assert.equal((hLower * cMin).toFixed(3), 1.246) // h Lower: 1.246
    var hUpper = hLower + 32 * Math.PI / (180 * 60)
    assert.equal((hUpper * cMin).toFixed(3), 33.246) // h Upper: 33.246
    var Rh = refraction.saemundsson(hUpper)
    assert.equal((Rh * cMin).toFixed(3), 24.618) // R Upper: 24.618
  })

  /**
   * Test two values for zenith given on p. 106.0
   */
  it('bennett2', function () {
    var R = refraction.bennett(Math.PI / 2)
    var cSec = 3600 * 180 / Math.PI
    assert.ok(Math.abs(0.08 + R * cSec) < 0.01)
    R = refraction.bennett2(Math.PI / 2)
    assert.ok(Math.abs(0.89 + R * cSec) < 0.01)
  })
})
