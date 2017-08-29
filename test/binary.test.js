/* global describe, it */

var assert = require('assert')

var binary = require('..').binary
var kepler = require('..').kepler

describe('#binary', function () {
  it('position', function () {
    // Example 57.1, p. 398
    var M = binary.meanAnomaly(1980, 1934.008, 41.623)
    var E = kepler.kepler1(0.2763, M, 6)
    var a = binary.position(0.907, 0.2763, 59.025 * Math.PI / 180,
    23.717 * Math.PI / 180, 219.907 * Math.PI / 180, E)
    var gth = a[0]
    var gr = a[1]
    assert.equal((M * 180 / Math.PI).toFixed(3), 37.788)
    assert.equal((gth * 180 / Math.PI).toFixed(1), 318.4)
    assert.equal(gr.toFixed(3), 0.411)
  })

  it('apparentEccentricity', function () {
    // Example 57.b, p. 400
    var res = binary.apparentEccentricity(0.2763,
      59.025 * Math.PI / 180,
      219.907 * Math.PI / 180
    )
    assert.equal(res.toFixed(3), 0.860)
  })
})
