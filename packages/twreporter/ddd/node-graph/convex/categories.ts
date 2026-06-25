import { v } from 'convex/values'
import { userMutation, userQuery } from './lib/helpers'
import { categoryFields } from './schema'

export const getCategories = userQuery({
  handler: async (ctx) => {
    return await ctx.db.query('categories').collect()
  },
})

export const updateCategory = userMutation({
  args: v.object({
    categoryId: v.id('categories'),
    patch: v.object(categoryFields).partial(),
  }),
  handler: async (ctx, { categoryId, patch }) => {
    return await ctx.db.patch(categoryId, patch)
  },
})
