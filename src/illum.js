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

const base = require('./base')

const M = exports

/**
 * PhaseAngle computes the phase angle of a planet.
 *
 * Argument r is planet's distance to Sun, gD its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 *
 * Result in radians.
 */
M.phaseAngle = function (r, gD, R) { // (r, gD, R float64)  float64
  return Math.acos((r * r + gD * gD - R * R) / (2 * r * gD))
}

/**
 * Fraction computes the illuminated fraction of the disk of a planet.
 *
 * Argument r is planet's distance to Sun, gD its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 */
M.fraction = function (r, gD, R) { // (r, gD, R float64)  float64
  // (41.2) p. 283
  let s = r + gD
  return (s * s - R * R) / (4 * r * gD)
}

/**
 * PhaseAngle2 computes the phase angle of a planet.
 *
 * Arguments L, B, R are heliocentric ecliptical coordinates of the planet.
 * L0, R0 are longitude and radius for Earth, gD is distance from Earth to
 * the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
M.phaseAngle2 = function (L, B, R, L0, R0, gD) { // (L, B, R, L0, R0, gD float64)  float64
  // (41.3) p. 283
  return Math.acos((R - R0 * Math.cos(B) * Math.cos(L - L0)) / gD)
}

/**
 * PhaseAngle3 computes the phase angle of a planet.
 *
 * Arguments L, B are heliocentric ecliptical longitude and latitude of the
 * planet.  x, y, z are cartesian coordinates of the planet, gD is distance
 * from Earth to the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
M.phaseAngle3 = function (L, B, x, y, z, gD) { // (L, B, x, y, z, gD float64)  float64
  // (41.4) p. 283
  let [sL, cL] = base.sincos(L)
  let [sB, cB] = base.sincos(B)
  return Math.acos((x * cB * cL + y * cB * sL + z * sB) / gD)
}

const p = Math.PI / 180

/**
 * FractionVenus computes an approximation of the illumanted fraction of Venus.
 */
M.fractionVenus = function (jde) { // (jde float64)  float64
  let T = base.J2000Century(jde)
  let V = 261.51 * p + 22518.443 * p * T
  let M = 177.53 * p + 35999.05 * p * T
  let N = 50.42 * p + 58517.811 * p * T
  let W = V + 1.91 * p * Math.sin(M) + 0.78 * p * Math.sin(N)
  let gD = Math.sqrt(1.52321 + 1.44666 * Math.cos(W))
  let s = 0.72333 + gD
  return (s * s - 1) / 2.89332 / gD
}

/**
 * Mercury computes the visual magnitude of Mercury.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.mercury = function (r, gD, i) { // (r, gD, i float64)  float64
  let s = i - 50 * p
  return 1.16 + 5 * Math.log10(r * gD) + 0.02838 / p * s + 0.0001023 / p / p * s * s
}

/**
 * Venus computes the visual magnitude of Venus.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.venus = function (r, gD, i) { // (r, gD, i float64)  float64
  return -4 + 5 * Math.log10(r * gD) + (0.01322 / p + 0.0000004247 / p / p / p * i * i) * i
}

/**
 * Mars computes the visual magnitude of Mars.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.mars = function (r, gD, i) { // (r, gD, i float64)  float64
  return -1.3 + 5 * Math.log10(r * gD) + 0.01486 / p * i
}

/**
 * Jupiter computes the visual magnitude of Jupiter.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.jupiter = function (r, gD) { // (r, gD float64)  float64
  return -8.93 + 5 * Math.log10(r * gD)
}

/**
 * Saturn computes the visual magnitude of Saturn.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring. gDU is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 * You can use saturndisk.Disk() to obtain B and gDU.
 */
M.saturn = function (r, gD, B, gDU) { // (r, gD, B, gDU float64)  float64
  let s = Math.sin(Math.abs(B))
  return -8.68 + 5 * Math.log10(r * gD) + 0.044 / p * Math.abs(gDU) - 2.6 * s + 1.25 * s * s
}

/**
 * Uranus computes the visual magnitude of Uranus.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.uranus = function (r, gD) { // (r, gD float64)  float64
  return -6.85 + 5 * Math.log10(r * gD)
}

/**
 * Neptune computes the visual magnitude of Neptune.
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.neptune = function (r, gD) { // (r, gD float64)  float64
  return -7.05 + 5 * Math.log10(r * gD)
}

/**
 * Mercury84 computes the visual magnitude of Mercury.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.mercury84 = function (r, gD, i) { // (r, gD, i float64)  float64
  return base.horner(i, -0.42 + 5 * Math.log10(r * gD),
    0.038 / p, -0.000273 / p / p, 0.000002 / p / p / p)
}

/**
 * Venus84 computes the visual magnitude of Venus.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.venus84 = function (r, gD, i) { // (r, gD, i float64)  float64
  return base.horner(i, -4.4 + 5 * Math.log10(r * gD),
    0.0009 / p, -0.000239 / p / p, 0.00000065 / p / p / p)
}

/**
 * Mars84 computes the visual magnitude of Mars.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.mars84 = function (r, gD, i) { // (r, gD, i float64)  float64
  return -1.52 + 5 * Math.log10(r * gD) + 0.016 / p * i
}

/**
 * Jupiter84 computes the visual magnitude of Jupiter.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth,
 * and i the phase angle in radians.
 */
M.jupiter84 = function (r, gD, i) { // (r, gD, i float64)  float64
  return -9.4 + 5 * Math.log10(r * gD) + 0.005 / p * i
}

/**
 * Saturn84 computes the visual magnitude of Saturn.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring. gDU is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 */
M.saturn84 = function (r, gD, B, gDU) { // (r, gD, B, gDU float64)  float64
  let s = Math.sin(Math.abs(B))
  return -8.88 + 5 * Math.log10(r * gD) + 0.044 / p * Math.abs(gDU) - 2.6 * s + 1.25 * s * s
}

/**
 * Uranus84 computes the visual magnitude of Uranus.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.uranus84 = function (r, gD) { // (r, gD float64)  float64
  return -7.19 + 5 * Math.log10(r * gD)
}

/**
 * Neptune84 computes the visual magnitude of Neptune.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.neptune84 = function (r, gD) { // (r, gD float64)  float64
  return -6.87 + 5 * Math.log10(r * gD)
}

/**
 * Pluto84 computes the visual magnitude of Pluto.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, gD the distance from Earth.
 */
M.pluto84 = function (r, gD) { // (r, gD float64)  float64
  return -1 + 5 * Math.log10(r * gD)
}
