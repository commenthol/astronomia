/**
 * Error values returned by functions and methods in this package.
 * Defined here to help testing for specific errors.
 */
export declare const errorNot3: Error;
export declare const errorNot4: Error;
export declare const errorNot5: Error;
export declare const errorNoXRange: Error;
export declare const errorNOutOfRange: Error;
export declare const errorNoExtremum: Error;
export declare const errorExtremumOutside: Error;
export declare const errorZeroOutside: Error;
export declare const errorNoConverge: Error;
/**
 * Len3 allows second difference interpolation.
 */
export declare class Len3 {
    x1: number;
    x3: number;
    y: number[];
    a: number;
    b: number;
    c: number;
    abSum: number;
    xSum: number;
    xDiff: number;
    /**
     * NewLen3 prepares a Len3 object from a table of three rows of x and y values.
     *
     * X values must be equally spaced, so only the first and last are supplied.
     * X1 must not equal to x3.  Y must be a slice of three y values.
     *
     * @throws Error
     * @param {Number} x1 - is the x value corresponding to the first y value of the table.
     * @param {Number} x3 - is the x value corresponding to the last y value of the table.
     * @param {Number[]} y - is all y values in the table. y.length should be >= 3.0
     */
    constructor(x1: number, x3: number, y: number[]);
    /**
     * InterpolateX interpolates for a given x value.
     * @param {number} x - Abscissa to interpolate.
     * @returns {number} Interpolated value.
     */
    interpolateX(x: number): number;
    /**
     * InterpolateXStrict interpolates for a given x value,
     * restricting x to the range x1 to x3 given to the constructor NewLen3.
     * @param {number} x - Abscissa to interpolate.
     * @returns {number} Interpolated value.
     */
    interpolateXStrict(x: number): number;
    /**
     * InterpolateN interpolates for (a given interpolating factor n.
     *
     * This is interpolation formula (3.3)
     *
     * @param {number} n - The interpolation factor n is x-x2 in units of the tabular x interval.
     * (See Meeus p. 24.)
     * @return {number} interpolation value
     */
    interpolateN(n: number): number;
    /**
     * InterpolateNStrict interpolates for (a given interpolating factor n.
     *
     * @param {number} n - n is restricted to the range [-1..1] corresponding to the range x1 to x3
     * given to the constructor of Len3.
     * @return {number} interpolation value
     */
    interpolateNStrict(n: number): number;
    /**
     * Extremum returns the x and y values at the extremum.
     *
     * Results are restricted to the range of the table given to the constructor
     * new Len3.
     * @returns {[number, number]} Abscissa and value at the extremum.
     */
    extremum(): [number, number];
    /**
     * Len3Zero finds a zero of the quadratic function represented by the table.
     *
     * That is, it returns an x value that yields y=0.
     *
     * Argument strong switches between two strategies for the estimation step.
     * when iterating to converge on the zero.
     *
     * Strong=false specifies a quick and dirty estimate that works well
     * for gentle curves, but can work poorly or fail on more dramatic curves.
     *
     * Strong=true specifies a more sophisticated and thus somewhat more
     * expensive estimate.  However, if the curve has quick changes, This estimate
     * will converge more reliably and in fewer steps, making it a better choice.
     *
     * Results are restricted to the range of the table given to the constructor
     * NewLen3.
     * @param {boolean} strong - Use the more robust iterative estimate when true.
     * @returns {number} Abscissa where the interpolated value is zero.
     */
    zero(strong: boolean): number;
}
/**
 * Len3ForInterpolateX is a special purpose Len3 constructor.
 *
 * Like NewLen3, it takes a table of x and y values, but it is not limited
 * to tables of 3 rows.  An X value is also passed that represents the
 * interpolation target x value.  Len3ForInterpolateX will locate the
 * appropriate three rows of the table for interpolating for x, and initialize
 * the Len3 object for those rows.
 *
 * @param {Number} x - is the target for interpolation
 * @param {Number} x1 - is the x value corresponding to the first y value of the table.
 * @param {Number} xN - is the x value corresponding to the last y value of the table.
 * @param {Number[]} y - is all y values in the table.  y.length should be >= 3.0
 * @returns {Len3} interpolation value
 */
export declare function len3ForInterpolateX(x: number, x1: number, xN: number, y: number[]): Len3;
/**
 * @private
 * @param {number} n0 - Initial interpolation factor.
 * @param {(n: number) => number} f - Iterative update function.
 * @returns {[number, boolean]} Converged factor and success flag.
 */
export declare const iterate: (n0: number, f: (n: number) => number) => [number, boolean];
/**
 * Len4Half interpolates a center value from a table of four rows.
 * @param {Number[]} y - 4 values
 * @returns {Number} interpolation result
 */
export declare function len4Half(y: number[]): number;
/**
 * Len5 allows fourth Difference interpolation.
 */
