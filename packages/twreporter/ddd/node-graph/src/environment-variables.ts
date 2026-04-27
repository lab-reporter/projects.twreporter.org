export const env = {
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  },
  convex: {
    url: import.meta.env.VITE_CONVEX_URL,
    siteUrl: import.meta.env.VITE_CONVEX_SITE_URL,
  },
}
