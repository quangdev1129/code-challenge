# Problem 4: Three Ways to Sum to N

**Input:** `n` — any integer
**Output:** sum of all integers from `1` to `n` (returns `0` for `n ≤ 0`)

```
sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
```

---

## Implementations

### A — Gauss's Formula (`sum_to_n_a`)

```ts
export function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}
```

Uses the closed-form identity derived by Gauss. No loops, no recursion — a single arithmetic expression.

| Complexity | Value |
|---|---|
| Time | O(1) |
| Space | O(1) |

---

### B — Iterative Loop (`sum_to_n_b`)

```ts
export function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```

Accumulates the total by stepping through every integer from `1` to `n`. Simple and predictable — only one variable lives in memory regardless of `n`.

| Complexity | Value |
|---|---|
| Time | O(n) |
| Space | O(1) |

---

### C — Recursive (`sum_to_n_c`)

```ts
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
```

Breaks the problem down as `sum(n) = n + sum(n − 1)` with base case `sum(0) = 0`. Elegant but each call frame is held on the call stack until the base case unwinds — this will throw a `RangeError: Maximum call stack size exceeded` for large values of `n` (typically > ~10,000 in Node.js).

| Complexity | Value |
|---|---|
| Time | O(n) |
| Space | O(n) — one stack frame per call |

---

## Comparison

| Implementation | Time | Space | Safe for large n |
|---|---|---|---|
| A — Formula | O(1) | O(1) | Yes |
| B — Iterative | O(n) | O(1) | Yes |
| C — Recursive | O(n) | O(n) | No (stack overflow) |

---

## Unit Tests

Tests are written with **Jest** + **ts-jest** and cover:

- Positive integers (`1`, `2`, `5`, `10`, `100`)
- Zero (`0`)
- Negative integers (`-1`, `-5`, `-10`, `-1000`) — all return `0` (empty sum)
- Large inputs near `Number.MAX_SAFE_INTEGER` — formula and iterative only, since the recursive implementation overflows the call stack

### Run

```bash
npm test
```

### Result

```
PASS ./index.test.ts
  sum_to_n_a (formula)
    ✓ sum_to_n(1) === 1
    ✓ sum_to_n(2) === 3  (smallest multi-term sum)
    ✓ sum_to_n(5) === 15
    ✓ sum_to_n(10) === 55
    ✓ sum_to_n(100) === 5050
    ✓ sum_to_n(0) === 0
    ✓ sum_to_n(-1) === 0
    ✓ sum_to_n(-5) === 0
    ✓ sum_to_n(-10) === 0
    ✓ sum_to_n(-1000) === 0  (large negative)
  sum_to_n_b (iterative)
    ✓ sum_to_n(1) === 1
    ✓ sum_to_n(2) === 3  (smallest multi-term sum)
    ✓ sum_to_n(5) === 15
    ✓ sum_to_n(10) === 55
    ✓ sum_to_n(100) === 5050
    ✓ sum_to_n(0) === 0
    ✓ sum_to_n(-1) === 0
    ✓ sum_to_n(-5) === 0
    ✓ sum_to_n(-10) === 0
    ✓ sum_to_n(-1000) === 0  (large negative)
  sum_to_n_c (recursive)
    ✓ sum_to_n(1) === 1
    ✓ sum_to_n(2) === 3  (smallest multi-term sum)
    ✓ sum_to_n(5) === 15
    ✓ sum_to_n(10) === 55
    ✓ sum_to_n(100) === 5050
    ✓ sum_to_n(0) === 0
    ✓ sum_to_n(-1) === 0
    ✓ sum_to_n(-5) === 0
    ✓ sum_to_n(-10) === 0
    ✓ sum_to_n(-1000) === 0  (large negative)
  sum_to_n_a (formula) — large inputs
    ✓ sum_to_n(100_000) === 5_000_050_000
    ✓ sum_to_n(133_693_440) result is a safe integer
  sum_to_n_b (iterative) — large inputs
    ✓ sum_to_n(100_000) === 5_000_050_000
    ✓ sum_to_n(133_693_440) result is a safe integer

Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        0.637 s
```
