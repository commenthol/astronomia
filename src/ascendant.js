/**
 * @contributor 2024 TheMascot
 * @module ascendant
 * @license MIT
 */

import sexa from './sexagesimal.js'
import { DateToJDE } from './julian.js'
import { meanObliquity } from './nutation.js'
import sidereal from './sidereal.js'

/**
   * Helper function
   * If latitude or longitude is in Decimal Degrees (DD) (format: 43.63871944444445)
   * DDtoDMS() can convert it to Degrees, Minutes and Seconds (format: 43 38 19.39)
   * DMS is the expected format of the calculateAscendant() function
   */
export function DDtoDMS (float) {
  const isNegative = float.toString()[0] === '-'
  const dd = Math.abs(Math.trunc(float))
  const mm = Math.abs(Math.trunc((float % dd) * 60))
  const ss = Math.abs((((float % dd) * 60) % mm) * 60)

  return new sexa.Angle(isNegative, dd, mm, ss)
}

/**
   * Calculating the current ascendant from the spring equinox
   * based on current location on Earth and given date and time
   *
   * @param {object} latAngle - sexa.Angle object created based
   *  on current latitude on Earth of observer (format: boolean, int, int, float)
   * boolean is true if coordinate is from the Southern hemisphere
   * @param {object} lonAngle - sexa.Angle object created based
   *  on current longitude on Earth of observer (format: boolean, int, int, float)
   * boolean is true if coordinate is from the Western hemisphere
   * @param {object} date - proper Javascript new Date() object (if time is not
   *  inputted, JS will use 00:00) (format: yyyy, mm, dd, hh, mm, ss)
   * @returns {float} - the distance of the ascendant from the spring equinox
   * in radians
   */

export function calculateAscendant (latAngle, lonAngle, date) {
  const jde = DateToJDE(date)
  const ε = meanObliquity(jde)

  const θutc = new sexa.Time(sidereal.mean(jde)).sec()
  const myLon = lonAngle.deg() // in degrees for easier calculation
  const myLonInSec = (myLon / 15) * 3600 // divison by 15 converts it to hours
  const θloc = new sexa.Time(θutc + myLonInSec).rad()

  const myLat = latAngle.rad() // in radians for easier calculation

  function calculateAsc (θloc, ε, ϕ) {
    /**
   *  θloc is the local sidereal time, expressed as an angle in radians
   *  ε is the obliquity of the ecliptic
   *  ϕ is the latitude of the observer in radians
   */
    return Math.atan2(Math.cos(θloc), -(Math.sin(θloc) * Math.cos(ε) + Math.tan(ϕ) * Math.sin(ε)))
  }

  return calculateAsc(θloc, ε, myLat)
}

export default {
  calculateAscendant,
  DDtoDMS
}
