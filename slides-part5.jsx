/* Part 5 — A Designer's Value in the AI Era
 * Closing manifesto · 3 slides
 *
 * Self-contained module — design tokens / primitives inlined,
 * not relying on slides-shared.jsx. SectionDivider is reused
 * from slides_archived.jsx via props. ClosingQuote is custom
 * (slides_archived's ClosingNoLogo is hardcoded Chinese).
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider } from './slides_archived.jsx'

/* ============================================================
   Design tokens — 與 slides-part4.jsx 保持同步
   ============================================================ */

const TYPE_SCALE = {
  hero: 108,
  display: 88,
  title: 56,
  subtitle: 36,
  body: 32,
  small: 26,
  tiny: 22,
};

const TRACK = {
  hero:     '-0.025em',
  heroLat:  '-0.045em',
  display:  '-0.025em',
  title:    '-0.02em',
  subtitle: '-0.012em',
  body:     '-0.008em',
  small:    '-0.005em',
  tiny:     '0em',
};

const SPACING = {
  paddingTop: 72,
  paddingBottom: 56,
  paddingX: 120,
  titleGap: 36,
  itemGap: 28,
};

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 26 },
  },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const C = {
  canvas:        '#090909',
  surface1:      '#141414',
  surface2:      '#1c1c1c',
  ink:           '#ffffff',
  inkMuted:      '#999999',
  hairline:      '#262626',
  inverseInk:    '#000000',
  textDescription: '#999999',
  gradientViolet:  '#6a4cf5',
  gradientMagenta: '#d44df0',
  gradientOrange:  '#ff7a3d',
  gradientCoral:   '#ff5577',
};

const ROUNDED = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 20,
  xl: 30,
  pill: 100,
};

/* ============================================================
   Shared primitives
   ============================================================ */

const Frame = ({ bg = C.canvas, children, style = {}, padded = true }) => (
  <div style={{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    background: bg,
    color: C.ink,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    padding: padded ? `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px` : 0,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const Eyebrow = ({ children, color = C.inkMuted }) => (
  <div style={{
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    letterSpacing: TRACK.small,
    color,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
  }}>{children}</div>
);

const SlideNumber = ({ n, total, color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    right: SPACING.paddingX,
    fontSize: TYPE_SCALE.tiny,
    color,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
    letterSpacing: '0.08em',
  }}>
    {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 500,
      lineHeight: 1.05,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: TRACK.heroLat,
      color: C.ink,
    }}>{title}</h1>
    {sub && (
      <div style={{
        fontSize: TYPE_SCALE.subtitle,
        color: C.inkMuted,
        marginTop: 20,
        lineHeight: 1.3,
        fontWeight: 400,
        maxWidth: 1400,
        letterSpacing: TRACK.subtitle,
      }}>{sub}</div>
    )}
  </div>
);

/* SLIDE 1 — Three Takeaways (headline-only cards) */
const Part5ThreeTakeaways = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  const cards = [
    {
      accent: C.gradientViolet,
      main: 'We are empowered.',
      lines: ['Closer to the material.', 'More becomes possible.'],
    },
    {
      accent: C.gradientMagenta,
      main: 'The bar is raised.',
      lines: ['When 8/10 is free,', 'good enough is not enough.'],
    },
    {
      accent: C.gradientOrange,
      main: 'Craft and taste win.',
      lines: ['AI delivers 80.', 'You bring the 20.'],
    },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="05 AI 時代設計師的價值"
        title="重新定義設計師價值的三個轉變"
        sub="The three shifts that redefine a designer's value."
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 56,
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={FADE_UP}
            style={{
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: '48px 40px 56px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 24,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* Top accent stripe */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 4,
              background: card.accent,
            }} />
            {/* Main headline */}
            <div style={{
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: TRACK.heroLat,
              color: C.ink,
              fontFamily: "Inter, system-ui, sans-serif",
            }}>
              {card.main}
            </div>
            {/* Sub headline */}
            <div style={{
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: TRACK.subtitle,
              color: C.inkMuted,
              fontFamily: "Inter, system-ui, sans-serif",
            }}>
              {card.lines.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 2 — Closing Hero Quote */
const Part5ClosingQuote = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame
      padded={false}
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 50%, #ff7a3d 100%)"
    >
      <div style={{
        position: 'relative', height: '100%',
        padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: C.ink,
      }}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={state}
          variants={STAGGER}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <motion.div
            variants={FADE_UP}
            style={{
              fontSize: TYPE_SCALE.hero,
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: TRACK.heroLat,
              color: C.ink,
              marginBottom: 48,
            }}
          >
            We are not just designers anymore.<br/>
            We are&nbsp;
            <span style={{
              background: C.ink,
              color: C.gradientViolet,
              padding: '0.02em 0.18em',
              fontWeight: 700,
              borderRadius: '0.06em',
            }}>builders</span>
            &nbsp;too.
          </motion.div>
          <motion.div
            variants={FADE_UP}
            style={{
              fontSize: TYPE_SCALE.display,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: TRACK.heroLat,
              color: C.ink,
              opacity: 0.95,
              fontStyle: 'italic',
            }}
          >
            “Start anywhere, <br/>compound everywhere.”
          </motion.div>
          <motion.div
            variants={FADE_UP}
            style={{
              fontSize: TYPE_SCALE.body,
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: TRACK.body,
              color: C.ink,
              opacity: 0.7,
              marginTop: 32,
            }}
          >
            — Ryo Lu, Head of Design at Cursor
          </motion.div>
        </motion.div>

      </div>
      <SlideNumber n={n} total={total} color={C.ink} />
    </Frame>
  );
};

export {
  Part5ThreeTakeaways,
  Part5ClosingQuote,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = 'AI 時代設計師的價值'
export const subtitle = 'Get closer. Raise the bar. Sign your work.'

export default [
  { label: "Section · Designer's Value", render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 5"
      title="AI 時代設計師的價值"
      subtitle="A Designer's Value in the AI Era"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Three Takeaways', render: (p) => <Part5ThreeTakeaways {...p} /> },
  { label: 'Closing · We are builders now', render: (p) => <Part5ClosingQuote {...p} /> },
]
