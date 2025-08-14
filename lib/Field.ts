import type Semigroup from "./Semigroup";
import type Group from "./Group";

export default interface Field<T> extends Semigroup<T>, Group<T> {
    inv(x: T): T;
}
