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
    fontFamily: "'Geist Mono', ui-monospace, monospace",
  }}>{children}</div>
);

const SlideNumber = ({ n, total, color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    right: SPACING.paddingX,
    fontSize: TYPE_SCALE.tiny,
    color,
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    letterSpacing: '0.08em',
  }}>
    {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

const Footmark = ({ color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    left: SPACING.paddingX,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}>
    <div style={{
      fontSize: TYPE_SCALE.tiny,
      color,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      fontWeight: 500,
    }}>Claude Code · Designer's Value</div>
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
      tag: 'Boundary',
      accent: C.gradientViolet,
      lines: ['Closer to the material.', 'More becomes possible.'],
    },
    {
      tag: 'Bar',
      accent: C.gradientMagenta,
      lines: ['When 7/10 is free,', 'good enough is not enough.'],
    },
    {
      tag: 'Signature',
      accent: C.gradientOrange,
      lines: ['Craft and taste', 'are your signature.'],
    },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 01 · Three Takeaways"
        title="Get closer. Raise the bar. Sign your work."
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
              justifyContent: 'space-between',
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
            {/* Card tag */}
            <div style={{
              fontSize: TYPE_SCALE.tiny,
              color: card.accent,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontWeight: 600,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>
              {String(i + 1).padStart(2, '0')} · {card.tag}
            </div>
            {/* Headline */}
            <div style={{
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: TRACK.heroLat,
              color: C.ink,
              fontFamily: "Inter, system-ui, sans-serif",
            }}>
              {card.lines.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
            {/* Bottom spacer (intentional empty slot for future supporting line / bullets) */}
            <div style={{ height: 4 }} />
          </motion.div>
        ))}
      </motion.div>
      <Footmark />
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
        >
          <motion.div variants={FADE_UP} style={{
            fontSize: TYPE_SCALE.small,
            letterSpacing: TRACK.small,
            color: C.ink, fontWeight: 500,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            opacity: 0.78,
          }}>Part 5 · Closing</motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={state}
          variants={STAGGER}
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
            We are not designers anymore.<br/>
            We are&nbsp;
            <span style={{
              background: C.ink,
              color: C.gradientViolet,
              padding: '0.02em 0.18em',
              fontWeight: 700,
              borderRadius: '0.06em',
            }}>builders</span>
            &nbsp;now.
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
            Start anywhere, <br/>compound everywhere.
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={state}
          variants={STAGGER}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <motion.div variants={FADE_UP} style={{
            fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500,
            letterSpacing: TRACK.small,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            opacity: 0.78,
          }}>Thank you</motion.div>
          <motion.div variants={FADE_UP} style={{
            fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 700,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            letterSpacing: TRACK.small,
          }}>Q &amp; A</motion.div>
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
export const title = "A Designer's Value in the AI Era"
export const subtitle = 'Get closer. Raise the bar. Sign your work.'

export default [
  { label: "Section · Designer's Value", render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 5"
      title="A Designer's Value in the AI Era"
      subtitle="Get closer. Raise the bar. Sign your work."
      range="Closing · Manifesto"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Three Takeaways', render: (p) => <Part5ThreeTakeaways {...p} /> },
  { label: 'Closing · We are builders now', render: (p) => <Part5ClosingQuote {...p} /> },
]
