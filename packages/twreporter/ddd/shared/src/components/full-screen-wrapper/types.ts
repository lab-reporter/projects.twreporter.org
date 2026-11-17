import z from 'zod'

export const fullScreenWrapperConfigSchema = z.object({
  splashScreenText: z.string(),
})

export type FullScreenWrapperConfig = z.infer<
  typeof fullScreenWrapperConfigSchema
>
