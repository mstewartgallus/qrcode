import Semigroup from "./Semigroup";

export default interface Group<T> {
    zero: T;
    add(x: T, y: T): T;
    neg(x: T): T;
}

export class Exp<T> implements Semigroup<T> {
    group: Group<T>;
    one: T;

    constructor(group: Group<T>) {
        this.group = group;
        this.one = group.zero;
    }

    mul(x: T, y: T) {
        return this.group.add(x, y);
    }
}
