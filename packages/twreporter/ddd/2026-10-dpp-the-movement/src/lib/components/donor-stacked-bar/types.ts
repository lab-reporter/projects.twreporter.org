import { z } from 'zod'
import {
  colorSchema,
  createShellConfigSchema,
} from '@lab-reporter/ddd-shared/components/shared/types.ts'
import defaultConfig from '../../../../public/donor-stacked-bar.json' with { type: 'json' }

export const donorStackedBarConfigSchema = createShellConfigSchema(
  defaultConfig,
)
  .extend({
    axis: z
      .object({
        min: z.number().nonnegative().default(defaultConfig.axis.min).meta({
          title: '軸最小值（元）',
        }),
        max: z
          .number()
          .positive()
          .nullable()
          .default(defaultConfig.axis.max)
          .meta({
            title: '軸最大值（元）',
            description: '留空使用資料最大值；必須大於最小值。',
          }),
        tickCount: z
          .number()
          .int()
          .min(2)
          .max(20)
          .default(defaultConfig.axis.tickCount)
          .meta({
            title: '刻度數量',
            description: '包含兩端刻度；金額與百分比模式皆適用。',
          }),
      })
      .default(defaultConfig.axis)
      .meta({
        title: 'X 軸設定',
        description:
          '金額範圍以元設定；百分比模式固定為 0–100%。範圍外的長條會裁切。',
        'ui:order': ['min', 'max', 'tickCount'],
      }),
    columns: z
      .object({
        label: z
          .string()
          .min(1)
          .default(defaultConfig.columns.label)
          .meta({ title: '企業／集團欄位' }),
        description: z
          .string()
          .default(defaultConfig.columns.description)
          .meta({
            title: '企業說明欄位',
            description: '留空不顯示。',
          }),
      })
      .default(defaultConfig.columns)
      .meta({
        title: 'CSV 欄位對應',
        'ui:order': ['label', 'description'],
        'ui:options': { layout: 'two-column' },
      }),
    series: z
      .array(
        z
          .object({
            column: z.string().min(1).meta({ title: 'CSV 金額欄位' }),
            label: z.string().min(1).meta({ title: '顯示名稱' }),
            color: colorSchema,
          })
          .meta({ 'ui:order': ['column', 'label', 'color'] }),
      )
      .min(1)
      .default(defaultConfig.series)
      .meta({
        title: '政黨與色票',
        description: '順序決定長條堆疊與圖例順序。',
        'ui:options': { titleKey: 'label', collapsible: true },
      }),
  })
  .meta({
    title: '政治獻金堆疊長條圖設定',
    'ui:order': [
      'title',
      'subtitle',
      'columns',
      'series',
      'axis',
      'footnotes',
      'wide',
      'backdrop',
    ],
  })

export type DonorStackedBarConfig = z.infer<typeof donorStackedBarConfigSchema>
