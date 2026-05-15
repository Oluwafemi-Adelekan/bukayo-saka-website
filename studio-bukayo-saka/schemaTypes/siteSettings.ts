import {defineType, defineField} from 'sanity'

// Singleton — one document, never duplicated.
// Arsenal numeric stats are auto-fetched from the FPL API — don't duplicate them here.
// This document covers content that no API can supply: England stats, editorial copy.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ── England stats (no public API tracks these) ─────────────────────────
    defineField({
      name: 'englandStats',
      title: 'England Stats',
      description: 'Update manually after international fixtures. Arsenal stats are auto-fetched from the FPL API.',
      type: 'object',
      fields: [
        defineField({name: 'caps',    title: 'Caps',    type: 'number'}),
        defineField({name: 'goals',   title: 'Goals',   type: 'number'}),
        defineField({name: 'assists', title: 'Assists', type: 'number'}),
        defineField({name: 'ga',      title: 'G+A',     type: 'number'}),
        defineField({name: 'shirt',   title: 'Shirt Number', type: 'number'}),
      ],
    }),

    // ── Editorial copy ─────────────────────────────────────────────────────
    defineField({
      name: 'mainQuote',
      title: 'Main Quote (Arsenal overlay)',
      type: 'text',
      rows: 3,
      description: 'The large centred quote in the Arsenal story overlay.',
    }),
    defineField({
      name: 'arsenalStory',
      title: 'Arsenal Story Copy',
      type: 'text',
      rows: 4,
      description: 'Paragraph shown next to the stats card in the Arsenal overlay.',
    }),
    defineField({
      name: 'englandDescription',
      title: 'England Description',
      type: 'text',
      rows: 4,
      description: 'Paragraph shown next to the stats card in the England overlay.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
