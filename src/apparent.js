/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apparent
 */
/**
 * Apparent: Chapter 23, Apparent Place of a Star
 */

import base from './base'
import coord from './coord'
import _nutation from './nutation'
import precess from './precess'
import solar from './solar'
const {cos, tan} = Math

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
export function nutation (α, δ, jd) { // (α, δ, jd float64)  (Δα1, Δδ1 float64)
  const ε = _nutation.meanObliquity(jd)
  const [sinε, cosε] = base.sincos(ε)
  const [Δψ, Δε] = _nutation.nutation(jd)
  const [sinα, cosα] = base.sincos(α)
  const tanδ = tan(δ)
  // (23.1) p. 151
  const Δα1 = (cosε + sinε * sinα * tanδ) * Δψ - cosα * tanδ * Δε
  const Δδ1 = sinε * cosα * Δψ + sinα * Δε
  return [Δα1, Δδ1]
}

/**
 * κ is the constant of aberration in radians.
 */
const κ = 20.49552 * Math.PI / 180 / 3600

/**
 * longitude of perihelian of Earth's orbit.
 */
export function perihelion (T) { // (T float64)  float64
  return base.horner(T, 102.93735, 1.71946, 0.00046) * Math.PI / 180
}

/**
 * EclipticAberration returns corrections due to aberration for ecliptic
 * coordinates of an object.
 */
export function eclipticAberration (λ, β, jd) { // (λ, β, jd float64)  (Δλ, Δβ float64)
  const T = base.J2000Century(jd)
  const {lon, ano} = solar.trueLongitude(T) // eslint-disable-line no-unused-vars
  const e = solar.eccentricity(T)
  const π = perihelion(T)
  const [sβ, cβ] = base.sincos(β)
  const [ssλ, csλ] = base.sincos(lon - λ)
  const [sinπλ, cosπλ] = base.sincos(π - λ)
  // (23.2) p. 151
  const Δλ = κ * (e * cosπλ - csλ) / cβ
  const Δβ = -κ * sβ * (ssλ - e * sinπλ)
  return [Δλ, Δβ]
}

/**
 * Aberration returns corrections due to aberration for equatorial
 * coordinates of an object.
 */
export function aberration (α, δ, jd) { // (α, δ, jd float64)  (Δα2, Δδ2 float64)
  const ε = _nutation.meanObliquity(jd)
  const T = base.J2000Century(jd)
  const {lon, ano} = solar.trueLongitude(T) // eslint-disable-line no-unused-vars
  const e = solar.eccentricity(T)
  const π = perihelion(T)
  const [sinα, cosα] = base.sincos(α)
  const [sinδ, cosδ] = base.sincos(δ)
  const [sins, coss] = base.sincos(lon)
  const [sinπ, cosπ] = base.sincos(π)
  const cosε = cos(ε)
  const q1 = cosα * cosε
  // (23.3) p. 152
  const Δα2 = κ * (e * (q1 * cosπ + sinα * sinπ) - (q1 * coss + sinα * sins)) / cosδ
  const q2 = cosε * (tan(ε) * cosδ - sinα * sinδ)
  const q3 = cosα * sinδ
  const Δδ2 = κ * (e * (cosπ * q2 + sinπ * q3) - (coss * q2 + sins * q3))
  return [Δα2, Δδ2]
}

/**
 * Position computes the apparent position of an object.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, precession, nutation, and aberration.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 */
