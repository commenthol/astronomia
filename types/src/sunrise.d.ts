/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module sunrise
 */
/**
 * Sunrise: Compute rise, noon, set of the Sun for an earth observer
 */
export type Calendar = import('./julian.js').Calendar;
/**
 * @property {Calendar} date - Observer's calendar date.
 * @property {number} jde - Julian ephemeris day at midnight UTC.
 * @property {number} lat - Observer latitude in radians.
 * @property {number} lon - Observer longitude in radians.
 * @property {number|undefined} refraction - Atmospheric refraction correction in radians.
 */
export declare class Sunrise {
    date: import("./julian.js").Calendar;
    jde: number;
    lat: number;
    lon: number;
    refraction: number;
    /**
     * Computes time of sunrise, sunset for a given day `date` of an observer on earth given by latitude and longitude.
     * Methods may return `undefined` instead of `julian.Calendar` for latitudes very near the poles.
     * @param {Calendar} date - calendar date
     * @param {number} lat - latitude of observer in the range of (-89.6, 89.6)
     * @param {number} lon - longitude of observer (measured positively westwards, New York = 40.7° lat, 74° lon)
     * @param {number} [refraction] - optional refraction
     */
    constructor(date: Calendar, lat: number, lon: number, refraction?: number);
    /** @private @param {number} jde - Julian ephemeris day. @returns {number} Noon offset in day fractions. */
    private _calcNoon;
    /**
     * @private
     * @param {number} jde - Julian ephemeris day.
     * @param {number} h0 - Standard altitude in radians.
     * @param {boolean} isSet - Whether to compute sunset rather than sunrise.
     * @returns {number} Event offset in day fractions.
     */
    private _calcRiseOrSet;
    /**
     * @private
     * @param {number} h0 - Standard altitude in radians.
     * @param {boolean} isSet - Whether to compute sunset rather than sunrise.
     * @param {number} step - Search direction in days.
     * @returns {Calendar|undefined} Next event date, if found.
     */
    private _calcPolarDayNight;
    /**
     * @private
     * @param {number} h0 - Standard altitude in radians.
     * @param {boolean} isSet - Whether to compute sunset rather than sunrise.
     * @returns {Calendar|undefined} Event date, if one can be computed.
     */
    private _calc;
    /**
     * time of solar transit
     * @return {Calendar} time of noon
     */
    noon(): Calendar;
    /**
     * Solar limb appears over the easter horizon in the morning
     * @return {Calendar} time of sunrise
     */
    rise(): Calendar;
    /**
     * @return {Calendar} time of sunset
     * Solar limb disappears on the western horizon in the evening
     */
    set(): Calendar;
    /**
     * Solar limb is fully visible at the easter horizon
     * @return {Calendar} time of sunrise end
     */
    riseEnd(): Calendar;
    /**
     * Solar limb starts disappearing on the western horizon in the evening
     * @return {Calendar} time of sunset start
     */
    setStart(): Calendar;
    /**
     * Dawn, there is still enough light for objects to be distinguishable,
     * @return {Calendar} time of dawn
     */
    dawn(): Calendar;
    /**
     * Dusk, there is still enough light for objects to be distinguishable
     * Bright stars and planets are visible by naked eye
     * @return {Calendar} time of dusk
     */
    dusk(): Calendar;
    /**
     * nautical dawn - Horizon gets visible by naked eye
     * @return {Calendar} time of nautical dawn
     */
    nauticalDawn(): Calendar;
    /**
     * nautical dusk - Horizon is no longer visible by naked eye
     * @return {Calendar} time of nautical dusk
     */
    nauticalDusk(): Calendar;
    /**
     * night starts - No sunlight illumination of the sky, such no intereferance
     * with astronomical observations.
     * @return {Calendar} time of start of night
     */
    nightStart(): Calendar;
    /**
     * night end - Sunlight starts illumination of the sky and interferes
     * with astronomical observations.
     * @return {Calendar} time of end of night
     */
    nightEnd(): Calendar;
    /**
     * Start of "golden hour" before sunset
     * @return {Calendar} time of start of golden hour
     */
    goldenHourStart(): Calendar;
    /**
     * End of "golden hour" after sunrise
     * @return {Calendar} time of end of golden hour
     */
    goldenHourEnd(): Calendar;
}
declare const _default: {
    Sunrise: typeof Sunrise;
};
export default _default;
