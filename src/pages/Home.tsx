import { Hero } from '../components/Hero';
import { NoticeBoard } from '../components/NoticeBoard';
import { AboutIntro } from '../components/AboutIntro';
import { Stats } from '../components/Stats';
import { DirectorMessage } from '../components/DirectorMessage';
import { Courses } from '../components/Courses';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Faculty } from '../components/Faculty';
import { SuccessStories } from '../components/SuccessStories';
import { Certificates } from '../components/Certificates';
import { CtaStrip } from '../components/CtaStrip';

export function Home() {
  return (
    <>
      <Hero />
      <NoticeBoard />
      <AboutIntro />
      <Stats />
      <Certificates />
      <DirectorMessage />
      <Courses />
      <WhyChooseUs />
      <Faculty />
      <SuccessStories />
      <CtaStrip />
    </>
  );
}
