import type Field from "./Field";
import zip from "@/lib/zip";

// References:
//
// http://web.archive.org/web/20241111192302/https://dev.to/maxart2501/let-s-develop-a-qr-code-generator-part-i-basic-concepts-510a
// https://research.swtch.com/qart

// GF(2^8) implementation


const bits = function *(x: number) {
    for (let ii = 0; ii < 8; ii += 1) {
        yield (x & (1 << ii)) !== 0;
    }
}

const bitLength = (x: number) => {
    let bits = 0;
    while (x >> bits) {
        bits += 1;
    }
    return bits;
}

// 2^k x
const doubling = function *(x: number) {
    for (let ii = 0; ii < 8; ii += 1) {
        yield x;
        x <<= 1;
    }
}

const mul = (x: number, y: number) => {
    x = x | 0;
    y = y | 0;

    let z = 0;

    // x = x[0] ^ 2 x[1] ^ 4 x[2] ^ 8 x[3] ^ 16 x[4] ^ 32 x[5] ^ 64 x[6] ^ 128 x[7]
    // y 2^k
    for (const [x_i, exp_k_y] of zip(bits(x), doubling(y))) {
        if (x_i) {
            z ^= exp_k_y;
        }
    }
    return z;
};

const div = (numerator: number, denominator: number) => {
    const numLength = bitLength(numerator);
    const denomLength = bitLength(denominator);

    if (numLength < denomLength) {
        return numerator;
    }

    // FIXME... isn't this just multiplication?
    for (const [bit, denom_exp] of zip(bits(numerator), doubling(denominator))) {
        if (bit) {
            numerator ^= denom_exp;
        }
    }
    return numerator;
};

export default class FiniteFieldSlow implements Field<number> {
    poly: number;

    zero = 0;
    one = 1;

    // FIXME.. enforce prime number
    constructor(poly: number) {
        this.poly = poly;
    }

    inv(): number {
        throw 'todo';
    }

    neg(x: number) {
        return x;
    }

    add(x: number, y: number) {
        x = x | 0;
        y = y | 0;
        return (x ^ y) | 0;
    }

    mul(x: number, y: number) {
        return div(mul(x, y), this.poly);
    }
}
