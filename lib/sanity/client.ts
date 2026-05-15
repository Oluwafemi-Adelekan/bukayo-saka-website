import { createClient } from 'next-sanity'
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: 'atq6r4b6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
