import {defineType, defineField} from 'sanity'

export const beyondThePitchSlide = defineType({
  name: 'beyondThePitchSlide',
  title: 'Beyond the Pitch Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'navLabel',
      title: 'Nav Label',
      type: 'string',
      description: 'Short label shown in the slide navigation tabs — e.g. "BIG SHOE FOUNDATION - NIGERIA"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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
    select: {title: 'headline', subtitle: 'navLabel'},
  },
})
