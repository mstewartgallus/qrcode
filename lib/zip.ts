const zip = function *<T>(...its: [Iterable<T>]): [T] {
    for (;;) {
        const tuple = Array(its.length);
        for (const [ii, it] of its.entries()) {
            const result = it.next();
            if (result.done) {
                return;
            }
            tuple[ii] = result.value;
        }
        yield tuple;
    }
};

export default zip;
