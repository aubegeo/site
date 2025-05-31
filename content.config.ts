import { defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  schema: {
    article: z.object({
      title: z.string(),
      description: z.string(),
      date: z.string().optional(),
      tags: z.array(z.string()).optional(),
      _path: z.string(),
      _draft: z.boolean().optional()
    })
  }
})