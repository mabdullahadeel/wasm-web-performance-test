function fibWorker(n) {
    if (n < 2) {
        return n;
    }
    return fibWorker(n - 1) + fibWorker(n - 2);
}

const ctx = self;

ctx.addEventListener('message', (event) => {
    const {data} = event;
    const {n} = data;
    const res = fibWorker(n);
    ctx.postMessage({res});
});