/**
 * Eclipse type identifiers returned from Solar and Lunar.
 */
export declare const TYPE: {
    None: number;
    Partial: number;
    Annular: number;
    AnnularTotal: number;
    Penumbral: number;
    Umbral: number;
    Total: number;
};
export type SolarEclipse = {
    /**
     * - Eclipse type identifier.
     */
    type: number;
    /**
     * - Whether the eclipse is central.
     */
    central?: boolean;
    /**
     * - Julian ephemeris day of maximum eclipse.
     */
    jdeMax?: number;
    /**
     * - Eclipse magnitude.
     */
    magnitude?: number;
    /**
     * - Shadow-center distance from Earth's center.
     */
    distance?: number;
    /**
     * - Radius of the umbral cone.
     */
    umbral?: number;
    /**
     * - Radius of the penumbral cone.
     */
    penumbral?: number;
};
export type LunarEclipse = {
    /**
     * - Eclipse type identifier.
     */
    type: number;
    /**
     * - Julian ephemeris day of maximum eclipse.
     */
    jdeMax?: number;
    /**
     * - Eclipse magnitude.
     */
    magnitude?: number;
    /**
     * - Shadow-center distance from the Moon's center.
     */
    distance?: number;
    /**
     * - Radius of the umbral cone.
     */
    umbral?: number;
    /**
     * - Radius of the penumbral cone.
     */
    penumbral?: number;
    /**
     * - Totality semiduration in days.
     */
    sdTotal?: number;
    /**
     * - Partial-phase semiduration in days.
     */
    sdPartial?: number;
    /**
     * - Penumbral-phase semiduration in days.
     */
    sdPenumbral?: number;
};
/**
 * Solar computes quantities related to solar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Partial, Annular, AnnularTotal, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * central is true if the center of the eclipse shadow touches the Earth.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Earth center, in a plane through the center of the Earth.
 *
 * γ is the distance from the eclipse shadow center to the Earth center
 * at time jdeMax.
 *
 * u is the radius of the Moon's umbral cone in the plane of the Earth.
 *
 * p is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude for partial eclipses.  It is not valid for other
 * eclipse types.
 *
 * γ, u, and p are in units of equatorial Earth radii.
 * @param {number} year - Decimal year near the eclipse.
 * @returns {SolarEclipse} Solar eclipse circumstances. Fields other than `type` are omitted when no eclipse occurs.
 */
export declare function solar(year: number): SolarEclipse;
/**
 * Lunar computes quantities related to lunar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Penumbral, Umbral, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Moon center, in a plane through the center of the Moon.
 *
 * γ is the distance from the eclipse shadow center to the moon center
 * at time jdeMax.
 *
 * σ is the radius of the umbral cone in the plane of the Moon.
 *
 * ρ is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude.
 *
 * sd- return values are semidurations of the phases of the eclipse, in days.
 *
 * γ, σ, and ρ are in units of equatorial Earth radii.
 * @param {number} year - Decimal year near the eclipse.
 * @returns {LunarEclipse} Lunar eclipse circumstances. Fields other than `type` are omitted when no eclipse occurs.
 */
export declare function lunar(year: number): LunarEclipse;
declare const _default: {
    TYPE: {
        None: number;
        Partial: number;
        Annular: number;
        AnnularTotal: number;
        Penumbral: number;
        Umbral: number;
        Total: number;
    };
    solar: typeof solar;
    lunar: typeof lunar;
};
export default _default;
