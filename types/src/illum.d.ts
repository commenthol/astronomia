/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module illum
 */
/**
 * Illum: Chapter 41, Illuminated Fraction of the Disk and Magnitude of a Planet.
 *
 * Also see functions `illuminated` and `limb` in package base.  While this
 * chapter title includes "illumnated fraction," the function for computing
 * illuminated fraction given a phase angle is `base.illuminated`.
 * `base.limb` is the function mentioned at the bottom of p. 283.0
 */
/**
 * PhaseAngle computes the phase angle of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 *
 * Result in radians.
 * @param {number} r - Planet-to-Sun distance in AU.
 * @param {number} Δ - Planet-to-Earth distance in AU.
 * @param {number} R - Earth-to-Sun distance in AU.
 * @returns {number} Phase angle in radians.
 */
export declare function phaseAngle(r: number, Δ: number, R: number): number;
/**
 * Fraction computes the illuminated fraction of the disk of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 * @param {number} r - Planet-to-Sun distance in AU.
 * @param {number} Δ - Planet-to-Earth distance in AU.
 * @param {number} R - Earth-to-Sun distance in AU.
 * @returns {number} Illuminated fraction of the planetary disk.
 */
export declare function fraction(r: number, Δ: number, R: number): number;
/**
 * PhaseAngle2 computes the phase angle of a planet.
 *
 * Arguments L, B, R are heliocentric ecliptical coordinates of the planet.
 * L0, R0 are longitude and radius for Earth, Δ is distance from Earth to
 * the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 * @param {number} L - Planet heliocentric ecliptic longitude in radians.
 * @param {number} B - Planet heliocentric ecliptic latitude in radians.
 * @param {number} R - Planet heliocentric distance in AU.
 * @param {number} L0 - Earth's heliocentric longitude in radians.
 * @param {number} R0 - Earth's heliocentric distance in AU.
 * @param {number} Δ - Planet-to-Earth distance in AU.
 * @returns {number} Phase angle in radians.
 */
export declare function phaseAngle2(L: number, B: number, R: number, L0: number, R0: number, Δ: number): number;
/**
 * PhaseAngle3 computes the phase angle of a planet.
 *
 * Arguments L, B are heliocentric ecliptical longitude and latitude of the
 * planet.  x, y, z are cartesian coordinates of the planet, Δ is distance
 * from Earth to the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 * @param {number} L - Planet heliocentric ecliptic longitude in radians.
 * @param {number} B - Planet heliocentric ecliptic latitude in radians.
 * @param {number} x - Planet rectangular x-coordinate.
 * @param {number} y - Planet rectangular y-coordinate.
 * @param {number} z - Planet rectangular z-coordinate.
 * @param {number} Δ - Planet-to-Earth distance in AU.
 * @returns {number} Phase angle in radians.
 */
export declare function phaseAngle3(L: number, B: number, x: number, y: number, z: number, Δ: number): number;
/**
 * FractionVenus computes an approximation of the illumanted fraction of Venus.
 * @param {number} jde - Julian ephemeris day.
 * @returns {number} Approximate illuminated fraction of Venus.
 */
export declare function fractionVenus(jde: number): number;
/**
 * Mercury computes the visual magnitude of Mercury.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Mercury's distance from the Sun in AU.
 * @param {number} Δ - Mercury's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Mercury.
 */
export declare function mercury(r: number, Δ: number, i: number): number;
/**
 * Venus computes the visual magnitude of Venus.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Venus's distance from the Sun in AU.
 * @param {number} Δ - Venus's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Venus.
 */
export declare function venus(r: number, Δ: number, i: number): number;
/**
 * Mars computes the visual magnitude of Mars.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Mars's distance from the Sun in AU.
 * @param {number} Δ - Mars's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Mars.
 */
export declare function mars(r: number, Δ: number, i: number): number;
/**
 * Jupiter computes the visual magnitude of Jupiter.
 * Formula by G. Müller
 * Effect of phase not considered
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Jupiter's distance from the Sun in AU.
 * @param {number} Δ - Jupiter's distance from Earth in AU.
 * @returns {number} Visual magnitude of Jupiter.
 */
export declare function jupiter(r: number, Δ: number): number;
/**
 * Saturn computes the visual magnitude of Saturn.
 * Formula by G. Müller
 * Sun's altitude above the plane of the ring is not considered.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring.
 * ΔU (in radians) is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 * You can use saturndisk.Disk() to obtain B and ΔU.
 * @param {number} r - Saturn's distance from the Sun in AU.
 * @param {number} Δ - Saturn's distance from Earth in AU.
 * @param {number} B - Saturnicentric latitude of Earth in radians.
 * @param {number} ΔU - Difference in Saturnicentric longitudes in radians.
 * @returns {number} Visual magnitude of Saturn.
 */
