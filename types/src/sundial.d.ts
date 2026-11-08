/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sundial
 */
/**
 * Sundial: Chapter 58, Calculation of a Planar Sundial.
 */
export type PointData = {
    x: number;
    y: number;
};
export type LineData = {
    hour: number;
    points: PointData[];
};
/**
 * General computes data for the general case of a planar sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial, z is zenithal distance of the direction defined by the
 * stylus.  Angles φ, D, and z are in radians.  Units of stylus length a
 * are arbitrary.
 *
 * Results consist of a set of lines, a center point, u, the length of a
 * polar stylus, and ψ, the angle which the polar stylus makes with the plane
 * of the sundial.  The center point, the points defining the hour lines, and
 * u are in units of a, the stylus length.  ψ is in radians.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} D - Gnomonic declination in radians.
 * @param {number} a - Stylus length in arbitrary units.
 * @param {number} z - Zenith distance in radians.
 * @returns {{ lines: LineData[], center: PointData, length: number, angle: number }} Sundial lines and polar-stylus geometry.
 */
export declare function general(φ: number, D: number, a: number, z: number): {
    lines: LineData[];
    center: PointData;
    length: number;
    angle: number;
};
/**
 * Equatorial computes data for a sundial level with the equator.
 *
 * Argument φ is geographic latitude at which the sundial will be located;
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * The sundial will have two sides, north and south.  Results n and s define
 * lines on the north and south sides of the sundial.  Result coordinates
 * are in units of a, the stylus length.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} a - Stylus length in arbitrary units.
 * @returns {{ north: LineData[], south: LineData[] }} Hour lines on the north and south faces.
 */
export declare function equatorial(φ: number, a: number): {
    north: LineData[];
    south: LineData[];
};
/**
 * Horizontal computes data for a horizontal sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located,
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} a - Stylus length in arbitrary units.
 * @returns {{ lines: LineData[], center: PointData, length: number }} Hour lines and polar-stylus geometry.
 */
export declare function horizontal(φ: number, a: number): {
    lines: LineData[];
    center: PointData;
    length: number;
};
/**
 * Vertical computes data for a vertical sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} D - Gnomonic declination in radians.
 * @param {number} a - Stylus length in arbitrary units.
 * @returns {{ lines: LineData[], center: PointData, length: number }} Hour lines and polar-stylus geometry.
 */
export declare function vertical(φ: number, D: number, a: number): {
    lines: LineData[];
    center: PointData;
    length: number;
};
declare const _default: {
    general: typeof general;
    equatorial: typeof equatorial;
    horizontal: typeof horizontal;
    vertical: typeof vertical;
};
export default _default;
