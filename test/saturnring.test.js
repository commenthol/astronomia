/* global describe, it */

var assert = require('assert')

var planetposition = require('..').planetposition
var saturnring = require('..').saturnring
var sexa = require('..').sexagesimal

describe('#saturnring', function () {
  var earth = new planetposition.Planet(planetposition.earth)
  var saturn = new planetposition.Planet(planetposition.saturn)

  it('ring()', function () {
    // Example 45.a, p. 320
    var res = saturnring.ring(2448972.50068, earth, saturn)
    var B = res[0]
    var Bʹ = res[1]
    var gDU = res[2]
    var P = res[3]
    var a = res[4]
    var b = res[5]
    assert.equal((B * 180 / Math.PI).toFixed(3), 16.442)
    assert.equal((Bʹ * 180 / Math.PI).toFixed(3), 14.679)
    assert.equal((gDU * 180 / Math.PI).toFixed(3), 4.198)
    assert.equal((P * 180 / Math.PI).toFixed(3), 6.741)
    assert.equal(new sexa.Angle(a).toString(2), '0°0′35.87″')
    assert.equal(new sexa.Angle(b).toString(2), '0°0′10.15″')
    // B  = 16.442
    // Bʹ = 14.679
    // gDU = 4.198
    // P  = 6.741
    // a  = 35″.87
    // b  = 10″.15
  })

  it('ub', function () {
    var resR = saturnring.ring(2448972.50068, earth, saturn)
    var resU = saturnring.ub(2448972.50068, earth, saturn)
    assert.equal(resR[2], resU[0])
    assert.equal(resR[0], resU[1])
  })
})
