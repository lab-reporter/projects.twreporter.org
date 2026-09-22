import { z } from 'zod'

export const columnAlignmentSchema = z.enum(['left', 'right', 'center'])

export const tableColumnSchema = z.object({
  key: z
    .string()
    .describe('The CSV header used to select values for this column.'),
  label: z.string().describe('The text displayed in the table header.'),
  width: z
    .number()
    .positive()
    .max(1)
    .optional()
    .describe('The column width as a fraction of the table width.'),
  align: columnAlignmentSchema.optional().meta({
    description: 'Cell and header alignment.',
    default: 'left',
  }),
})

export const tableConfigSchema = z.object({
  title: z.string().describe('The title displayed above the table.'),
  footnotes: z.array(z.string()).describe('Notes displayed beneath the table.'),
  columns: z
    .array(tableColumnSchema)
    .min(1)
    .describe('The columns to display, in order.'),
  wide: z.boolean().optional().meta({
    description: 'Use the wide Reporter shell layout.',
    default: false,
  }),
  backdrop: z.boolean().optional().meta({
    description: 'Show the shell backdrop.',
    default: true,
  }),
  label: z
    .string()
    .optional()
    .describe('An optional label displayed directly above the table.'),
  mobileWidth: z.number().positive().optional().meta({
    description:
      'The table width on mobile, as a percentage. Values above 100 enable horizontal scrolling.',
    default: 100,
  }),
})

export type ColumnAlignment = z.infer<typeof columnAlignmentSchema>
export type TableColumn = z.infer<typeof tableColumnSchema>
export type TableConfig = z.infer<typeof tableConfigSchema>
