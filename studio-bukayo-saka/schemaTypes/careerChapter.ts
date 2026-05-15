import {defineType, defineField} from 'sanity'

// Powers the immersive 3D scroll section inside the England overlay.
// Each document = one chapter (e.g. "International Debut", "World Cup 2022").
// Heading and image x/y/z values position elements in 3D space — edit carefully.
export const careerChapter = defineType({
  name: 'careerChapter',
  title: 'Career Chapter (3D Story)',
  type: 'document',
  fields: [
    defineField({
      name: 'lines',
      title: 'Heading Lines',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Each string = one line of the large heading, e.g. ["INTERNATIONAL", "DEBUT"]',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small caption below the heading, e.g. "October 2020 · First England Cap"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Chapters render in ascending order along the Z axis. 1 = first.',
    }),
    defineField({
      name: 'headingX',
      title: 'Heading X (vw)',
      type: 'number',
      description: 'Horizontal offset of the heading in the 3D scene.',
      initialValue: 0,
    }),
    defineField({
      name: 'headingY',
      title: 'Heading Y (vh)',
      type: 'number',
      description: 'Vertical offset of the heading in the 3D scene.',
      initialValue: -8,
    }),
    defineField({
      name: 'headingZ',
      title: 'Heading Z depth (px)',
      type: 'number',
      description: 'Depth of the heading along the camera axis. More negative = further away.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'alt',   title: 'Alt Text', type: 'string'}),
            defineField({
              name: 'x', title: 'X Position (vw)', type: 'number',
              description: 'Horizontal offset. Negative = left of centre.',
            }),
            defineField({
              name: 'y', title: 'Y Position (vh)', type: 'number',
              description: 'Vertical offset. Negative = above centre.',
            }),
            defineField({
              name: 'z', title: 'Z Depth (px)', type: 'number',
              description: 'More negative = further away from camera.',
            }),
          ],
          preview: {select: {title: 'alt'}},
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'lines', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      const heading = Array.isArray(title) ? title.join(' / ') : title
      return {title: heading, subtitle}
    },
  },
})
