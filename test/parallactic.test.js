import assert from 'assert'
import { parallactic, sexagesimal as sexa } from '../src/index.js'

describe('#parallactic', function () {
  it('eclipticAtHorizon', function () {
    const ε = 23.44 * Math.PI / 180
    const φ = 51 * Math.PI / 180
    const θ = 75 * Math.PI / 180
    const res = parallactic.eclipticAtHorizon(ε, φ, θ)
    const λ1 = res[0], λ2 = res[1], I = res[2] // eslint-disable-line one-var

    assert.strictEqual(new sexa.Angle(λ1).toString(0), '169°21′30″')
    assert.strictEqual(new sexa.Angle(λ2).toString(0), '349°21′30″')
    assert.strictEqual(new sexa.Angle(I).toString(0), '61°53′14″')
  })

  it('diurnalPathAtHorizon', function () {
    const φ = 40 * Math.PI / 180
    const ε = 23.44 * Math.PI / 180
    let J = parallactic.diurnalPathAtHorizon(0, φ) // 0.8726646259971648
    let Jexp = Math.PI / 2 - φ
    assert.ok(Math.abs((J - Jexp) / Jexp) < 1e-15, new sexa.Angle(J).toString())
    J = parallactic.diurnalPathAtHorizon(ε, φ) // 0.794553542331993
    Jexp = new sexa.Angle(false, 45, 31, 0).rad()
    assert.ok(Math.abs((J - Jexp) / Jexp) < 1e-3, new sexa.Angle(J).toString())
  })
})
