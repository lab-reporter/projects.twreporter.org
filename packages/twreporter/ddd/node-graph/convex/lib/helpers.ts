import { customCtx } from 'convex-helpers/server/customFunctions'
import { mutation, query } from '../_generated/server'
import { customQuery } from 'convex-helpers/server/customFunctions'
import { serverEnv } from './environmentVariables'
import { customMutation } from 'convex-helpers/server/customFunctions'

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) throw new Error('Not authenticated')

    if (!user.email?.endsWith(`@${serverEnv.auth.allowDomain}`))
      throw new Error('Unauthorized')

    return { user }
  }),
)

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) throw new Error('Not authenticated')

    if (!user.email?.endsWith(`@${serverEnv.auth.allowDomain}`))
      throw new Error('Unauthorized')

    return { ctx: { user }, args }
  },
})
