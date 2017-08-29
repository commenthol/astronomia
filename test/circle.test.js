/* eslint one-var: 0 */
/* global describe, it */

var assert = require('assert')

var base = require('..').base
var circle = require('..').circle
var sexa = require('..').sexagesimal

describe('#circle', function () {
  it('Smallest typeI', function () {
    // Exercise, p. 128.0
    var c1 = new base.Coord(
      new sexa.RA(9, 5, 41.44).rad(),
      new sexa.Angle(false, 18, 30, 30).rad()
    )
    var c2 = new base.Coord(
      new sexa.RA(9, 9, 29).rad(),
      new sexa.Angle(false, 17, 43, 56.7).rad()
    )
    var c3 = new base.Coord(
      new sexa.RA(8, 59, 47.14).rad(),
      new sexa.Angle(false, 17, 49, 36.8).rad()
    )
    var a = circle.smallest(c1, c2, c3)
    var d = a[0], t = a[1]
    assert.equal(new sexa.Angle(d).toString(0), '2°18′38″') // gD = 2°.31054 = 2°19′
    assert.equal(t, true) // type I
  })

  it('Smallest typeII', function () {
    // Example 20.a, p. 128.0
    var c1 = new base.Coord(
      new sexa.RA(12, 41, 8.64).rad(),
      new sexa.Angle(true, 5, 37, 54.2).rad()
    )
    var c2 = new base.Coord(
      new sexa.RA(12, 52, 5.21).rad(),
      new sexa.Angle(true, 4, 22, 26.2).rad()
    )
    var c3 = new base.Coord(
      new sexa.RA(12, 39, 28.11).rad(),
      new sexa.Angle(true, 1, 50, 3.7).rad()
    )
    var a = circle.smallest(c1, c2, c3)
    var d = a[0], t = a[1]
    assert.equal(new sexa.Angle(d).toString(0), '4°15′49″') // gD = 4°.26363 = 4°16′
    assert.equal(t, false) // type II
  })
})
