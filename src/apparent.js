/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apparent
 */
/**
 * Apparent: Chapter 23, Apparent Place of a Star
 */

const base = require('./base')
const coord = require('./coord')
const nutation = require('./nutation')
const precess = require('./precess')
const solar = require('./solar')
const {cos, tan} = Math

const M = exports

/**
 * Nutation returns corrections due to nutation for equatorial coordinates
 * of an object.
 *
 * Results are invalid for objects very near the celestial poles.
 * @param {Number} ga - right ascension
 * @param {Number} gd - declination
 * @param {Number} jd - Julian Day
 * @return {Number[]} [gDga1, gDgd1] -
*/
M.nutation = function (ga, gd, jd) { // (ga, gd, jd float64)  (gDga1, gDgd1 float64)
  let ge = nutation.meanObliquity(jd)
  let [singe, cosge] = base.sincos(ge)
  let [gDgps, gDge] = nutation.nutation(jd)
  let [singa, cosga] = base.sincos(ga)
  let tangd = tan(gd)
    // (23.1) p. 151
  let gDga1 = (cosge + singe * singa * tangd) * gDgps - cosga * tangd * gDge
  let gDgd1 = singe * cosga * gDgps + singa * gDge
  return [gDga1, gDgd1]
}

/**
 * gk is the constant of aberration in radians.
 */
const gk = 20.49552 * Math.PI / 180 / 3600

/**
 * longitude of perihelian of Earth's orbit.
 */
M.perihelion = function (T) { // (T float64)  float64
  return base.horner(T, 102.93735, 1.71946, 0.00046) * Math.PI / 180
}

/**
 * EclipticAberration returns corrections due to aberration for ecliptic
 * coordinates of an object.
 */
M.eclipticAberration = function (gl, gb, jd) { // (gl, gb, jd float64)  (gDgl, gDgb float64)
  let T = base.J2000Century(jd)
  let {lon, ano} = solar.true(T) // eslint-disable-line no-unused-vars
  let e = solar.eccentricity(T)
  let gp = M.perihelion(T)
  let [sgb, cgb] = base.sincos(gb)
  let [ssgl, csgl] = base.sincos(lon - gl)
  let [singpgl, cosgpgl] = base.sincos(gp - gl)
    // (23.2) p. 151
  let gDgl = gk * (e * cosgpgl - csgl) / cgb
  let gDgb = -gk * sgb * (ssgl - e * singpgl)
  return [gDgl, gDgb]
}

/**
 * Aberration returns corrections due to aberration for equatorial
 * coordinates of an object.
 */
M.aberration = function (ga, gd, jd) { // (ga, gd, jd float64)  (gDga2, gDgd2 float64)
  let ge = nutation.meanObliquity(jd)
  let T = base.J2000Century(jd)
  let {lon, ano} = solar.true(T) // eslint-disable-line no-unused-vars
  let e = solar.eccentricity(T)
  let gp = M.perihelion(T)
  let [singa, cosga] = base.sincos(ga)
  let [singd, cosgd] = base.sincos(gd)
  let [sins, coss] = base.sincos(lon)
  let [singp, cosgp] = base.sincos(gp)
  let cosge = cos(ge)
  let q1 = cosga * cosge
  // (23.3) p. 152
  let gDga2 = gk * (e * (q1 * cosgp + singa * singp) - (q1 * coss + singa * sins)) / cosgd
  let q2 = cosge * (tan(ge) * cosgd - singa * singd)
  let q3 = cosga * singd
  let gDgd2 = gk * (e * (cosgp * q2 + singp * q3) - (coss * q2 + sins * q3))
  return [gDga2, gDgd2]
}

/**
 * Position computes the apparent position of an object.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, precession, nutation, and aberration.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 */
