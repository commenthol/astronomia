/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solarxyz
 */
/**
 * Solarxyz: Chapter 26, Rectangular Coordinates of the Sun.
 */
const base = require('./base')
const nutation = require('./nutation')
const solar = require('./solar')
const M = exports

/**
 * Position returns rectangular coordinates referenced to the mean equinox of date.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.position = function (earth, jde) { // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  // (26.1) p. 171
  let {lon, lat, range} = solar.trueVSOP87(earth, jde)
  let [sε, cε] = base.sincos(nutation.meanObliquity(jde))
  let [ss, cs] = base.sincos(lon)
  let sβ = Math.sin(lat)
  let x = range * cs
  let y = range * (ss * cε - sβ * sε)
  let z = range * (ss * sε + sβ * cε)
  return {x, y, z}
}

/**
 * LongitudeJ2000 returns geometric longitude referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {Number} geometric longitude referenced to equinox J2000.
 */
M.longitudeJ2000 = function (earth, jde) {
  let lon = earth.position2000(jde).lon
  return base.pmod(lon + Math.PI - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI)
}

/**
 * PositionJ2000 returns rectangular coordinates referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionJ2000 = function (earth, jde) {
  let {x, y, z} = M.xyz(earth, jde)
  // (26.3) p. 174
  return {
    x: x + 0.00000044036 * y - 0.000000190919 * z,
    y: -0.000000479966 * x + 0.917482137087 * y - 0.397776982902 * z,
    z: 0.397776982902 * y + 0.917482137087 * z
  }
}

M.xyz = function (earth, jde) {
  let {lon, lat, range} = earth.position2000(jde)
  let s = lon + Math.PI
  let β = -lat
  let [ss, cs] = base.sincos(s)
  let [sβ, cβ] = base.sincos(β)
  // (26.2) p. 172
  let x = range * cβ * cs
  let y = range * cβ * ss
  let z = range * sβ
  return {x, y, z}
}

/**
 * PositionB1950 returns rectangular coordinates referenced to B1950.
 *
 * Results are referenced to the mean equator and equinox of the epoch B1950
 * in the FK5 system, not FK4.
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionB1950 = function (earth, jde) { // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  let {x, y, z} = M.xyz(earth, jde)
  return {
    x: 0.999925702634 * x + 0.012189716217 * y + 0.000011134016 * z,
    y: -0.011179418036 * x + 0.917413998946 * y - 0.397777041885 * z,
    z: -0.004859003787 * x + 0.397747363646 * y + 0.917482111428 * z
  }
}

const ζt = [2306.2181, 0.30188, 0.017998]
const zt = [2306.2181, 1.09468, 0.018203]
const θt = [2004.3109, -0.42665, -0.041833]

/**
 * PositionEquinox returns rectangular coordinates referenced to an arbitrary epoch.
 *
 * Position will be computed for given Julian day "jde" but referenced to mean
 * equinox "epoch" (year).
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @param {Number} epoch
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionEquinox = function (earth, jde, epoch) {
  let xyz = M.positionJ2000(earth, jde)
  let x0 = xyz.x
  let y0 = xyz.y
  let z0 = xyz.z
  let t = (epoch - 2000) * 0.01
  let ζ = base.horner(t, ζt) * t * Math.PI / 180 / 3600
  let z = base.horner(t, zt) * t * Math.PI / 180 / 3600
  let θ = base.horner(t, θt) * t * Math.PI / 180 / 3600
  let [sζ, cζ] = base.sincos(ζ)
  let [sz, cz] = base.sincos(z)
  let [sθ, cθ] = base.sincos(θ)
  let xx = cζ * cz * cθ - sζ * sz
  let xy = sζ * cz + cζ * sz * cθ
  let xz = cζ * sθ
  let yx = -cζ * sz - sζ * cz * cθ
  let yy = cζ * cz - sζ * sz * cθ
  let yz = -sζ * sθ
  let zx = -cz * sθ
  let zy = -sz * sθ
  let zz = cθ
  return {
    x: xx * x0 + yx * y0 + zx * z0,
    y: xy * x0 + yy * y0 + zy * z0,
    z: xz * x0 + yz * y0 + zz * z0
  }
}
