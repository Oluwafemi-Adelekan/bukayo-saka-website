import {defineType, defineField} from 'sanity'

export const trophy = defineType({
  name: 'trophy',
  title: 'Trophy / Award',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'years',
      title: 'Year(s)',
      type: 'string',
      description: 'e.g. "2020" or "2020, 2023"',
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
    select: {title: 'label', subtitle: 'years'},
  },
})
