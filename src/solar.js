/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solar
 */
/**
 * Solar: Chapter 25, Solar Coordinates.
 *
 * Partial implementation:
 *
 * 1. Higher accuracy positions are not computed with Appendix III but with
 * full VSOP87 as implemented in package planetposition.
 *
 * 2. Higher accuracy correction for aberration (using the formula for
 * variation Δλ on p. 168) is not implemented.  Results for example 25.b
 * already match the full VSOP87 values on p. 165 even with the low accuracy
 * correction for aberration, thus there are no more significant digits that
 * would check a more accurate result.  Also the size of the formula presents
 * significant chance of typographical error.
 */

const base = require('./base')
const coord = require('./coord')
const nutation = require('./nutation')

const M = exports

/**
 * True returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon = true geometric longitude, ☉, in radians
 *   {Number} ano = true anomaly in radians
 */
M.true = function (T) {
  // (25.2) p. 163
  let L0 = base.horner(T, 280.46646, 36000.76983, 0.0003032) *
    Math.PI / 180
  let m = M.meanAnomaly(T)
  let C = (base.horner(T, 1.914602, -0.004817, -0.000014) *
    Math.sin(m) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m)) * Math.PI / 180
  let lon = base.pmod(L0 + C, 2 * Math.PI)
  let ano = base.pmod(m + C, 2 * Math.PI)
  return {lon, ano}
}

/**
 * meanAnomaly returns the mean anomaly of Earth at the given T.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Result is in radians and is not normalized to the range 0..2π.
 */
M.meanAnomaly = function (T) {
  // (25.3) p. 163
  return base.horner(T, 357.52911, 35999.05029, -0.0001537) * Math.PI / 180
}

/**
 * eccentricity returns eccentricity of the Earth's orbit around the sun.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} eccentricity of the Earth's orbit around the sun.
 */
M.eccentricity = function (T) {
  // (25.4) p. 163
  return base.horner(T, 0.016708634, -0.000042037, -0.0000001267)
}

/**
 * Radius returns the Sun-Earth distance in AU.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Sun-Earth distance in AU
 */
M.radius = function (T) {
  let {lon, ano} = M.true(T) // eslint-disable-line
  let e = M.eccentricity(T)
  // (25.5) p. 164
  return 1.000001018 * (1 - e * e) / (1 + e * Math.cos(ano))
}

/**
 * ApparentLongitude returns apparent longitude of the Sun referenced to the true equinox of date.
 * Result includes correction for nutation and aberration.  Unit is radians.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} apparent longitude of the Sun referenced to the true equinox of date.
 */
M.apparentLongitude = function (T) {
  let Ω = node(T)
  let {lon, ano} = M.true(T) // eslint-disable-line
  return lon - 0.00569 * Math.PI / 180 - 0.00478 * Math.PI / 180 * Math.sin(Ω)
}

/**
 * @private
 */
function node (T) {
  return 125.04 * Math.PI / 180 - 1934.136 * Math.PI / 180 * T
}

/**
 * true2000 returns true geometric longitude and anomaly of the sun referenced to equinox J2000.
 * Results are accurate to .01 degree for years 1900 to 2100.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon - true geometric longitude, ☉, in radians
 *   {Number} ano - true anomaly in radians
 */
M.true2000 = function (T) {
  let {lon, ano} = M.true(T)
  lon -= 0.01397 * Math.PI / 180 * T * 100
  return {lon, ano}
}

/**
 * trueEquatorial returns the true geometric position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
M.trueEquatorial = function (jde) {
  let {lon, ano} = M.true(base.J2000Century(jde)) // eslint-disable-line
  let ε = nutation.meanObliquity(jde)
  let [ss, cs] = base.sincos(lon)
  let [sε, cε] = base.sincos(ε)
  // (25.6, 25.7) p. 165
  let ra = Math.atan2(cε * ss, cs)
  let dec = sε * ss
  return new base.Coord(ra, dec)
}

/**
 * apparentEquatorial returns the apparent position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
M.apparentEquatorial = function (jde) {
  let T = base.J2000Century(jde)
  let λ = M.apparentLongitude(T)
  let ε = nutation.meanObliquity(jde)
  let [sλ, cλ] = base.sincos(λ)
  // (25.8) p. 165
  let [sε, cε] = base.sincos(ε + 0.00256 * Math.PI / 180 * Math.cos(node(T)))
  let ra = Math.atan2(cε * sλ, cλ)
  let dec = Math.asin(sε * sλ)
  return new base.Coord(ra, dec)
}

/**
 * trueVSOP87 returns the true geometric position of the sun as ecliptic coordinates.
 *
 * Result computed by full VSOP87 theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Object}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
M.trueVSOP87 = function (planet, jde) {
  let {lon, lat, range} = planet.position(jde)
  let s = lon + Math.PI
  // FK5 correction.
  let λp = base.horner(base.J2000Century(jde),
    s, -1.397 * Math.PI / 180, -0.00031 * Math.PI / 180)
  let [sλp, cλp] = base.sincos(λp)
  let Δβ = 0.03916 / 3600 * Math.PI / 180 * (cλp - sλp)
  // (25.9) p. 166
  lon = base.pmod(s - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI)
  lat = Δβ - lat
  return new base.Coord(lon, lat, range)
}

/**
 * apparentVSOP87 returns the apparent position of the sun as ecliptic coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
M.apparentVSOP87 = function (planet, jde) {
  // note: see duplicated code in ApparentEquatorialVSOP87.
  let {lon, lat, range} = M.trueVSOP87(planet, jde)
  let Δψ = nutation.nutation(jde)[0]
  let a = M.aberration(range)
  lon = lon + Δψ + a
  return new base.Coord(lon, lat, range)
}

/**
 * apparentEquatorialVSOP87 returns the apparent position of the sun as equatorial coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 *   {Number} range - range in AU
 */
M.apparentEquatorialVSOP87 = function (planet, jde) {
  // note: duplicate code from ApparentVSOP87 so we can keep Δε.
  // see also duplicate code in time.E().
  let {lon, lat, range} = M.trueVSOP87(planet, jde)
  let [Δψ, Δε] = nutation.nutation(jde)
  let a = M.aberration(range)
  let λ = lon + Δψ + a
  let ε = nutation.meanObliquity(jde) + Δε
  let {ra, dec} = new coord.Ecliptic(λ, lat).toEquatorial(ε)
  return new base.Coord(ra, dec, range)
}

/**
 * Low precision formula.  The high precision formula is not implemented
 * because the low precision formula already gives position results to the
 * accuracy given on p. 165.  The high precision formula represents lots
 * of typing with associated chance of typos, and no way to test the result.
 * @param {Number} range
 * @returns {Number} aberation
 */
M.aberration = function (range) {
  // (25.10) p. 167
  return -20.4898 / 3600 * Math.PI / 180 / range
}
