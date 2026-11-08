/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module vsop87
 */
/**
 * Converts VSOP87 data files to javascript modules
 */
export declare class VSOP {
    planet: string;
    dirname: string;
    type: string;
    data: {};
    /**
     * load VSOP87 planet data from VSOP87 files
     * Data can be obtained from ftp://cdsarc.u-strasbg.fr/pub/cats/VI%2F81/
     * @throws {Error}
     * @param {String} planet - MERCURY VENUS EARTH MARS JUPITER SATURN URANUS NEPTUNE
     * @param {String} dirname - folder containing VSOP87 files
     * @param {Object} [opts]
     * @param {String} [opts.type] - file type A, B, C, D - See vsop87.txt
     */
    constructor(planet: string, dirname: string, opts?: {
        type?: string;
    });
    /** @returns {string} File extension for the configured planet. */
    _getExt(): string;
    /**
     * Load and parse the configured VSOP87 data file.
     * @param {(error: Error|null) => void} cb - Completion callback.
     * @returns {void}
     */
    load(cb: (error: Error | null) => void): void;
    /**
     * Load and parse the configured VSOP87 data file synchronously.
     * @returns {void}
     */
    loadSync(): void;
    /**
     * parse data
     * @param {string} data - Content of the VSOP file.
     * @returns {void}
     */
    parse(data: string): void;
    /**
     * get parsed data
     * ```js
     * { L: { '0': [[<A>, <B>, <C>], ...], '1': [], '2': [], '3': [], '4': [], '5': [] },
     *   B: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] },
     *   R: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] } }
     * ```
     * @returns {Record<string, Record<string, number[][]>>} Parsed VSOP87 coefficients.
     */
    getData(): Record<string, Record<string, number[][]>>;
}
declare const _default: {
    VSOP: typeof VSOP;
};
export default _default;
