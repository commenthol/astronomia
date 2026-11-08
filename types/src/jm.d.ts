/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jm
 */
/**
 * JM: Chapter 9, Jewish and Moslem Calendars.
 *
 * The Jewish calendar routines are implemented as a monolithic function,
 * because computations of the various results build off of common
 * intermediate results.
 *
 * The Moslem calendar routines break down nicely into some separate functions.
 *
 * Included in these are two functions that convert between Gregorian and
 * Julian calendar days without going through Julian day (JD).  As such,
 * I suppose, these or similar routines are not in chapter 7, Julian Day.
 * Package base might also be a suitable place for these, but I'm not sure
 * they are used anywhere else in the book.  Anyway, they have the quirk
 * that they are not direct inverses:  JulianToGregorian returns the day number
 * of the day of the Gregorian year, but GregorianToJulian wants the Gregorian
 * month and day of month as input.
 */
/**
 * JewishCalendar returns interesting dates and facts about a given year.
 *
 * Input is a Julian or Gregorian year.
 *
 * Outputs:
 *  A:      (int) Year number in the Jewish Calendar
 *  mP:     (int) Month number of Pesach.
 *  dP:     (int) Day number of Pesach.
 *  mNY:    (int) Month number of the Jewish new year.
 *  dNY:    (int) Day number of the Jewish new year.
 *  months: (int) Number of months in this year.
 *  days:   (int) Number of days in this year.
 * @param {number} y - Julian or Gregorian calendar year.
 * @returns {[number, number, number, number, number, number, number]} Jewish year, Pesach date, new-year date, month count, and year length.
 */
export declare function JewishCalendar(y: number): [number, number, number, number, number, number, number];
/**
 * MoslemToJD converts a Moslem calendar date to a Julian Day.
 * @param {Number} y - year in moslem calendar
 * @param {Number} m - month
 * @param {Number} d - day
 * @returns {Number} jd - Julian day
 */
export declare function MoslemToJD(y: number, m: number, d: number): number;
/**
 * MoslemLeapYear returns true if year y of the Moslem calendar is a leap year.
 * @param {Number} year
 * @returns {Boolean} true if leap year
 */
export declare function MoslemLeapYear(year: number): boolean;
export type DateObj = {
    year: number;
    month: number;
    day: number;
};
/**
 * @typedef {object} DateObj
 * @property {number} year
 * @property {number} month
 * @property {number} day
 */
/**
 * JulianToMoslem takes a year, month, and day of the Julian calendar and returns the equivalent year, month, and day of the Moslem calendar.
 *
 * @param {Number} y - julian year
 * @param {Number} m - julian month
 * @param {Number} d - julian day
 * @returns {DateObj}
 */
export declare function JulianToMoslem(y: number, m: number, d: number): DateObj;
/**
 * String returns the Romanization of the month ("Muḥarram", "Ṣafar", ...).
 * @param {number} m - Moslem calendar month number (1-12).
 * @returns {string} Romanized month name.
 */
export declare function moslemMonth(m: number): string;
declare const _default: {
    JewishCalendar: typeof JewishCalendar;
    MoslemToJD: typeof MoslemToJD;
    MoslemLeapYear: typeof MoslemLeapYear;
    JulianToMoslem: typeof JulianToMoslem;
    moslemMonth: typeof moslemMonth;
};
export default _default;
