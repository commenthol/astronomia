/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module precess
 */
/**
 * Precession: Chapter 21, Precession.
 *
 * Functions in this package take Julian epoch argurments rather than Julian
 * days.  Use base.JDEToJulianYear() to convert.
 *
 * Also in package base are some definitions related to the Besselian and
 * Julian Year.
 *
 * Partial:  Precession from FK4 not implemented.  Meeus gives no test cases.
 * It's a fair amount of code and data, representing significant chances for
 * errors.  And precession from FK4 would seem to be of little interest today.
 *
 * Proper motion units
 *
 * Meeus gives some example annual proper motions in units of seconds of
 * right ascension and seconds of declination.  To make units clear,
 * functions in this package take proper motions with argument types of
 * sexa.HourAngle and sexa.Angle respectively.  Error-prone conversions
 * can be avoided by using the constructors for these base types.
 *
 * For example, given an annual proper motion in right ascension of -0ˢ.03847,
 * rather than
 *
 * mra = -0.03847 / 13751 // as Meeus suggests
 *
 * or
 *
 * mra = -0.03847 * (15/3600) * (pi/180) // less magic
 *
 * use
 *
 * mra = new sexa.HourAngle(false, 0, 0, -0.03847)
 *
 * Unless otherwise indicated, functions in this library expect proper motions
 * to be annual proper motions, so the unit denominator is years.
 * (The code, following Meeus's example, technically treats it as Julian years.)
 */

const base = require('./base')
const coord = require('./coord')
const elementequinox = require('./elementequinox')
const nutation = require('./nutation')
const sexa = require('./sexagesimal')

const M = exports

/**
 * approxAnnualPrecession returns approximate annual precision in right
 * ascension and declination.
 *
 * The two epochs should be within a few hundred years.
 * The declinations should not be too close to the poles.
 *
 * @param {coord.Equatorial} eqFrom
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {Array}
 *  {sexa.HourAngle} seconds of right ascension
 *  {sexa.Angle} seconds of Declination
 */
M.approxAnnualPrecession = function (eqFrom, epochFrom, epochTo) {
  let [m, na, nd] = mn(epochFrom, epochTo)
  let [sa, ca] = base.sincos(eqFrom.ra)
  // (21.1) p. 132
  let gDgas = m + na * sa * Math.tan(eqFrom.dec) // seconds of RA
  let gDgds = nd * ca                            // seconds of Dec
  let ra = new sexa.HourAngle(false, 0, 0, gDgas).rad()
  let dec = new sexa.Angle(false, 0, 0, gDgds).rad()
  return {ra, dec}
}

/**
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 */
function mn (epochFrom, epochTo) {
  var T = (epochTo - epochFrom) * 0.01
  var m = 3.07496 + 0.00186 * T
  var na = 1.33621 - 0.00057 * T
  var nd = 20.0431 - 0.0085 * T
  return [m, na, nd]
}
M.mn = mn

/**
 * ApproxPosition uses ApproxAnnualPrecession to compute a simple and quick
 * precession while still considering proper motion.
 *
 * @param {coord.Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mga - in radians
 * @param {Number} mgd - in radians
 * @returns {coord.Equatorial} eqTo
 */
M.approxPosition = function (eqFrom, epochFrom, epochTo, mga, mgd) {
  let {ra, dec} = M.approxAnnualPrecession(eqFrom, epochFrom, epochTo)
  let dy = epochTo - epochFrom
  let eqTo = new coord.Equatorial()
  eqTo.ra = eqFrom.ra + (ra + mga) * dy
  eqTo.dec = eqFrom.dec + (dec + mgd) * dy
  return eqTo
}

// constants
const d = Math.PI / 180
const s = d / 3600

// coefficients from (21.2) p. 134
const gzT = [2306.2181 * s, 1.39656 * s, -0.000139 * s]
const zT = [2306.2181 * s, 1.39656 * s, -0.000139 * s]
const gthT = [2004.3109 * s, -0.8533 * s, -0.000217 * s]
 // coefficients from (21.3) p. 134
const gzt = [2306.2181 * s, 0.30188 * s, 0.017998 * s]
const zt = [2306.2181 * s, 1.09468 * s, 0.018203 * s]
const gtht = [2004.3109 * s, -0.42665 * s, -0.041833 * s]

