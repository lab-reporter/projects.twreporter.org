import { createQuery } from '@tanstack/svelte-query'
import { fetchCSVArray } from '../fetch'
import { dataPath } from '../constants/path'

export const useColors = () =>
  createQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const res = await fetchCSVArray({
        url: dataPath.colorPalette,
      })

      return {
        default: res.find((c) => c.Type === 'default'),
        stops: res.filter((c) => c.Type === 'interpolate'),
        steps: res.filter((c) => c.Type === 'step'),
      }
    },
    retry: true,
  })
