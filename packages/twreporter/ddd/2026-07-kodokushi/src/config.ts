import { z } from 'zod'
import { mq } from '@lab-reporter/ddd-shared/media-query'
import illustrationData from './illustrations.json'

const positionSchema = z.object({
  x: z.number().meta({
    title: '水平X',
    'ui:layout': 'two-column',
  }),
  top: z.number().meta({
    title: '垂直Y',
    'ui:layout': 'two-column',
  }),
  width: z.number().positive().meta({
    title: '寬度',
    'ui:layout': 'single-column',
  }),
})

export const illustrationSchema = z
  .object({
    anchor: z.number().int().nonnegative().meta({
      title: '內容區塊 index',
      description: '從 start 到 end 之間的內容區塊，由 0 開始，包含標題。',
      'ui:layout': 'single-column',
    }),
    src: z.url().meta({
      title: '圖片或影片 URL',
      'ui:layout': 'no-title',
    }),
    mobile: positionSchema.optional().meta({
      title: '手機位置與尺寸',
      description: `${mq.mobile}，未設定時使用 desktop`,
    }),
    largeMobile: positionSchema.optional().meta({
      title: '大型手機位置與尺寸',
      description: `${mq.largeMobile}，未設定時使用 mobile，mobile 未設定時使用 desktop`,
    }),
    tablet: positionSchema.optional().meta({
      title: '平板位置與尺寸',
      description: `${mq.tablet}，未設定時使用 desktop`,
    }),
    desktop: positionSchema.meta({
      title: '桌機位置與尺寸',
      description: mq.desktop,
    }),
    hd: positionSchema.optional().meta({
      title: '寬螢幕位置與尺寸',
      description: `${mq.hd}，未設定時使用 desktop`,
    }),
  })
  .meta({ title: '插圖', 'ui:options': { label: false } })

export const configSchema = z
  .object({
    illustrations: z
      .array(illustrationSchema)
      .default(() => structuredClone(illustrationData.illustrations))
      .meta({
        title: '插圖',
        'ui:options': { collapsible: true, titleKey: 'src' },
      }),
  })
  .meta({ title: '文繞圖設定' })

export type IllustrationSpec = z.infer<typeof illustrationSchema>
export type GraphicConfig = z.infer<typeof configSchema>
