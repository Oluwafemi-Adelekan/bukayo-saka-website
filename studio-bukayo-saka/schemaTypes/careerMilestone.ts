import {defineType, defineField} from 'sanity'

// The four story beats inside the Professional Debut scroll section:
// debut → FA Cup winner → England call-up → First England goal
export const careerMilestone = defineType({
  name: 'careerMilestone',
  title: 'Career Milestone',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Milestone Type',
      type: 'string',
      options: {
        list: [
          {title: 'Professional Debut', value: 'debut'},
          {title: 'FA Cup Winner', value: 'facup'},
          {title: 'England Call-Up', value: 'england_callup'},
          {title: 'First England Goal', value: 'first_goal'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'First line — rendered in Kegilka serif, e.g. "PROFESSIONAL"',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Second line — rendered in Mona Sans light, e.g. "DEBUT"',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Displayed as the large outline number — e.g. "2018"',
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'year'},
  },
})
