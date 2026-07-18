// Case-study data. Visuals are code-generated from each project's palette —
// no image assets anywhere in this repo.
//
// Each case study follows a Before -> After -> Bridge shape:
//   summary  = one BAB line (the problem we walked into, and the state we left)
//   body[]   = problem -> rebuild -> result-with-metric (3-5 strings)
// Clients are illustrative. Metrics are plausible and clearly generic.
export const PROJECTS = [
  {
    slug: 'aurora-finance',
    title: 'Aurora Finance',
    category: 'Web & app development',
    year: '2026',
    palette: ['#59f3ff', '#3c6cff'],
    summary:
      'A trading dashboard that exhausted its users; we rebuilt it as a calm instrument that surfaces what matters in a single glance.',
    services: ['Product design', 'WebGL', 'Frontend build'],
    body: [
      'Aurora’s traders lived inside a dashboard that was technically complete and emotionally draining — twelve alert streams, no hierarchy, every number shouting at once.',
      'We rebuilt the interface around a single depth axis: portfolio health floats nearest the viewer, context recedes, and motion carries meaning — the velocity of a position maps to velocity on screen.',
      'Median task time dropped 34%, and the new frame became the template for the rest of their product family.',
    ],
  },
  {
    slug: 'meridian-atelier',
    title: 'Meridian Atelier',
    category: 'Branding & logo',
    year: '2025',
    palette: ['#c084fc', '#3c6cff'],
    summary:
      'A couture house with no face; we gave it a living monogram and a brand system buyers recognize before they read the name.',
    services: ['Brand identity', 'Logo design', 'Art direction'],
    body: [
      'Meridian had the craft of a great atelier and the brand of a generic shop — no mark, no system, nothing to remember them by.',
      'We built a monogram that breathes: a single ligatured “M” that morphs across packaging, storefront and screen, held together by a tight type and color system.',
      'Aided brand recall in their segment rose 41% in two quarters, and wholesale partners started asking for the logo before the lookbook.',
    ],
  },
  {
    slug: 'northwind-labs',
    title: 'Northwind Labs',
    category: 'Branding & design system',
    year: '2025',
    palette: ['#59f3ff', '#c084fc'],
    summary:
      'Brilliant research almost nobody could read; we gave Northwind a decoding type system that makes rigor feel inviting.',
    services: ['Brand identity', 'Design system', 'Development'],
    body: [
      'Northwind publishes research that wins grants and loses readers — dense, correct, and impossible to skim.',
      'We built a decoding type system: headlines resolve from cipher to clarity as you scroll, a metaphor for the lab’s work, with charts generated live from their open datasets.',
      'Media citations tripled within six months of launch, and two of their papers reached a general audience for the first time.',
    ],
  },
  {
    slug: 'halcyon-audio',
    title: 'Halcyon Audio',
    category: '2D / 3D animation',
    year: '2024',
    palette: ['#3c6cff', '#59f3ff'],
    summary:
      'A headphone launch that read like a spec sheet; we turned the product’s own sound into a 3D scene that moves to the music.',
    services: ['Launch site', 'WebAudio + WebGL', 'Motion design'],
    body: [
      'Halcyon’s flagship deserved more than a frequency chart, but every launch asset they had was static.',
      'We built a scene where the product’s frequency response sculpts the environment — a WebAudio analyser feeds displacement, bloom and particle drift in real time.',
      'Pre-orders sold out in eleven days, and the launch film was shared 3.2x more than their previous drop.',
    ],
  },
  {
    slug: 'terra-verde',
    title: 'Terra Verde',
    category: 'Web design & art direction',
    year: '2024',
    palette: ['#c084fc', '#59f3ff'],
    summary:
      'An architecture studio chopped into thumbnails; we rebuilt their site as one continuous camera walk through six buildings.',
    services: ['Web design', 'Scroll choreography', 'CMS'],
    body: [
      'Architects think in sequence — approach, threshold, volume, light — and their old site flattened that into a grid of thumbnails.',
      'We rebuilt it as a single continuous camera journey: scroll is the walk, each project a room the camera enters, plan drawings assembling themselves from strokes as you arrive.',
      'The studio now opens client pitches by scrolling the site in silence, and inbound project enquiries rose 28% year over year.',
    ],
  },
  {
    slug: 'brightpath-clinic',
    title: 'Brightpath Clinic',
    category: 'Digital marketing',
    year: '2026',
    palette: ['#59f3ff', '#c084fc'],
    summary:
      'A clinic with empty chairs and a forgotten website; we built a measured growth engine that fills the booking calendar.',
    services: ['SEO', 'Paid search', 'Lifecycle email'],
    body: [
      'Brightpath had a beautiful practice and a website that converted no one — no local search presence, no follow-up, no way to book without a phone call.',
      'We rebuilt the funnel: local SEO and paid search for intent, a booking path that works on a phone, and lifecycle email that brings lapsed patients back.',
      'New-patient bookings climbed 63% in four months, and the cost to acquire each one fell by nearly half.',
    ],
  },
  {
    slug: 'cobalt-logistics',
    title: 'Cobalt Logistics',
    category: 'AI automation',
    year: '2026',
    palette: ['#8e78ff', '#59f3ff'],
    summary:
      'A logistics team drowning in manual triage; we put an AI layer on the inbox that routes, drafts and learns from every correction.',
    services: ['AI strategy', 'Model integration', 'Internal tools'],
    body: [
      'Cobalt’s ops team spent four hours a day sorting freight exceptions by hand — the same edge cases, the same copy, the same delays.',
      'We trained a routing model on their history, wired it into the inbox, and gave dispatchers a one-click draft they can edit or send — every correction feeds back to the model.',
      'Manual triage time fell 71%, exception response dropped from hours to minutes, and the model now handles 6 in 10 exceptions without a human touch.',
    ],
  },
  {
    slug: 'ironwood-manufacturing',
    title: 'Ironwood Manufacturing',
    category: 'Workflow automation',
    year: '2025',
    palette: ['#c084fc', '#3c6cff'],
    summary:
      'Orders lost between five tools; we stitched the stack into one workflow that moves itself, end to end.',
    services: ['Process audit', 'Zapier / n8n', 'Documentation'],
    body: [
      'Ironwood’s orders travelled by hand from quote to invoice across five disconnected tools, and something fell through the cracks every week.',
      'We mapped the real process, then rebuilt it as one automated workflow — quotes trigger jobs, jobs trigger invoices, and every step logs itself without a human copy-paste.',
      'Order-to-invoice time dropped from nine days to one, and the weekly “where did this order go” meeting simply stopped.',
    ],
  },
];

export function getProject(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}
