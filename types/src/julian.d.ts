/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module julian
 */
/**
 * Julian: Chapter 7, Julian day.
 */
/** 1582-10-05 Julian Date is 1st Gregorian Date (1582-10-15) */
export declare const GREGORIAN0JD = 2299160.5;
export type CalendarDateParts = {
    year: number;
    month: number;
    day: number;
};
export type CalendarMonthDay = {
    month: number;
    day: number;
};
/** @typedef {{year: number, month: number, day: number}} CalendarDateParts */
/** @typedef {{month: number, day: number}} CalendarMonthDay */
/**
 * Base class for CalendarJulian and CalendarGregorian
 * Respects the start of the Gregorian Calendar at `GREGORIAN0JD`
 */
export declare class Calendar {
    year: number;
    month: number;
    day: number;
    /**
     * @param {number|Date} [year] - If `Date` is given then year, month, day is taken from that. Shortcut to `new Calendar().fromDate(date)`
     * @param {number} [month]
     * @param {number} [day]
     */
    constructor(year?: number | Date, month?: number, day?: number);
    /** @returns {{year: number, month: number, day: number}} Calendar date components. */
    getDate(): {
        year: number;
        month: number;
        day: number;
    };
    /** @returns {{hour: number, minute: number, second: number, millisecond: number}} UTC time components. */
    getTime(): {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    };
    /** @returns {string} Calendar date and time in ISO 8601 format. */
    toISOString(): string;
    /** @returns {boolean} Whether this date is in the Gregorian calendar. */
    isGregorian(): boolean;
    /**
     * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
     * proleptic Gregorian Calender
     * @param {Date} date - Proleptic Gregorian date.
     * @returns {this} This calendar, updated from the date.
     */
    fromDate(date: Date): this;
    /**
     * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
     * proleptic Gregorian Calender
     * @returns {Date} proleptic Gregorian date
     */
    toDate(): Date;
    /**
     * converts a calendar date to decimal year
     * @returns {number} decimal year
     */
    toYear(): number;
    /**
     * converts a decimal year to a calendar date
     * @param {number} year - Decimal year.
     * @returns {this} This calendar, updated from the decimal year.
     */
    fromYear(year: number): this;
    /** @returns {boolean} Whether the current calendar year is a leap year. */
    isLeapYear(): boolean;
    /** @returns {number} Julian day for this calendar date. */
    toJD(): number;
    /**
     * Set this calendar date from a Julian day.
     * @param {number} jd - Julian day.
     * @returns {this}
     */
    fromJD(jd: number): this;
    /**
     * Set this calendar date from a Julian ephemeris day.
     * @param {number} jde - Julian ephemeris day.
     * @returns {this}
     */
    fromJDE(jde: number): this;
    /** @returns {number} Julian ephemeris day for this calendar date. */
    toJDE(): number;
    /**
     * Set date to midnight UTC.
     * @returns {this} This calendar, with time set to midnight.
     */
    midnight(): this;
    /**
     * Set date to noon UTC.
     * @returns {this} This calendar, with time set to noon.
     */
    noon(): this;
    /**
     * @param {boolean} td - If true, convert from TD to UT; otherwise convert from UT to TD.
     * @returns {this} This calendar, updated for ΔT.
     */
    deltaT(td: boolean): this;
    /** @returns {number} Day of the week as an integer in the range 0-6. */
    dayOfWeek(): number;
    /** @returns {number} Day number within the current year. */
    dayOfYear(): number;
}
export declare class CalendarJulian extends Calendar {
    /** @returns {number} Julian day for this Julian calendar date. */
    toJD(): number;
    /**
     * Set this Julian calendar date from a Julian day.
     * @param {number} jd - Julian day.
     * @returns {this}
     */
    fromJD(jd: number): this;
    /** @returns {boolean} Whether the Julian year is a leap year. */
    isLeapYear(): boolean;
    /** @returns {number} Day number within the Julian year. */
    dayOfYear(): number;
    /**
     * toGregorian converts a Julian calendar date to a year, month, and day
     * in the Gregorian calendar.
     * @returns {CalendarGregorian}
     */
    toGregorian(): CalendarGregorian;
}
export declare class CalendarGregorian extends Calendar {
    /** @returns {number} Julian day for this Gregorian calendar date. */
    toJD(): number;
    /**
     * Set this Gregorian calendar date from a Julian day.
     * @param {number} jd - Julian day.
     * @returns {this}
     */
    fromJD(jd: number): this;
    /** @returns {boolean} Whether the Gregorian year is a leap year. */
    isLeapYear(): boolean;
    /** @returns {number} Day number within the Gregorian year. */
    dayOfYear(): number;
    toJulian(): CalendarJulian;
}
/**
 * base conversion from calendar date to julian day
 * @param {number} y - Calendar year.
 * @param {number} m - Month number (1-12).
 * @param {number} d - Day of month, possibly fractional.
 * @param {boolean} isJulian - Whether to use the Julian calendar.
 * @returns {number} Julian day.
 */
