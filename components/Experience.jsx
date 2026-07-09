'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from './SmoothScroll';
import Loader from './Loader';
import Cursor from './Cursor';
import Nav from './Nav';
import ScrollProgress from './ScrollProgress';
import FocusVeil from './FocusVeil';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Approach from './sections/Approach';
import Showcase from './sections/Showcase';
import Stories from './sections/Stories';
import Mark from './sections/Mark';
import About from './sections/About';
import Facts from './sections/Facts';
import Recognition from './sections/Recognition';
import Motion from './sections/Motion';
import Contact from './sections/Contact';

// The Scene touches window + ships heavy libs — client-only.
const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function Experience() {
  return (
    <SmoothScroll>
      <Loader />
      <Cursor />
      <Scene />
      <FocusVeil />
      <Nav />
      <ScrollProgress />
      <main className="page">
        <Hero />
        <Services />
        <Approach />
        <Showcase />
        <Stories />
        <Mark />
        <About />
        <Facts />
        <Recognition />
        <Motion />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
