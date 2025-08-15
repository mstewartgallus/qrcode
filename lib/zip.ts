const zip = function *<S, T>(x: Iterator<S>, y: Iterator<T>): Generator<[S, T]> {
    for (;;) {
        const xResult = x.next();
        if (xResult.done) {
            return;
        }
        const yResult = y.next();
        if (xResult.done) {
            return;
        }
        yield [xResult.value, yResult.value];
    }
};

export default zip;