export declare function CalendarToJD(y: number, m: number, d: number, isJulian: boolean): number;
/**
 * CalendarGregorianToJD converts a Gregorian year, month, and day of month
 * to Julian day.
 *
 * Negative years are valid, back to JD 0.  The result is not valid for
 * dates before JD 0.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} jd - Julian day (float)
 */
export declare function CalendarGregorianToJD(y: number, m: number, d: number): number;
/**
 * CalendarJulianToJD converts a Julian year, month, and day of month to Julian day.
 *
 * Negative years are valid, back to JD 0.  The result is not valid for
 * dates before JD 0.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} jd - Julian day (float)
 */
export declare function CalendarJulianToJD(y: number, m: number, d: number): number;
/**
 * LeapYearJulian returns true if year y in the Julian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Julian Calendar
 */
export declare function LeapYearJulian(y: number): boolean;
/**
 * LeapYearGregorian returns true if year y in the Gregorian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Gregorian Calendar
 */
export declare function LeapYearGregorian(y: number): boolean;
/**
 * JDToCalendar returns the calendar date for the given jd.
 *
 * Note that this function returns a date in either the Julian or Gregorian
 * Calendar, as appropriate.
 * @param {number} jd - Julian day (float)
 * @param {boolean} isJulian - set true for Julian Calendar, otherwise Gregorian is used
 * @returns {CalendarDateParts} Calendar year, month, and day.
 */
export declare function JDToCalendar(jd: number, isJulian: boolean): CalendarDateParts;
/**
 * JDToCalendarGregorian returns the calendar date for the given jd in the Gregorian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {CalendarDateParts} Calendar year, month, and day.
 */
export declare function JDToCalendarGregorian(jd: number): CalendarDateParts;
/**
 * JDToCalendarJulian returns the calendar date for the given jd in the Julian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {CalendarDateParts} Calendar year, month, and day.
 */
export declare function JDToCalendarJulian(jd: number): CalendarDateParts;
/**
 * isJDCalendarGregorian tests if Julian day `jd` falls into the Gregorian calendar
 * @param {number} jd - Julian day (float)
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
export declare function isJDCalendarGregorian(jd: number): boolean;
/**
 * isCalendarGregorian tests if date falls into the Gregorian calendar
 * @param {number} year - julian/gregorian year
 * @param {number} [month] - month of julian/gregorian year
 * @param {number} [day] - day of julian/gregorian year
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
export declare function isCalendarGregorian(year: number, month?: number, day?: number): boolean;
/**
 * JDToDate converts a Julian day `jd` to a Date Object (Gregorian Calendar)
 *
 * Note: Javascript uses the the ISO-8601 calendar, which is a proleptic Gregorian
 * calendar, i.e. it acts as if this calendar was always in effect, even before
 * its year of introduction in 1582. Therefore dates between 1582-10-05 and
 * 1582-10-14 exists.
 *
 * @param {number} jd - Julian day (float)
 * @returns {Date}
 */
export declare function JDToDate(jd: number): Date;
/**
 * DateToJD converts a proleptic Gregorian Date into a Julian day `jd`
 * @param {Date} date
 * @returns {number} jd - Julian day (float)
 */
export declare function DateToJD(date: Date): number;
/**
 * JDEToDate converts a Julian ephemeris day `jde` to a Date Object (Gregorian Calendar)
 * To obtain "Universal Time" (UT) from "Dynamical Time" (TD) the correction ΔT (in seconds) gets applied
 * ```
 * UT = TD - ΔT
 * ```
 * If your use case does not require such accuracy converting `jde` using `JDToDate` is fine.
 *
 * Note: Javascript uses the the ISO-8601 calendar, which is a proleptic Gregorian
 * calendar, i.e. it acts as if this calendar was always in effect, even before
 * its year of introduction in 1582. Therefore dates between 1582-10-05 and
 * 1582-10-14 exists.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns {Date} Javascript Date Object
 */
