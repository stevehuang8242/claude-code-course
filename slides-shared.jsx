/* Shared infrastructure for every slides-part*.jsx file.
 * Design tokens, Framer Motion variants, and chrome primitives that every
 * deck slide needs. Part files import what they need from here and only
 * own the slide-content components specific to their section. */

import React from 'react'

export const TYPE_SCALE = {
  hero: 108,
  display: 88,
  title: 56,
  subtitle: 36,
  body: 32,
  small: 26,
  tiny: 22,
};

/* Tracking baked per size. Mixed CJK+Latin caps at -2.5% so Chinese
 * characters don't overlap; Latin-only contexts can push to -4.5%. */
export const TRACK = {
  hero:     '-0.025em',
  heroLat:  '-0.045em',
  display:  '-0.025em',
  title:    '-0.02em',
  subtitle: '-0.012em',
  body:     '-0.008em',
  small:    '-0.005em',
  tiny:     '0em',
};

export const SPACING = {
  paddingTop: 72,
  paddingBottom: 56,
  paddingX: 120,
  titleGap: 36,
  itemGap: 28,
};

export const ROUNDED = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 20,
  xl: 30,
  xxl: 40,
  pill: 100,
  full: 9999,
};

/* Framer Motion variants — restrained spring entrance.
 * y: 24 keeps movement subtle; spring (stiffness 240 / damping 26) lands
 * snappy without overshoot. STAGGER is the parent variant; nest it for
 * cascading entrances and put delayChildren only on the outermost layer
 * so deeper levels don't accumulate extra waits. */
export const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 26 },
  },
};

export const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const STAGGER_INNER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* Framer dark palette. Legacy alias names (pine, cedar, basalt, ...)
 * remap to the new dark tokens so non-mounted legacy slides still resolve. */
export const C = {
  canvas:        '#090909',
  surface1:      '#141414',
  surface2:      '#1c1c1c',
  ink:           '#ffffff',
  inkMuted:      '#999999',
  hairline:      '#262626',
  hairlineSoft:  '#1a1a1a',
  inverseCanvas: '#ffffff',
  inverseInk:    '#000000',

  gradientViolet:  '#6a4cf5',
  gradientMagenta: '#d44df0',
  gradientOrange:  '#ff7a3d',
  gradientCoral:   '#ff5577',

  // Legacy aliases — do not introduce new uses.
  pine:        '#ffffff',
  cedar:       '#999999',
  basalt:      '#090909',
  clay:        '#ffffff',
  slate:       '#262626',
  earth:       '#141414',
  white:       '#141414',
  surfaceSoft: '#141414',
  textSecondary:   '#999999',
  textDescription: '#999999',
  border:      '#262626',
  borderSoft:  '#1a1a1a',
  bgSecondary: '#141414',

  tagGreen:    '#1c1c1c',  tagGreenText:  '#ffffff',
  tagOrange:   '#1c1c1c',  tagOrangeText: '#ffffff',
  tagBlue:     '#1c1c1c',  tagBlueText:   '#ffffff',
  tagRed:      '#1c1c1c',  tagRedText:    '#ffffff',
  tagGrey:     '#141414',  tagGreyText:   '#999999',

  blockLime:   '#141414',
  blockLilac:  '#141414',
  blockCream:  '#141414',
  blockPink:   '#141414',
  blockMint:   '#141414',
  blockCoral:  '#141414',
  blockNavy:   '#090909',

  chartGreen:  '#666666',
  chartOrange: '#ffffff',
  chartPurple: '#666666',
  chartBlue:   '#999999',
  chartYellow: '#ffffff',

  accentMagenta:   '#ffffff',
  semanticSuccess: '#ffffff',
};

/* ============================================================
   Shared primitives — chrome every slide reaches for
   ============================================================ */

export const Frame = ({ bg = C.canvas, children, style = {}, padded = true }) => (
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

export const Eyebrow = ({ children, color = C.inkMuted }) => (
  <div style={{
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    letterSpacing: TRACK.small,
    color,
    fontFamily: "'Geist Mono', ui-monospace, monospace",
  }}>{children}</div>
);

export const SlideNumber = ({ n, total, color = C.textDescription }) => (
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

export const Footmark = ({ color = C.textDescription }) => (
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
    }}>Claude Code 核心概念</div>
  </div>
);

export const Tag = ({ children, bg = C.tagGreen, fg = C.tagGreenText }) => (
  <span style={{
    display: 'inline-block',
    background: bg,
    color: fg,
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: ROUNDED.pill,
    letterSpacing: TRACK.small,
  }}>{children}</span>
);

export const Code = ({ children, size = TYPE_SCALE.body }) => (
  <span style={{
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    fontSize: size,
    background: C.surface2,
    color: C.ink,
    padding: '4px 12px',
    borderRadius: ROUNDED.sm,
  }}>{children}</span>
);

export const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 500,
      lineHeight: 1.05,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: TRACK.title,
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