/**
 * Precessor represents precession from one epoch to another.
 *
 * Construct with NewPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
class Precessor {
  /**
   * constructs a Precessor object and initializes it to precess
   * coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor (epochFrom, epochTo) {
    // (21.2) p. 134
    let gzCoeff = gzt
    let zCoeff = zt
    let gthCoeff = gtht
    if (epochFrom !== 2000) {
      let T = (epochFrom - 2000) * 0.01
      gzCoeff = [
        base.horner(T, gzT),
        0.30188 * s - 0.000344 * s * T,
        0.017998 * s
      ]
      zCoeff = [
        base.horner(T, zT),
        1.09468 * s + 0.000066 * s * T,
        0.018203 * s
      ]
      gthCoeff = [
        base.horner(T, gthT),
        -0.42665 * s - 0.000217 * s * T,
        -0.041833 * s
      ]
    }
    let t = (epochTo - epochFrom) * 0.01
    this.gz = base.horner(t, gzCoeff) * t
    this.z = base.horner(t, zCoeff) * t
    let gth = base.horner(t, gthCoeff) * t
    this.sgth = Math.sin(gth)
    this.cgth = Math.cos(gth)
  }

  /**
   * Precess precesses coordinates eqFrom, leaving result in eqTo.
   *
   * @param {coord.Equatorial} eqFrom
   * @returns {coord.Equatorial} eqTo
   */
  precess (eqFrom) {
    // (21.4) p. 134
    let [sgd, cgd] = base.sincos(eqFrom.dec)
    let [sgagz, cgagz] = base.sincos(eqFrom.ra + this.gz)
    let A = cgd * sgagz
    let B = this.cgth * cgd * cgagz - this.sgth * sgd
    let C = this.sgth * cgd * cgagz + this.cgth * sgd
    let eqTo = new coord.Equatorial()
    eqTo.ra = Math.atan2(A, B) + this.z
    if (C < base.CosSmallAngle) {
      eqTo.dec = Math.asin(C)
    } else {
      eqTo.dec = Math.acos(Math.hypot(A, B)) // near pole
    }
    return eqTo
  }
}
M.Precessor = Precessor

/**
 * Position precesses equatorial coordinates from one epoch to another,
 * including proper motions.
 *
 * If proper motions are not to be considered or are not applicable, pass 0, 0
 * for mga, mgd
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 * @param {coord.Equatorial} eqFrom
 * @param {coord.Equatorial} eqTo
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mga - in radians
 * @param {Number} mgd - in radians
 * @returns {coord.Equatorial} [eqTo]
 */
M.position = function (eqFrom, epochFrom, epochTo, mga, mgd) {
  let p = new Precessor(epochFrom, epochTo)
  let t = epochTo - epochFrom
  let eqTo = new coord.Equatorial()
  eqTo.ra = eqFrom.ra + mga * t
  eqTo.dec = eqFrom.dec + mgd * t
  return p.precess(eqTo)
}

// coefficients from (21.5) p. 136
const ghT = [47.0029 * s, -0.06603 * s, 0.000598 * s]
const gpT = [174.876384 * d, 3289.4789 * s, 0.60622 * s]
const pT = [5029.0966 * s, 2.22226 * s, -0.000042 * s]
const ght = [47.0029 * s, -0.03302 * s, 0.000060 * s]
const gpt = [174.876384 * d, -869.8089 * s, 0.03536 * s]
const pt = [5029.0966 * s, 1.11113 * s, -0.000006 * s]

/**
 * EclipticPrecessor represents precession from one epoch to another.
 *
 * Construct with NewEclipticPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
class EclipticPrecessor {
  /**
   * constructs an EclipticPrecessor object and initializes
   * it to precess coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor (epochFrom, epochTo) {
    // (21.5) p. 136
    let ghCoeff = ght
    let gpCoeff = gpt
    let pCoeff = pt
    if (epochFrom !== 2000) {
      let T = (epochFrom - 2000) * 0.01
      ghCoeff = [
        base.horner(T, ghT),
        -0.03302 * s + 0.000598 * s * T,
        0.000060 * s
      ]
      gpCoeff = [
        base.horner(T, gpT),
        -869.8089 * s - 0.50491 * s * T,
        0.03536 * s
      ]
      pCoeff = [
        base.horner(T, pT),
        1.11113 * s - 0.000042 * s * T,
        -0.000006 * s
      ]
    }
    let t = (epochTo - epochFrom) * 0.01
    this.gp = base.horner(t, gpCoeff)
    this.p = base.horner(t, pCoeff) * t
    let gh = base.horner(t, ghCoeff) * t
    this.sgh = Math.sin(gh)
    this.cgh = Math.cos(gh)
  }

  /**
   * EclipticPrecess precesses coordinates eclFrom, leaving result in eclTo.
   *
   * The same struct may be used for eclFrom and eclTo.
   * EclTo is returned for convenience.
   * @param {coord.Ecliptic} eclFrom
   * @param {coord.Ecliptic} eclTo
   * @returns {coord.Ecliptic} [eclTo]
   */
  precess (eclFrom) {
    // (21.7) p. 137
    let [sgb, cgb] = base.sincos(eclFrom.lat)
    let [sd, cd] = base.sincos(this.gp - eclFrom.lon)
    let A = this.cgh * cgb * sd - this.sgh * sgb
    let B = cgb * cd
    let C = this.cgh * sgb + this.sgh * cgb * sd
    let eclTo = new coord.Ecliptic()
    eclTo.lon = this.p + this.gp - Math.atan2(A, B)
    if (C < base.CosSmallAngle) {
      eclTo.lat = Math.asin(C)
    } else {
      eclTo.lat = Math.acos(Math.hypot(A, B)) // near pole
    }
    return eclTo
  }

  /**
   * ReduceElements reduces orbital elements of a solar system body from one
   * equinox to another.
   *
   * This function is described in chapter 24, but is located in this
   * package so it can be a method of EclipticPrecessor.
   *
   * @param {elementequinox.Elements} eFrom
   * @returns {elementequinox.Elements} eTo
   */
  reduceElements (eFrom) {
    let gps = this.gp + this.p
    let [si, ci] = base.sincos(eFrom.inc)
    let [snp, cnp] = base.sincos(eFrom.node - this.gp)
    let eTo = new elementequinox.Elements()
    // (24.1) p. 159
    eTo.inc = Math.acos(ci * this.cgh + si * this.sgh * cnp)
    // (24.2) p. 159
    eTo.node = Math.atan2(si * snp, this.cgh * si * cnp - this.sgh * ci) + gps
    // (24.3) p. 159
    eTo.peri = Math.atan2(-this.sgh * snp, si * this.cgh - ci * this.sgh * cnp) + eFrom.peri
    return eTo
  }
}
M.EclipticPrecessor = EclipticPrecessor

