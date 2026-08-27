/**
 * Implementation A: Mathematical formula
 * Uses Gauss's closed-form formula: n * (n + 1) / 2
 * Time complexity:  O(1) — constant time, single arithmetic expression
 * Space complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}

/**
 * Implementation B: Iterative loop
 * Accumulates the sum by iterating from 1 to n.
 * Time complexity:  O(n) — linear, one pass through all integers up to n
 * Space complexity: O(1)
 */
export function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation C: Recursive
 * Breaks the problem down as: sum(n) = n + sum(n - 1), base case sum(0) = 0.
 * Time complexity:  O(n) — n recursive calls on the call stack
 * Space complexity: O(n) — each call frame is held in memory until unwinding
 */
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
