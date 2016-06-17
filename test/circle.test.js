/* eslint one-var: 0 */
/* global describe, it */

var assert = require('assert')

var circle = require('..').circle
var sexa = require('..').sexagesimal

console.log(circle)

describe('#circle', function () {
  it('Smallest typeII', function () {
    // Example 20.a, p. 128.0
    var r1 = new sexa.RA(12, 41, 8.64).rad()
    var r2 = new sexa.RA(12, 52, 5.21).rad()
    var r3 = new sexa.RA(12, 39, 28.11).rad()
    var d1 = new sexa.Angle(true, 5, 37, 54.2).rad()
    var d2 = new sexa.Angle(true, 4, 22, 26.2).rad()
    var d3 = new sexa.Angle(true, 1, 50, 3.7).rad()
    var a = circle.smallest(r1, d1, r2, d2, r3, d3)
    var d = a[0], t = a[1]
    assert.equal(new sexa.Angle(d).toString(0), '4°15′49″') // Δ = 4°.26363 = 4°16′
    assert.equal(t, false) // type II
  })

  it('Smallest typeI', function () {
    // Exercise, p. 128.0
    var r1 = new sexa.RA(9, 5, 41.44).rad()
    var r2 = new sexa.RA(9, 9, 29).rad()
    var r3 = new sexa.RA(8, 59, 47.14).rad()
    var d1 = new sexa.Angle(false, 18, 30, 30).rad()
    var d2 = new sexa.Angle(false, 17, 43, 56.7).rad()
    var d3 = new sexa.Angle(false, 17, 49, 36.8).rad()
    var a = circle.smallest(r1, d1, r2, d2, r3, d3)
    var d = a[0], t = a[1]
    assert.equal(new sexa.Angle(d).toString(0), '2°18′38″') // Δ = 2°.31054 = 2°19′
    assert.equal(t, true) // type I
  })
})
