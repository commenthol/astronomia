/* eslint no-multi-spaces: 0 */
/* global describe, it */

var assert = require('assert')

var angle = require('..').angle
var julian = require('..').julian
var sexa = require('..').sexagesimal

describe('#angle', function () {
  var r1 = [
    new sexa.RA(10, 29, 44.27).rad(),
    new sexa.RA(10, 36, 19.63).rad(),
    new sexa.RA(10, 43,  1.75).rad()
  ]
  var d1 = [
    new sexa.Angle(false, 11,  2,  5.9).rad(),
    new sexa.Angle(false, 10, 29, 51.7).rad(),
    new sexa.Angle(false,  9, 55, 16.7).rad()
  ]
  var r2 = [
    new sexa.RA(10, 33, 29.64).rad(),
    new sexa.RA(10, 33, 57.97).rad(),
    new sexa.RA(10, 34, 26.22).rad()
  ]
  var d2 = [
    new sexa.Angle(false, 10, 40, 13.2).rad(),
    new sexa.Angle(false, 10, 37, 33.4).rad(),
    new sexa.Angle(false, 10, 34, 53.9).rad()
  ]
  var jd1 = julian.CalendarGregorianToJD(1978, 9, 13)
  var jd3 = julian.CalendarGregorianToJD(1978, 9, 15)

  it('Example Sep', function () {
    // Example 17.a, p. 110.0
    var r1 = new sexa.RA(14, 15, 39.7).rad()
    var d1 = new sexa.Angle(false, 19, 10, 57).rad()
    var r2 = new sexa.RA(13, 25, 11.6).rad()
    var d2 = new sexa.Angle(true, 11, 9, 41).rad()
    var d = angle.Sep(r1, d1, r2, d2)
    assert.equal(new sexa.Angle(d).toString(0), '32°47′35″')
  })

  /**
   * First exercise, p. 110.0
   */
  it('Sep', function () {
    var r1 = new sexa.RA(4, 35, 55.2).rad()
    var d1 = new sexa.Angle(false, 16, 30, 33).rad()
    var r2 = new sexa.RA(16, 29, 24).rad()
    var d2 = new sexa.Angle(true, 26, 25, 55).rad()
    var d = angle.Sep(r1, d1, r2, d2)
    var answer = new sexa.Angle(false, 169, 58, 0).rad()
    assert.ok(Math.abs(d - answer) < 1e-4, new sexa.Angle(d).toString())
  })

  /**
   * Second exercise, p. 110.0
   */
  it('MinSep', function () {
    var err
    try {
      var sep = angle.MinSep(jd1, jd3, r1, d1, r2, d2)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    var answer = 0.5017 * Math.PI / 180 // on p. 111
    assert.ok(Math.abs((sep - answer) / sep) < 1e-3, new sexa.Angle(sep).toString())
  })

  /**
   * "rectangular coordinate" solution, p. 113.0
   */
  it('MinSepRect', function () {
    var err
    try {
      var sep = angle.MinSepRect(jd1, jd3, r1, d1, r2, d2)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    var answer = 224 * Math.PI / 180 / 3600 // on p. 111
    assert.ok(Math.abs((sep - answer) / sep) < 1e-2, new sexa.Angle(sep))
  })

  it('SepHav', function () {
    // Example 17.a, p. 110.0
    var r1 = new sexa.RA(14, 15, 39.7).rad()
    var d1 = new sexa.Angle(false, 19, 10, 57).rad()
    var r2 = new sexa.RA(13, 25, 11.6).rad()
    var d2 = new sexa.Angle(true, 11, 9, 41).rad()
    var d = angle.SepHav(r1, d1, r2, d2)
    assert.ok(new sexa.Angle(d).toString(0), '32°47′35″')
  })

  it('SepPauwels', function () {
    // Example 17.b, p. 116.0
    var r1 = new sexa.RA(14, 15, 39.7).rad()
    var d1 = new sexa.Angle(false, 19, 10, 57).rad()
    var r2 = new sexa.RA(13, 25, 11.6).rad()
    var d2 = new sexa.Angle(true, 11, 9, 41).rad()
    var d = angle.SepPauwels(r1, d1, r2, d2)
    assert.ok(new sexa.Angle(d).toString(0), '32°47′35″')
  })
})
