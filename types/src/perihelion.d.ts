import { Planet } from './planetposition.js';
export declare const mercury: number;
export declare const venus: number;
export declare const earth: number;
export declare const mars: number;
export declare const jupiter: number;
export declare const saturn: number;
export declare const uranus: number;
export declare const neptune: number;
export declare const embary: number;
/**
 * Perihelion returns an approximate jde of the perihelion event nearest the given time.
 *
 * @param {number} p - planet constant from above
 * @param {Number} year - year number indicating a time near the perihelion event.
 * @returns {Number} jde - time of the event
 */
export declare function perihelion(p: number, year: number): number;
/**
 * Aphelion returns an approximate jde of the aphelion event nearest the given time.
 *
 * @param {number} p - planet constant from above
 * @param {Number} year - year number indicating a time near the aphelion event.
 * @returns {Number} jde - time of the event
 */
export declare function aphelion(p: number, year: number): number;
/**
 * Perihelion2 returns the perihelion event nearest the given time.
 *
 * @param {Planet} planet - VSOP87 planet (EMBary is not allowed).
 * @param {number} year - Decimal year near the perihelion event.
 * @param {number} precision - Desired time precision in days.
 * @param {(result: [number, number]) => void} [cb] - Optional asynchronous callback receiving Julian day and heliocentric distance.
 * @returns {[number, number]|void} Event Julian day and distance in AU, or void when using the callback.
 */
export declare function perihelion2(planet: Planet, year: number, precision: number, cb?: (result: [number, number]) => void): [number, number] | void;
/**
 * Aphelion2 returns the aphelion event nearest the given time.
 *
 * @param {Planet} planet - VSOP87 planet (EMBary is not allowed).
 * @param {number} year - Decimal year near the aphelion event.
 * @param {number} precision - Desired time precision in days.
 * @param {(result: [number, number]) => void} [cb] - Optional asynchronous callback receiving Julian day and heliocentric distance.
 * @returns {[number, number]|void} Event Julian day and distance in AU, or void when using the callback.
 */
export declare function aphelion2(planet: Planet, year: number, precision: number, cb?: (result: [number, number]) => void): [number, number] | void;
declare const _default: {
    mercury: number;
    venus: number;
    earth: number;
    mars: number;
    jupiter: number;
    saturn: number;
    uranus: number;
    neptune: number;
    embary: number;
    perihelion: typeof perihelion;
    aphelion: typeof aphelion;
    perihelion2: typeof perihelion2;
    aphelion2: typeof aphelion2;
};
export default _default;