M.position = function (eqFrom, epochFrom, epochTo, mga, mgd) { // (eqFrom, eqTo *coord.Equatorial, epochFrom, epochTo float64, mga sexa.HourAngle, mgd sexa.Angle)  *coord.Equatorial
  let eqTo = precess.position(eqFrom, epochFrom, epochTo, mga, mgd)
  let jd = base.JulianYearToJDE(epochTo)
  let [gDga1, gDgd1] = M.nutation(eqTo.ra, eqTo.dec, jd)
  let [gDga2, gDgd2] = M.aberration(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += gDga1 + gDga2
  eqTo.dec += gDgd1 + gDgd2
  return eqTo
}

/**
 * AberrationRonVondrak uses the Ron-Vondrák expression to compute corrections
 * due to aberration for equatorial coordinates of an object.
 */
M.aberrationRonVondrak = function (ga, gd, jd) { // (ga, gd, jd float64)  (gDga, gDgd float64)
  let T = base.J2000Century(jd)
  let r = {
    T: T,
    L2: 3.1761467 + 1021.3285546 * T,
    L3: 1.7534703 + 628.3075849 * T,
    L4: 6.2034809 + 334.0612431 * T,
    L5: 0.5995465 + 52.9690965 * T,
    L6: 0.8740168 + 21.3299095 * T,
    L7: 5.4812939 + 7.4781599 * T,
    L8: 5.3118863 + 3.8133036 * T,
    Lp: 3.8103444 + 8399.6847337 * T,
    D: 5.1984667 + 7771.3771486 * T,
    Mp: 2.3555559 + 8328.6914289 * T,
    F: 1.6279052 + 8433.4661601 * T
  }
  let Xp = 0
  let Yp = 0
  let Zp = 0
    // sum smaller terms first
  for (var i = 35; i >= 0; i--) {
    let [x, y, z] = rvTerm[i](r)
    Xp += x
    Yp += y
    Zp += z
  }
  let [singa, cosga] = base.sincos(ga)
  let [singd, cosgd] = base.sincos(gd)
    // (23.4) p. 156
  return [(Yp * cosga - Xp * singa) / (c * cosgd), -((Xp * cosga + Yp * singa) * singd - Zp * cosgd) / c]
}

const c = 17314463350 // unit is 1e-8 AU / day

// r = {T, L2, L3, L4, L5, L6, L7, L8, Lp, D, Mp, F}
const rvTerm = [
  function (r) { // 1
    let [sinA, cosA] = base.sincos(r.L3)
    return [(-1719914 - 2 * r.T) * sinA - 25 * cosA,
      (25 - 13 * r.T) * sinA + (1578089 + 156 * r.T) * cosA,
      (10 + 32 * r.T) * sinA + (684185 - 358 * r.T) * cosA
    ]
  },
  function (r) { // 2
    let [sinA, cosA] = base.sincos(2 * r.L3)
    return [(6434 + 141 * r.T) * sinA + (28007 - 107 * r.T) * cosA,
      (25697 - 95 * r.T) * sinA + (-5904 - 130 * r.T) * cosA,
      (11141 - 48 * r.T) * sinA + (-2559 - 55 * r.T) * cosA
    ]
  },
  function (r) { // 3
    let [sinA, cosA] = base.sincos(r.L5)
    return [715 * sinA, 6 * sinA - 657 * cosA, -15 * sinA - 282 * cosA]
  },
  function (r) { // 4
    let [sinA, cosA] = base.sincos(r.Lp)
    return [715 * sinA, -656 * cosA, -285 * cosA]
  },
  function (r) { // 5
    let [sinA, cosA] = base.sincos(3 * r.L3)
    return [(486 - 5 * r.T) * sinA + (-236 - 4 * r.T) * cosA,
      (-216 - 4 * r.T) * sinA + (-446 + 5 * r.T) * cosA, -94 * sinA - 193 * cosA
    ]
  },
  function (r) { // 6
    let [sinA, cosA] = base.sincos(r.L6)
    return [159 * sinA, 2 * sinA - 147 * cosA, -6 * sinA - 61 * cosA]
  },
  function (r) { // 7
    let cosA = Math.cos(r.F)
    return [0, 26 * cosA, -59 * cosA]
  },
  function (r) { // 8
    let [sinA, cosA] = base.sincos(r.Lp + r.Mp)
    return [39 * sinA, -36 * cosA, -16 * cosA]
  },
  function (r) { // 9
    let [sinA, cosA] = base.sincos(2 * r.L5)
    return [33 * sinA - 10 * cosA, -9 * sinA - 30 * cosA, -5 * sinA - 13 * cosA]
  },
  function (r) { // 10
    let [sinA, cosA] = base.sincos(2 * r.L3 - r.L5)
    return [31 * sinA + cosA, sinA - 28 * cosA, -12 * cosA]
  },
  function (r) { // 11
    let [sinA, cosA] = base.sincos(3 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sinA - 28 * cosA, 25 * sinA + 8 * cosA, 11 * sinA + 3 * cosA]
  },
  function (r) { // 12
    let [sinA, cosA] = base.sincos(5 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sinA - 28 * cosA, -25 * sinA - 8 * cosA, -11 * sinA + -3 * cosA]
  },
  function (r) { // 13
    let [sinA, cosA] = base.sincos(2 * r.L2 - r.L3)
    return [21 * sinA, -19 * cosA, -8 * cosA]
  },
  function (r) { // 14
    let [sinA, cosA] = base.sincos(r.L2)
    return [-19 * sinA, 17 * cosA, 8 * cosA]
  },
  function (r) { // 15
    let [sinA, cosA] = base.sincos(r.L7)
    return [17 * sinA, -16 * cosA, -7 * cosA]
  },
  function (r) { // 16
    let [sinA, cosA] = base.sincos(r.L3 - 2 * r.L5)
    return [16 * sinA, 15 * cosA, sinA + 7 * cosA]
  },
  function (r) { // 17
    let [sinA, cosA] = base.sincos(r.L8)
    return [16 * sinA, sinA - 15 * cosA, -3 * sinA - 6 * cosA]
  },
  function (r) { // 18
    let [sinA, cosA] = base.sincos(r.L3 + r.L5)
    return [11 * sinA - cosA, -sinA - 10 * cosA, -sinA - 5 * cosA]
  },
  function (r) { // 19
    let [sinA, cosA] = base.sincos(2 * r.L2 - 2 * r.L3)
    return [-11 * cosA, -10 * sinA, -4 * sinA]
  },
  function (r) { // 20
    let [sinA, cosA] = base.sincos(r.L3 - r.L5)
    return [-11 * sinA - 2 * cosA, -2 * sinA + 9 * cosA, -sinA + 4 * cosA]
  },
  function (r) { // 21
    let [sinA, cosA] = base.sincos(4 * r.L3)
    return [-7 * sinA - 8 * cosA, -8 * sinA + 6 * cosA, -3 * sinA + 3 * cosA]
  },
  function (r) { // 22
    let [sinA, cosA] = base.sincos(3 * r.L3 - 2 * r.L5)
    return [-10 * sinA, 9 * cosA, 4 * cosA]
  },
  function (r) { // 23
    let [sinA, cosA] = base.sincos(r.L2 - 2 * r.L3)
    return [-9 * sinA, -9 * cosA, -4 * cosA]
  },
  function (r) { // 24
    let [sinA, cosA] = base.sincos(2 * r.L2 - 3 * r.L3)
    return [-9 * sinA, -8 * cosA, -4 * cosA]
  },
  function (r) { // 25
    let [sinA, cosA] = base.sincos(2 * r.L6)
    return [-9 * cosA, -8 * sinA, -3 * sinA]
  },
  function (r) { // 26
    let [sinA, cosA] = base.sincos(2 * r.L2 - 4 * r.L3)
    return [-9 * cosA, 8 * sinA, 3 * sinA]
  },
  function (r) { // 27
    let [sinA, cosA] = base.sincos(3 * r.L3 - 2 * r.L4)
    return [8 * sinA, -8 * cosA, -3 * cosA]
  },
  function (r) { // 28
    let [sinA, cosA] = base.sincos(r.Lp + 2 * r.D - r.Mp)
    return [8 * sinA, -7 * cosA, -3 * cosA]
  },
  function (r) { // 29
    let [sinA, cosA] = base.sincos(8 * r.L2 - 12 * r.L3)
    return [-4 * sinA - 7 * cosA, -6 * sinA + 4 * cosA, -3 * sinA + 2 * cosA]
  },
  function (r) { // 30
    let [sinA, cosA] = base.sincos(8 * r.L2 - 14 * r.L3)
    return [-4 * sinA - 7 * cosA, 6 * sinA - 4 * cosA, 3 * sinA - 2 * cosA]
  },
  function (r) { // 31
    let [sinA, cosA] = base.sincos(2 * r.L4)
    return [-6 * sinA - 5 * cosA, -4 * sinA + 5 * cosA, -2 * sinA + 2 * cosA]
  },
  function (r) { // 32
    let [sinA, cosA] = base.sincos(3 * r.L2 - 4 * r.L3)
    return [-sinA - cosA, -2 * sinA - 7 * cosA, sinA - 4 * cosA]
  },
  function (r) { // 33
    let [sinA, cosA] = base.sincos(2 * r.L3 - 2 * r.L5)
    return [4 * sinA - 6 * cosA, -5 * sinA - 4 * cosA, -2 * sinA - 2 * cosA]
  },
  function (r) { // 34
    let [sinA, cosA] = base.sincos(3 * r.L2 - 3 * r.L3)
    return [-7 * cosA, -6 * sinA, -3 * sinA]
  },
  function (r) { // 35
    let [sinA, cosA] = base.sincos(2 * r.L3 - 2 * r.L4)
    return [5 * sinA - 5 * cosA, -4 * sinA - 5 * cosA, -2 * sinA - 2 * cosA]
  },
  function (r) { // 36
    let [sinA, cosA] = base.sincos(r.Lp - 2 * r.D)
    return [5 * sinA, -5 * cosA, -2 * cosA]
  }
]

/**
 * PositionRonVondrak computes the apparent position of an object using
 * the Ron-Vondrák expression for aberration.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, aberration, precession, and nutation.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 *
 * Note the Ron-Vondrák expression is only valid for the epoch J2000.
 * EqFrom must be coordinates at epoch J2000.
 */
M.positionRonVondrak = function (eqFrom, epochTo, mga, mgd) { // (eqFrom, eqTo *coord.Equatorial, epochTo float64, mga sexa.HourAngle, mgd sexa.Angle)  *coord.Equatorial
  let t = epochTo - 2000
  let eqTo = new coord.Equatorial()
  eqTo.ra = eqFrom.ra + mga.rad() * t
  eqTo.dec = eqFrom.dec + mgd.rad() * t
  let jd = base.JulianYearToJDE(epochTo)
  let [gDga, gDgd] = M.aberrationRonVondrak(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += gDga
  eqTo.dec += gDgd
  eqTo = precess.position(eqTo, 2000, epochTo, 0, 0)
  let [gDga1, gDgd1] = M.nutation(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += gDga1
  eqTo.dec += gDgd1
  return eqTo
}
