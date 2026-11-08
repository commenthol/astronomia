/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module fit
 */
/**
 * Fit: Chapter 4, Curve Fitting.
 */
/**
 * Linear fits a line to sample data.
 *
 * Argument p is a list of data points.  Results a and b are coefficients
 * of the best fit line y = ax + b.
 * @param {{x: number, y: number}[]} points - Sample points.
 * @returns {[number, number]} Slope and intercept of the best-fit line.
 */
export declare function linear(points: {
    x: number;
    y: number;
}[]): [number, number];
/**
 * CorrelationCoefficient returns a correlation coefficient for sample data.
 * @param {{x: number, y: number}[]} points - Sample points.
 * @returns {number} Correlation coefficient.
 */
export declare function correlationCoefficient(points: {
    x: number;
    y: number;
}[]): number;
/**
 * Quadratic fits y = ax² + bx + c to sample data.
 *
 * Argument p is a list of data points.  Results a, b, and c are coefficients
 * of the best fit quadratic y = ax² + bx + c.
 * @param {{x: number, y: number}[]} points - Sample points.
 * @returns {[number, number, number]} Quadratic coefficients a, b, and c.
 */
export declare function quadratic(points: {
    x: number;
    y: number;
}[]): [number, number, number];
/**
 * Func3 implements multiple linear regression for a linear combination
 * of three functions.
 *
 * Given sample data and three functions in x, Func3 returns coefficients
 * a, b, and c fitting y = aƒ₀(x) + bƒ₁(x) + cƒ₂(x) to sample data.
 * @param {{x: number, y: number}[]} points - Sample points.
 * @param {(x: number) => number} f0 - First basis function.
 * @param {(x: number) => number} f1 - Second basis function.
 * @param {(x: number) => number} f2 - Third basis function.
 * @returns {[number, number, number]} Regression coefficients.
 */
export declare function func3(points: {
    x: number;
    y: number;
}[], f0: (x: number) => number, f1: (x: number) => number, f2: (x: number) => number): [number, number, number];
/**
 * Func1 fits a linear multiple of a function to sample data.
 *
 * Given sample data and a function in x, Func1 returns coefficient
 * a fitting y = aƒ(x).
 * @param {{x: number, y: number}[]} points - Sample points.
 * @param {(x: number) => number} f - Basis function.
 * @returns {number} Regression coefficient.
 */
export declare function func1(points: {
    x: number;
    y: number;
}[], f: (x: number) => number): number;
declare const _default: {
    linear: typeof linear;
    correlationCoefficient: typeof correlationCoefficient;
    quadratic: typeof quadratic;
    func3: typeof func3;
    func1: typeof func1;
};
export default _default;
