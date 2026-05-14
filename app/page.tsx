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

export default function Home() {
  return (
    <main>
      <div style={{ position: 'relative' }}>
        {/* Signature intro overlay — plays on load, fades out to reveal hero */}
        <SignatureReveal />
        <Hero />
        {/* Story Intro (EALING BORN) */}
        <StoryIntro />
        
        {/* Hale End Academy Section */}
        <HaleEndAcademy />

        {/* Professional Debut → FA Cup Winner → England Call-Up → First England Goal
            One unified section, one sticky element, no duplicate. */}
        <ProfessionalDebut />
        <Number7 />

        {/* Rest of the sections */}
        <ClubAndCountry />
        <BeyondThePitch />
        <Commercial />
        <MatchCenter />
        {/* Sticky bottom brand — appears once hero is scrolled past, then scrolls up at the very end */}
        <FixedBrand />
      </div>
      <Footer />
    </main>
  )
}
