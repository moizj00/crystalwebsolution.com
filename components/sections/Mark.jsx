'use client';

import DecodeText from '../DecodeText';
import Reveal from '../Reveal';

// The brand-mark beat: shards assemble in 3D behind this statement
// across MARK_WINDOW as the user scrolls through.
export default function Mark() {
  return (
    <section className="section mark" id="mark">
      <p className="eyebrow"><Reveal as="span">The idea</Reveal></p>
      <DecodeText as="h2" text="Scattered thoughts," className="mark-line" />
      <DecodeText as="h2" text="assembled with intent." className="mark-line mark-line-accent" delay={0.3} />
      <Reveal className="mark-sub">
        <p>Keep scrolling — the mark finds its shape the way every project does: piece by piece, on purpose.</p>
      </Reveal>
    </section>
  );
}
