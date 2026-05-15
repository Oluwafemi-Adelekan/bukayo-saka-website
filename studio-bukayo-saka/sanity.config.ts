import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Bukayo Saka',

  projectId: 'atq6r4b6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── Singleton — always one document, no list view ──────────────
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),

            S.divider(),

            // ── Story sections ─────────────────────────────────────────────
            S.listItem()
              .title('Career Milestones')
              .schemaType('careerMilestone')
              .child(S.documentTypeList('careerMilestone').title('Career Milestones')),

            S.listItem()
              .title('Career Chapters (3D Story)')
              .schemaType('careerChapter')
              .child(S.documentTypeList('careerChapter').title('Career Chapters')),

            S.divider(),

            // ── Other sections ─────────────────────────────────────────────
            S.listItem()
              .title('Trophy Cabinet')
              .schemaType('trophy')
              .child(S.documentTypeList('trophy').title('Trophies & Awards')),

            S.listItem()
              .title('Beyond the Pitch')
              .schemaType('beyondThePitchSlide')
              .child(S.documentTypeList('beyondThePitchSlide').title('Beyond the Pitch Slides')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
