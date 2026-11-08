/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moon
 */
/**
 * Moon: Chapter 53, Ephemeris for Physical Observations of the Moon.
 *
 * Incomplete.  Topocentric functions are commented out for lack of test data.
 */
import { Coord } from './base.js';
import { Planet } from './planetposition.js';
/**
 * Physical returns quantities useful for physical observation of the Moon.
 *
 * Returned l, b are librations in selenographic longitude and latitude.
 * They represent combined optical and physical librations.  Topocentric
 * librations are not considered.
 *
 * Returned P is the the position angle of the Moon's axis of rotation.
 *
 * Returned l0, b0 are the selenographic coordinates of the Sun.
 *
 * Returned values all in radians.

 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 Planet Earth
 * @return {[import('./base.js').Coord, number, import('./base.js').Coord]} Moon coordinates, axis position angle, and solar coordinates, all in radians.
 */
export declare function physical(jde: number, earth: Planet): [import('./base.js').Coord, number, import('./base.js').Coord];
/**
 * Quantities computed for a jde and used in computing return values of
 * physical().  Computations are broken into several methods to organize
 * the code.
 */
export declare class Moon {
    jde: number;
    Δψ: number;
    F: number;
    Ω: number;
    ε: number;
    sε: number;
    cε: number;
    ρ: number;
    σ: number;
    τ: number;
    /** @param {number} jde - Julian ephemeris day. */
    constructor(jde: number);
    /**
     * lib() curiously serves for computing both librations and solar coordinates,
     * depending on the coordinates λ, β passed in.  Quantity A not described in
     * the book, but clearly depends on the λ, β of the current context and so
     * does not belong in the moon struct.  Instead just return it from optical
     * and pass it along to physical.
     * @param {number} λ - Ecliptic longitude in radians.
     * @param {number} β - Ecliptic latitude in radians.
     * @returns {[number, number]} Selenographic longitude and latitude in radians.
     */
    lib(λ: number, β: number): [number, number];
    /**
     * Compute the optical libration of the Moon.
     * @param {number} λ - Ecliptic longitude in radians.
     * @param {number} β - Ecliptic latitude in radians.
     * @returns {[number, number, number]} Optical libration longitude, latitude, and auxiliary angle, in radians.
     */
    optical(λ: number, β: number): [number, number, number];
    /**
     * Compute the physical libration of the Moon.
     * @param {number} A - Auxiliary angle from the optical-libration calculation.
     * @param {number} b_ - Optical libration latitude in radians.
     * @returns {[number, number]} Physical longitude and latitude corrections in radians.
     */
    physical(A: number, b_: number): [number, number];
    /**
     * Compute the position angle of the Moon's rotation axis.
     * @param {number} λ - Ecliptic longitude in radians.
     * @param {number} β - Ecliptic latitude in radians.
     * @param {number} b - Selenographic latitude in radians.
     * @returns {number} Position angle in radians.
     */
    pa(λ: number, β: number, b: number): number;
    /**
     * Compute the Sun's selenographic coordinates.
     * @param {number} λ - Lunar ecliptic longitude in radians.
     * @param {number} β - Lunar ecliptic latitude in radians.
     * @param {number} Δ - Earth-Moon distance in kilometres.
     * @param {Planet} earth - VSOP87 Earth ephemeris.
     * @returns {[number, number]} Solar selenographic longitude and latitude in radians.
     */
    sun(λ: number, β: number, Δ: number, earth: Planet): [number, number];
}
/**
 * SunAltitude returns altitude of the Sun above the lunar horizon.
 *
 * @param {Coord} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Coord} cSun - selenographic coordinates of the Sun (as returned by physical(), for example.)
 * @return altitude in radians.
 */
export declare function sunAltitude(cOnMoon: Coord, cSun: Coord): number;
/**
 * Sunrise returns time of sunrise for a point on the Moon near the given date.
 *
 * @param {Coord} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 Planet Earth
 * @return time of sunrise as a jde nearest the given jde.
 */
export declare function sunrise(cOnMoon: Coord, jde: number, earth: Planet): number;
/**
 * Sunset returns time of sunset for a point on the Moon near the given date.
 *
 * @param {Coord} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 Planet Earth
 * @return time of sunset as a jde nearest the given jde.
 */
export declare function sunset(cOnMoon: Coord, jde: number, earth: Planet): number;
/**
 * selenographic coordinates of some lunar features
 * Table 53.A
 */
export declare const selenographic: {
    archimedes: Coord;
    aristarchus: Coord;
    aristillus: Coord;
    aristoteles: Coord;
    arzachel: Coord;
    autolycus: Coord;
    billy: Coord;
    birt: Coord;
    campanus: Coord;
    censorinus: Coord;
    clavius: Coord;
    copernicus: Coord;
    delambre: Coord;
    dionysius: Coord;
    endymion: Coord;
    eratosthenes: Coord;
    eudoxus: Coord;
    fracastorius: Coord;
    fraMauro: Coord;
    gassendi: Coord;
    goclenius: Coord;
    grimaldi: Coord;
    harpalus: Coord;
    horrocks: Coord;
    kepler: Coord;
    langrenus: Coord;
    lansberg: Coord;
    letronne: Coord;
    macrobius: Coord;
    manilius: Coord;
    menelaus: Coord;
    messier: Coord;
    petavius: Coord;
    pico: Coord;
    pitatus: Coord;
    piton: Coord;
    plato: Coord;
    plinius: Coord;
    posidonius: Coord;
    proclus: Coord;
    ptolemeusA: Coord;
    pytheas: Coord;
    reinhold: Coord;
    riccioli: Coord;
    schickard: Coord;
    schiller: Coord;
    tauruntius: Coord;
    theophilus: Coord;
    timocharis: Coord;
    tycho: Coord;
    vitruvius: Coord;
    walter: Coord;
};
declare const _default: {
    physical: typeof physical;
    Moon: typeof Moon;
    sunAltitude: typeof sunAltitude;
    sunrise: typeof sunrise;
    sunset: typeof sunset;
    selenographic: {
        archimedes: Coord;
        aristarchus: Coord;
        aristillus: Coord;
        aristoteles: Coord;
        arzachel: Coord;
        autolycus: Coord;
        billy: Coord;
        birt: Coord;
        campanus: Coord;
        censorinus: Coord;
        clavius: Coord;
        copernicus: Coord;
        delambre: Coord;
        dionysius: Coord;
        endymion: Coord;
        eratosthenes: Coord;
        eudoxus: Coord;
        fracastorius: Coord;
        fraMauro: Coord;
        gassendi: Coord;
        goclenius: Coord;
        grimaldi: Coord;
        harpalus: Coord;
        horrocks: Coord;
        kepler: Coord;
        langrenus: Coord;
        lansberg: Coord;
        letronne: Coord;
        macrobius: Coord;
        manilius: Coord;
        menelaus: Coord;
        messier: Coord;
        petavius: Coord;
        pico: Coord;
        pitatus: Coord;
        piton: Coord;
        plato: Coord;
        plinius: Coord;
        posidonius: Coord;
        proclus: Coord;
        ptolemeusA: Coord;
        pytheas: Coord;
        reinhold: Coord;
        riccioli: Coord;
        schickard: Coord;
        schiller: Coord;
        tauruntius: Coord;
        theophilus: Coord;
        timocharis: Coord;
        tycho: Coord;
        vitruvius: Coord;
        walter: Coord;
    };
};
export default _default;
