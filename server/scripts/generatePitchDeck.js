/*
 InterNexus Pitch Deck Generator
 Creates a concise, statesmanlike slide deck "a la Lee Hsien Loong"—clear, data-driven, pragmatic.
 Output: InterNexus_Pitch_Deck.pptx at project root
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PptxGenJS from 'pptxgenjs';

// Resolve __dirname under ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(path.join(__dirname, '..', '..'));
const outPath = path.join(rootDir, 'InterNexus_Pitch_Deck.pptx');
const logoPath = path.join(rootDir, 'client', 'src', 'assets', 'internexus-logo.png');

const hasLogo = fs.existsSync(logoPath);

// Theme
const COLORS = {
  primary: '203864', // deep navy
  secondary: '1890FF', // blue accent
  accent: '52C41A', // green
  orange: 'FA8C16',
  text: '0F172A',
  subtle: '64748B',
  bg: 'FFFFFF',
};

function titleSlide(pptx, title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  if (hasLogo) {
    slide.addImage({ path: logoPath, x: 0.2, y: 0.2, w: 1.0, h: 1.0 });
  }
  slide.addText(title, { x: 1.0, y: 1.6, w: 8.0, h: 1.0, fontSize: 44, bold: true, color: COLORS.primary });
  slide.addText(subtitle, { x: 1.0, y: 2.5, w: 8.5, h: 0.8, fontSize: 20, color: COLORS.subtle });
  slide.addShape(pptx.ShapeType.rect, { x: 1.0, y: 3.3, w: 4.2, h: 0.08, fill: { color: COLORS.secondary }, line: { color: COLORS.secondary } });
  slide.addText('InterNexus', { x: 9.0, y: 6.6, w: 2.0, h: 0.4, fontSize: 12, color: COLORS.subtle, align: 'right' });
}

function sectionSlide(pptx, label, blurb = '') {
  const slide = pptx.addSlide();
  slide.background = { color: 'F5F7FA' };
  slide.addText(label, { x: 0.8, y: 2.2, w: 8.5, h: 1.0, fontSize: 36, bold: true, color: COLORS.primary });
  if (blurb) {
    slide.addText(blurb, { x: 0.8, y: 3.1, w: 8.5, h: 1.0, fontSize: 18, color: COLORS.subtle });
  }
}

function bulletsSlide(pptx, title, content, opts = {}) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  slide.addText(title, { x: 0.8, y: 0.6, w: 8.5, h: 0.7, fontSize: 30, bold: true, color: COLORS.primary });
  const cols = opts.columns || 1;
  const colWidth = 9.0 / cols - 0.2;

  if (cols === 1) {
    const text = Array.isArray(content) ? content.join("\n") : String(content);
    slide.addText(text, {
      x: 0.8, y: 1.3, w: colWidth, h: 5.0, fontSize: 18, color: COLORS.text, bullet: true, lineSpacingMultiple: 1.15,
    });
  } else {
    content.forEach((col, i) => {
      const text = Array.isArray(col) ? col.join("\n") : String(col);
      slide.addText(text, {
        x: 0.8 + i * (colWidth + 0.2), y: 1.3, w: colWidth, h: 5.0, fontSize: 18, color: COLORS.text, bullet: true, lineSpacingMultiple: 1.15,
      });
    });
  }
  return slide;
}

function twoColSlide(pptx, title, leftBullets, rightBullets) {
  return bulletsSlide(pptx, title, [leftBullets, rightBullets], { columns: 2 });
}

function numberTiles(pptx, slide, tiles) {
  // tiles: [{label, value, color}]
  const baseX = 0.8, baseY = 1.5; const tileW = 4.2, tileH = 1.6; const gap = 0.3;
  tiles.forEach((t, idx) => {
    const x = baseX + (idx % 2) * (tileW + gap);
    const y = baseY + Math.floor(idx / 2) * (tileH + gap);
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: tileW, h: tileH, fill: { color: 'F7FAFC' }, line: { color: 'E2E8F0' }, rectRadius: 0.1 });
    slide.addText(String(t.value), { x: x + 0.3, y: y + 0.25, w: 2.5, h: 0.8, fontSize: 32, bold: true, color: t.color || COLORS.primary });
    slide.addText(t.label, { x: x + 0.3, y: y + 0.9, w: 3.5, h: 0.6, fontSize: 14, color: COLORS.subtle });
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = 'InterNexus Team';
  pptx.company = 'InterNexus';
  pptx.subject = 'InterNexus Pitch Deck';
  pptx.title = 'InterNexus – Virtual Research HQ';

  // 1. Title
  titleSlide(pptx, 'InterNexus', 'The virtual HQ for global research collaboration');

  // 2. Opening (tone: calm, balanced, clear)
  bulletsSlide(pptx, 'Context & Opportunity', [
    'Research is global, but collaboration remains fragmented and siloed',
    'Teams juggle apps for chat, files, whiteboards, and data—context is lost',
    'Universities and labs need a neutral, secure digital HQ to work as one',
  ]);

  // 3. Problem -> 4. Why now
  twoColSlide(pptx, 'Problem / Why Now',
    [
      'Fragmented tools; little institutional memory',
      'Cross-border projects struggle with compliance & data sharing',
      'Hard to discover mutual strengths and co-authors across partners',
    ],
    [
      'AI-native workflows are finally practical (LLMs, embeddings)',
      'Post-pandemic remote/hybrid collaboration is standard',
      'Universities seek internationalisation and measurable impact',
    ],
  );

  // 5. Solution
  bulletsSlide(pptx, 'InterNexus – What We Offer', [
    'Virtual HQ: shared space with presence, rooms, and context',
    'Collaboration Hub: chat, whiteboard, files, tasks in one place',
    'Partner Intelligence: maps, mutual authors, and research graphs',
    'Analytics: project health, impact metrics, and dashboards',
  ]);

  // 6. Demo Highlights
  bulletsSlide(pptx, 'Product Highlights', [
    '3D Virtual HQ tour (Three.js) – presence and serendipity',
    'Real-time Collaboration (Socket.IO) – chat, typing, whiteboard',
    'Partner Map – discover strengths, mutual authors & collaborators',
    'AI Insights – summarise threads, suggest partners, draft proposals',
  ]);

  // 7. Market
  const s7 = bulletsSlide(pptx, 'Market & Segments', [
    'Initial: universities, research institutes, think-tanks',
    'Expansion: corporate R&D, NGOs, cross-border consortia',
    'Pricing: per-seat with campus/site licences; enterprise support',
  ]);
  numberTiles(pptx, s7, [
    { label: 'Initial TAM (HE & Institutes)', value: '>$3B', color: COLORS.secondary },
    { label: 'Serviceable (APAC focus)', value: '$600M', color: COLORS.accent },
    { label: 'Target Yr3 ARR', value: '$15–25M', color: COLORS.primary },
    { label: 'Pilot Conversion', value: '30–40%', color: COLORS.orange },
  ]);

  // 8. Business Model
  bulletsSlide(pptx, 'Business Model', [
    'SaaS per-seat; discounted campus/site licences',
    'Add-ons: AI packs, analytics connectors, compliance modules',
    'Marketplace for research tools/integrations (plugins)',
  ]);

  // 9. Go-To-Market
  bulletsSlide(pptx, 'Go-To-Market', [
    'Anchor pilots with top universities (consortiums)',
    'Publish joint case studies; showcase impact metrics',
    'Partner with cloud, EdTech, and government agencies',
  ]);

  // 10. Traction (placeholders)
  const s10 = bulletsSlide(pptx, 'Early Traction', [
    'Working prototype (client/server) with real-time collaboration',
    'Partner profiling, mutual authors, and analytics UI',
    'Active pilots in discussion – seeking additional partners',
  ]);
  numberTiles(pptx, s10, [
    { label: 'Universities Engaged', value: '10+', color: COLORS.secondary },
    { label: 'PoCs Underway', value: '3–5', color: COLORS.accent },
    { label: 'M-o-M Growth', value: '30%+', color: COLORS.primary },
    { label: 'Time to Deploy', value: '< 1 week', color: COLORS.orange },
  ]);

  // 11. Competitive Landscape
  twoColSlide(pptx, 'Competitive Landscape',
    [
      'Horizontal tools (Teams/Slack/Zoom) – generic, not research-native',
      'Point tools (whiteboards, docs, drives) – disconnected',
      'Cloud drives & LMS – not collaboration-first',
    ],
    [
      'InterNexus = research graph + collaboration + analytics',
      'Neutral platform across institutions; rich partner intelligence',
      'Composable integrations; privacy-by-design',
    ],
  );

  // 12. Moat
  bulletsSlide(pptx, 'Moat', [
    'Institutional graph (projects, people, outputs) enriched over time',
    'Cross-institution workflows and permissions baked-in',
    'AI models fine-tuned on collaboration and research ontologies',
  ]);

  // 13. Tech & Security
  twoColSlide(pptx, 'Architecture & Security',
    [
      'React/Vite frontend; Node/Express backend; Socket.IO real-time',
      'MongoDB persistence; Redis optional; modular services',
      '3D via Three.js; D3/Recharts for analytics',
    ],
    [
      'JWT + role-based access; audit logs',
      'Data isolation by tenant; encryption in transit/at rest',
      'Compliance ready: GDPR/PDPA pillars; data residency options',
    ],
  );

  // 14. Roadmap
  bulletsSlide(pptx, 'Roadmap (12–18 months)', [
    'Q1: Pilot deployments; SSO; integrations (Drive, O365, GSuite)',
    'Q2: AI assistants (summaries, partner matching, drafting)',
    'Q3: Marketplace SDK; cross-tenant data rooms',
    'Q4: Analytics connectors; admin dashboards; billing',
  ]);

  // 15. Team
  bulletsSlide(pptx, 'Team', [
    'Multidisciplinary: full-stack, data viz, research ops',
    'Advisors across academia, policy, and enterprise',
    'Culture: user-centered, secure-by-default, ship fast',
  ]);

  // 16. The Ask
  bulletsSlide(pptx, 'The Ask', [
    'Seeking pilots and strategic partners',
    'Optionally raising pre-seed for 18-month runway',
    'Use of funds: product, security, go-to-market, pilots',
  ]);

  // 17. Use of Funds / Milestones
  twoColSlide(pptx, 'Use of Funds / Milestones',
    [ 'Engineering (45%)', 'Security & Compliance (15%)', 'GTM & Partnerships (25%)', 'Ops (15%)' ],
    [ '5 university pilots', 'Marketplace beta', 'Admin analytics', 'ARR targets & case studies' ],
  );

  // 18. Closing
  bulletsSlide(pptx, 'Closing', [
    'InterNexus makes cross-border research work like one institution',
    'Clear value for universities, labs, and R&D teams',
    'Let’s build measurable impact together',
  ]);

  // 19. Q&A
  const q = pptx.addSlide();
  q.addText('Q & A', { x: 2.5, y: 2.1, w: 6.0, h: 1.5, fontSize: 56, bold: true, color: COLORS.primary, align: 'center' });
  q.addText('Questions welcome on product, pilots, and roadmap', { x: 1.5, y: 3.2, w: 8.0, h: 0.8, fontSize: 20, color: COLORS.subtle, align: 'center' });

  await pptx.writeFile({ fileName: outPath });
  console.log(`✅ Pitch deck generated at: ${outPath}`);
}

main().catch(err => {
  console.error('Failed to generate pitch deck:', err);
  process.exit(1);
});
