/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonnode
 */
/**
 * Moonnode: Chapter 51, Passages of the Moon through the Nodes.
 */
/**
 * Ascending returns the date of passage of the Moon through an ascending node.
 *
 * @param {Number} year - decimal year specifying a date near the event.
 * @returns {Number} jde of the event nearest the given date.
 */
export declare function ascending(year: number): number;
/**
 * Descending returns the date of passage of the Moon through a descending node.
 *
 * @param {Number} year - decimal year specifying a date near the event.
 * @returns {Number} jde of the event nearest the given date.
 */
export declare function descending(year: number): number;
declare const _default: {
    ascending: typeof ascending;
    descending: typeof descending;
};
export default _default;
