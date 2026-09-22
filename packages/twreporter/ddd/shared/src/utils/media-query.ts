export const breakpoints = {
  mobile: 0, // <480
  largeMobile: 480, // 480-767
  tablet: 768, // 768-1023
  desktop: 1024, // 1024-1439
  hd: 1440, // >=1440
} as const

export type Breakpoint = keyof typeof breakpoints

export const breakpointFallbacks = {
  mobile: 'desktop',
  largeMobile: 'mobile',
  tablet: 'desktop',
  desktop: null,
  hd: 'desktop',
} as const satisfies Record<Breakpoint, Breakpoint | null>

export type ResponsiveValue<T> = {
  [K in Breakpoint as (typeof breakpointFallbacks)[K] extends null ? K : never]: T
} & Partial<Record<Breakpoint, T>>

export const mq = {
  mobile: `(width < ${breakpoints.largeMobile}px)`,
  largeMobile: `(${breakpoints.largeMobile}px <= width < ${breakpoints.tablet}px)`,
  tablet: `(${breakpoints.tablet}px <= width < ${breakpoints.desktop}px)`,
  desktop: `(${breakpoints.desktop}px <= width < ${breakpoints.hd}px)`,
  hd: `(width >= ${breakpoints.hd}px)`,
} satisfies Record<Breakpoint, string>

export function getBreakpoint(width: number): Breakpoint {
  if (width < breakpoints.largeMobile) return 'mobile'
  if (width < breakpoints.tablet) return 'largeMobile'
  if (width < breakpoints.desktop) return 'tablet'
  if (width < breakpoints.hd) return 'desktop'
  return 'hd'
}

export function resolveResponsiveValue<T>(
  values: ResponsiveValue<T>,
  breakpoint: Breakpoint,
): T {
  let candidate: Breakpoint | null = breakpoint
  while (candidate !== null) {
    const value = values[candidate]
    if (value !== undefined) return value
    candidate = breakpointFallbacks[candidate]
  }
  throw new Error(`Missing responsive value for ${breakpoint} and its fallbacks`)
}