export function position (eqFrom, epochFrom, epochTo, mα, mδ) { // (eqFrom, eqTo *coord.Equatorial, epochFrom, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  const eqTo = precess.position(eqFrom, epochFrom, epochTo, mα, mδ)
  const jd = base.JulianYearToJDE(epochTo)
  const [Δα1, Δδ1] = nutation(eqTo.ra, eqTo.dec, jd)
  const [Δα2, Δδ2] = aberration(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα1 + Δα2
  eqTo.dec += Δδ1 + Δδ2
  return eqTo
}

/**
 * AberrationRonVondrak uses the Ron-Vondrák expression to compute corrections
 * due to aberration for equatorial coordinates of an object.
 */
export function aberrationRonVondrak (α, δ, jd) { // (α, δ, jd float64)  (Δα, Δδ float64)
  const T = base.J2000Century(jd)
  const r = {
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
  for (let i = 35; i >= 0; i--) {
    const [x, y, z] = rvTerm[i](r)
    Xp += x
    Yp += y
    Zp += z
  }
  const [sinα, cosα] = base.sincos(α)
  const [sinδ, cosδ] = base.sincos(δ)
  // (23.4) p. 156
  return [(Yp * cosα - Xp * sinα) / (c * cosδ), -((Xp * cosα + Yp * sinα) * sinδ - Zp * cosδ) / c]
}

const c = 17314463350 // unit is 1e-8 AU / day

// r = {T, L2, L3, L4, L5, L6, L7, L8, Lp, D, Mp, F}
const rvTerm = [
  function (r) { // 1
    const [sinA, cosA] = base.sincos(r.L3)
    return [(-1719914 - 2 * r.T) * sinA - 25 * cosA,
      (25 - 13 * r.T) * sinA + (1578089 + 156 * r.T) * cosA,
      (10 + 32 * r.T) * sinA + (684185 - 358 * r.T) * cosA
    ]
  },
  function (r) { // 2
    const [sinA, cosA] = base.sincos(2 * r.L3)
    return [(6434 + 141 * r.T) * sinA + (28007 - 107 * r.T) * cosA,
      (25697 - 95 * r.T) * sinA + (-5904 - 130 * r.T) * cosA,
      (11141 - 48 * r.T) * sinA + (-2559 - 55 * r.T) * cosA
    ]
  },
  function (r) { // 3
    const [sinA, cosA] = base.sincos(r.L5)
    return [715 * sinA, 6 * sinA - 657 * cosA, -15 * sinA - 282 * cosA]
  },
  function (r) { // 4
    const [sinA, cosA] = base.sincos(r.Lp)
    return [715 * sinA, -656 * cosA, -285 * cosA]
  },
  function (r) { // 5
    const [sinA, cosA] = base.sincos(3 * r.L3)
    return [(486 - 5 * r.T) * sinA + (-236 - 4 * r.T) * cosA,
      (-216 - 4 * r.T) * sinA + (-446 + 5 * r.T) * cosA, -94 * sinA - 193 * cosA
    ]
  },
  function (r) { // 6
    const [sinA, cosA] = base.sincos(r.L6)
    return [159 * sinA, 2 * sinA - 147 * cosA, -6 * sinA - 61 * cosA]
  },
  function (r) { // 7
    const cosA = Math.cos(r.F)
    return [0, 26 * cosA, -59 * cosA]
  },
  function (r) { // 8
    const [sinA, cosA] = base.sincos(r.Lp + r.Mp)
    return [39 * sinA, -36 * cosA, -16 * cosA]
  },
  function (r) { // 9
    const [sinA, cosA] = base.sincos(2 * r.L5)
    return [33 * sinA - 10 * cosA, -9 * sinA - 30 * cosA, -5 * sinA - 13 * cosA]
  },
  function (r) { // 10
    const [sinA, cosA] = base.sincos(2 * r.L3 - r.L5)
    return [31 * sinA + cosA, sinA - 28 * cosA, -12 * cosA]
  },
  function (r) { // 11
    const [sinA, cosA] = base.sincos(3 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sinA - 28 * cosA, 25 * sinA + 8 * cosA, 11 * sinA + 3 * cosA]
  },
  function (r) { // 12
    const [sinA, cosA] = base.sincos(5 * r.L3 - 8 * r.L4 + 3 * r.L5)
    return [8 * sinA - 28 * cosA, -25 * sinA - 8 * cosA, -11 * sinA + -3 * cosA]
  },
  function (r) { // 13
    const [sinA, cosA] = base.sincos(2 * r.L2 - r.L3)
    return [21 * sinA, -19 * cosA, -8 * cosA]
  },
  function (r) { // 14
    const [sinA, cosA] = base.sincos(r.L2)
    return [-19 * sinA, 17 * cosA, 8 * cosA]
  },
  function (r) { // 15
    const [sinA, cosA] = base.sincos(r.L7)
    return [17 * sinA, -16 * cosA, -7 * cosA]
  },
  function (r) { // 16
    const [sinA, cosA] = base.sincos(r.L3 - 2 * r.L5)
    return [16 * sinA, 15 * cosA, sinA + 7 * cosA]
  },
  function (r) { // 17
    const [sinA, cosA] = base.sincos(r.L8)
    return [16 * sinA, sinA - 15 * cosA, -3 * sinA - 6 * cosA]
  },
  function (r) { // 18
    const [sinA, cosA] = base.sincos(r.L3 + r.L5)
    return [11 * sinA - cosA, -sinA - 10 * cosA, -sinA - 5 * cosA]
  },
  function (r) { // 19
    const [sinA, cosA] = base.sincos(2 * r.L2 - 2 * r.L3)
    return [-11 * cosA, -10 * sinA, -4 * sinA]
  },
  function (r) { // 20
    const [sinA, cosA] = base.sincos(r.L3 - r.L5)
    return [-11 * sinA - 2 * cosA, -2 * sinA + 9 * cosA, -sinA + 4 * cosA]
  },
  function (r) { // 21
    const [sinA, cosA] = base.sincos(4 * r.L3)
    return [-7 * sinA - 8 * cosA, -8 * sinA + 6 * cosA, -3 * sinA + 3 * cosA]
  },
  function (r) { // 22
    const [sinA, cosA] = base.sincos(3 * r.L3 - 2 * r.L5)
    return [-10 * sinA, 9 * cosA, 4 * cosA]
  },
  function (r) { // 23
    const [sinA, cosA] = base.sincos(r.L2 - 2 * r.L3)
    return [-9 * sinA, -9 * cosA, -4 * cosA]
  },
  function (r) { // 24
    const [sinA, cosA] = base.sincos(2 * r.L2 - 3 * r.L3)
    return [-9 * sinA, -8 * cosA, -4 * cosA]
  },
  function (r) { // 25
    const [sinA, cosA] = base.sincos(2 * r.L6)
    return [-9 * cosA, -8 * sinA, -3 * sinA]
  },
  function (r) { // 26
    const [sinA, cosA] = base.sincos(2 * r.L2 - 4 * r.L3)
    return [-9 * cosA, 8 * sinA, 3 * sinA]
  },
  function (r) { // 27
    const [sinA, cosA] = base.sincos(3 * r.L3 - 2 * r.L4)
    return [8 * sinA, -8 * cosA, -3 * cosA]
  },
  function (r) { // 28
    const [sinA, cosA] = base.sincos(r.Lp + 2 * r.D - r.Mp)
    return [8 * sinA, -7 * cosA, -3 * cosA]
  },
  function (r) { // 29
    const [sinA, cosA] = base.sincos(8 * r.L2 - 12 * r.L3)
    return [-4 * sinA - 7 * cosA, -6 * sinA + 4 * cosA, -3 * sinA + 2 * cosA]
  },
  function (r) { // 30
    const [sinA, cosA] = base.sincos(8 * r.L2 - 14 * r.L3)
    return [-4 * sinA - 7 * cosA, 6 * sinA - 4 * cosA, 3 * sinA - 2 * cosA]
  },
  function (r) { // 31
    const [sinA, cosA] = base.sincos(2 * r.L4)
    return [-6 * sinA - 5 * cosA, -4 * sinA + 5 * cosA, -2 * sinA + 2 * cosA]
  },
  function (r) { // 32
    const [sinA, cosA] = base.sincos(3 * r.L2 - 4 * r.L3)
    return [-sinA - cosA, -2 * sinA - 7 * cosA, sinA - 4 * cosA]
  },
  function (r) { // 33
    const [sinA, cosA] = base.sincos(2 * r.L3 - 2 * r.L5)
    return [4 * sinA - 6 * cosA, -5 * sinA - 4 * cosA, -2 * sinA - 2 * cosA]
  },
  function (r) { // 34
    const [sinA, cosA] = base.sincos(3 * r.L2 - 3 * r.L3)
    return [-7 * cosA, -6 * sinA, -3 * sinA]
  },
  function (r) { // 35
    const [sinA, cosA] = base.sincos(2 * r.L3 - 2 * r.L4)
    return [5 * sinA - 5 * cosA, -4 * sinA - 5 * cosA, -2 * sinA - 2 * cosA]
  },
  function (r) { // 36
    const [sinA, cosA] = base.sincos(r.Lp - 2 * r.D)
    return [5 * sinA, -5 * cosA, -2 * cosA]
  }
]

/**
 * PositionRonVondrak computes the apparent position of an object using
 * the Ron-Vondrák expression for aberration.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, aberration, precession, and _nutation.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 *
 * Note the Ron-Vondrák expression is only valid for the epoch J2000.
 * EqFrom must be coordinates at epoch J2000.
 */
export function positionRonVondrak (eqFrom, epochTo, mα, mδ) { // (eqFrom, eqTo *coord.Equatorial, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  const t = epochTo - 2000
  let eqTo = new coord.Equatorial()
  eqTo.ra = eqFrom.ra + mα.rad() * t
  eqTo.dec = eqFrom.dec + mδ.rad() * t
  const jd = base.JulianYearToJDE(epochTo)
  const [Δα, Δδ] = aberrationRonVondrak(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα
  eqTo.dec += Δδ
  eqTo = precess.position(eqTo, 2000, epochTo, 0, 0)
  const [Δα1, Δδ1] = nutation(eqTo.ra, eqTo.dec, jd)
  eqTo.ra += Δα1
  eqTo.dec += Δδ1
  return eqTo
}

export default {
  nutation,
  perihelion,
  eclipticAberration,
  aberration,
  position,
  aberrationRonVondrak,
  positionRonVondrak
}
