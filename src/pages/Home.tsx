import { Hero } from '../components/Hero';
import { AboutIntro } from '../components/AboutIntro';
import { Stats } from '../components/Stats';
import { DirectorMessage } from '../components/DirectorMessage';
import { Courses } from '../components/Courses';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Faculty } from '../components/Faculty';
import { SuccessStories } from '../components/SuccessStories';
import { CtaStrip } from '../components/CtaStrip';

export function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <Stats />
      <DirectorMessage />
      <Courses />
      <WhyChooseUs />
      <Faculty />
      <SuccessStories />
      <CtaStrip />
    </>
  );
}
