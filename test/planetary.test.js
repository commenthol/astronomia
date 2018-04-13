import assert from 'assert'
import {planetary, base, julian, sexagesimal as sexa} from '..'

describe('#planetary', function () {
  it('mercuryInfConj()', function () {
    // Example 36.a, p. 252
    var j = planetary.mercuryInfConj(1993.75)
    // console.log("0.000\n", j)
    var d = new julian.Calendar().fromJD(j).toDate().toISOString()
    assert.equal(j.toFixed(3), 2449297.645)
    assert.equal(d, '1993-11-06T03:28:41.609Z')
  })

  it('saturnConj()', function () {
    // Example 36.b, p. 252
    var j = planetary.saturnConj(2125.5)
    var d = new julian.Calendar().fromJD(j).toDate().toISOString()
    assert.equal(j.toFixed(3), 2497437.904)
    assert.equal(d, '2125-08-26T09:41:05.648Z')
  })

  it('mercuryWestElongation()', function () {
    // Example 36.c, p. 253
    var res = planetary.mercuryWestElongation(1993.9)
    var j = res[0]
    var e = res[1]
    var d = new julian.Calendar().fromJDE(j).toDate().toISOString()
    assert.equal(j.toFixed(2), 2449314.14)
    assert.equal(d, '1993-11-22T15:18:35.044Z')
    assert.equal((e * 180 / Math.PI).toFixed(4), 19.7506 /* deg */)
    assert.equal(new sexa.Angle(e).toString(0), '19°45′2″')
  })

  it('marsStation2()', function () {
    // Example 36.d, p. 254
    var j = planetary.marsStation2(1997.3)
    var d = new julian.Calendar().fromJDE(j).toDate().toISOString()
    assert.equal(j.toFixed(3), 2450566.255)
    assert.equal(d, '1997-04-27T18:06:34.275Z')
  })

  function Tc (f, jNom, hour) {
    this.f = f
    this.jNom = jNom
    this.hour = hour
  }

  var td = [
    new Tc(planetary.mercuryInfConj, julian.CalendarGregorianToJD(1631, 11, 7), 7),
    new Tc(planetary.venusInfConj, julian.CalendarGregorianToJD(1882, 12, 6), 17),
    new Tc(planetary.marsOpp, julian.CalendarGregorianToJD(2729, 9, 9), 3),
    new Tc(planetary.jupiterOpp, julian.CalendarJulianToJD(-6, 9, 15), 7),
    new Tc(planetary.saturnOpp, julian.CalendarJulianToJD(-6, 9, 14), 9),
    new Tc(planetary.uranusOpp, julian.CalendarGregorianToJD(1780, 12, 17), 14),
    new Tc(planetary.neptuneOpp, julian.CalendarGregorianToJD(1846, 8, 20), 4)
  ]

  describe('255', function () {
    td.forEach(function (d, i) {
      it('' + i, function () {
        var f = base.modf(0.5 + d.f(base.JDEToJulianYear(d.jNom)))[1]
        assert.equal(Math.floor(f * 24 + 0.5), d.hour)
      })
    })
  })
})
