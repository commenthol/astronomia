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

const M = exports

/**
 * Nutation returns corrections due to nutation for equatorial coordinates
 * of an object.
 *
 * Results are invalid for objects very near the celestial poles.
 * @param {Number} α - right ascension
 * @param {Number} δ - declination
 * @param {Number} jd - Julian Day
 * @return {Number[]} [Δα1, Δδ1] -
*/
M.nutation = function (α, δ, jd) { // (α, δ, jd float64)  (Δα1, Δδ1 float64)
  let ε = nutation.meanObliquity(jd)
  let [sε, cε] = base.sincos(ε)
  let [Δψ, Δε] = nutation.nutation(jd)
  let [sα, cα] = base.sincos(α)
  let tδ = Math.tan(δ)
    // (23.1) p. 151
  let Δα1 = (cε + sε * sα * tδ) * Δψ - cα * tδ * Δε
  let Δδ1 = sε * cα * Δψ + sα * Δε
  return [Δα1, Δδ1]
}

/**
 * κ is the constant of aberration in radians.
 */
const κ = 20.49552 * Math.PI / 180 / 3600

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
M.eclipticAberration = function (λ, β, jd) { // (λ, β, jd float64)  (Δλ, Δβ float64)
  let T = base.J2000Century(jd)
  let {lon, ano} = solar.true(T) // eslint-disable-line no-unused-vars
  let e = solar.eccentricity(T)
  let π = M.perihelion(T)
  let [sβ, cβ] = base.sincos(β)
  let [ssλ, csλ] = base.sincos(lon - λ)
  let [sπλ, cπλ] = base.sincos(π - λ)
    // (23.2) p. 151
  let Δλ = κ * (e * cπλ - csλ) / cβ
  let Δβ = -κ * sβ * (ssλ - e * sπλ)
  return [Δλ, Δβ]
}

/**
 * Aberration returns corrections due to aberration for equatorial
 * coordinates of an object.
 */
M.aberration = function (α, δ, jd) { // (α, δ, jd float64)  (Δα2, Δδ2 float64)
  let ε = nutation.meanObliquity(jd)
  let T = base.J2000Century(jd)
  let {lon, ano} = solar.true(T) // eslint-disable-line no-unused-vars
  let e = solar.eccentricity(T)
  let π = M.perihelion(T)
  let [sα, cα] = base.sincos(α)
  let [sδ, cδ] = base.sincos(δ)
  let [ss, cs] = base.sincos(lon)
  let [sπ, cπ] = base.sincos(π)
  let cε = Math.cos(ε)
  let tε = Math.tan(ε)
  let q1 = cα * cε
  // (23.3) p. 152
  let Δα2 = κ * (e * (q1 * cπ + sα * sπ) - (q1 * cs + sα * ss)) / cδ
  let q2 = cε * (tε * cδ - sα * sδ)
  let q3 = cα * sδ
  let Δδ2 = κ * (e * (cπ * q2 + sπ * q3) - (cs * q2 + ss * q3))
  return [Δα2, Δδ2]
}

/**
 * Position computes the apparent position of an object.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, precession, nutation, and aberration.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 */
