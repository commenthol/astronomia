/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module illum
 */
/**
 * Illum: Chapter 41, Illuminated Fraction of the Disk and Magnitude of a Planet.
 *
 * Also see functions `illuminated` and `limb` in package base.  While this
 * chapter title includes "illumnated fraction," the function for computing
 * illuminated fraction given a phase angle is `base.illuminated`.
 * `base.limb` is the function mentioned at the bottom of p. 283.0
 */

import base from './base.js'

const { toDeg } = base
const D2R = Math.PI / 180

/**
 * PhaseAngle computes the phase angle of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 *
 * Result in radians.
 */
export function phaseAngle (r, Δ, R) { // (r, Δ, R float64)  float64
  return Math.acos((r * r + Δ * Δ - R * R) / (2 * r * Δ))
}

/**
 * Fraction computes the illuminated fraction of the disk of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 */
export function fraction (r, Δ, R) { // (r, Δ, R float64)  float64
  // (41.2) p. 283
  const s = r + Δ
  return (s * s - R * R) / (4 * r * Δ)
}

/**
 * PhaseAngle2 computes the phase angle of a planet.
 *
 * Arguments L, B, R are heliocentric ecliptical coordinates of the planet.
 * L0, R0 are longitude and radius for Earth, Δ is distance from Earth to
 * the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
export function phaseAngle2 (L, B, R, L0, R0, Δ) { // (L, B, R, L0, R0, Δ float64)  float64
  // (41.3) p. 283
  return Math.acos((R - R0 * Math.cos(B) * Math.cos(L - L0)) / Δ)
}

/**
 * PhaseAngle3 computes the phase angle of a planet.
 *
 * Arguments L, B are heliocentric ecliptical longitude and latitude of the
 * planet.  x, y, z are cartesian coordinates of the planet, Δ is distance
 * from Earth to the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
export function phaseAngle3 (L, B, x, y, z, Δ) { // (L, B, x, y, z, Δ float64)  float64
  // (41.4) p. 283
  const [sL, cL] = base.sincos(L)
  const [sB, cB] = base.sincos(B)
  return Math.acos((x * cB * cL + y * cB * sL + z * sB) / Δ)
}

/**
 * FractionVenus computes an approximation of the illumanted fraction of Venus.
 */
export function fractionVenus (jde) { // (jde float64)  float64
  const T = base.J2000Century(jde)
  const V = (261.51 + 22518.443 * T) * D2R
  const M = (177.53 + 35999.05 * T) * D2R
  const N = (50.42 + 58517.811 * T) * D2R
  const W = V + (1.91 * Math.sin(M) + 0.78 * Math.sin(N)) * D2R
  const Δ = Math.sqrt(1.52321 + 1.44666 * Math.cos(W))
  const s = 0.72333 + Δ
  return (s * s - 1) / 2.89332 / Δ
}

/**
 * Mercury computes the visual magnitude of Mercury.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function mercury (r, Δ, i) { // (r, Δ, i float64)  float64
  const s = toDeg(i) - 50
  return 1.16 + 5 * Math.log10(r * Δ) + (0.02838 + 0.0001023 * s) * s
}

/**
 * Venus computes the visual magnitude of Venus.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function venus (r, Δ, i) { // (r, Δ, i float64)  float64
  const iDeg = toDeg(i)
  return -4 + 5 * Math.log10(r * Δ) + (0.01322 + 0.0000004247 * iDeg * iDeg) * iDeg
}

/**
 * Mars computes the visual magnitude of Mars.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function mars (r, Δ, i) { // (r, Δ, i float64)  float64
  return -1.3 + 5 * Math.log10(r * Δ) + 0.01486 * toDeg(i)
}

/**
 * Jupiter computes the visual magnitude of Jupiter.
 * Formula by G. Müller
 * Effect of phase not considered
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function jupiter (r, Δ) { // (r, Δ float64)  float64
  return -8.93 + 5 * Math.log10(r * Δ)
}

/**
 * Saturn computes the visual magnitude of Saturn.
 * Formula by G. Müller
 * Sun's altitude above the plane of the ring is not considered.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring.
 * ΔU (in radians) is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 * You can use saturndisk.Disk() to obtain B and ΔU.
 */
export function saturn (r, Δ, B, ΔU) { // (r, Δ, B, ΔU float64)  float64
  const s = Math.sin(Math.abs(B))
  return -8.68 + 5 * Math.log10(r * Δ) + 0.044 * Math.abs(toDeg(ΔU)) - 2.6 * s + 1.25 * s * s
}

/**
 * Uranus computes the visual magnitude of Uranus.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function uranus (r, Δ) { // (r, Δ float64)  float64
  return -6.85 + 5 * Math.log10(r * Δ)
}

/**
 * Neptune computes the visual magnitude of Neptune.
 * Formulae by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function neptune (r, Δ) { // (r, Δ float64)  float64
  return -7.05 + 5 * Math.log10(r * Δ)
}

/**
 * Mercury84 computes the visual magnitude of Mercury.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function mercury84 (r, Δ, i) { // (r, Δ, i float64)  float64
  return base.horner(toDeg(i), -0.42 + 5 * Math.log10(r * Δ),
    0.038, -0.000273, 0.000002)
}

/**
 * Venus84 computes the visual magnitude of Venus.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function venus84 (r, Δ, i) { // (r, Δ, i float64)  float64
  return base.horner(toDeg(i), -4.4 + 5 * Math.log10(r * Δ),
    0.0009, 0.000239, -0.00000065)
}

/**
 * Mars84 computes the visual magnitude of Mars.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function mars84 (r, Δ, i) { // (r, Δ, i float64)  float64
  return -1.52 + 5 * Math.log10(r * Δ) + 0.016 * toDeg(i)
}

/**
 * Jupiter84 computes the visual magnitude of Jupiter.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
export function jupiter84 (r, Δ, i) { // (r, Δ, i float64)  float64
  return -9.4 + 5 * Math.log10(r * Δ) + 0.005 * toDeg(i)
}

/**
 * Saturn84 computes the visual magnitude of Saturn.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring.
 * ΔU (in radians) is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 */
export function saturn84 (r, Δ, B, ΔU) { // (r, Δ, B, ΔU float64)  float64
  const s = Math.sin(Math.abs(B))
  return -8.88 + 5 * Math.log10(r * Δ) + 0.044 * Math.abs(toDeg(ΔU)) - 2.6 * s + 1.25 * s * s
}

/**
 * Uranus84 computes the visual magnitude of Uranus.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function uranus84 (r, Δ) { // (r, Δ float64)  float64
  return -7.19 + 5 * Math.log10(r * Δ)
}

/**
 * Neptune84 computes the visual magnitude of Neptune.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function neptune84 (r, Δ) { // (r, Δ float64)  float64
  return -6.87 + 5 * Math.log10(r * Δ)
}

/**
 * Pluto84 computes the visual magnitude of Pluto.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
export function pluto84 (r, Δ) { // (r, Δ float64)  float64
  return -1 + 5 * Math.log10(r * Δ)
}

export default {
  phaseAngle,
  fraction,
  phaseAngle2,
  phaseAngle3,
  fractionVenus,
  mercury,
  venus,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  mercury84,
  venus84,
  mars84,
  jupiter84,
  saturn84,
  uranus84,
  neptune84,
  pluto84
}
