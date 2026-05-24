/* Part 2 — 從想法 / 設計稿到可操作互動介面
 * 12 slides：Section + Agenda + Ch.01–Ch.06 + Overview + Closing
 *
 * Self-contained module — design tokens / primitives inlined,
 * mirroring slides-part1.jsx. SectionDivider is reused from
 * slides_archived.jsx via props.
 *
 * Source blueprint: Slide/Slide-part2.md
 * Plan: Plan/Plan-part2.md
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider } from './slides_archived.jsx'

/* ============================================================
   Design tokens — 與 slides-part1.jsx 同步
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

const STAGGER_INNER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
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

const MONO = "'Geist Mono', ui-monospace, monospace";

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

const Tag = ({ children, color = C.inkMuted, bg = C.surface2 }) => (
  <span style={{
    display: 'inline-block',
    fontSize: TYPE_SCALE.tiny,
    fontFamily: MONO,
    color,
    background: bg,
    padding: '6px 14px',
    borderRadius: ROUNDED.sm,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
  }}>{children}</span>
);

/* ============================================================
   SLIDE 01 — Agenda · 兩條路徑六章地圖
   ============================================================ */

const AGENDA_ITEMS = [
  { n: '01', title: 'Two Starting Points', sub: '設計師的兩種起點', tag: 'Context',    accent: C.gradientViolet },
  { n: '02', title: 'Claude Design',       sub: '工具定位與能力邊界', tag: 'Tool',       accent: C.gradientMagenta },
  { n: '03', title: 'Reference Curation',  sub: '多方參考的整理術', tag: 'Scenario 1', accent: C.gradientViolet },
  { n: '04', title: 'Generate & Handoff',  sub: 'Claude Design 產出到 Claude Code', tag: 'Scenario 1', accent: C.gradientMagenta },
  { n: '05', title: 'Figma to Cursor',     sub: '已有圖稿的接軌準備', tag: 'Scenario 2', accent: C.gradientOrange },
  { n: '06', title: 'Chatbot in Action',   sub: 'Cursor + Claude Code 從圖稿到介面', tag: 'Scenario 2', accent: C.gradientCoral },
];

const Part2Agenda = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Part 2 · Agenda"
        title="兩條路徑，六個段落"
        sub="從場景設定，到 Scenario 1（從想法）、Scenario 2（從圖稿）。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 56,
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(3, auto)',
          columnGap: 56,
          rowGap: 20,
        }}
      >
        {AGENDA_ITEMS.map((item) => (
          <motion.div
            key={item.n}
            variants={FADE_UP}
            style={{
              display: 'grid',
              gridTemplateColumns: '88px 1fr auto',
              alignItems: 'center',
              gap: 28,
              padding: '20px 0',
              borderBottom: `1px solid ${C.hairline}`,
            }}
          >
            <div style={{
              fontSize: TYPE_SCALE.subtitle,
              fontFamily: MONO,
              color: item.accent,
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}>{item.n}</div>
            <div>
              <div style={{
                fontSize: TYPE_SCALE.body,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 6,
                letterSpacing: TRACK.body,
              }}>{item.title}</div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: C.inkMuted,
                letterSpacing: TRACK.small,
              }}>{item.sub}</div>
            </div>
            <Tag color={item.accent}>{item.tag}</Tag>
          </motion.div>
        ))}
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 02 — Ch.01 Two Starting Points · Two-Column 比較
   ============================================================ */

const STARTING_POINTS = [
  {
    tag: 'Scenario 1 · From Idea',
    accent: C.gradientViolet,
    headline: '手上只有需求與想法',
    inputs: ['需求文字', '品牌素材', '競品參考'],
    path: ['Reference Curation', 'Claude Design', 'Handoff'],
    when: '探索期 · 提案期 · 初稿期',
  },
  {
    tag: 'Scenario 2 · From Figma',
    accent: C.gradientOrange,
    headline: '手上已有完整 UI 圖稿',
    inputs: ['Figma file', 'Components', 'Design tokens'],
    path: ['圖稿健檢', 'Cursor + MCP', 'Chatbot 實作'],
    when: '落地期 · 改版期 · 既有專案延伸',
  },
];

