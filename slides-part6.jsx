/* Part 6 — 課後作業｜把工具變成你的方法
 * Homework brief · 2 slides
 *
 * Self-contained module — design tokens / primitives inlined,
 * not relying on slides-shared.jsx. SectionDivider reused from
 * slides_archived.jsx via props. HwBrief is a custom high-density
 * layout: top hero band + three Q-cards (Q1 / Q2 ⭐ / Q3).
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider } from './slides_archived.jsx'

/* ============================================================
   Design tokens — 與 slides-part5.jsx 保持同步
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
  paddingBottom: 100,
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

/* ============================================================
   SLIDE 1 — 作業說明 + 三問題分享結構（all-in-one）
   ============================================================ */

const HwBrief = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';

  const cards = [
    {
      tag: 'Q1 · 1.5 min',
      title: '你怎麼開始？',
      sub: '方法選擇',
      accent: C.gradientViolet,
      bullets: [
        '為什麼挑這幾頁？簡單 / 複雜 / 有代表性 / 想挑戰？',
        '怎麼跟 Claude Code 拆解？先 plan mode、還是先用 Figma MCP？',
        '有沒有準備 CLAUDE.md 或任何前置條件？',
      ],
      star: false,
    },
    {
      tag: 'Q2 · 2 min · 最關鍵',
      title: '關鍵轉折？',
      sub: '問題解決',
      accent: C.gradientMagenta,
      bullets: [
        'Figma MCP 回傳的 code 跟你想的不一樣嗎？怎麼處理？',
        '哪一個 prompt 沒效、你怎麼調整？',
        '有沒有哪個時刻你決定「不該繼續往這方向 prompt 下去」？',
      ],
      star: true,
    },
    {
      tag: 'Q3 · 1.5 min',
      title: '下次怎麼做？',
      sub: '內化反思',
      accent: C.gradientOrange,
      bullets: [
        '哪一個環節你會用完全不同的方式處理？',
        '對 Figma MCP / Claude Code 的「能 vs. 不能」有什麼新認知？',
        '會改變你跟工程師合作的方式嗎？',
      ],
      star: false,
    },
  ];

  return (
    <Frame>
      <SlideHead
        kicker="課後作業｜把工具變成你的方法"
        title="不用做完美，重點是過程"
        sub="挑自己專案在 Figma 上的 1–2 頁系統畫面 → 用 Claude Code + Figma MCP 建立為 working prototype"
      />

      {/* 5 分鐘分享結構 · 小 label */}
      <div style={{
        marginTop: 48,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny,
          color: C.inkMuted,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        }}>
          6/12（五）發表 · 每人 5 分鐘 · 分享內容須包含以下三個面向
        </div>
        <div style={{
          flex: 1,
          height: 1,
          background: C.hairline,
        }} />
      </div>

      {/* 三欄 cards */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          flex: 1,
          minHeight: 0,
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
              border: card.star
                ? `1.5px solid ${card.accent}55`
                : `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: '32px 32px 36px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 0,
              boxShadow: card.star
                ? `0 0 0 1px ${card.accent}22, 0 12px 48px -16px ${card.accent}55`
                : 'none',
            }}
          >
            {/* Top accent stripe */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 4,
              background: card.accent,
            }} />

            {/* Title */}
            <div style={{
              fontSize: 42,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: TRACK.title,
              color: C.ink,
            }}>
              {card.title}
            </div>

            {/* Sub — 一句話定位 */}
            <div style={{
              marginTop: 8,
              fontSize: TYPE_SCALE.tiny,
              color: C.inkMuted,
              letterSpacing: TRACK.small,
              fontWeight: 400,
            }}>
              {card.sub}
            </div>

            {/* Divider */}
            <div style={{
              marginTop: 24,
              marginBottom: 22,
              height: 1,
              background: C.hairline,
            }} />

            {/* Bullets */}
            <ul style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {card.bullets.map((b, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 22,
                    lineHeight: 1.55,
                    color: C.inkMuted,
                    letterSpacing: TRACK.small,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    color: card.accent,
                    fontWeight: 700,
                    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                    fontSize: 18,
                    lineHeight: 1.7,
                  }}>
                    {String(j + 1).padStart(2, '0')}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

export {
  HwBrief,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = '課後作業｜把工具變成你的方法'
export const subtitle = '5 分鐘，談一次你和 Claude Code 的真實協作'

export default [
  { label: 'Section · Homework', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 6"
      title="課後作業｜把工具變成你的方法"
      subtitle="5 分鐘，談一次你和 Claude Code 的真實協作"
      bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)"
    />
  )},
  { label: '作業說明 + 三問題分享結構', render: (p) => <HwBrief {...p} /> },
]
