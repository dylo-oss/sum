const { sum } = require('@dylo/sum');

const nativeSum = (a, b) => a + b;

const warmup = (func, a, b, warmupIterations) => {
  for (let i = 0; i < warmupIterations; i++) {
    func(a, b);
  }
};

const benchmark = (func, a, b, iterations) => {
  let totalDuration = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    func(a, b);
    const end = performance.now();
    totalDuration += end - start;
  }

  return totalDuration / iterations;
};

const testCases = [
  { a: 1, b: 2, iterations: 1000000, warmup: 100, description: 'Small numbers, high iterations' },
  { a: 100, b: 200, iterations: 1000000, warmup: 100, description: 'Hundreds, high iterations' },
  { a: 1000, b: 2000, iterations: 1000000, warmup: 100, description: 'Thousands, high iterations' },
  { a: 1, b: 2, iterations: 10000, warmup: 10, description: 'Small numbers, low iterations' },
  { a: 100, b: 200, iterations: 10000, warmup: 10, description: 'Hundreds, low iterations' },
  { a: 1000, b: 2000, iterations: 10000, warmup: 10, description: 'Thousands, low iterations' },
  { a: 1, b: 2, iterations: 1000000, warmup: 0, description: 'No warmup, small numbers' },
  { a: 100, b: 200, iterations: 1000000, warmup: 0, description: 'No warmup, hundreds' },
  { a: 1000, b: 2000, iterations: 1000000, warmup: 0, description: 'No warmup, thousands' },
];

const results = [];

for (const { a, b, iterations, warmup: warmupIterations, description } of testCases) {
  if (warmupIterations > 0) {
    warmup(nativeSum, a, b, warmupIterations);
    warmup(sum, a, b, warmupIterations);
  }
  const nativeDuration = benchmark(nativeSum, a, b, iterations);
  const packageDuration = benchmark(sum, a, b, iterations);
  const difference = nativeDuration - packageDuration;
  results.push({
    input: `${a} + ${b}`,
    native: nativeDuration,
    package: packageDuration,
    difference,
    description,
  });
}

console.table(results, ['input', 'native', 'package', 'difference', 'description']);