export declare function JDEToDate(jde: number): Date;
/**
 * DateToJDE converts a Date Object (Gregorian Calendar) to a Julian ephemeris day `jde`
 * To obtain "Dynamical Time" (TD) from "Universal Time" (UT) the correction ΔT (in seconds) gets applied
 * ```
 * TD = UT + ΔT
 * ```
 * If your use case does not require such accuracy converting `Date` using `DateToJD` is fine.
 *
 * @param {Date} date - Javascript Date Object
 * @returns {number} jde - Julian ephemeris day (float)
 */
export declare function DateToJDE(date: Date): number;
/**
 * converts Modified Julian Day `mjd` to Julian Day `jd`
 * @param {Number} mjd - Modified Julian Day
 * @returns {Number} jd - Julian Day
 */
export declare function MJDToJD(mjd: number): number;
/**
 * converts Julian Day `jd` to Modified Julian Day `mjd`
 * The MJD sometimes appear when mentioning orbital elements of artificial satellites.
 * Contrary to JD the MJD begins at Greenwich mean midnight.
 * @param {Number} jd - Julian Day
 * @returns {Number} mjd - Modified Julian Day MJD
 */
export declare function JDToMJD(jd: number): number;
/**
 * DayOfWeek determines the day of the week for a given JD.
 *
 * The value returned is an integer in the range 0 to 6, where 0 represents
 * Sunday.  This is the same convention followed in the time package of the
 * Javascript standard library.
 * @param {number} jd - Julian day (float)
 * @returns {number} (int) 0 == sunday; ...; 6 == saturday
 */
export declare function DayOfWeek(jd: number): number;
/**
 * DayOfYearGregorian computes the day number within the year of the Gregorian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
export declare function DayOfYearGregorian(y: number, m: number, d: number): number;
/**
 * DayOfYearJulian computes the day number within the year of the Julian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
export declare function DayOfYearJulian(y: number, m: number, d: number): number;
/**
 * DayOfYear computes the day number within the year.
 *
 * This form of the function is not specific to the Julian or Gregorian
 * calendar, but you must tell it whether the year is a leap year.
 * @param {number} _y - Calendar year (unused; leap status is provided separately).
 * @param {number} m - Month number.
 * @param {number} d - Day of month.
 * @param {boolean} leap - Whether the calendar year is a leap year.
 * @returns {number} Day number within the year.
 */
export declare function DayOfYear(_y: number, m: number, d: number, leap: boolean): number;
/**
 * DayOfYearToCalendar returns the calendar month and day for a given
 * day of year and leap year status.
 * @param {number} n - day of year (int)
 * @param {boolean} leap - set `true` if `y` is leap year
 * @returns {CalendarMonthDay} Calendar month and day.
 */
export declare function DayOfYearToCalendar(n: number, leap: boolean): CalendarMonthDay;
/**
 * DayOfYearToCalendarGregorian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarGregorian} { (int) year, (int) month, (float) day }
 */
export declare function DayOfYearToCalendarGregorian(year: number, n: number): CalendarGregorian;
/**
 * DayOfYearToCalendarJulian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarJulian} { (int) year, (int) month, (float) day }
 */
export declare function DayOfYearToCalendarJulian(year: number, n: number): CalendarJulian;
declare const _default: {
    GREGORIAN0JD: number;
    Calendar: typeof Calendar;
    CalendarJulian: typeof CalendarJulian;
    CalendarGregorian: typeof CalendarGregorian;
    CalendarToJD: typeof CalendarToJD;
    CalendarGregorianToJD: typeof CalendarGregorianToJD;
    CalendarJulianToJD: typeof CalendarJulianToJD;
    LeapYearJulian: typeof LeapYearJulian;
    LeapYearGregorian: typeof LeapYearGregorian;
    JDToCalendar: typeof JDToCalendar;
    JDToCalendarGregorian: typeof JDToCalendarGregorian;
    JDToCalendarJulian: typeof JDToCalendarJulian;
    isJDCalendarGregorian: typeof isJDCalendarGregorian;
    isCalendarGregorian: typeof isCalendarGregorian;
    JDToDate: typeof JDToDate;
    DateToJD: typeof DateToJD;
    JDEToDate: typeof JDEToDate;
    DateToJDE: typeof DateToJDE;
    MJDToJD: typeof MJDToJD;
    JDToMJD: typeof JDToMJD;
    DayOfWeek: typeof DayOfWeek;
    DayOfYearGregorian: typeof DayOfYearGregorian;
    DayOfYearJulian: typeof DayOfYearJulian;
    DayOfYear: typeof DayOfYear;
    DayOfYearToCalendar: typeof DayOfYearToCalendar;
    DayOfYearToCalendarGregorian: typeof DayOfYearToCalendarGregorian;
    DayOfYearToCalendarJulian: typeof DayOfYearToCalendarJulian;
};
export default _default;
