/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module sunrise
 */
/**
 * Sunrise: Compute rise, noon, set of the Sun for an earth observer
 */

/* eslint key-spacing: 0 */

import sexa from './sexagesimal'
import solar from './solar'
import julian from './julian'
import rise from './rise'
import sidereal from './sidereal'
import deltat from './deltat'
import globe from './globe'

const stdh0 = {
  sunrise:          new sexa.Angle(true, 0, 50, 0).rad(),
  sunriseEnd:       new sexa.Angle(true, 0, 18, 0).rad(),
  twilight:         new sexa.Angle(true, 6, 0, 0).rad(),
  nauticalTwilight: new sexa.Angle(true, 12, 0, 0).rad(),
  night:            new sexa.Angle(true, 18, 0, 0).rad(),
  goldenHour:       new sexa.Angle(false, 6, 0, 0).rad()
}

const stdh0Sunrise = (refraction) => rise.refraction(stdh0.sunrise, refraction)
const stdh0SunriseEnd = (refraction) => rise.refraction(stdh0.sunriseEnd, refraction)
const stdh0Twilight = (refraction) => rise.refraction(stdh0.twilight, refraction)
const stdh0NauticalTwilight = (refraction) => rise.refraction(stdh0.nauticalTwilight, refraction)
const stdh0Night = (refraction) => rise.refraction(stdh0.night, refraction)
const stdh0GoldenHour = (refraction) => rise.refraction(stdh0.goldenHour, refraction)

export class Sunrise {
  /**
   * Computes time of sunrise, sunset for a given day `date` of an observer on earth given by latitude and longitude.
   * Methods may return `undefined` instead of `julian.Calendar` for latitudes very near the poles.
   * @param {julian.Calendar} date - calendar date
   * @param {globe.Coord} coord - coordinates of observer
   * @param {number} [refraction] - optional refraction
   */
  constructor (date, coord, refraction, _compat) {
    if (typeof coord !== 'object') {
      // TODO REMOVE_V2
      // v1 maintain backwards compatibility with old API (date, lat, lon, refraction)
      const lat = coord
      const lon = refraction
      refraction = _compat
      coord = globe.Coord.fromWgs84(lat, -lon)
    }
    this.date = date
    this.jd = date.midnight().toJD()
    this.refraction = refraction
    this.coord = coord

    this.jde = date.midnight().toJDE()
    this.lat = coord.lat
    this.lon = coord.lon
  }

  times (h0) {
    const {jd, coord} = this
    const ΔT = deltat.deltaT(new julian.Calendar().fromJD(jd).toYear())
    const jde = jd + ΔT / 86400

    const ae = [
      solar.apparentTopocentric(jde - 1, coord),
      solar.apparentTopocentric(jde, coord),
      solar.apparentTopocentric(jde + 1, coord)
    ]
    const α3 = ae.map(i => i.ra)
    const δ3 = ae.map(i => i.dec)

    const Th0 = sidereal.apparent0UT(jd)
    const o = rise.times(coord, ΔT, h0, Th0, α3, δ3)
    const _toDate = (secs) => new julian.Calendar().fromJD(jd + secs / 86400)

    return {
      rise: _toDate(o.rise),
      transit: _toDate(o.transit),
      set: _toDate(o.set)
    }
  }

  _calc (h0, isSet) {
    const r = this.times(h0)
    return isSet ? r.set : r.rise
  }

  /**
   * time of solar transit
   * @return {julian.Calendar} time of noon
   */
  noon () {
    return this.times(stdh0Sunrise(this.refraction)).transit
  }

  /**
   * Solar limb appears over the easter horizon in the morning
   * @return {julian.Calendar} time of sunrise
   */
  rise () {
    return this._calc(stdh0Sunrise(this.refraction), false)
  }

  /**
   * @return {julian.Calendar} time of sunset
   * Solar limb disappears on the western horizon in the evening
   */
  set () {
    return this._calc(stdh0Sunrise(this.refraction), true)
  }

  /**
   * Solar limb is fully visible at the easter horizon
   * @return {julian.Calendar} time of sunrise end
   */
  riseEnd () {
    return this._calc(stdh0SunriseEnd(this.refraction), false)
  }

  /**
   * Solar limb starts disappearing on the western horizon in the evening
   * @return {julian.Calendar} time of sunset start
   */
  setStart () {
    return this._calc(stdh0SunriseEnd(this.refraction), true)
  }

  /**
   * Dawn, there is still enough light for objects to be distinguishable,
   * @return {julian.Calendar} time of dawn
   */
  dawn () {
    return this._calc(stdh0Twilight(this.refraction), false)
  }

  /**
   * Dusk, there is still enough light for objects to be distinguishable
   * Bright stars and planets are visible by naked eye
   * @return {julian.Calendar} time of dusk
   */
  dusk () {
    return this._calc(stdh0Twilight(this.refraction), true)
  }

  /**
   * nautical dawn - Horizon gets visible by naked eye
   * @return {julian.Calendar} time of nautical dawn
   */
  nauticalDawn () {
    return this._calc(stdh0NauticalTwilight(this.refraction), false)
  }

  /**
   * nautical dusk - Horizon is no longer visible by naked eye
   * @return {julian.Calendar} time of nautical dusk
   */
  nauticalDusk () {
    return this._calc(stdh0NauticalTwilight(this.refraction), true)
  }

  /**
   * night starts - No sunlight illumination of the sky, such no intereferance
   * with astronomical observations.
   * @return {julian.Calendar} time of start of night
   */
  nightStart () {
    return this._calc(stdh0Night(this.refraction), true)
  }

  /**
   * night end - Sunlight starts illumination of the sky and interferes
   * with astronomical observations.
   * @return {julian.Calendar} time of end of night
   */
  nightEnd () {
    return this._calc(stdh0Night(this.refraction), false)
  }

  /**
   * Start of "golden hour" before sunset
   * @return {julian.Calendar} time of start of golden hour
   */
  goldenHourStart () {
    return this._calc(stdh0GoldenHour(this.refraction), true)
  }

  /**
   * End of "golden hour" after sunrise
   * @return {julian.Calendar} time of end of golden hour
   */
  goldenHourEnd () {
    return this._calc(stdh0GoldenHour(this.refraction), false)
  }
}

export default {
  Sunrise
}
