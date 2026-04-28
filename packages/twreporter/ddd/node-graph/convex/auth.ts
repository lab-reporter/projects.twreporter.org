import { userQuery } from './lib/helpers'

export const getMe = userQuery({
  handler: async (ctx) => {
    return { user: ctx.user }
  },
})
