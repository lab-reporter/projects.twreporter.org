import { z } from 'zod'
import {
  colorSchema,
  createShellConfigSchema,
} from '@lab-reporter/ddd-shared/components/shared/types.ts'
import defaultConfig from '../../../../public/detailed-bar-chart.json' with { type: 'json' }

export const detailedBarChartConfigSchema = createShellConfigSchema(
  defaultConfig,
)
  .extend({
    'layout-direction': z
      .enum(['horizontal', 'vertical'])
      .default('horizontal')
      .meta({
        title: '名單分區排列方向',
        description:
          '左右分區時，立委與首長每欄最多三張；上下分區時，卡片由左到右排列。',
        'ui:enumNames': ['左右分區', '上下分區'],
      }),
    columns: z
      .object({
        filter: z
          .string()
          .default(defaultConfig.columns.filter)
          .optional()
          .meta({
            title: '篩選欄位',
            description: '留空合併所有資料。',
            'ui:options': { layout: 'two-column' },
          }),
        group: z
          .string()
          .min(1)
          .default(defaultConfig.columns.group)
          .meta({
            title: '企業／集團欄位',
            'ui:options': { layout: 'two-column' },
          }),
        label: z
          .string()
          .min(1)
          .default(defaultConfig.columns.label)
          .meta({
            title: '名單名稱欄位',
            'ui:options': { layout: 'two-column' },
          }),
        category: z
          .string()
          .min(1)
          .default(defaultConfig.columns.category)
          .meta({ title: '分類欄位', 'ui:options': { layout: 'two-column' } }),
        value: z
          .string()
          .min(1)
          .default(defaultConfig.columns.value)
          .meta({
            title: '金額欄位',
            description: '填入以元為單位的數字，圖表固定顯示為萬元。',
            'ui:options': { layout: 'two-column' },
          }),
        description: z
          .union([z.string(), z.array(z.string())])
          .default(defaultConfig.columns.description)
          .meta({
            title: '名單說明欄位',
            description:
              '可使用單一欄位或欄位陣列；陣列最後一欄的值會依前方欄位分組合併。',
            'ui:options': { layout: 'two-column' },
          }),
        section: z
          .string()
          .default(defaultConfig.columns.section)
          .meta({
            title: '名單分組欄位',
            description:
              '跨分組候選人依明細欄位開頭的四位數選舉年份，使用最新選舉的分組。留空不分組，分組順序依資料列順序。',
            'ui:options': { layout: 'two-column' },
          }),
        detail: z
          .string()
          .default(defaultConfig.columns.detail)
          .meta({ title: '明細欄位', 'ui:options': { layout: 'two-column' } }),
        breakdown: z
          .string()
          .default(defaultConfig.columns.breakdown)
          .meta({
            title: '其他類別明細欄位',
            'ui:options': { layout: 'two-column' },
          }),
      })
      .default(defaultConfig.columns)
      .meta({
        title: 'CSV 欄位對應',
        description:
          '填入 CSV 第一列的欄位名稱。篩選、說明、名單分組、明細與其他類別明細可留空。',
        'ui:order': [
          'filter',
          'group',
          'label',
          'category',
          'value',
          'description',
          'section',
          'detail',
          'breakdown',
        ],
      }),
    descriptions: z
      .array(
        z
          .object({
            group: z
              .string()
              .min(1)
              .meta({
                title: '企業／集團',
                description: '須與企業／集團欄位的 CSV 值完全相同。',
                'ui:options': { layout: 'two-column' },
              }),
            filter: z.string().meta({
              title: '縣市／篩選值',
              description:
                '須與篩選欄位的 CSV 值完全相同；未設定篩選欄位時留空。',
              'ui:options': { layout: 'two-column' },
            }),
            text: z.string().min(1).meta({
              title: '說明',
              'ui:widget': 'textarea',
            }),
          })
          .meta({ 'ui:order': ['group', 'filter', 'text'] }),
      )
      .default(defaultConfig.descriptions)
      .meta({
        title: '長條補充說明',
        description: '只顯示符合目前所選企業及縣市的項目。',
        'ui:options': { titleKey: 'group', collapsible: true },
      }),
    cardFilter: z
      .object({
        column: z.string().default(defaultConfig.cardFilter.column).meta({
          title: 'CSV 篩選欄位',
          description: '只篩選下方名單，不影響長條及企業總額。留空不篩選。',
        }),
        values: z
          .array(z.string())
          .default(defaultConfig.cardFilter.values)
          .meta({
            title: '包含的值',
            description: '須與 CSV 值完全相同；留空顯示全部。',
          }),
        label: z
          .string()
          .default(defaultConfig.cardFilter.label)
          .meta({ title: '名單顯示名稱' }),
      })
      .default(defaultConfig.cardFilter)
      .meta({
        title: '候選人卡片篩選',
        'ui:order': ['column', 'values', 'label'],
      }),
    highlight: z
      .object({
        value: z
          .string()
          .min(1)
          .default(defaultConfig.highlight.value)
          .meta({
            title: 'CSV 分類值',
            'ui:options': { layout: 'two-column' },
          }),
        label: z
          .string()
          .default(defaultConfig.highlight.label)
          .meta({ title: '顯示名稱', 'ui:options': { layout: 'two-column' } }),
        color: colorSchema.default(defaultConfig.highlight.color),
      })
      .default(defaultConfig.highlight)
      .meta({ title: '重點類別', 'ui:order': ['value', 'label', 'color'] }),
    remainder: z
      .object({
        label: z
          .string()
          .default(defaultConfig.remainder.label)
          .meta({ title: '顯示名稱', 'ui:options': { layout: 'two-column' } }),
        color: colorSchema.default(defaultConfig.remainder.color),
      })
      .default(defaultConfig.remainder)
      .meta({
        title: '其餘類別',
        description: '分類欄位不等於重點類別值的資料。',
        'ui:order': ['label', 'color'],
      }),
  })
  .meta({
    title: '捐款明細圖設定',
    'ui:order': [
      'title',
      'subtitle',
      'layout-direction',
      'columns',
      'descriptions',
      'highlight',
      'remainder',
      'cardFilter',
      'footnotes',
      'wide',
      'backdrop',
    ],
  })

export type DetailedBarChartConfig = z.infer<
  typeof detailedBarChartConfigSchema
>
