import assert from 'assert'
import {base, julian, moonillum, moonposition, solar} from '..'

var p = Math.PI / 180

describe('#moonillum', function () {
  var j = julian.CalendarGregorianToJD(1992, 4, 12)

  it('phaseAngleEquatorial', function () {
    var i = moonillum.phaseAngleEquatorial(
      new base.Coord(134.6885 * p, 13.7684 * p, 368410),
      new base.Coord(20.6579 * p, 8.6964 * p, 149971520)
    )
    assert.equal((i / p).toFixed(4), 69.0756)
  })

  it('phaseAngleEquatorial2', function () {
    var i = moonillum.phaseAngleEquatorial2(
      new base.Coord(134.6885 * p, 13.7684 * p),
      new base.Coord(20.6579 * p, 8.6964 * p)
    )
    var k = base.illuminated(i)
    assert.equal(k.toFixed(4), 0.6775)
  })

  it('phaseAngleEcliptic', function () {
    var pos = moonposition.position(j)
    var T = base.J2000Century(j)
    var λ0 = solar.apparentLongitude(T)
    var R = solar.radius(T) * base.AU
    var i = moonillum.phaseAngleEcliptic(pos, new base.Coord(λ0, 0, R))
    var ref = 69.0756 * Math.PI / 180
    var err = Math.abs((i - ref) / ref)
    assert.ok(err < 1e-4)
  })

  it('phaseAngleEcliptic2', function () {
    var pos = moonposition.position(j)
    var λ0 = solar.apparentLongitude(base.J2000Century(j))
    var i = moonillum.phaseAngleEcliptic2(pos, new base.Coord(λ0))
    var k = base.illuminated(i)
    var ref = 0.6775
    var err = Math.abs(k - ref)
    assert.ok(err < 1e-4)
  })

  it('phaseAngle3', function () {
    var i = moonillum.phaseAngle3(j)
    var k = base.illuminated(i)
    assert.equal((i * 180 / Math.PI).toFixed(2), 68.88)
    assert.equal(k.toFixed(4), 0.6801)
  })
})
