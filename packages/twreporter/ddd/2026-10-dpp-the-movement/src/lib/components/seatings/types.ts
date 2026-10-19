import { z } from 'zod'
import {
  colorSchema,
  createShellConfigSchema,
} from '@lab-reporter/ddd-shared/components/shared/types.ts'
import defaultConfig from '../../../../public/seatings.json' with { type: 'json' }

export const seatingsConfigSchema = createShellConfigSchema(defaultConfig)
  .extend({
    columns: z
      .object({
        group: z
          .string()
          .min(1)
          .default(defaultConfig.columns.group)
          .meta({
            title: '分組欄位',
            description: '每個分組呈現一排席次。',
            'ui:options': { layout: 'two-column' },
          }),
        category: z
          .string()
          .min(1)
          .default(defaultConfig.columns.category)
          .meta({
            title: '類別欄位',
            description: '決定席次顏色及圖例。',
            'ui:options': { layout: 'two-column' },
          }),
        label: z
          .string()
          .min(1)
          .default(defaultConfig.columns.label)
          .meta({ title: '名稱欄位', 'ui:options': { layout: 'two-column' } }),
        description: z
          .string()
          .default(defaultConfig.columns.description)
          .meta({
            title: '說明欄位',
            description: '在 tooltip 中顯示。留空不使用。',
            'ui:options': { layout: 'two-column' },
          }),
      })
      .default(defaultConfig.columns)
      .meta({
        title: 'CSV 欄位對應',
        description: '填入 CSV 第一列的欄位名稱，須完全相同。',
        'ui:order': ['group', 'category', 'label', 'description'],
      }),
    categories: z
      .array(
        z
          .object({
            value: z
              .string()
              .min(1)
              .meta({
                title: 'CSV 類別值',
                'ui:options': { layout: 'two-column' },
              }),
            label: z
              .string()
              .optional()
              .meta({
                title: '顯示名稱',
                description: '留空使用 CSV 類別值。',
                'ui:options': { layout: 'two-column' },
              }),
            color: colorSchema,
          })
          .meta({ 'ui:order': ['value', 'label', 'color'] }),
      )
      .default(defaultConfig.categories)
      .meta({
        title: '類別順序與顏色',
        description: '使用上移、下移按鈕調整順序；未設定的類別顯示為灰色。',
        'ui:options': { titleKey: 'value', collapsible: true },
      }),
    focusCategory: z.string().default(defaultConfig.focusCategory).meta({
      title: '摘要類別',
      description:
        '填入 CSV 類別值，在各分組標題旁顯示席次與比例。留空不顯示。',
    }),
  })
  .meta({
    title: '席次圖設定',
    'ui:order': [
      'title',
      'subtitle',
      'columns',
      'focusCategory',
      'categories',
      'footnotes',
      'wide',
      'backdrop',
    ],
  })

export type SeatingsConfig = z.infer<typeof seatingsConfigSchema>