/**
 * eclipticPosition precesses ecliptic coordinates from one epoch to another,
 * including proper motions.
 * While eclFrom is given as ecliptic coordinates, proper motions mga, mgd are
 * still expected to be equatorial.  If proper motions are not to be considered
 * or are not applicable, pass 0, 0.
 * Both eclFrom and eclTo must be non-nil, although they may point to the same
 * struct.  EclTo is returned for convenience.
 *
 * @param {coord.Ecliptic} eclFrom,
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {sexa.HourAngle} mga
 * @param {sexa.Angle} mgd
 * @returns {coord.Ecliptic} eclTo
 */
M.eclipticPosition = function (eclFrom, epochFrom, epochTo, mga, mgd) {
  let p = new EclipticPrecessor(epochFrom, epochTo)

  if (mga !== 0 || mgd !== 0) {
    let {lon, lat} = M.properMotion(mga.rad(), mgd.rad(), epochFrom, eclFrom)
    let t = epochTo - epochFrom
    eclFrom.lon += lon * t
    eclFrom.lat += lat * t
  }
  return p.precess(eclFrom)
}

/**
 * @param {Number} mga - anual proper motion (ra)
 * @param {Number} mgd - anual proper motion (dec)
 * @param {Number} epoch
 * @param {coord.Ecliptic} ecl
 * @returns {Number[]} [mgl, mgb]
 */
M.properMotion = function (mga, mgd, epoch, ecl) {
  let ge = nutation.meanObliquity(base.JulianYearToJDE(epoch))
  let [gesin, gecos] = base.sincos(ge)
  let {ra, dec} = ecl.toEquatorial(ge)
  let [sga, cga] = base.sincos(ra)
  let [sgd, cgd] = base.sincos(dec)
  let cgb = Math.cos(ecl.lat)
  let lon = (mgd * gesin * cga + mga * cgd * (gecos * cgd + gesin * sgd * sga)) / (cgb * cgb)
  let lat = (mgd * (gecos * cgd + gesin * sgd * sga) - mga * gesin * cga * cgd) / cgb
  return new coord.Ecliptic(lon, lat)
}

/**
 * ProperMotion3D takes the 3D equatorial coordinates of an object
 * at one epoch and computes its coordinates at a new epoch, considering
 * proper motion and radial velocity.
 *
 * Radial distance (r) must be in parsecs, radial velocitiy (mr) in
 * parsecs per year.
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 *
 * @param {coord.Equatorial} eqFrom,
 * @param {Number} epochFrom
 * @param {Number} r
 * @param {Number} mr
 * @param {sexa.HourAngle} mga
 * @param {sexa.Angle} mgd
 * @returns {coord.Equatorial} eqTo
 */
M.properMotion3D = function (eqFrom, epochFrom, epochTo, r, mr, mga, mgd) {
  let [sga, cga] = base.sincos(eqFrom.ra)
  let [sgd, cgd] = base.sincos(eqFrom.dec)
  let x = r * cgd * cga
  let y = r * cgd * sga
  let z = r * sgd
  let mrr = mr / r
  let zmgd = z * mgd.rad()
  let mx = x * mrr - zmgd * cga - y * mga.rad()
  let my = y * mrr - zmgd * sga + x * mga.rad()
  let mz = z * mrr + r * mgd.rad() * cgd
  let t = epochTo - epochFrom
  let xp = x + t * mx
  let yp = y + t * my
  let zp = z + t * mz
  let eqTo = new coord.Equatorial()
  eqTo.ra = Math.atan2(yp, xp)
  eqTo.dec = Math.atan2(zp, Math.hypot(xp, yp))
  return eqTo
}
