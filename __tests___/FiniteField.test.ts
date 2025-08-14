import type Semigroup from "@/lib/Semigroup";
import type Group from "@/lib/Group";
import type Field from "@/lib/Field";
import { Exp } from "@/lib/Group";
import FiniteFieldSlow from "@/lib/FiniteFieldSlow";
import FiniteField from "@/lib/FiniteField";
import zip from "@/lib/zip";

const identity = <T>(sg: Semigroup<T>, x: T) =>
    expect(sg.mul(sg.one, x)).toBe(x);

const assocs = <T>(sg: Semigroup<T>, x: T, y: T, z: T) =>
    expect(sg.mul(x, sg.mul(y, z)))
        .toBe(sg.mul(sg.mul(x, y), z));

const commutes = <T>(sg: Semigroup<T>, x: T, y: T) =>
    expect(sg.mul(x, y))
        .toBe(sg.mul(y, x));

const rightDistributes = <T>(f: Field<T>, x: T, y: T, z: T) =>
    expect(f.mul(x, f.add(y, z)))
        .toBe(f.add(f.mul(x, y), f.add(x, z)));

const inverse = <T>(g: Group<T>, x: T) =>
    expect(g.add(g.neg(x), x)).toBe(g.zero);

const randomByte = () => Math.floor(Math.random() * 255);

const randomBytes = function *() {
    for (let ii = 0; ii < 2; ++ii) {
        yield randomByte();
    }
};

describe('FiniteFieldSlow', () => {
    const slow = new FiniteFieldSlow(0x11D);
    const lut = new FiniteField(2, 0x11D);

    // FIXME
    if (false) {
        for (const [x, y] of zip(randomBytes(), randomBytes())) {
            it(`${x} · ${y} = ${x} · ${y}`, () => {
                expect(slow.mul(x, y)).toBe(lut.mul(x, y));
            });
        }
    }

    for (const x of randomBytes()) {
        it(`1 · ${x} = ${x}`, () => {
            identity(slow, x);
        });
    }

    // FIXME
    if (false) {
        for (const [x, y, z] of zip(randomBytes(), randomBytes(), randomBytes())) {
            it(`${x}·(${y}·${z}) = (${x}·${y})·${z}`, () => {
                assocs(slow, x, y, z);
            });
        }
    }

    for (const [x, y] of zip(randomBytes(), randomBytes())) {
        it(`${x} · ${y} = ${y} · ${x}`, () => {
            commutes(slow, x, y);
        });
    }

    for (const x of randomBytes()) {
        it(`0 + ${x} = 0`, () => {
            identity(new Exp(slow), x);
        });
    }

    for (const [x, y, z] of zip(randomBytes(), randomBytes(), randomBytes())) {
        it(`${x} + (${y} + ${z}) = (${x} + ${y}) + ${z}`, () => {
            assocs(new Exp(slow), x, y, z);

        });
    }

    for (const [x, y] of zip(randomBytes(), randomBytes())) {
        it(`${x} + ${y} = ${y} + ${x}`, () => {
            commutes(new Exp(slow), x, y);
        });
    }

    for (const x of randomBytes()) {
        it(`${x} + -${x} = 0`, () => {
            inverse(slow, x);
        });
    }

    // FIXME
    if (false) {
        for (const [x, y, z] of zip(randomBytes(), randomBytes(), randomBytes())) {
            it(`${x}·(${y} + ${z}) = ${x}·${y} + ${x}·${z}`, () => {
                rightDistributes(slow, x, y, z);
            });
        }
    }
});
