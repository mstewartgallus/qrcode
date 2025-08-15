import type Field from "./Field";
import FiniteFieldSlow from "./FiniteFieldSlow";

// References:
//
// http://web.archive.org/web/20241111192302/https://dev.to/maxart2501/let-s-develop-a-qr-code-generator-part-i-basic-concepts-510a
// https://research.swtch.com/qart

// FIXME.. make tests for field properties...
// GF(2^8) implementation

// FIXME... a mess
export default class FiniteField implements Field<number> {
    #log: Uint8Array;
    #exp: Uint8Array;

    zero = 0;
    one = 1;

    constructor(alpha: number, poly: number) {
        const slow = new FiniteFieldSlow(poly);

        const log = new Uint8Array(256);
        const exp = new Uint8Array(512);

        let value = 1;
        for (let exponent = 0; exponent < 255; exponent = exponent + 1 | 0) {
            exp[exponent] = value;
            exp[(exponent + 255) | 0] = value;
            log[value] = exponent;

            value = slow.mul(alpha, value);
        }
        log[0] = 255;

        this.#log = log;
        this.#exp = exp;
    }

    add(x: number, y: number) {
        return x ^ y;
    }

    mul(x: number, y: number) {
        if (x == 0 || y == 0) {
            return 0;
        }
        return this.#exp[this.#log[x] + this.#log[y]];
    }

    inv(x: number) {
        if (x === 0) {
            return 0;
        }
        return this.#exp[255 - this.#log[x]];
    }

    neg(x: number) {
        return x;
    }

}

// FIXME... this is incomprehensible..
// polyMul(x: Uint8Array, y: Uint8Array) => {
//     const z = new Uint8Array(x.length + y.length - 1);
//     for (let ii = 0; ii < x.length; ++ii) {
//         let k = 0;
//         for (let jj = 0; < jj < y.length; ++jj) {
//             k ^= this.mul(x[jj], y[ii - jj]);
//         }
//         z[ii] = k;
//     }
//     return z;
// }