const Part2TwoStartingPoints = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.01 · Two Starting Points"
        title="同一個終點，兩條路徑"
        sub="你手邊有什麼，決定你怎麼走。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <motion.div
          variants={STAGGER_INNER}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 28,
          }}
        >
          {STARTING_POINTS.map((sp) => (
            <motion.div
              key={sp.tag}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: sp.accent,
              }} />
              <Tag color={sp.accent}>{sp.tag}</Tag>

              <div style={{
                fontSize: 36,
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1.2,
                letterSpacing: TRACK.title,
              }}>{sp.headline}</div>

              {/* Inputs */}
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  color: sp.accent,
                  fontFamily: MONO,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>Inputs</div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                }}>
                  {sp.inputs.map((inp) => (
                    <div key={inp} style={{
                      fontSize: TYPE_SCALE.small,
                      color: C.ink,
                      background: C.surface2,
                      padding: '8px 16px',
                      borderRadius: ROUNDED.sm,
                      letterSpacing: TRACK.small,
                    }}>{inp}</div>
                  ))}
                </div>
              </div>

              {/* Path */}
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  color: sp.accent,
                  fontFamily: MONO,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>Path</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  fontFamily: MONO,
                  fontSize: 20,
                  color: C.ink,
                  letterSpacing: '-0.02em',
                }}>
                  {sp.path.map((step, i) => (
                    <React.Fragment key={step}>
                      <span style={{
                        padding: '8px 14px',
                        border: `1.5px solid ${sp.accent}`,
                        borderRadius: ROUNDED.md,
                        color: sp.accent,
                        fontWeight: 600,
                      }}>{step}</span>
                      {i < sp.path.length - 1 && (
                        <span style={{ color: C.inkMuted }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* When */}
              <div style={{
                marginTop: 'auto',
                paddingTop: 20,
                borderTop: `1px solid ${C.hairline}`,
                fontSize: TYPE_SCALE.small,
                color: C.inkMuted,
                letterSpacing: TRACK.small,
              }}>
                <span style={{ color: sp.accent, fontFamily: MONO, fontWeight: 600 }}>適用情境</span>
                <span style={{ margin: '0 12px', color: C.hairline }}>|</span>
                {sp.when}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={FADE_UP}
          style={{
            background: 'linear-gradient(135deg, rgba(106,76,245,0.12) 0%, rgba(255,122,61,0.12) 100%)',
            borderLeft: `4px solid ${C.gradientMagenta}`,
            borderRadius: ROUNDED.sm,
            padding: '20px 28px',
            fontSize: TYPE_SCALE.small,
            color: C.ink,
            lineHeight: 1.4,
            letterSpacing: TRACK.small,
          }}
        >
          <span style={{ color: C.gradientMagenta, fontWeight: 600 }}>會合點：</span>
          兩條路徑都會走進 Claude Code 實作——Part 1 學的工作流，這裡全部派上用場。
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 03 — Ch.02 Claude Design · Hero quote + 三點說明
   ============================================================ */

const CLAUDE_DESIGN_POINTS = [
  {
    label: '能做',
    accent: C.gradientViolet,
    detail: '文字 + 圖片 + 品牌素材 → UI 草稿 / 變體',
  },
  {
    label: '不能做',
    accent: C.inkMuted,
    detail: '取代 Figma 的細節打磨、取代 Claude Code 的程式實作',
  },
  {
    label: '與 Figma MCP 差別',
    accent: C.gradientOrange,
    detail: 'Claude Design 「生成」，Figma MCP 「讀取」既有圖稿',
  },
];

const Part2ClaudeDesign = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.02 · Claude Design"
        title="從文字 + 參考，到可視化設計"
        sub="定位在 Figma 之前、Claude Code 之後不接管。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Hero quote */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: 'linear-gradient(135deg, rgba(106,76,245,0.14) 0%, rgba(212,77,240,0.14) 100%)',
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '44px 56px',
          }}
        >
          <div style={{
            fontSize: 64,
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: TRACK.display,
          }}>
            接收<span style={{ color: C.gradientViolet }}>文字需求</span> + <span style={{ color: C.gradientMagenta }}>多模態參考</span>，<br/>
            快速產出 UI 草稿與變體。
          </div>
        </motion.div>

        {/* Three points */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {CLAUDE_DESIGN_POINTS.map((p) => (
            <motion.div
              key={p.label}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: 4, background: p.accent,
              }} />
              <Tag color={p.accent}>{p.label}</Tag>
              <div style={{
                fontSize: TYPE_SCALE.body,
                color: C.ink,
                lineHeight: 1.35,
                letterSpacing: TRACK.body,
                fontWeight: 500,
              }}>{p.detail}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Designer analogy callout */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: 'rgba(212,77,240,0.10)',
            borderLeft: `4px solid ${C.gradientMagenta}`,
            borderRadius: ROUNDED.sm,
            padding: '20px 28px',
            fontSize: TYPE_SCALE.small,
            color: C.ink,
            lineHeight: 1.4,
            letterSpacing: TRACK.small,
            marginTop: 'auto',
          }}
        >
          <span style={{ color: C.gradientMagenta, fontWeight: 600 }}>設計師類比：</span>
          像 brainstorm 階段的快速 wireframe——但多了視覺與互動骨架。
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05 — Ch.03 Reference Curation · 三張卡 + prompt 公式 banner
   ============================================================ */

const REFERENCE_CARDS = [
  {
    n: '01',
    tag: 'Requirements',
    accent: C.gradientViolet,
    headline: '要做什麼、給誰用',
    items: ['功能清單', '使用者情境', '目標裝置', '頁面層級'],
  },
  {
    n: '02',
    tag: 'Brand',
    accent: C.gradientMagenta,
    headline: '長什麼樣、什麼調性',
    items: ['色票', '字體', 'tone & manner', '既有 brand guideline'],
  },
  {
    n: '03',
    tag: 'Reference & Copy',
    accent: C.gradientOrange,
    headline: '對標誰、寫什麼字',
    items: ['截圖', 'Dribbble / Mobbin', '實際 copy（非 lorem）', 'empty state 文案'],
  },
];

const Part2ReferenceCuration = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · Reference Curation"
        title="輸出的品質，來自輸入的結構"
        sub="亂塞 = 平庸輸出；結構化餵料 = 像樣的初稿。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <motion.div
          variants={STAGGER_INNER}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {REFERENCE_CARDS.map((card) => (
            <motion.div
              key={card.n}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: card.accent,
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Tag color={card.accent}>{card.tag}</Tag>
                <div style={{
                  fontSize: TYPE_SCALE.subtitle,
                  fontFamily: MONO,
                  color: card.accent,
                  fontWeight: 700,
                  lineHeight: 1,
                  opacity: 0.5,
                }}>{card.n}</div>
              </div>
              <div style={{
                fontSize: 30,
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1.2,
                letterSpacing: TRACK.title,
              }}>{card.headline}</div>
              <div style={{
                marginTop: 'auto',
                paddingTop: 16,
                borderTop: `1px solid ${C.hairline}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                {card.items.map((item) => (
                  <div key={item} style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    fontSize: TYPE_SCALE.small,
                    color: C.inkMuted,
                    letterSpacing: TRACK.small,
                  }}>
                    <span style={{ color: card.accent, fontFamily: MONO }}>·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Prompt formula banner */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: 'rgba(255,85,119,0.10)',
            borderLeft: `4px solid ${C.gradientCoral}`,
            borderRadius: ROUNDED.sm,
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{
            fontSize: TYPE_SCALE.tiny,
            fontFamily: MONO,
            color: C.gradientCoral,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>Prompt 組裝順序</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: MONO,
            fontSize: 26,
            color: C.ink,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: C.gradientViolet }}>目標</span>
            <span style={{ color: C.inkMuted }}>→</span>
            <span style={{ color: C.gradientMagenta }}>約束</span>
            <span style={{ color: C.inkMuted }}>→</span>
            <span style={{ color: C.gradientOrange }}>參考</span>
            <span style={{ color: C.inkMuted }}>→</span>
            <span style={{ color: C.gradientCoral }}>例外</span>
          </div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 06 — Ch.04 Generate & Handoff · 三段流程
   ============================================================ */

const PHASES = [
  {
    step: '01 · 產出',
    action: 'Generate',
    accent: C.gradientViolet,
    bg: 'rgba(106,76,245,0.14)',
    headline: '第一輪看版型，再分頁迭代',
    detail: '提示語用「保留 X，調整 Y」——避免整段重寫造成設計漂移。',
  },
  {
    step: '02 · 打包',
    action: 'Package',
    accent: C.gradientMagenta,
    bg: 'rgba(212,77,240,0.14)',
    headline: '截圖 + 結構 + 互動 + 約束',
    detail: '必補 hover / focus / loading / empty / error 五種 state。',
  },
  {
    step: '03 · 實作',
    action: 'Implement',
    accent: C.gradientOrange,
    bg: 'rgba(255,122,61,0.14)',
    headline: '進 Claude Code，跑 R→P→I',
    detail: 'Research → Plan → Implement（Part 1 Ch.04 工作流派上用場）。',
  },
];

const Part2GenerateHandoff = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.04 · Generate & Handoff"
        title="產出不是終點，是下一段的 input"
        sub="handoff 的乾淨度，決定 Claude Code 寫出來的 code 品質。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <motion.div
          variants={STAGGER_INNER}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'stretch',
            gap: 16,
          }}
        >
          {PHASES.map((p, i) => (
            <React.Fragment key={p.step}>
              <motion.div
                variants={FADE_UP}
                style={{
                  flex: 1,
                  background: p.bg,
                  border: `1px solid ${p.accent}`,
                  borderRadius: ROUNDED.lg,
                  padding: '32px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  fontFamily: MONO,
                  color: p.accent,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>{p.step}</div>
                <div style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: p.accent,
                  fontFamily: MONO,
                  letterSpacing: TRACK.heroLat,
                  lineHeight: 1,
                }}>{p.action}</div>
                <div style={{
                  fontSize: TYPE_SCALE.body,
                  color: C.ink,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  letterSpacing: TRACK.body,
                }}>{p.headline}</div>
                <div style={{
                  marginTop: 'auto',
                  paddingTop: 16,
                  borderTop: `1px solid ${C.hairline}`,
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.45,
                  letterSpacing: TRACK.small,
                }}>{p.detail}</div>
              </motion.div>
              {i < PHASES.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: MONO,
                  fontSize: 32,
                  color: C.inkMuted,
                  fontWeight: 400,
                  flexShrink: 0,
                }}>→</div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          variants={FADE_UP}
          style={{
            background: 'rgba(255,85,119,0.12)',
            borderLeft: `4px solid ${C.gradientCoral}`,
            borderRadius: ROUNDED.sm,
            padding: '20px 28px',
            fontSize: TYPE_SCALE.small,
            color: C.ink,
            lineHeight: 1.45,
            letterSpacing: TRACK.small,
          }}
        >
          <span style={{ color: C.gradientCoral, fontWeight: 600 }}>常見坑：</span>
          handoff 漏掉 hover / loading / error state，Claude Code 就補不齊——畫面跑起來但少一半互動。
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 08 — Ch.05 Figma to Cursor · Two-Column
   ============================================================ */

const FIGMA_CHECKLIST = [
  { item: '圖層命名',     hint: '不要 Rectangle 24 / Frame 7' },
  { item: 'Frame 命名',   hint: '語意化：hero / nav / card-product' },
  { item: 'Component 用法', hint: 'instance 不亂 detach' },
  { item: 'Auto-layout',   hint: '套用度決定 chatbot 讀得懂多少' },
  { item: 'Variables',     hint: '色票 / 字級 / spacing 對應到 design token' },
];

const MCP_STEPS = [
  { id: '①', accent: C.gradientViolet,  title: '確認連線',       detail: 'channel 與 file 權限（Part 1 已建好，這裡複習）。' },
  { id: '②', accent: C.gradientMagenta, title: '選擇抓取範圍',   detail: '整頁 / 單一 frame / 單一 component。' },
  { id: '③', accent: C.gradientOrange,  title: '對應 design token', detail: '色票 / 字級 / spacing 是否能對應 code 的 token。' },
  { id: '④', accent: C.gradientCoral,   title: '避開預設陷阱',   detail: '純圖片貼上、未 detach instance、跨檔案 component。' },
];

const Part2FigmaToCursor = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.05 · Figma to Cursor"
        title="MCP 不是萬能讀心術"
        sub="命名 / Component / Auto-layout，直接決定 Claude Code 看得懂多少。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 48,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 48,
        }}
      >
        {/* Left — health checklist */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '32px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <Tag color={C.gradientOrange}>圖稿健檢清單</Tag>
          <div style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.ink,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: TRACK.subtitle,
          }}>準備好，再進 MCP</div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginTop: 8,
          }}>
            {FIGMA_CHECKLIST.map((c) => (
              <div key={c.item} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                alignItems: 'baseline',
                gap: 14,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.hairline}`,
              }}>
                <div style={{
                  fontSize: 24,
                  fontFamily: MONO,
                  color: C.gradientOrange,
                  lineHeight: 1,
                  fontWeight: 600,
                }}>☐</div>
                <div>
                  <div style={{
                    fontSize: TYPE_SCALE.body,
                    color: C.ink,
                    fontWeight: 600,
                    letterSpacing: TRACK.body,
                  }}>{c.item}</div>
                  <div style={{
                    fontSize: TYPE_SCALE.small,
                    color: C.inkMuted,
                    marginTop: 2,
                    letterSpacing: TRACK.small,
                  }}>{c.hint}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — MCP steps */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {MCP_STEPS.map((step) => (
            <motion.div
              key={step.id}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                alignItems: 'baseline',
                gap: 20,
                paddingBottom: 16,
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <div style={{
                fontSize: TYPE_SCALE.subtitle,
                color: step.accent,
                fontWeight: 700,
                lineHeight: 1,
              }}>{step.id}</div>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.body,
                  color: C.ink,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: TRACK.body,
                }}>{step.title}</div>
                <div style={{
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.45,
                  letterSpacing: TRACK.small,
                }}>{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 09 — Ch.06 Chatbot in Action · 對話 mock + 5 點節奏
   ============================================================ */

const CHAT_BUBBLES = [
  { role: 'designer', text: '請讀取這個 frame，產出對應的 component，使用既有 design token。' },
  { role: 'ai',       text: '已讀取，產出 <ProductCard />，使用 token.color.bg-card、token.spacing.md…' },
  { role: 'designer', text: '保留結構，把 padding 改成 24px、hover state 加上 elevation。' },
  { role: 'ai',       text: '已更新，差異點：① padding 16 → 24 ② hover 加上 elevation-2 shadow。' },
];

const CHATBOT_RHYTHM = [
  { id: '①', accent: C.gradientViolet,  title: '第一輪指令',   detail: '讀圖 + 對應 component + 沿用 token。' },
  { id: '②', accent: C.gradientMagenta, title: '驗證',         detail: '跑起來 → 對照 Figma → 找差異 → 回報。' },
  { id: '③', accent: C.gradientOrange,  title: '補完互動',     detail: 'hover / focus / loading / empty / error 五種 state。' },
  { id: '④', accent: C.gradientCoral,   title: '迭代策略',     detail: '「保留結構，只改 X」——小範圍而非整頁重寫。' },
  { id: '⑤', accent: C.gradientViolet,  title: '何時開新 session', detail: 'context 接近滿 / 議題切換 / 需要乾淨思考時。' },
];

const Part2ChatbotInAction = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.06 · Chatbot in Action"
        title="和 AI 一起看著同一張圖討論"
        sub="chatbot 不是「貼圖等結果」——它是設計師與 AI 的共同工作介面。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — chat mock */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottom: `1px solid ${C.hairline}`,
          }}>
            <Tag color={C.gradientCoral}>Claude Code Chat</Tag>
            <div style={{
              fontSize: TYPE_SCALE.tiny,
              fontFamily: MONO,
              color: C.inkMuted,
              letterSpacing: '0.08em',
            }}>session · active</div>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflow: 'hidden',
          }}>
            {CHAT_BUBBLES.map((b, i) => {
              const isAI = b.role === 'ai';
              return (
                <div key={i} style={{
                  alignSelf: isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '88%',
                  background: isAI ? 'rgba(106,76,245,0.18)' : C.surface2,
                  border: isAI ? `1px solid rgba(106,76,245,0.4)` : `1px solid ${C.hairline}`,
                  borderRadius: ROUNDED.md,
                  padding: '12px 16px',
                  fontSize: 18,
                  color: C.ink,
                  lineHeight: 1.45,
                  letterSpacing: TRACK.small,
                }}>
                  <div style={{
                    fontSize: 13,
                    fontFamily: MONO,
                    color: isAI ? C.gradientViolet : C.inkMuted,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                    fontWeight: 600,
                  }}>{isAI ? 'Claude' : 'Designer'}</div>
                  <div>{b.text}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right — rhythm 5 points */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {CHATBOT_RHYTHM.map((r) => (
            <motion.div
              key={r.id}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr',
                alignItems: 'baseline',
                gap: 16,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <div style={{
                fontSize: 32,
                color: r.accent,
                fontWeight: 700,
                lineHeight: 1,
              }}>{r.id}</div>
              <div>
                <div style={{
                  fontSize: 26,
                  color: C.ink,
                  fontWeight: 600,
                  marginBottom: 4,
                  letterSpacing: TRACK.body,
                }}>{r.title}</div>
                <div style={{
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.4,
                  letterSpacing: TRACK.small,
                }}>{r.detail}</div>
              </div>
            </motion.div>
          ))}
          <motion.div
            variants={FADE_UP}
            style={{
              marginTop: 8,
              background: 'rgba(106,76,245,0.12)',
              borderLeft: `4px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.sm,
              padding: '14px 20px',
              fontSize: TYPE_SCALE.small,
              color: C.ink,
              lineHeight: 1.4,
              letterSpacing: TRACK.small,
            }}
          >
            <span style={{ color: C.gradientViolet, fontWeight: 600 }}>設計師類比：</span>
            像 Figma 的 design review——但 reviewer 同時會改 code。
          </motion.div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 10 — Overview · 兩條路徑一張圖
   ============================================================ */

const CONVERGENCE_POINTS = [
  {
    label: '共用工作流',
    detail: 'Research → Plan → Implement',
    ref: 'Part 1 · Ch.04',
    accent: C.gradientViolet,
  },
  {
    label: '共用知識',
    detail: 'Session / Context window 管理',
    ref: 'Part 1 · Ch.04',
    accent: C.gradientMagenta,
  },
  {
    label: '共用工具',
    detail: 'Cursor + Claude Code + Figma MCP',
    ref: 'Part 1 · Ch.02–03',
    accent: C.gradientOrange,
  },
];

const Part2Overview = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Part 2 · Overview"
        title="兩條路徑，一張地圖"
        sub="走到 Claude Code 之後，兩條路完全合流。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — convergence tree */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
            fontFamily: MONO,
            fontSize: 20,
            color: C.inkMuted,
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: C.ink, fontWeight: 700, fontSize: 24, marginBottom: 8 }}>可操作互動介面</div>

          {/* Scenario 1 path */}
          <div style={{ color: C.gradientViolet }}>
            <div>├─ <span style={{ fontWeight: 700 }}>Scenario 1 · From Idea</span></div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│  └─ Reference Curation</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│     └─ Claude Design</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│        └─ Handoff <span style={{ color: C.gradientViolet }}>───┐</span></div>
          </div>

          <div style={{ color: C.inkMuted, paddingLeft: 24 }}>│                          <span style={{ color: C.ink }}>▼</span></div>
          <div style={{ paddingLeft: 24 }}>│         <span style={{
            color: C.ink, fontWeight: 700, fontSize: 22,
            background: 'linear-gradient(90deg, rgba(106,76,245,0.18), rgba(255,122,61,0.18))',
            padding: '2px 12px', borderRadius: ROUNDED.sm,
          }}>Claude Code · 實作 + 迭代</span></div>
          <div style={{ color: C.inkMuted, paddingLeft: 24 }}>│                          <span style={{ color: C.ink }}>▲</span></div>

          {/* Scenario 2 path */}
          <div style={{ color: C.gradientOrange }}>
            <div>└─ <span style={{ fontWeight: 700 }}>Scenario 2 · From Figma</span></div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>   └─ 圖稿健檢</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>      └─ Cursor + MCP</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>         └─ Chatbot <span style={{ color: C.gradientOrange }}>──────┘</span></div>
          </div>
        </motion.div>

        {/* Right — convergence points */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 18,
          }}
        >
          <div style={{
            fontSize: TYPE_SCALE.tiny,
            fontFamily: MONO,
            color: C.inkMuted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>會合點 · 共用什麼</div>
          {CONVERGENCE_POINTS.map((cp) => (
            <motion.div
              key={cp.label}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.md,
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                borderLeft: `4px solid ${cp.accent}`,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div style={{
                  fontSize: TYPE_SCALE.body,
                  color: C.ink,
                  fontWeight: 600,
                  letterSpacing: TRACK.body,
                }}>{cp.label}</div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  fontFamily: MONO,
                  color: cp.accent,
                  letterSpacing: '0.08em',
                }}>{cp.ref}</div>
              </div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: C.inkMuted,
                letterSpacing: TRACK.small,
                lineHeight: 1.4,
              }}>{cp.detail}</div>
            </motion.div>
          ))}
          <motion.div
            variants={FADE_UP}
            style={{
              marginTop: 4,
              fontSize: TYPE_SCALE.small,
              color: C.inkMuted,
              lineHeight: 1.4,
              letterSpacing: TRACK.small,
              fontStyle: 'italic',
            }}
          >
            Part 2 講的是「前半段差異」，後半段 Part 1 已經教過——這就是兩個 part 接續的點。
          </motion.div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 11 — Closing · 動手做
   ============================================================ */

const PRACTICE_CARDS = [
  {
    tag: 'Scenario 1 練習',
    accent: C.gradientViolet,
    headline: '找一個沒做完的提案',
    detail: '用 Claude Design 跑一輪：整理 inputs → 產出 → handoff 到 Claude Code。',
  },
  {
    tag: 'Scenario 2 練習',
    accent: C.gradientOrange,
    headline: '挑一個既有 Figma 頁面',
    detail: '健檢圖稿 → Cursor 接 MCP → 用 chatbot 跑出可操作介面。',
  },
];

const Part2Closing = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 50%, #ff7a3d 100%)">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        <motion.div variants={FADE_UP}>
          <Eyebrow color="rgba(255,255,255,0.85)">Part 2 · Closing</Eyebrow>
        </motion.div>

        <motion.div variants={FADE_UP} style={{
          fontSize: 96,
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: TRACK.hero,
          color: C.ink,
          maxWidth: 1500,
        }}>
          你的下一個介面，
          <span style={{
            background: 'rgba(0,0,0,0.32)',
            padding: '0 16px',
            borderRadius: ROUNDED.md,
            marginLeft: 8,
          }}>從哪裡開始？</span>
        </motion.div>

        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
          }}
        >
          {PRACTICE_CARDS.map((p) => (
            <motion.div
              key={p.tag}
              variants={FADE_UP}
              style={{
                background: 'rgba(9,9,9,0.55)',
                border: `1px solid rgba(255,255,255,0.16)`,
                borderRadius: ROUNDED.lg,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: p.accent,
              }} />
              <Tag color={p.accent} bg="rgba(0,0,0,0.4)">{p.tag}</Tag>
              <div style={{
                fontSize: 32,
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1.2,
                letterSpacing: TRACK.title,
              }}>{p.headline}</div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.45,
                letterSpacing: TRACK.small,
              }}>{p.detail}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={FADE_UP} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          <div style={{
            fontSize: 56,
            fontFamily: MONO,
            color: C.ink,
            letterSpacing: '0.04em',
            fontWeight: 600,
          }}>Q &amp; A</div>
          <div style={{
            fontSize: TYPE_SCALE.tiny,
            fontFamily: MONO,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}>End of Part 2</div>
        </motion.div>
      </motion.div>
    </Frame>
  );
};

/* ============================================================
   Exports
   ============================================================ */

export {
  Part2Agenda,
  Part2TwoStartingPoints,
  Part2ClaudeDesign,
  Part2ReferenceCuration,
  Part2GenerateHandoff,
  Part2FigmaToCursor,
  Part2ChatbotInAction,
  Part2Overview,
  Part2Closing,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = '情境一 · Design to Code'
export const subtitle = '兩條路徑、一個終點——Claude Design 與 Claude Code 的接力。'

export default [
  { label: 'Section · Part 2', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 2"
      title="從想法 / 設計稿到可操作互動介面"
      subtitle="兩種起點，同一個終點——資源即路徑。"
      range="Ch.01 – Ch.06 · 兩條路徑 + Claude Design"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Agenda', render: (p) => <Part2Agenda {...p} /> },
  { label: 'Ch.01 · Two Starting Points', render: (p) => <Part2TwoStartingPoints {...p} /> },
  { label: 'Ch.02 · Claude Design', render: (p) => <Part2ClaudeDesign {...p} /> },
  { label: 'Section · Scenario 1', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Scenario 1 · From Idea"
      title="當你只有想法"
      subtitle="把分散的需求 + 參考素材，組裝成 AI 看得懂的 input。"
      range="Ch.03 – Ch.04 · Reference Curation → Generate & Handoff"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Ch.03 · Reference Curation', render: (p) => <Part2ReferenceCuration {...p} /> },
  { label: 'Ch.04 · Generate & Handoff', render: (p) => <Part2GenerateHandoff {...p} /> },
  { label: 'Section · Scenario 2', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Scenario 2 · From Figma"
      title="當你已經有圖稿"
      subtitle="圖稿不會自己變 code——準備度決定 chatbot 看得懂多少。"
      range="Ch.05 – Ch.06 · Figma to Cursor → Chatbot in Action"
      bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)"
    />
  )},
  { label: 'Ch.05 · Figma to Cursor', render: (p) => <Part2FigmaToCursor {...p} /> },
  { label: 'Ch.06 · Chatbot in Action', render: (p) => <Part2ChatbotInAction {...p} /> },
  { label: 'Overview', render: (p) => <Part2Overview {...p} /> },
  { label: 'Closing', render: (p) => <Part2Closing {...p} /> },
]