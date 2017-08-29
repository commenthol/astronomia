/* global describe, it */

var assert = require('assert')

var parallactic = require('..').parallactic
var sexa = require('..').sexagesimal

describe('#parallactic', function () {
  it('eclipticAtHorizon', function () {
    var ge = 23.44 * Math.PI / 180
    var gf = 51 * Math.PI / 180
    var gth = 75 * Math.PI / 180
    var res = parallactic.eclipticAtHorizon(ge, gf, gth)
    var gl1 = res[0], gl2 = res[1], I = res[2] // eslint-disable-line one-var

    assert.equal(new sexa.Angle(gl1).toString(0), '169°21′30″')
    assert.equal(new sexa.Angle(gl2).toString(0), '349°21′30″')
    assert.equal(new sexa.Angle(I).toString(0), '61°53′14″')
  })

  it('diurnalPathAtHorizon', function () {
    var gf = 40 * Math.PI / 180
    var ge = 23.44 * Math.PI / 180
    var J = parallactic.diurnalPathAtHorizon(0, gf) // 0.8726646259971648
    var Jexp = Math.PI / 2 - gf
    assert.ok(Math.abs((J - Jexp) / Jexp) < 1e-15, new sexa.Angle(J).toString())
    J = parallactic.diurnalPathAtHorizon(ge, gf) // 0.794553542331993
    Jexp = new sexa.Angle(false, 45, 31, 0).rad()
    assert.ok(Math.abs((J - Jexp) / Jexp) < 1e-3, new sexa.Angle(J).toString())
  })
})
