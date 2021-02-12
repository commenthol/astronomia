/* global describe, it */

import assert from 'assert'
import float from './support/float.js'
import { refraction } from '../src/index.js'

describe('#refraction', function () {
  it('bennett', function () {
    // Example 16.a, p. 107.0
    const h0 = 0.5 * Math.PI / 180
    const R = refraction.bennett(h0)
    const cMin = 60 * 180 / Math.PI
    assert.strictEqual(float(R * cMin).toFixed(3), 28.754) // R Lower: 28.754
    const hLower = h0 - R
    assert.strictEqual(float(hLower * cMin).toFixed(3), 1.246) // h Lower: 1.246
    const hUpper = hLower + 32 * Math.PI / (180 * 60)
    assert.strictEqual(float(hUpper * cMin).toFixed(3), 33.246) // h Upper: 33.246
    const Rh = refraction.saemundsson(hUpper)
    assert.strictEqual(float(Rh * cMin).toFixed(3), 24.618) // R Upper: 24.618
  })

  /**
   * Test two values for zenith given on p. 106.0
   */
  it('bennett2', function () {
    let R = refraction.bennett(Math.PI / 2)
    const cSec = 3600 * 180 / Math.PI
    assert.ok(Math.abs(0.08 + R * cSec) < 0.01)
    R = refraction.bennett2(Math.PI / 2)
    assert.ok(Math.abs(0.89 + R * cSec) < 0.01)
  })
})