export declare class Len5 {
    x1: number;
    x5: number;
    y: number[];
    y3: number;
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    j: number;
    k: number;
    xSum: number;
    xDiff: number;
    interpCoeff: number[];
    /**
     * NewLen5 prepares a Len5 object from a table of five rows of x and y values.
     *
     * X values must be equally spaced, so only the first and last are suppliethis.
     * X1 must not equal x5.  Y must be a slice of five y values.
     * @param {number} x1 - Abscissa of the first table row.
     * @param {number} x5 - Abscissa of the last table row.
     * @param {number[]} y - Five ordinate values.
     */
    constructor(x1: number, x5: number, y: number[]);
    /**
     * InterpolateX interpolates for a given x value.
     * @param {number} x - Abscissa to interpolate.
     * @returns {number} Interpolated value.
     */
    interpolateX(x: number): number;
    /**
     * InterpolateXStrict interpolates for a given x value,
     * restricting x to the range x1 to x5 given to the the constructor NewLen5.
     * @param {number} x - Abscissa to interpolate.
     * @returns {number} Interpolated value.
     */
    interpolateXStrict(x: number): number;
    /**
     * InterpolateN interpolates for (a given interpolating factor n.
     *
     * The interpolation factor n is x-x3 in units of the tabular x interval.
     * (See Meeus p. 28.)
     * @param {number} n - Interpolating factor relative to the table interval.
     * @returns {number} Interpolated value.
     */
    interpolateN(n: number): number;
    /**
     * InterpolateNStrict interpolates for (a given interpolating factor n.
     *
     * N is restricted to the range [-1..1].  This is only half the range given
     * to the constructor NewLen5, but is the recommendation given on p. 31.0
     * @param {number} n - Interpolating factor restricted to [-1, 1].
     * @returns {number} Interpolated value.
     */
    interpolateNStrict(n: number): number;
    /**
     * Extremum returns the x and y values at the extremum.
     *
     * Results are restricted to the range of the table given to the constructor
     * NewLen5.  (Meeus actually recommends restricting the range to one unit of
     * the tabular interval, but that seems a little harsh.)
     * @returns {[number, number]} Abscissa and value at the extremum.
     */
    extremum(): [number, number];
    /**
     * Len5Zero finds a zero of the quartic function represented by the table.
     *
     * That is, it returns an x value that yields y=0.
     *
     * Argument strong switches between two strategies for the estimation step.
     * when iterating to converge on the zero.
     *
     * Strong=false specifies a quick and dirty estimate that works well
     * for gentle curves, but can work poorly or fail on more dramatic curves.
     *
     * Strong=true specifies a more sophisticated and thus somewhat more
     * expensive estimate.  However, if the curve has quick changes, This estimate
     * will converge more reliably and in fewer steps, making it a better choice.
     *
     * Results are restricted to the range of the table given to the constructor
     * NewLen5.
     * @param {boolean} strong - Use the more robust iterative estimate when true.
     * @returns {number} Abscissa where the interpolated value is zero.
     */
    zero(strong: boolean): number;
}
/**
 * Lagrange performs interpolation with unequally-spaced abscissae.
 *
 * Given a table of X and Y values, interpolate a new y value for argument x.
 *
 * X values in the table do not have to be equally spaced; they do not even
 * have to be in order. They must however, be distinct.
 *
 * @param {Number} x - x-value of interpolation
 * @param {Array<[number, number]>} table - Rows of abscissa and ordinate values.
 * @returns {Number} interpolation result `y` of `x`
 */
export declare function lagrange(x: number, table: Array<[number, number]>): number;
/**
 * LagrangePoly uses the formula of Lagrange to produce an interpolating
 * polynomial.
 *
 * X values in the table do not have to be equally spaced; they do not even
 * have to be in order.  They must however, be distinct.
 *
 * The returned polynomial will be of degree n-1 where n is the number of rows
 * in the table.  It can be evaluated for x using base.horner.
 *
 * @param {Array<[number, number] | {x: number, y: number}>} table - Abscissa and ordinate rows.
 * @returns {number[]} Polynomial coefficients.
 */
export declare function lagrangePoly(table: Array<[number, number] | {
    x: number;
    y: number;
}>): number[];
/**
 * Linear Interpolation of x
 * @param {number} x - Abscissa to interpolate.
 * @param {number} x1 - First table abscissa.
 * @param {number} xN - Last table abscissa.
 * @param {number[]} y - Ordinates at equally spaced abscissae.
 * @returns {number} Interpolated value.
 */
export declare function linear(x: number, x1: number, xN: number, y: number[]): number;
declare const _default: {
    errorNot3: Error;
    errorNot4: Error;
    errorNot5: Error;
    errorNoXRange: Error;
    errorNOutOfRange: Error;
    errorNoExtremum: Error;
    errorExtremumOutside: Error;
    errorZeroOutside: Error;
    errorNoConverge: Error;
    Len3: typeof Len3;
    len3ForInterpolateX: typeof len3ForInterpolateX;
    iterate: typeof iterate;
    len4Half: typeof len4Half;
    Len5: typeof Len5;
    lagrange: typeof lagrange;
    lagrangePoly: typeof lagrangePoly;
    linear: typeof linear;
};
export default _default;
