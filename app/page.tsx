import Hero from '@/components/Hero'
import StoryIntro from '@/components/StoryIntro'
import HaleEndAcademy from '@/components/HaleEndAcademy'
import ProfessionalDebut from '@/components/ProfessionalDebut'
import Number7 from '@/components/Number7'
import FixedBrand from '@/components/FixedBrand'
import ClubAndCountry from '@/components/ClubAndCountry'
import BeyondThePitch from '@/components/BeyondThePitch'
import Commercial from '@/components/Commercial'
import MatchCenter from '@/components/MatchCenter'
import Footer from '@/components/Footer'
import SignatureReveal from '@/components/SignatureReveal'
import {
  getTrophies,
  getBTPSlides,
  getCareerChapters,
  getMilestones,
  getSiteSettings,
} from '@/lib/sanity/queries'

export default async function Home() {
  // Fetch all Sanity content in parallel — server-side, ISR-cached at 1 hour
  const [trophies, btpSlides, careerChapters, milestones, settings] = await Promise.all([
    getTrophies(),
    getBTPSlides(),
    getCareerChapters(),
    getMilestones(),
    getSiteSettings(),
  ])

  return (
    <main>
      <div style={{ position: 'relative' }}>
        <SignatureReveal />
        <Hero />
        <StoryIntro />
        <HaleEndAcademy />
        <ProfessionalDebut milestones={milestones} />
        <Number7 />
        <ClubAndCountry
          careerChapters={careerChapters}
          trophies={trophies}
          settings={settings}
        />
        <BeyondThePitch slides={btpSlides} />
        <Commercial />
        <MatchCenter />
        <FixedBrand />
      </div>
      <Footer />
    </main>
  )
}
