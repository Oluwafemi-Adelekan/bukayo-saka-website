import Hero from '@/components/Hero'
import NewStory from '@/components/NewStory'
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
        <NewStory />
        <ClubAndCountry
          careerChapters={careerChapters}
          trophies={trophies}
          settings={settings}
        />
        <BeyondThePitch slides={btpSlides} />
        <Commercial />
        <MatchCenter />
      </div>
      <Footer />
    </main>
  )
}
