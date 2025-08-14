export default interface Semigroup<T> {
    one: T;
    mul(x: T, y: T): T;
}
