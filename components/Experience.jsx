'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from './SmoothScroll';
import Loader from './Loader';
import Nav from './Nav';
import ScrollProgress from './ScrollProgress';
import FocusVeil from './FocusVeil';
import Hero from './sections/Hero';

// The Scene touches window + ships heavy libs — client-only.
const Scene = dynamic(() => import('./Scene'), { ssr: false });

// Lazy load section components that appear below the fold
const Services = dynamic(() => import('./sections/Services'));
const Approach = dynamic(() => import('./sections/Approach'));
const Showcase = dynamic(() => import('./sections/Showcase'));
const Stories = dynamic(() => import('./sections/Stories'));
const Mark = dynamic(() => import('./sections/Mark'));
const About = dynamic(() => import('./sections/About'));
const Facts = dynamic(() => import('./sections/Facts'));
const Recognition = dynamic(() => import('./sections/Recognition'));
const Motion = dynamic(() => import('./sections/Motion'));
const Contact = dynamic(() => import('./sections/Contact'));

export default function Experience() {
  return (
    <SmoothScroll>
      <Loader />
      <Scene />
      <FocusVeil />
      <Nav />
      <ScrollProgress />
      <main className="page">
        <Hero />
        <About />
        <Facts />
        <Showcase />
        <Services />
        <Approach />
        <Stories />
        <Mark />
        <Recognition />
        <Motion />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
