import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

const allImplementations = [
  { name: "sum_to_n_a (formula)", fn: sum_to_n_a },
  { name: "sum_to_n_b (iterative)", fn: sum_to_n_b },
  { name: "sum_to_n_c (recursive)", fn: sum_to_n_c },
];

// Recursive implementation overflows the call stack for large n — excluded from large-n tests.
const stackSafeImplementations = [
  { name: "sum_to_n_a (formula)", fn: sum_to_n_a },
  { name: "sum_to_n_b (iterative)", fn: sum_to_n_b },
];

describe.each(allImplementations)("$name", ({ fn }) => {
  // --- positive integers ---
  test("sum_to_n(1) === 1", () => {
    expect(fn(1)).toBe(1);
  });

  test("sum_to_n(2) === 3  (smallest multi-term sum)", () => {
    expect(fn(2)).toBe(3);
  });

  test("sum_to_n(5) === 15", () => {
    expect(fn(5)).toBe(15);
  });

  test("sum_to_n(10) === 55", () => {
    expect(fn(10)).toBe(55);
  });

  test("sum_to_n(100) === 5050", () => {
    expect(fn(100)).toBe(5050);
  });

  // --- zero ---
  test("sum_to_n(0) === 0", () => {
    expect(fn(0)).toBe(0);
  });

  // --- negative integers ---
  // There are no positive integers to sum when n < 1, so the result is 0 (empty sum).
  test("sum_to_n(-1) === 0", () => {
    expect(fn(-1)).toBe(0);
  });

  test("sum_to_n(-5) === 0", () => {
    expect(fn(-5)).toBe(0);
  });

  test("sum_to_n(-10) === 0", () => {
    expect(fn(-10)).toBe(0);
  });

  test("sum_to_n(-1000) === 0  (large negative)", () => {
    expect(fn(-1000)).toBe(0);
  });
});

// Large-n tests only for non-recursive implementations (recursive hits call stack limit)
describe.each(stackSafeImplementations)("$name — large inputs", ({ fn }) => {
  test("sum_to_n(100_000) === 5_000_050_000", () => {
    expect(fn(100_000)).toBe(5_000_050_000);
  });

  // Largest n whose result stays below Number.MAX_SAFE_INTEGER (2^53 - 1)
  // 133_693_440 * 133_693_441 / 2 = 8_934_466_999_246_080 < 9_007_199_254_740_991
  test("sum_to_n(133_693_440) result is a safe integer", () => {
    const result = fn(133_693_440);
    expect(Number.isSafeInteger(result)).toBe(true);
    expect(result).toBe((133_693_440 * (133_693_440 + 1)) / 2);
  });
});
