/* global describe, it */

var assert = require('assert')

var jupitermoons = require('..').jupitermoons
var planetposition = require('..').planetposition

describe('#jupitermoons', function () {
  it('positions()', function () {
    var pos = jupitermoons.positions(2448972.50068)
    var p1 = pos[0]
    var p2 = pos[1]
    var p3 = pos[2]
    var p4 = pos[3]
    assert.equal(p1.x.toFixed(2), -3.44)
    assert.equal(p1.y.toFixed(2), 0.21)
    assert.equal(p2.x.toFixed(2), 7.44)
    assert.equal(p2.y.toFixed(2), 0.25)
    assert.equal(p3.x.toFixed(2), 1.24)
    assert.equal(p3.y.toFixed(2), 0.65)
    assert.equal(p4.x.toFixed(2), 7.08)
    assert.equal(p4.y.toFixed(2), 1.10)
    // Output:
    // X1 = -3.44  Y1 = +0.21
    // X2 = +7.44  Y2 = +0.25
    // X3 = +1.24  Y3 = +0.65
    // X4 = +7.08  Y4 = +1.10
  })

  it('e5()', function () {
    var e = new planetposition.Planet(planetposition.earth)
    var j = new planetposition.Planet(planetposition.jupiter)
    var pos = jupitermoons.e5(2448972.50068, e, j)
    assert.equal(pos[0].x.toFixed(4), -3.4503)
    assert.equal(pos[0].y.toFixed(4), +0.2093)
    assert.equal(pos[1].x.toFixed(4), +7.4418)
    assert.equal(pos[1].y.toFixed(4), +0.2500)
    assert.equal(pos[2].x.toFixed(4), +1.2010)
    assert.equal(pos[2].y.toFixed(4), +0.6480)
    assert.equal(pos[3].x.toFixed(4), +7.0720)
    assert.equal(pos[3].y.toFixed(4), +1.0956)
    // Output:
    // X  -3.4503  +7.4418  +1.2010  +7.0720
    // Y  +0.2093  +0.2500  +0.6480  +1.0956
  })
})
