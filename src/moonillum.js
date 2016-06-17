/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Moonillum: Chapter 48, Illuminated Fraction of the Moon's Disk
 *
 * Also see functions Illuminated and Limb in package base.  The function
 * for computing illuminated fraction given a phase angle (48.1) is
 * base.Illuminated.  Formula (48.3) is implemented as base.Limb.
 */

const base = require('./base')
const M = exports

const p = Math.PI / 180

/**
/**
 * phaseAngleEquatorial computes the phase angle of the Moon given equatorial coordinates.
 *
 * Arguments α, δ, Δ are geocentric right ascension, declination, and distance
 * to the Moon; α0, δ0, R  are coordinates of the Sun.  Angles must be in
 * radians.  Distances must be in the same units as each other.
 *
 * Result in radians.
 */
M.phaseAngleEquatorial = function (α, δ, Δ, α0, δ0, R) { // (α, δ, Δ, α0, δ0, R float64)  float64
  return pa(Δ, R, cosEq(α, δ, α0, δ0))
}

/**
 * cos elongation from equatorial coordinates
 * @private
 */
function cosEq (α, δ, α0, δ0) { // (α, δ, α0, δ0 float64)  float64
  let [sδ, cδ] = base.sincos(δ)
  let [sδ0, cδ0] = base.sincos(δ0)
  return sδ0 * sδ + cδ0 * cδ * Math.cos(α0 - α)
}

/**
 * phase angle from cos elongation and distances
 * @private
 * @param {number} Δ
 * @param {number} R
 * @param {number} cψ
 * @returns {number}
 */
function pa (Δ, R, cψ) {
  let sψ = Math.sin(Math.acos(cψ))
  let i = Math.atan(R * sψ / (Δ - R * cψ))
  if (i < 0) {
    i += Math.PI
  }
  return i
}

/**
 * phaseAngleEquatorial2 computes the phase angle of the Moon given equatorial coordinates.
 *
 * Less accurate than phaseAngleEquatorial.
 *
 * Arguments α, δ are geocentric right ascension and declination of the Moon;
 * α0, δ0  are coordinates of the Sun.  Angles must be in radians.
 *
 * Result in radians.
 */
M.phaseAngleEquatorial2 = function (α, δ, α0, δ0) { // (α, δ, α0, δ0 float64)  float64
  return Math.acos(-cosEq(α, δ, α0, δ0))
}

/**
 * phaseAngleEcliptic computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Arguments λ, β, Δ are geocentric longitude, latitude, and distance
 * to the Moon; λ0, R  are longitude and distance to the Sun.  Angles must be
 * in radians.  Distances must be in the same units as each other.
 *
 * Result in radians.
 */
M.phaseAngleEcliptic = function (λ, β, Δ, λ0, R) { // (λ, β, Δ, λ0, R float64)  float64
  return pa(Δ, R, cosEcl(λ, β, λ0))
}

/**
 * cos elongation from ecliptic coordinates
 * @private
 */
function cosEcl (λ, β, λ0) { // (λ, β, λ0 float64)  float64
  return Math.cos(β) * Math.cos(λ - λ0)
}

/**
 * phaseAngleEcliptic2 computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Less accurate than phaseAngleEcliptic.
 *
 * Arguments λ, β are geocentric longitude and latitude of the Moon;
 * λ0 is longitude of the Sun.  Angles must be in radians.
 *
 * Result in radians.
 *
 * @param {number} λ
 * @param {number} β
 * @param {number} λ0
 * @returns {number}
 */
M.phaseAngleEcliptic2 = function (λ, β, λ0) {
  return Math.acos(-cosEcl(λ, β, λ0))
}

/**
 * phaseAngle3 computes the phase angle of the Moon given a julian day.
 *
 * Less accurate than phaseAngle functions taking coordinates.
 *
 * Result in radians.
 */
M.phaseAngle3 = function (jde) { // (jde float64)  float64
  let T = base.J2000Century(jde)
  let D = base.horner(T, 297.8501921 * p, 445267.1114034 * p,
    -0.0018819 * p, p / 545868, -p / 113065000)
  let m = base.horner(T, 357.5291092 * p, 35999.0502909 * p,
    -0.0001535 * p, p / 24490000)
  let m_ = base.horner(T, 134.9633964 * p, 477198.8675055 * p,
    0.0087414 * p, p / 69699, -p / 14712000)
  return Math.PI - base.pmod(D, 2 * Math.PI) +
    -6.289 * p * Math.sin(m_) +
    2.1 * p * Math.sin(m) +
    -1.274 * p * Math.sin(2 * D - m_) +
    -0.658 * p * Math.sin(2 * D) +
    -0.214 * p * Math.sin(2 * m_) +
    -0.11 * p * Math.sin(D)
}
