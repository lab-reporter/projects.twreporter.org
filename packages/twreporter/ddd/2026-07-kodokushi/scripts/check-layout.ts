import assert from 'node:assert/strict'
import { subtractIntervals } from '../src/lib/layout.ts'

assert.deepEqual(subtractIntervals(580, [[120, 240], [220, 320], [460, 700]]), [
  [0, 120],
  [320, 460],
])

// Results are [start, end], so the usable width is end - start.
for (const [start, end] of subtractIntervals(580, [[0, 355]])) {
  assert.ok(start + (end - start) <= 580)
}

// Completely and nearly blocked rows must remain distinguishable from normal rows.
assert.deepEqual(subtractIntervals(580, [[0, 580]]), [])
assert.deepEqual(subtractIntervals(580, [[0, 578]]), [[578, 580]])

console.log('layout interval check passed')
