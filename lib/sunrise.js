'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module sunrise
 */
/**
 * Sunrise: Compute rise, noon, set of the Sun for an earth observer
 */

/* eslint key-spacing: 0 */

var base = require('./base');
var eqtime = require('./eqtime');
var sexa = require('./sexagesimal');
var solar = require('./solar');
var julian = require('./julian');
var rise = require('./rise');

var stdh0 = {
  sunrise: new sexa.Angle(true, 0, 50, 0).rad(),
  sunriseEnd: new sexa.Angle(true, 0, 18, 0).rad(),
  twilight: new sexa.Angle(true, 6, 0, 0).rad(),
  nauticalTwilight: new sexa.Angle(true, 12, 0, 0).rad(),
  night: new sexa.Angle(true, 18, 0, 0).rad(),
  goldenHour: new sexa.Angle(false, 6, 0, 0).rad()
};

var stdh0Sunrise = function stdh0Sunrise(refraction) {
  return rise.refraction(stdh0.sunrise, refraction);
};
var stdh0SunriseEnd = function stdh0SunriseEnd(refraction) {
  return rise.refraction(stdh0.sunriseEnd, refraction);
};
var stdh0Twilight = function stdh0Twilight(refraction) {
  return rise.refraction(stdh0.twilight, refraction);
};
var stdh0NauticalTwilight = function stdh0NauticalTwilight(refraction) {
  return rise.refraction(stdh0.nauticalTwilight, refraction);
};
var stdh0Night = function stdh0Night(refraction) {
  return rise.refraction(stdh0.night, refraction);
};
var stdh0GoldenHour = function stdh0GoldenHour(refraction) {
  return rise.refraction(stdh0.goldenHour, refraction);
};

