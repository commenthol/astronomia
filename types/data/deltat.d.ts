/**
 * DO NOT EDIT MANUALLY
 * Use `scripts/deltat.js` to generate file.
 * Datasets are from <https://maia.usno.navy.mil/ser7> and
 * <ftp://ftp.iers.org/products/eop/rapid/standard>
 */
declare const m: {
    historic: {
        table: number[];
        first: number;
        last: number;
    };
    data: {
        table: number[];
        first: number;
        firstYM: number[];
        last: number;
        lastYM: number[];
    };
    prediction: {
        table: number[];
        first: number;
        last: number;
    };
};
export default m;
