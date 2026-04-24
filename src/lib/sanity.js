import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true, // Switched to true to use the Edge CDN and save costs. On-demand revalidation still works via webhooks.
  next: {
    tags: ['sanity']
  }
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
