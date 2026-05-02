import Hero from '@/components/Hero'
import StoryIntro from '@/components/StoryIntro'
import HaleEndAcademy from '@/components/HaleEndAcademy'
import ProfessionalDebut from '@/components/ProfessionalDebut'
import FixedBrand from '@/components/FixedBrand'
import Story from '@/components/Story'
import ClubAndCountry from '@/components/ClubAndCountry'
import StatsSection from '@/components/StatsSection'
import TrophyCabinet from '@/components/TrophyCabinet'
import BeyondThePitch from '@/components/BeyondThePitch'
import Commercial from '@/components/Commercial'
import MatchCenter from '@/components/MatchCenter'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Story Intro (EALING BORN) */}
      <StoryIntro />
      
      {/* Hale End Academy Section */}
      <HaleEndAcademy />

      {/* Professional Debut Section */}
      <ProfessionalDebut />

      {/* Rest of the story sections */}
      <Story />
      <ClubAndCountry />
      <StatsSection />
      <TrophyCabinet />
      <BeyondThePitch />
      <Commercial />
      <MatchCenter />
      <Footer />
      {/* Fixed bottom brand — appears once hero is scrolled past */}
      <FixedBrand />
    </main>
  )
}