M.position = function (eqFrom, epochFrom, epochTo, mα, mδ) { // (eqFrom, eqTo *coord.Equatorial, epochFrom, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  let eqTo = precess.position(eqFrom, epochFrom, epochTo, mα, mδ)
  let jd = base.JulianYearToJDE(epochTo)
  let [Δα1, Δδ1] = M.nutation(eqTo.ra, eqTo.dec, jd)
  let [Δα2, Δδ2] = M.aberration(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα1 + Δα2
  eqTo.dec += Δδ1 + Δδ2
  return eqTo
}

/**
 * AberrationRonVondrak uses the Ron-Vondrák expression to compute corrections
 * due to aberration for equatorial coordinates of an object.
 */
M.aberrationRonVondrak = function (α, δ, jd) { // (α, δ, jd float64)  (Δα, Δδ float64)
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
  let [sα, cα] = base.sincos(α)
  let [sδ, cδ] = base.sincos(δ)
    // (23.4) p. 156
  return [(Yp * cα - Xp * sα) / (c * cδ), -((Xp * cα + Yp * sα) * sδ - Zp * cδ) / c]
}

const c = 17314463350 // unit is 1e-8 AU / day

// r = {T, L2, L3, L4, L5, L6, L7, L8, Lp, D, Mp, F}
const rvTerm = [
  function (r) { // 1
    let [sA, cA] = base.sincos(r.L3)
    return [(-1719914 - 2 * r.T) * sA - 25 * cA,
      (25 - 13 * r.T) * sA + (1578089 + 156 * r.T) * cA,
      (10 + 32 * r.T) * sA + (684185 - 358 * r.T) * cA
    ]
  },
  function (r) { // 2
    let [sA, cA] = base.sincos(2 * r.L3)
    return [(6434 + 141 * r.T) * sA + (28007 - 107 * r.T) * cA,
      (25697 - 95 * r.T) * sA + (-5904 - 130 * r.T) * cA,
      (11141 - 48 * r.T) * sA + (-2559 - 55 * r.T) * cA
    ]
  },
  function (r) { // 3
    let [sA, cA] = base.sincos(r.L5)
    return [715 * sA, 6 * sA - 657 * cA, -15 * sA - 282 * cA]
  },
  function (r) { // 4
    let [sA, cA] = base.sincos(r.Lp)
    return [715 * sA, -656 * cA, -285 * cA]
  },
  function (r) { // 5
    let [sA, cA] = base.sincos(3 * r.L3)
    return [(486 - 5 * r.T) * sA + (-236 - 4 * r.T) * cA,
      (-216 - 4 * r.T) * sA + (-446 + 5 * r.T) * cA, -94 * sA - 193 * cA
    ]
  },
  function (r) { // 6
    let [sA, cA] = base.sincos(r.L6)
    return [159 * sA, 2 * sA - 147 * cA, -6 * sA - 61 * cA]
  },
  function (r) { // 7
    let cA = Math.cos(r.F)
    return [0, 26 * cA, -59 * cA]
  },
  function (r) { // 8
    let [sA, cA] = base.sincos(r.Lp + r.Mp)
    return [39 * sA, -36 * cA, -16 * cA]
  },
  function (r) { // 9
    let [sA, cA] = base.sincos(2 * r.L5)
    return [33 * sA - 10 * cA, -9 * sA - 30 * cA, -5 * sA - 13 * cA]
  },
  function (r) { // 10
    let [sA, cA] = base.sincos(2 * r.L3 - r.L5)
    return [31 * sA + cA, sA - 28 * cA, -12 * cA]
  },
  function (r) { // 11
    let [sA, cA] = base.sincos(3 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sA - 28 * cA, 25 * sA + 8 * cA, 11 * sA + 3 * cA]
  },
  function (r) { // 12
    let [sA, cA] = base.sincos(5 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sA - 28 * cA, -25 * sA - 8 * cA, -11 * sA + -3 * cA]
  },
  function (r) { // 13
    let [sA, cA] = base.sincos(2 * r.L2 - r.L3)
    return [21 * sA, -19 * cA, -8 * cA]
  },
  function (r) { // 14
    let [sA, cA] = base.sincos(r.L2)
    return [-19 * sA, 17 * cA, 8 * cA]
  },
  function (r) { // 15
    let [sA, cA] = base.sincos(r.L7)
    return [17 * sA, -16 * cA, -7 * cA]
  },
  function (r) { // 16
    let [sA, cA] = base.sincos(r.L3 - 2 * r.L5)
    return [16 * sA, 15 * cA, sA + 7 * cA]
  },
  function (r) { // 17
    let [sA, cA] = base.sincos(r.L8)
    return [16 * sA, sA - 15 * cA, -3 * sA - 6 * cA]
  },
  function (r) { // 18
    let [sA, cA] = base.sincos(r.L3 + r.L5)
    return [11 * sA - cA, -sA - 10 * cA, -sA - 5 * cA]
  },
  function (r) { // 19
    let [sA, cA] = base.sincos(2 * r.L2 - 2 * r.L3)
    return [-11 * cA, -10 * sA, -4 * sA]
  },
  function (r) { // 20
    let [sA, cA] = base.sincos(r.L3 - r.L5)
    return [-11 * sA - 2 * cA, -2 * sA + 9 * cA, -sA + 4 * cA]
  },
  function (r) { // 21
    let [sA, cA] = base.sincos(4 * r.L3)
    return [-7 * sA - 8 * cA, -8 * sA + 6 * cA, -3 * sA + 3 * cA]
  },
  function (r) { // 22
    let [sA, cA] = base.sincos(3 * r.L3 - 2 * r.L5)
    return [-10 * sA, 9 * cA, 4 * cA]
  },
  function (r) { // 23
    let [sA, cA] = base.sincos(r.L2 - 2 * r.L3)
    return [-9 * sA, -9 * cA, -4 * cA]
  },
  function (r) { // 24
    let [sA, cA] = base.sincos(2 * r.L2 - 3 * r.L3)
    return [-9 * sA, -8 * cA, -4 * cA]
  },
  function (r) { // 25
    let [sA, cA] = base.sincos(2 * r.L6)
    return [-9 * cA, -8 * sA, -3 * sA]
  },
  function (r) { // 26
    let [sA, cA] = base.sincos(2 * r.L2 - 4 * r.L3)
    return [-9 * cA, 8 * sA, 3 * sA]
  },
  function (r) { // 27
    let [sA, cA] = base.sincos(3 * r.L3 - 2 * r.L4)
    return [8 * sA, -8 * cA, -3 * cA]
  },
  function (r) { // 28
    let [sA, cA] = base.sincos(r.Lp + 2 * r.D - r.Mp)
    return [8 * sA, -7 * cA, -3 * cA]
  },
  function (r) { // 29
    let [sA, cA] = base.sincos(8 * r.L2 - 12 * r.L3)
    return [-4 * sA - 7 * cA, -6 * sA + 4 * cA, -3 * sA + 2 * cA]
  },
  function (r) { // 30
    let [sA, cA] = base.sincos(8 * r.L2 - 14 * r.L3)
    return [-4 * sA - 7 * cA, 6 * sA - 4 * cA, 3 * sA - 2 * cA]
  },
  function (r) { // 31
    let [sA, cA] = base.sincos(2 * r.L4)
    return [-6 * sA - 5 * cA, -4 * sA + 5 * cA, -2 * sA + 2 * cA]
  },
  function (r) { // 32
    let [sA, cA] = base.sincos(3 * r.L2 - 4 * r.L3)
    return [-sA - cA, -2 * sA - 7 * cA, sA - 4 * cA]
  },
  function (r) { // 33
    let [sA, cA] = base.sincos(2 * r.L3 - 2 * r.L5)
    return [4 * sA - 6 * cA, -5 * sA - 4 * cA, -2 * sA - 2 * cA]
  },
  function (r) { // 34
    let [sA, cA] = base.sincos(3 * r.L2 - 3 * r.L3)
    return [-7 * cA, -6 * sA, -3 * sA]
  },
  function (r) { // 35
    let [sA, cA] = base.sincos(2 * r.L3 - 2 * r.L4)
    return [5 * sA - 5 * cA, -4 * sA - 5 * cA, -2 * sA - 2 * cA]
  },
  function (r) { // 36
    let [sA, cA] = base.sincos(r.Lp - 2 * r.D)
    return [5 * sA, -5 * cA, -2 * cA]
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
M.positionRonVondrak = function (eqFrom, epochTo, mα, mδ) { // (eqFrom, eqTo *coord.Equatorial, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  let t = epochTo - 2000
  let eqTo = new coord.Equatorial()
  eqTo.ra = eqFrom.ra + mα.rad() * t
  eqTo.dec = eqFrom.dec + mδ.rad() * t
  let jd = base.JulianYearToJDE(epochTo)
  let [Δα, Δδ] = M.aberrationRonVondrak(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα
  eqTo.dec += Δδ
  eqTo = precess.position(eqTo, 2000, epochTo, 0, 0)
  let [Δα1, Δδ1] = M.nutation(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα1
  eqTo.dec += Δδ1
  return eqTo
}
