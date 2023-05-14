import init, { add, greet, fib } from './wasm-tools/pkg/wasm_tools.js';

const app = document.getElementById('app');
const btn = document.getElementById('btn');

btn.addEventListener('click', handleTriggerFib);

function updateContent(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    app.appendChild(div);
}

function fibJS(n) {
    if (n < 2) {
        return n;
    }
    return fibJS(n - 1) + fibJS(n - 2);
}

async function run() {
    await init();
    const res = add(1, 2);
    updateContent(`1 + 2 = ${res}`);
    const res2 = greet('Wasm Tools');
    updateContent(res2);
}

function measureExecutionTime(fn) {
    return function(...args) {
      const start = performance.now();
      const result = fn.apply(this, args);
      const end = performance.now();
      const executionTime = end - start;
      return {result, executionTime};
    };
  }

function handleTriggerFib() {
    // JS
    const {result: res3, executionTime: time3} = measureExecutionTime(fibJS)(40);
    updateContent(`fibJS(40) = ${res3} in ${time3}ms`);

    // Wasm
    const {result: res4, executionTime: time4} = measureExecutionTime(fib)(40);
    updateContent(`fibWasm(40) = ${res4} in ${time4}ms`);

    // Web Worker
    const worker = new Worker('./worker.js');
    const start = performance.now();
    worker.addEventListener('message', (event) => {
        const {data} = event;
        const {res} = data;
        const end = performance.now();
        updateContent(`fibWorker(40) = ${res} in ${end - start}ms`);
        worker.terminate();
    });
    worker.postMessage({n: 40});
}

run();
