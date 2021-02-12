import assert from 'assert'
import float from './support/float.js'
import { base, julian, moonillum, moonposition, solar } from '../src/index.js'

const p = Math.PI / 180

describe('#moonillum', function () {
  const j = julian.CalendarGregorianToJD(1992, 4, 12)

  it('phaseAngleEquatorial', function () {
    const i = moonillum.phaseAngleEquatorial(
      new base.Coord(134.6885 * p, 13.7684 * p, 368410),
      new base.Coord(20.6579 * p, 8.6964 * p, 149971520)
    )
    assert.strictEqual(float(i / p).toFixed(4), 69.0756)
  })

  it('phaseAngleEquatorial2', function () {
    const i = moonillum.phaseAngleEquatorial2(
      new base.Coord(134.6885 * p, 13.7684 * p),
      new base.Coord(20.6579 * p, 8.6964 * p)
    )
    const k = base.illuminated(i)
    assert.strictEqual(float(k).toFixed(4), 0.6775)
  })

  it('phaseAngleEcliptic', function () {
    const pos = moonposition.position(j)
    const T = base.J2000Century(j)
    const λ0 = solar.apparentLongitude(T)
    const R = solar.radius(T) * base.AU
    const i = moonillum.phaseAngleEcliptic(pos, new base.Coord(λ0, 0, R))
    const ref = 69.0756 * Math.PI / 180
    const err = Math.abs((i - ref) / ref)
    assert.ok(err < 1e-4)
  })

  it('phaseAngleEcliptic2', function () {
    const pos = moonposition.position(j)
    const λ0 = solar.apparentLongitude(base.J2000Century(j))
    const i = moonillum.phaseAngleEcliptic2(pos, new base.Coord(λ0))
    const k = base.illuminated(i)
    const ref = 0.6775
    const err = Math.abs(k - ref)
    assert.ok(err < 1e-4)
  })

  it('phaseAngle3', function () {
    const i = moonillum.phaseAngle3(j)
    const k = base.illuminated(i)
    assert.strictEqual(float(i * 180 / Math.PI).toFixed(2), 68.88)
    assert.strictEqual(float(k).toFixed(4), 0.6801)
  })
})
