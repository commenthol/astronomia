/* global describe, it */

var assert = require('assert')

var base = require('..').base
var nearparabolic = require('..').nearparabolic

describe('#nearparabolic', function () {
  describe('anomalyDistance', function () {
    var tdat = [
      // test data p. 247
      {q: 0.921326, e: 1, t: 138.4783, gn: 102.74426, r: 2.364192},
      {q: 0.1, e: 0.987, t: 254.9, gn: 164.50029, r: 4.063777},
      {q: 0.123456, e: 0.99997, t: -30.47, gn: 221.91190, r: 0.965053},
      {q: 3.363943, e: 1.05731, t: 1237.1, gn: 109.40598, r: 10.668551},
      {q: 0.5871018, e: 0.9672746, t: 20, gn: 52.85331, r: 0.729116},
      {q: 0.5871018, e: 0.9672746, t: 0, gn: 0, r: 0.5871018}
    ]
    var e = new nearparabolic.Elements()

    tdat.forEach(function (d, i) {
      it('' + i, function () {
        e.timeP = base.J2000 + Math.random() * base.JulianCentury
        e.pDis = d.q
        e.ecc = d.e

        var res = e.anomalyDistance(e.timeP + d.t)
        // console.log(res)
        if (!res.err) {
          assert.ok(Math.abs(res.ano * 180 / Math.PI - d.gn) < 1e-5, d.gn)
          assert.ok(Math.abs(res.dist - d.r) < 1e-6, d.r)
        }
      })
    })
  })

  describe('anomalyDistance2', function () {
    var tdat = [
      // test data p. 248
      {q: 0.1, e: 0.9, t: 10, gn: 126, p: 0, c: true},
      {q: 0.1, e: 0.9, t: 20, gn: 142, p: 0, c: true},
      {q: 0.1, e: 0.9, t: 30, gn: 0, p: 0, c: false},
      {q: 0.1, e: 0.987, t: 10, gn: 123, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 20, gn: 137, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 30, gn: 143, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 60, gn: 152, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 100, gn: 157, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 200, gn: 163, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 400, gn: 167, p: 0, c: true},
      {q: 0.1, e: 0.987, t: 500, gn: 0, p: 0, c: false},
      {q: 0.1, e: 0.999, t: 100, gn: 156, p: 0, c: true},
      {q: 0.1, e: 0.999, t: 200, gn: 161, p: 0, c: true},
      {q: 0.1, e: 0.999, t: 500, gn: 166, p: 0, c: true},
      {q: 0.1, e: 0.999, t: 1000, gn: 169, p: 0, c: true},
      {q: 0.1, e: 0.999, t: 5000, gn: 174, p: 0, c: true},
      {q: 1, e: 0.99999, t: 100000, gn: 172.5, p: 1, c: true},
      {q: 1, e: 0.99999, t: 10000000, gn: 178.41, p: 2, c: true},
      {q: 1, e: 0.99999, t: 14000000, gn: 178.58, p: 2, c: true},
      {q: 1, e: 0.99999, t: 17000000, gn: 178.68, p: 2, c: true},
      {q: 1, e: 0.99999, t: 18000000, gn: 0, p: 2, c: false}
    ]

    var e = new nearparabolic.Elements()
    tdat.forEach(function (d, i) {
      it('' + i, function () {
        e.timeP = base.J2000 + Math.random() * base.JulianCentury
        e.pDis = d.q
        e.ecc = d.e
        var res = e.anomalyDistance(e.timeP + d.t)
        assert.ok(!res.err === d.c)
        if (!res.err) {
          assert.ok(Math.abs(res.ano * 180 / Math.PI - d.gn) < Math.pow(10, -d.p), JSON.stringify(res))
        }
      })
    })
  })
})