export declare function saturn(r: number, Δ: number, B: number, ΔU: number): number;
/**
 * Uranus computes the visual magnitude of Uranus.
 * Formula by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Uranus's distance from the Sun in AU.
 * @param {number} Δ - Uranus's distance from Earth in AU.
 * @returns {number} Visual magnitude of Uranus.
 */
export declare function uranus(r: number, Δ: number): number;
/**
 * Neptune computes the visual magnitude of Neptune.
 * Formulae by G. Müller
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Neptune's distance from the Sun in AU.
 * @param {number} Δ - Neptune's distance from Earth in AU.
 * @returns {number} Visual magnitude of Neptune.
 */
export declare function neptune(r: number, Δ: number): number;
/**
 * Mercury84 computes the visual magnitude of Mercury.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Mercury's distance from the Sun in AU.
 * @param {number} Δ - Mercury's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Mercury using the 1984 formula.
 */
export declare function mercury84(r: number, Δ: number, i: number): number;
/**
 * Venus84 computes the visual magnitude of Venus.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Venus's distance from the Sun in AU.
 * @param {number} Δ - Venus's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Venus using the 1984 formula.
 */
export declare function venus84(r: number, Δ: number, i: number): number;
/**
 * Mars84 computes the visual magnitude of Mars.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Mars's distance from the Sun in AU.
 * @param {number} Δ - Mars's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Mars using the 1984 formula.
 */
export declare function mars84(r: number, Δ: number, i: number): number;
/**
 * Jupiter84 computes the visual magnitude of Jupiter.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 * @param {number} r - Jupiter's distance from the Sun in AU.
 * @param {number} Δ - Jupiter's distance from Earth in AU.
 * @param {number} i - Phase angle in radians.
 * @returns {number} Visual magnitude of Jupiter using the 1984 formula.
 */
export declare function jupiter84(r: number, Δ: number, i: number): number;
/**
 * Saturn84 computes the visual magnitude of Saturn.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring.
 * ΔU (in radians) is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 * @param {number} r - Saturn's distance from the Sun in AU.
 * @param {number} Δ - Saturn's distance from Earth in AU.
 * @param {number} B - Saturnicentric latitude of Earth in radians.
 * @param {number} ΔU - Difference in Saturnicentric longitudes in radians.
 * @returns {number} Visual magnitude of Saturn using the 1984 formula.
 */
export declare function saturn84(r: number, Δ: number, B: number, ΔU: number): number;
/**
 * Uranus84 computes the visual magnitude of Uranus.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Uranus's distance from the Sun in AU.
 * @param {number} Δ - Uranus's distance from Earth in AU.
 * @returns {number} Visual magnitude of Uranus using the 1984 formula.
 */
export declare function uranus84(r: number, Δ: number): number;
/**
 * Neptune84 computes the visual magnitude of Neptune.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Neptune's distance from the Sun in AU.
 * @param {number} Δ - Neptune's distance from Earth in AU.
 * @returns {number} Visual magnitude of Neptune using the 1984 formula.
 */
export declare function neptune84(r: number, Δ: number): number;
/**
 * Pluto84 computes the visual magnitude of Pluto.
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * @param {number} r - Pluto's distance from the Sun in AU.
 * @param {number} Δ - Pluto's distance from Earth in AU.
 * @returns {number} Visual magnitude of Pluto using the 1984 formula.
 */
export declare function pluto84(r: number, Δ: number): number;
declare const _default: {
    phaseAngle: typeof phaseAngle;
    fraction: typeof fraction;
    phaseAngle2: typeof phaseAngle2;
    phaseAngle3: typeof phaseAngle3;
    fractionVenus: typeof fractionVenus;
    mercury: typeof mercury;
    venus: typeof venus;
    mars: typeof mars;
    jupiter: typeof jupiter;
    saturn: typeof saturn;
    uranus: typeof uranus;
    neptune: typeof neptune;
    mercury84: typeof mercury84;
    venus84: typeof venus84;
    mars84: typeof mars84;
    jupiter84: typeof jupiter84;
    saturn84: typeof saturn84;
    uranus84: typeof uranus84;
    neptune84: typeof neptune84;
    pluto84: typeof pluto84;
};
export default _default;