var Sunrise = function () {
  /**
   * Computes time of sunrise, sunset for a given day `date` of an observer on earth given by latitude and longitude.
   * Methods may return `undefined` instead of `julian.Calendar` for latitudes very near the poles.
   * @param {julian.Calendar} date - calendar date
   * @param {number} lat - latitude of observer in the range of (-89.6, 89.6)
   * @param {number} lon - longitude of observer (measured positively westwards, New York = 40.7° lat, 74° lon)
   * @param {number} [refraction] - optional refraction
   */
  function Sunrise(date, lat, lon, refraction) {
    _classCallCheck(this, Sunrise);

    this.date = date;
    this.jde = date.midnight().toJDE();
    this.lat = sexa.angleFromDeg(lat);
    this.lon = sexa.angleFromDeg(lon);
    this.refraction = refraction;
  }

  _createClass(Sunrise, [{
    key: '_calcNoon',
    value: function _calcNoon(jde) {
      var etime = sexa.secFromHourAngle(eqtime.eSmart(jde));
      var delta = sexa.secFromHourAngle(this.lon);
      var time = 43200 /* noon */ + delta - etime; // in seconds
      return base.pmod(time / 86400, 86400);
    }
  }, {
    key: '_calcRiseOrSet',
    value: function _calcRiseOrSet(jde, h0, isSet) {
      var etime = sexa.secFromHourAngle(eqtime.eSmart(jde));
      var solarDec = solar.apparentEquatorial(jde).dec;
      var ha = rise.hourAngle(this.lat, h0, solarDec);
      if (isSet) ha = -ha;
      var delta = sexa.secFromHourAngle(ha - this.lon);
      var time = 43200 /* noon */ - delta - etime; // in seconds
      return time / 86400;
    }
  }, {
    key: '_calcPolarDayNight',
    value: function _calcPolarDayNight(h0, isSet, step) {
      var jde = this.jde;
      var t = void 0;
      var failCnt = 0;
      while (failCnt < 190) {
        // a bit more than days of half a year
        jde += step;
        try {
          t = this._calcRiseOrSet(jde, h0, isSet);
          t = this._calcRiseOrSet(jde + t, h0, isSet);
          break;
        } catch (e) {
          t = undefined;
          failCnt++;
        }
      }
      if (t === undefined) {
        return;
      }
      return new julian.Calendar().fromJDE(jde + t);
    }
  }, {
    key: '_calc',
    value: function _calc(h0, isSet) {
      var t = void 0;
      var jde = this.jde;
      // calc 2times for higher accuracy
      try {
        t = this._calcRiseOrSet(jde, h0, isSet);
        t = this._calcRiseOrSet(jde + t, h0, isSet);
        return new julian.Calendar().fromJDE(jde + t);
      } catch (e) {
        var step = isSet ? -1 : 1;
        var doy = this.date.dayOfYear();
        if ( // overlap with march, september equinoxes
        this.lat > 0 && doy > 76 && doy < 267 || // northern hemisphere
        this.lat < 0 && (doy < 83 || doy > 262) // southern hemisphere
        ) {
            step = -step;
          }
        return this._calcPolarDayNight(h0, isSet, step);
      }
    }

    /**
     * time of solar transit
     * @return {julian.Calendar} time of noon
     */

  }, {
    key: 'noon',
    value: function noon() {
      var jde = this.jde;
      // calc 2times for higher accuracy
      var t = this._calcNoon(jde + this.lon / (2 * Math.PI));
      t = this._calcNoon(jde + t);
      return new julian.Calendar().fromJDE(jde + t);
    }

    /**
     * Solar limb appears over the easter horizon in the morning
     * @return {julian.Calendar} time of sunrise
     */

  }, {
    key: 'rise',
    value: function rise() {
      return this._calc(stdh0Sunrise(this.refraction), false);
    }

    /**
     * @return {julian.Calendar} time of sunset
     * Solar limb disappears on the western horizon in the evening
     */

  }, {
    key: 'set',
    value: function set() {
      return this._calc(stdh0Sunrise(this.refraction), true);
    }

    /**
     * Solar limb is fully visible at the easter horizon
     * @return {julian.Calendar} time of sunrise end
     */

  }, {
    key: 'riseEnd',
    value: function riseEnd() {
      return this._calc(stdh0SunriseEnd(this.refraction), false);
    }

    /**
     * Solar limb starts disappearing on the western horizon in the evening
     * @return {julian.Calendar} time of sunset start
     */

  }, {
    key: 'setStart',
    value: function setStart() {
      return this._calc(stdh0SunriseEnd(this.refraction), true);
    }

    /**
     * Dawn, there is still enough light for objects to be distinguishable,
     * @return {julian.Calendar} time of dawn
     */

  }, {
    key: 'dawn',
    value: function dawn() {
      return this._calc(stdh0Twilight(this.refraction), false);
    }

    /**
     * Dusk, there is still enough light for objects to be distinguishable
     * Bright stars and planets are visible by naked eye
     * @return {julian.Calendar} time of dusk
     */

  }, {
    key: 'dusk',
    value: function dusk() {
      return this._calc(stdh0Twilight(this.refraction), true);
    }

    /**
     * nautical dawn - Horizon gets visible by naked eye
     * @return {julian.Calendar} time of nautical dawn
     */

  }, {
    key: 'nauticalDawn',
    value: function nauticalDawn() {
      return this._calc(stdh0NauticalTwilight(this.refraction), false);
    }

    /**
     * nautical dusk - Horizon is no longer visible by naked eye
     * @return {julian.Calendar} time of nautical dusk
     */

  }, {
    key: 'nauticalDusk',
    value: function nauticalDusk() {
      return this._calc(stdh0NauticalTwilight(this.refraction), true);
    }

    /**
     * night starts - No sunlight illumination of the sky, such no intereferance
     * with astronomical observations.
     * @return {julian.Calendar} time of start of night
     */

  }, {
    key: 'nightStart',
    value: function nightStart() {
      return this._calc(stdh0Night(this.refraction), true);
    }

    /**
     * night end - Sunlight starts illumination of the sky and interferes
     * with astronomical observations.
     * @return {julian.Calendar} time of end of night
     */

  }, {
    key: 'nightEnd',
    value: function nightEnd() {
      return this._calc(stdh0Night(this.refraction), false);
    }

    /**
     * Start of "golden hour" before sunset
     * @return {julian.Calendar} time of start of golden hour
     */

  }, {
    key: 'goldenHourStart',
    value: function goldenHourStart() {
      return this._calc(stdh0GoldenHour(this.refraction), true);
    }

    /**
     * End of "golden hour" after sunrise
     * @return {julian.Calendar} time of end of golden hour
     */

  }, {
    key: 'goldenHourEnd',
    value: function goldenHourEnd() {
      return this._calc(stdh0GoldenHour(this.refraction), false);
    }
  }]);

  return Sunrise;
}();

module.exports = Sunrise;