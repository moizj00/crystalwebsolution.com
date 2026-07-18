'use client';

import DecodeText from '../DecodeText';
import Reveal from '../Reveal';

export default function Mark() {
  return (
    <section className="section mark" id="mark">
      <p className="eyebrow"><Reveal as="span">The idea</Reveal></p>
      <DecodeText as="h2" text="Scattered thoughts," className="mark-line" start="top 45%" />
      <DecodeText
        as="h2"
        text="assembled with intent."
        className="mark-line mark-line-accent"
        delay={0.3}
        start="top 45%"
      />
      <Reveal className="mark-sub">
        <p>Keep scrolling — the mark finds its shape the way every project does: piece by piece, on purpose.</p>
      </Reveal>
    </section>
  );
}
