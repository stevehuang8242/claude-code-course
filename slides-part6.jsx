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
      accent: C.gradientViolet,
      bullets: [
        '為什麼挑這頁？簡單、複雜、還是想挑戰？',
        '怎麼跟 Claude Code 拆解？先 plan mode、還是先用 Figma MCP？',
      ],
      star: false,
    },
    {
      tag: 'Q2 · 2 min · 最關鍵',
      title: '關鍵轉折？',
      accent: C.gradientMagenta,
      bullets: [
        '用了 Figma MCP 但改的結果還是不如你的想像，怎麼處理？',
        '互動過程碰到什麼困難，你怎麼調整？',
      ],
      star: true,
    },
    {
      tag: 'Q3 · 1.5 min',
      title: '下次怎麼做？',
      accent: C.gradientOrange,
      bullets: [
        '對 Figma MCP / Claude Code 的「能 vs. 不能」有什麼新認知？',
        '會改變你跟工程師合作的方式嗎？',
      ],
      star: false,
    },
  ];

  const brief = [
    {
      label: '作業內容',
      text: '透過 Figma MCP、Figma Make 或 Claude Design 結合 Claude Code，產出一頁可操作的系統頁面、網頁或 App 畫面',
    },
    {
      label: '使用工具',
      text: '建議使用 Claude Code；若無 Claude Code，亦可使用 Codex 或 Antigravity',
    },
    {
      label: '帳號索取',
      text: '無 Claude Code 者，可向 Sully、Alan、Annie 索取 Claude Enterprise 帳號',
      notes: [
        'Claude Enterprise 帳號有額度限制；若額度不足，可能需自行購買 Pro 方案（US$20 / 月）',
        '登入時需請 Sully、Alan、Annie 協助驗證',
      ],
    },
    {
      label: '作業發表',
      text: '6/17（三）15:00~16:30，每人 5–10 分鐘，可參考以下三個分享面向：',
      notes: [
        '報告順序依字母序（發會議通知時會附上報告順序）',
      ],
    },
  ];

  return (
    <Frame>
      <SlideHead
        kicker="06 課後作業｜把工具變成你的方法"
        title="不用做完美，重點是過程"
      />

      {/* 作業 brief — 內容 / 工具 / 帳號，條列 */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 36,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {brief.map((row, i) => (
          <motion.div
            key={i}
            variants={FADE_UP}
            style={{
              display: 'grid',
              gridTemplateColumns: '230px 1fr',
              gap: 32,
              alignItems: 'baseline',
              padding: '16px 0',
              borderBottom: i < brief.length - 1 ? `1px solid ${C.hairline}` : 'none',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
            }}>
              <span style={{
                fontSize: TYPE_SCALE.tiny,
                fontWeight: 700,
                color: C.inkMuted,
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{
                fontSize: TYPE_SCALE.subtitle,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: TRACK.subtitle,
              }}>{row.label}</span>
            </div>
            <div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                lineHeight: 1.5,
                color: C.inkMuted,
                letterSpacing: TRACK.small,
              }}>{row.text}</div>
              {row.notes && (
                <ul style={{
                  margin: '10px 0 0 0',
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}>
                  {row.notes.map((note, k) => (
                    <li key={k} style={{
                      fontSize: TYPE_SCALE.tiny,
                      lineHeight: 1.45,
                      color: C.inkMuted,
                      letterSpacing: TRACK.small,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      opacity: 0.82,
                    }}>
                      <span style={{ flexShrink: 0 }}>※</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 三欄 cards — 對應 04 作業發表的三個分享面向 */}
      <motion.div
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 28,
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
              padding: '24px 28px 28px',
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
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: TRACK.title,
              color: C.ink,
            }}>
              {card.title}
            </div>

            {/* Divider */}
            <div style={{
              marginTop: 16,
              marginBottom: 16,
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
              gap: 12,
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
