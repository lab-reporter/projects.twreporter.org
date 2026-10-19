import assert from 'node:assert/strict'
import { donorStackedBarConfigSchema } from '../src/lib/components/donor-stacked-bar/types.ts'
import { buildDonorStackedBar } from '../src/lib/components/donor-stacked-bar/data.ts'
import defaultConfig from '../public/donor-stacked-bar.json' with { type: 'json' }

assert.deepEqual(donorStackedBarConfigSchema.parse({}).axis, defaultConfig.axis)
const config = donorStackedBarConfigSchema.parse({
  axis: { min: 0, max: null, tickCount: 5 },
})
const csv = {
  headers: [
    config.columns.label,
    config.columns.description,
    ...config.series.map((item) => item.column),
  ],
  rows: [
    { [config.columns.label]: '測試企業', [config.series[0].column]: '100' },
  ],
}
assert.deepEqual(config.axis, { min: 0, max: null, tickCount: 5 })
assert.deepEqual(buildDonorStackedBar(csv, config).axis, { min: 0, max: 100 })
assert.deepEqual(
  buildDonorStackedBar(csv, {
    ...config,
    axis: { min: 20, max: 80, tickCount: 3 },
  }).axis,
  { min: 20, max: 80 },
)
assert.deepEqual(buildDonorStackedBar({ ...csv, rows: [] }, config).axis, {
  min: 0,
  max: 1,
})
assert.throws(() =>
  buildDonorStackedBar(csv, {
    ...config,
    axis: { ...config.axis, min: 100, max: 50 },
  }),
)
for (const tickCount of [0, 1, 2.5, 21]) {
  assert.equal(
    donorStackedBarConfigSchema.safeParse({ axis: { tickCount } }).success,
    false,
  )
}
console.log('Donor axis checks passed')
