'use client';

import DecodeText from '../DecodeText';
import Reveal from '../Reveal';

// The brand-mark beat: shards assemble in 3D behind this statement as the
// user scrolls through (see components/three/MarkAssembly.jsx, windowed
// against this section's own measured span via lib/beatProgress.js).
export default function Mark() {
  return (
    <section className="section mark" id="mark">
      <p className="eyebrow"><Reveal as="span">The idea</Reveal></p>
      {/* start pushed later than the default 'top 85%' so these decode
          after the shard assembly has mostly resolved, instead of racing
          the flying fragments. */}
      <DecodeText as="h2" text="Scattered thoughts," className="mark-line" start="top 45%" />
      <DecodeText
        as="h2"
        text="assembled with intent."
        className="mark-line mark-line-accent"
        delay={0.3}
        start="top 45%"
      />
      <Reveal className="mark-sub">
        <p>Scroll on — the mark resolves the way every build does: shards first, then clarity, assembled on purpose.</p>
      </Reveal>
    </section>
  );
}
