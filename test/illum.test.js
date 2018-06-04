import assert from 'assert'
import {illum} from '..'

describe('#illum', function () {
  it('phaseAngle()', function () {
    // Example 41.a, p. 284
    var i = illum.phaseAngle(0.724604, 0.910947, 0.983824)
    assert.equal(Math.cos(i).toFixed(5), 0.29312)
  })

  it('fraction()', function () {
    // Example 41.a, p. 284
    var k = illum.fraction(0.724604, 0.910947, 0.983824)
    assert.equal(k.toFixed(3), 0.647)
  })

  it('phaseAngle2()', function () {
    // Example 41.a, p. 284
    var i = illum.phaseAngle2(26.10588 * Math.PI / 180, -2.62102 * Math.PI / 180, 0.724604,
      88.35704 * Math.PI / 180, 0.983824, 0.910947)
    assert.equal(Math.cos(i).toFixed(5), 0.29312)
  })

  it('phaseAngle3()', function () {
    // Example 41.a, p. 284
    var i = illum.phaseAngle3(26.10588 * Math.PI / 180, -2.62102 * Math.PI / 180,
      0.621794, -0.664905, -0.033138, 0.910947)
    assert.equal(Math.cos(i).toFixed(5), 0.29312)
  })

  it('fractionVenus()', function () {
    // Example 41.b, p. 284
    var k = illum.fractionVenus(2448976.5)
    assert.equal(k.toFixed(3), 0.640)
  })

  it('venus()', function () {
    // Example 41.c, p. 285
    var v = illum.venus(0.724604, 0.910947, 72.96 * Math.PI / 180)
    assert.equal(v.toFixed(1), -3.8)
  })

  it('saturn()', function () {
    // Example 41.d, p. 285
    var v = illum.saturn(9.867882, 10.464606, 16.442 * Math.PI / 180, 4.198 * Math.PI / 180)
    assert.equal(v.toFixed(1), 0.9)
  })

  it('venus84()', function () {
    // modified Example 41.c, p. 285
    var v = illum.venus84(0.724604, 0.910947, 72.96 * Math.PI / 180)
    assert.equal(v.toFixed(1), -4.2)
  })

  it('saturn84()', function () {
    // modified Example 41.d, p. 285
    var v = illum.saturn84(9.867882, 10.464606, 16.442 * Math.PI / 180, 4.198 * Math.PI / 180)
    assert.equal(v.toFixed(1), 0.7)
  })
})
