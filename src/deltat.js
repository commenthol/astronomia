/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module deltat
 */
/**
 * DeltaT: Chapter 10, Dynamical Time and Universal Time.
 *
 * This package uses no functions from the Chapter. Polynoms are from
 * <http://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html>, data sets are from
 * <http://maia.usno.navy.mil/ser7/>
 *
 * Functions in this package compute ΔT for various ranges of dates.
 *
 * ΔT = TD - UT1
 *
 * TD = "Dynamical Time", which is related to:
 *   ET "Ephermis Time", an older term.
 *   TDB "Barycentric Dynamical Time", very close to TD.
 *   TDT "Terrestrial Dynamical Time", a more correct term.
 *   TT "Terrestrial Time", a newer and more correct term.
 *
 * UT = "Universal Time", which is related (if ambiguously) to GMT "Greenwich
 * Mean Time".
 *
 * Terrestrial Time is effectively equal to International Atomic Time (TAI)
 * plus 32.184 seconds exactly: TT = TAI + 32.184
 * The epoch designated "J2000.0" is specified as Julian date 2451545.0 TT,
 * or 2000 January 1, 12h TT. This epoch can also be expressed as
 * 2000 January 1, 11:59:27.816 TAI or 2000 January 1, 11:58:55.816 UTC.
 */

import base from './base'
import interp from './interpolation'
import deltat from '../data/deltat'
import {Calendar, LeapYearGregorian} from './julian'

/**
 * deltaT returns the difference ΔT = TD - UT between Dynamical Time TD and
 * Univeral Time (GMT+12) in seconds
 *
 * Polynoms are from <http://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html>
 * and <http://www.staff.science.uu.nl/~gent0113/deltat/deltat_old.htm>
 *
 * @param {Number} dyear - decimal year
 * @returns {Number} ΔT in seconds.
 */
export function deltaT (dyear) {
  let ΔT
  if (dyear < -500) {
    ΔT = base.horner((dyear - 1820) * 0.01, -20, 0, 32)
  } else if (dyear < 500) {
    ΔT = base.horner(dyear * 0.01,
      10583.6, -1014.41, 33.78311, -5.952053, -0.1798452, 0.022174192, 0.0090316521
    )
  } else if (dyear < 1600) {
    ΔT = base.horner((dyear - 1000) * 0.01,
      1574.2, -556.01, 71.23472, 0.319781, -0.8503463, -0.005050998, 0.0083572073
    )
  } else if (dyear < deltat.historic.first) {
    ΔT = base.horner((dyear - 1600), 120, -0.9808, -0.01532, 1 / 7129)
  } else if (dyear < deltat.data.first) {
    ΔT = interpolate(dyear, deltat.historic)
  } else if (dyear < deltat.data.last - 0.25) { // -0.25 ~= do not consider last 3 months in dataset
    ΔT = interpolateData(dyear, deltat.data)
  } else if (dyear < deltat.prediction.last) {
    ΔT = interpolate(dyear, deltat.prediction)
  } else if (dyear < 2050) {
    ΔT = base.horner((dyear - 2000) / 100, 62.92, 32.217, 55.89)
  } else if (dyear < 2150) {
    ΔT = base.horner((dyear - 1820) / 100, -205.72, 56.28, 32)
  } else {
    const u = (dyear - 1820) / 100
    ΔT = -20 + 32 * u * u
  }
  return ΔT
}

/**
 * interpolation of dataset
 * @private
 * @param {Number} dyear - julian year
 * @returns {Number} ΔT in seconds.
 */
function interpolate (dyear, data) {
  const d3 = interp.len3ForInterpolateX(dyear,
    data.first, data.last, data.table
  )
  return d3.interpolateX(dyear)
}

/**
 * interpolation of dataset from finals2000A with is one entry per month
 * linear interpolation over whole dataset is inaccurate as points per month
 * are not equidistant. Therefore points are approximated using 2nd diff. interpolation
 * from current month using the following two points
 *
 * @private
 * @param {Number} dyear - julian year
 * @returns {Number} ΔT in seconds.
 */
function interpolateData (dyear, data) {
  const [fyear, fmonth] = data.firstYM
  const {year, month, first, last} = monthOfYear(dyear)
  const pos = 12 * (year - fyear) + (month - fmonth)
  const table = data.table.slice(pos, pos + 3)
  const d3 = new interp.Len3(first, last, table)
  return d3.interpolateX(dyear)
}

/**
* Get month of Year from fraction. Fraction differs at leap years.
* @private
* @param {Number} dyear - decimal year
* @return {Object} `{year: Number, month: Number, first: Number, last}`
*/
function monthOfYear (dyear) {
  if (!monthOfYear.data) { // memoize yearly fractions per month
    monthOfYear.data = {0: [], 1: []}
    for (let m = 0; m <= 12; m++) {
      monthOfYear.data[0][m] = new Calendar(1999, m, 1).toYear() - 1999 // non leap year
      monthOfYear.data[1][m] = new Calendar(2000, m, 1).toYear() - 2000 // leap year
    }
  }
  const year = dyear | 0
  const f = dyear - year
  const d = LeapYearGregorian(year) ? 1 : 0
  const data = monthOfYear.data[d]

  let month = 12 // TODO loop could be improved
  while (month > 0 && data[month] > f) {
    month--
  }
  const first = year + data[month]
  const last = month < 11 ? year + data[month + 2] : year + 1 + data[(month + 2) % 12]
  return {year, month, first, last}
}

export default {
  deltaT
}
