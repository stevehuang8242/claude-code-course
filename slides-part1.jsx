/* Part 1 — UX Design work with AI
 * 開場 + 環境建置 · 9 slides
 *
 * Self-contained module — design tokens / primitives inlined,
 * not relying on slides-shared.jsx. SectionDivider is reused
 * from slides_archived.jsx via props.
 *
 * Source blueprint: Slide/Slide-part1.md
 * Plan: Plan/Plan-part1.md
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider } from './slides_archived.jsx'

/* ============================================================
   Design tokens — 與 slides-part4.jsx / slides-part5.jsx 同步
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
    fontFamily: MONO,
  }}>{children}</div>
);

const SlideNumber = ({ n, total, color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    right: SPACING.paddingX,
    fontSize: TYPE_SCALE.tiny,
    color,
    fontFamily: MONO,
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
      fontFamily: MONO,
    }}>Part 1 · UX Design with AI</div>
  </div>
);

const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 500,
      lineHeight: 1.1,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: TRACK.hero,
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

/* Back-to-hub button — used on Ch.03 detail slides to return to the
 * Cursor Layout hub. Targets the slide tagged role="cursor-hub". */
const BackToHub = () => (
  <motion.button
    onClick={() => jumpToDeckRole('cursor-hub')}
    whileHover={{ x: -4, color: C.ink }}
    style={{
      position: 'absolute',
      top: 44,
      right: SPACING.paddingX,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: 'transparent',
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.pill,
      color: C.inkMuted,
      fontSize: TYPE_SCALE.tiny,
      fontFamily: MONO,
      fontWeight: 600,
      letterSpacing: '0.08em',
      cursor: 'pointer',
      transition: 'border-color 0.2s, color 0.2s',
    }}
  >
    <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
    <span>返回 Cursor 工作桌</span>
  </motion.button>
);

/* ============================================================
   SLIDE 01 — Agenda · 四章地圖
   ============================================================ */

const AGENDA_ITEMS = [
  { n: '01', title: 'Why AI Workflow', sub: '為什麼設計師要導入 AI 工作流', tag: 'Motivation', accent: C.gradientViolet },
  { n: '02', title: 'Toolchain Overview', sub: 'UI to Code 環境工具地圖', tag: 'Tools', accent: C.gradientMagenta },
  { n: '03', title: 'Cursor in Action', sub: 'Cursor 使用介面與操作', tag: 'Hands-on', accent: C.gradientOrange },
  { n: '04', title: 'AI Fundamentals', sub: 'Session / Context / Prompt / Token & Model', tag: 'Concepts', accent: C.gradientCoral },
];

const Part1Agenda = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Part 1 · Agenda"
        title="四個提問，串起這一章"
        sub="Why → What → How → Know，從動機到底層知識。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 64,
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(2, auto)',
          columnGap: 56,
          rowGap: 28,
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
              padding: '24px 0',
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
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 02 — Ch.01 合一頁 · The Shift（痛點 → 優勢 + UI⇄Code hero）
   ============================================================ */

const CH1_CARDS = [
  {
    tag: '01 · Ownership',
    accent: C.gradientViolet,
    pain: '設計稿丟出去 → 結果走樣',
    gain: '設計意圖不再被翻譯掉，親手把關到 code 層。',
    label: '控制感',
  },
  {
    tag: '02 · Velocity',
    accent: C.gradientMagenta,
    pain: '想驗證細節 → 等工程師排期',
    gain: '想到 → 看到，中間不再有排期。',
    label: '迭代速度',
  },
  {
    tag: '03 · Completeness',
    accent: C.gradientOrange,
    pain: '想試新想法 → 推不動、開不了會',
    gain: '從設計檔 → 可運作 prototype → 真實 code。',
    label: '交付完整度',
  },
];

const Part1Ch1Combined = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.01 · The Shift"
        title="不是取代，是雙向 — 三個轉變"
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
        {/* Hero banner — UI ⇄ Code shift declaration */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: 'linear-gradient(135deg, rgba(106,76,245,0.18) 0%, rgba(212,77,240,0.18) 100%)',
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '32px 44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
          }}
        >
          <div style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: TRACK.heroLat,
            color: C.ink,
            fontFamily: MONO,
            flexShrink: 0,
          }}>
            <span style={{ color: C.gradientViolet }}>UI → Code</span>
            <span style={{ color: C.inkMuted, margin: '0 0.3em' }}>．</span>
            <span style={{ color: C.gradientMagenta }}>Code → UI</span>
            <span style={{ color: C.inkMuted }}>．</span>
          </div>
          <div style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.ink,
            lineHeight: 1.3,
            letterSpacing: TRACK.subtitle,
            fontWeight: 400,
            opacity: 0.92,
            textAlign: 'right',
            maxWidth: 520,
          }}>
            設計師同時掌握兩個方向，<br/>價值才會跑出來。
          </div>
        </motion.div>

        {/* Three Pain → Gain cards */}
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
          {CH1_CARDS.map((card) => (
            <motion.div
              key={card.tag}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: card.accent,
              }} />
              <Tag color={card.accent}>{card.tag}</Tag>

              {/* Pain row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{
                  fontSize: TYPE_SCALE.subtitle,
                  color: C.gradientCoral,
                  fontFamily: MONO,
                  fontWeight: 700,
                  lineHeight: 1,
                  width: 28,
                  flexShrink: 0,
                }}>✗</div>
                <div style={{
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.4,
                  letterSpacing: TRACK.small,
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(255,85,119,0.4)',
                }}>{card.pain}</div>
              </div>

              {/* Down arrow */}
              <div style={{
                color: card.accent,
                fontSize: 22,
                fontFamily: MONO,
                marginLeft: 6,
                opacity: 0.7,
              }}>↓</div>

              {/* Gain row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{
                  fontSize: TYPE_SCALE.subtitle,
                  color: card.accent,
                  fontFamily: MONO,
                  fontWeight: 700,
                  lineHeight: 1,
                  width: 28,
                  flexShrink: 0,
                }}>✓</div>
                <div style={{
                  fontSize: 28,
                  color: C.ink,
                  lineHeight: 1.3,
                  letterSpacing: TRACK.body,
                  fontWeight: 600,
                }}>{card.gain}</div>
              </div>

              {/* Bottom label */}
              <div style={{
                marginTop: 'auto',
                paddingTop: 20,
                borderTop: `1px solid ${C.hairline}`,
                fontSize: TYPE_SCALE.small,
                fontFamily: MONO,
                color: card.accent,
                letterSpacing: '0.08em',
              }}>＿ {card.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 03 — Ch.02 合一頁 · Toolchain（relation banner + 2x2 工具卡）
   ============================================================ */

const RELATION_NODES = [
  { name: 'Cursor',      color: C.gradientViolet,  dashed: false },
  { name: 'Claude Code', color: C.gradientMagenta, dashed: false },
  { name: 'Figma MCP',   color: C.gradientOrange,  dashed: false },
  { name: 'Figma',       color: C.inkMuted,        dashed: true  },
];

const FOUR_TOOLS = [
  {
    name: 'Cursor',
    tag: 'IDE · 工作場域',
    accent: C.gradientViolet,
    headline: 'AI-first 的 code editor',
    detail: '設計師主要操作介面；視為「跟 AI 對話的工作桌」。',
  },
  {
    name: 'Claude Code',
    tag: 'AI Agent · 大腦',
    accent: C.gradientMagenta,
    headline: '跑在 Cursor / terminal 裡的 AI agent',
    detail: '讀懂需求、寫 code、執行任務的主要執行者。',
  },
  {
    name: 'Figma MCP',
    tag: 'Bridge · 設計橋樑',
    accent: C.gradientOrange,
    headline: '讓 Claude 能讀寫 Figma 的協定',
    detail: 'Model Context Protocol server；UI ⇄ Code 雙向的關鍵連結。',
  },
  {
    name: 'Node.js',
    tag: 'Runtime · 引擎',
    accent: C.gradientCoral,
    headline: '上述工具運作的底層執行環境',
    detail: 'JavaScript runtime；設計師不需要懂，但裝了它整套才能跑。',
  },
];

const Part1Ch2Combined = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.02 · Toolchain"
        title="你會碰到的四個名字，和它們怎麼接"
        sub="先認臉，再認關係——上面是 flow，下面是細節。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 36,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Relation banner — horizontal flow + Node.js foundation */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '22px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Flow row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: MONO,
          }}>
            {RELATION_NODES.map((node, i) => (
              <React.Fragment key={node.name}>
                <div style={{
                  padding: '10px 22px',
                  border: node.dashed
                    ? `1.5px dashed ${node.color}`
                    : `1.5px solid ${node.color}`,
                  borderRadius: ROUNDED.md,
                  color: node.color,
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: '-0.02em',
                }}>{node.name}</div>
                {i < RELATION_NODES.length - 1 && (
                  <div style={{
                    color: C.inkMuted,
                    fontSize: 28,
                    fontFamily: MONO,
                    fontWeight: 400,
                  }}>{i === 2 ? '⇄' : '→'}</div>
                )}
              </React.Fragment>
            ))}
            <div style={{
              flex: 1,
              fontSize: TYPE_SCALE.small,
              color: C.inkMuted,
              fontFamily: MONO,
              textAlign: 'right',
              letterSpacing: '0.08em',
            }}>UI ⇄ Code data flow</div>
          </div>
          {/* Node.js foundation strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingTop: 12,
            borderTop: `1px dashed ${C.hairline}`,
          }}>
            <div style={{
              padding: '6px 16px',
              border: `1px solid ${C.gradientCoral}`,
              borderRadius: ROUNDED.sm,
              color: C.gradientCoral,
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: '0.04em',
            }}>Node.js</div>
            <div style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, rgba(255,85,119,0.5), transparent)`,
            }} />
            <div style={{
              fontSize: TYPE_SCALE.small,
              color: C.inkMuted,
              fontFamily: MONO,
              letterSpacing: '0.04em',
            }}>foundation · 底層 runtime 支撐全部</div>
          </div>
        </motion.div>

        {/* 2x2 tool cards */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {FOUR_TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '24px 32px',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: 28,
                rowGap: 4,
                alignItems: 'start',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: 4, background: tool.accent,
              }} />
              <div style={{
                gridRow: 'span 3',
                fontSize: 48,
                fontWeight: 700,
                color: tool.accent,
                fontFamily: MONO,
                letterSpacing: TRACK.heroLat,
                lineHeight: 1,
                alignSelf: 'center',
                minWidth: 96,
              }}>{String(i + 1).padStart(2, '0')}</div>
              <Tag color={tool.accent}>{tool.tag}</Tag>
              <div style={{
                fontSize: 30,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: TRACK.title,
                lineHeight: 1.2,
                marginTop: 4,
              }}>
                <span style={{ fontFamily: MONO, color: tool.accent }}>{tool.name}</span>
                <span style={{ color: C.inkMuted, margin: '0 0.4em' }}>·</span>
                <span>{tool.headline}</span>
              </div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: C.inkMuted,
                lineHeight: 1.4,
                letterSpacing: TRACK.small,
                marginTop: 2,
              }}>{tool.detail}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 04 — Ch.03 Cursor Layout · Two-Column
   ============================================================ */

const CURSOR_AREAS = [
  { id: '①', accent: C.gradientViolet,  title: '專案 Folder（左側）',     detail: 'File Explorer，列出整個專案的檔案與資料夾。', role: 'cursor-folder' },
  { id: '②', accent: C.gradientMagenta, title: '編輯區（中央）',           detail: '開檔後在這裡看／改 code。' },
  { id: '③', accent: C.gradientOrange,  title: 'Claude Chat（右側／底部）', detail: '跟 AI 對話的主要介面。', role: 'cursor-chat' },
  { id: '④', accent: C.gradientCoral,   title: 'Terminal（底部）',         detail: '執行指令、看 Claude 跑的結果。', role: 'cursor-terminal' },
];

/* Navigate to a slide by its `data-deck-role` attribute (set via manifest `role` field).
 * Returns true if navigation succeeded; no-op + false if the role isn't found. */
const jumpToDeckRole = (role) => {
  const stage = typeof document !== 'undefined' ? document.querySelector('deck-stage') : null;
  if (!stage) return false;
  const sections = stage.querySelectorAll('section');
  const idx = [...sections].findIndex((s) => s.getAttribute('data-deck-role') === role);
  if (idx < 0) return false;
  stage.goTo(idx);
  return true;
};

const Part1CursorLayout = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · Cursor in Action"
        title="Cursor 的工作桌長這樣"
        sub="四個區域，對設計師而言就像 Figma 的 panel 排版。"
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
          gridTemplateColumns: '1.1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — mock Cursor layout */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: 20,
            display: 'grid',
            gridTemplateColumns: '0.6fr 1fr 0.7fr',
            gridTemplateRows: '1fr 0.4fr',
            gap: 12,
            position: 'relative',
          }}
        >
          {/* File Explorer */}
          <div style={{
            gridRow: 'span 2',
            background: C.surface2,
            border: `2px solid ${C.gradientViolet}`,
            borderRadius: ROUNDED.md,
            padding: 18,
            display: 'flex', flexDirection: 'column', gap: 8,
            position: 'relative',
          }}>
            <Tag color={C.gradientViolet}>① Folder</Tag>
            <div style={{ fontFamily: MONO, fontSize: 16, color: C.inkMuted, lineHeight: 1.7 }}>
              <div>▾ my-project/</div>
              <div style={{ paddingLeft: 14 }}>CLAUDE.md</div>
              <div style={{ paddingLeft: 14 }}>package.json</div>
              <div style={{ paddingLeft: 14 }}>▸ src/</div>
              <div style={{ paddingLeft: 14 }}>▸ assets/</div>
            </div>
          </div>
          {/* Editor */}
          <div style={{
            background: C.canvas,
            border: `2px solid ${C.gradientMagenta}`,
            borderRadius: ROUNDED.md,
            padding: 18,
            display: 'flex', flexDirection: 'column', gap: 8,
            position: 'relative',
          }}>
            <Tag color={C.gradientMagenta}>② Editor</Tag>
            <div style={{ fontFamily: MONO, fontSize: 14, color: C.inkMuted, lineHeight: 1.7 }}>
              <div><span style={{ color: C.gradientViolet }}>import</span> React <span style={{ color: C.gradientViolet }}>from</span> 'react'</div>
              <div>&nbsp;</div>
              <div><span style={{ color: C.gradientOrange }}>const</span> Card = () =&gt; (</div>
              <div style={{ paddingLeft: 18 }}>&lt;div&gt;...&lt;/div&gt;</div>
              <div>)</div>
            </div>
          </div>
          {/* Claude Chat */}
          <div style={{
            gridRow: 'span 2',
            background: C.surface2,
            border: `2px solid ${C.gradientOrange}`,
            borderRadius: ROUNDED.md,
            padding: 18,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <Tag color={C.gradientOrange}>③ Chat</Tag>
            <div style={{ fontSize: 14, color: C.inkMuted, lineHeight: 1.6 }}>
              <div style={{
                background: C.surface1,
                padding: '8px 12px',
                borderRadius: ROUNDED.sm,
                marginBottom: 8,
              }}>幫我把這張卡片改成兩欄。</div>
              <div style={{
                background: 'rgba(106,76,245,0.18)',
                padding: '8px 12px',
                borderRadius: ROUNDED.sm,
                color: C.ink,
              }}>好的，我會修改 Card 元件的 grid…</div>
            </div>
          </div>
          {/* Terminal */}
          <div style={{
            background: C.canvas,
            border: `2px solid ${C.gradientCoral}`,
            borderRadius: ROUNDED.md,
            padding: 14,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <Tag color={C.gradientCoral}>④ Terminal</Tag>
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.inkMuted, lineHeight: 1.6 }}>
              <div>$ npm run dev</div>
              <div style={{ color: C.gradientOrange }}>▸ Local: http://localhost:5173</div>
            </div>
          </div>
        </motion.div>

        {/* Right — area explanations */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 22,
          }}
        >
          {CURSOR_AREAS.map((area) => {
            const clickable = !!area.role;
            return (
              <motion.div
                key={area.id}
                variants={FADE_UP}
                onClick={clickable ? () => jumpToDeckRole(area.role) : undefined}
                whileHover={clickable ? {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  x: 4,
                } : undefined}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto',
                  alignItems: 'center',
                  gap: 20,
                  padding: '12px 16px 18px',
                  marginLeft: -16,
                  borderBottom: `1px solid ${C.hairline}`,
                  borderRadius: ROUNDED.sm,
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  fontSize: TYPE_SCALE.subtitle,
                  color: area.accent,
                  fontWeight: 700,
                  lineHeight: 1,
                }}>{area.id}</div>
                <div>
                  <div style={{
                    fontSize: TYPE_SCALE.body,
                    color: C.ink,
                    fontWeight: 600,
                    marginBottom: 6,
                    letterSpacing: TRACK.body,
                  }}>{area.title}</div>
                  <div style={{
                    fontSize: TYPE_SCALE.small,
                    color: C.inkMuted,
                    lineHeight: 1.4,
                    letterSpacing: TRACK.small,
                  }}>{area.detail}</div>
                </div>
                {clickable && (
                  <div style={{
                    fontSize: TYPE_SCALE.small,
                    color: area.accent,
                    fontFamily: MONO,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}>→ 詳細</div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05 — Ch.03 ③ Claude Chat · 對話框功能介紹
   ============================================================ */

const CHAT_FEATURES = [
  {
    n: '01',
    tag: 'Conversation',
    accent: C.gradientViolet,
    title: '多輪對話',
    summary: '像跟同事討論，記得上下文',
    detail: '可追問、修正方向、補背景；不是 Q&A，是持續協作。',
  },
  {
    n: '02',
    tag: 'Project Context',
    accent: C.gradientMagenta,
    title: '讀整個專案',
    summary: '跨檔搜尋、跨檔修改',
    detail: '透過 CLAUDE.md 學會專案規矩；不限於當前開啟的檔案。',
  },
  {
    n: '03',
    tag: 'Attach & Reference',
    accent: C.gradientOrange,
    title: '附圖 / @檔案',
    summary: '截圖拖進去 ＋ @filename 精確指向',
    detail: '圖與檔案是 Claude 的「視覺輸入」；改設計時最常用。',
  },
  {
    n: '04',
    tag: 'Slash Commands',
    accent: C.gradientCoral,
    title: '指令 commands',
    summary: '/init  /clear  /help  ...',
    detail: '以 / 開頭的 shortcut；常用操作快速完成。',
  },
];

const Part1ClaudeCodeChat = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · ③ Claude Chat"
        title="Claude Chat 能做的事"
        sub="把 Claude 當成一個能讀懂整個專案的設計助理。"
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
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 24,
        }}
      >
        {CHAT_FEATURES.map((f) => (
          <motion.div
            key={f.n}
            variants={FADE_UP}
            style={{
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 4, background: f.accent,
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Tag color={f.accent}>{f.tag}</Tag>
              <div style={{
                fontSize: 32,
                fontFamily: MONO,
                color: f.accent,
                fontWeight: 700,
                lineHeight: 1,
                opacity: 0.45,
                letterSpacing: '0.04em',
              }}>{f.n}</div>
            </div>
            <div style={{
              fontSize: 38,
              fontWeight: 600,
              color: C.ink,
              lineHeight: 1.15,
              letterSpacing: TRACK.title,
              marginTop: 6,
            }}>{f.title}</div>
            <div style={{
              fontSize: TYPE_SCALE.body,
              color: C.ink,
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: TRACK.body,
              opacity: 0.95,
            }}>{f.summary}</div>
            <div style={{
              marginTop: 'auto',
              paddingTop: 16,
              borderTop: `1px solid ${C.hairline}`,
              fontSize: TYPE_SCALE.small,
              color: C.inkMuted,
              lineHeight: 1.45,
              letterSpacing: TRACK.small,
            }}>{f.detail}</div>
          </motion.div>
        ))}
      </motion.div>
      <BackToHub />
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05b — Ch.03 ④ Terminal · 啟用步驟
   ============================================================ */

const TERMINAL_STEPS = [
  { n: '01', cmd: '$ claude',           detail: '在 Cursor terminal 輸入 claude 啟動 Claude Code。' },
  { n: '02', cmd: '→ opening browser…', detail: '第一次啟動會引導登入 Anthropic 帳號。' },
  { n: '03', cmd: '✓ ready',            detail: '啟動後對話框出現在右側 / 底部，可以開始對話。' },
  { n: '04', cmd: '⌘+L  /  ⌘+K',        detail: '隨時用快捷鍵切換 Chat / Inline 模式。' },
];

const Part1Terminal = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · ④ Terminal"
        title="從 Terminal 啟動 Claude Code"
        sub="四步驟，把 Claude 跑起來。"
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
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — terminal mock */}
        <motion.div variants={FADE_UP} style={{
          background: C.canvas,
          border: `2px solid ${C.gradientCoral}`,
          borderRadius: ROUNDED.lg,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          fontFamily: MONO,
          fontSize: 20,
          lineHeight: 1.65,
        }}>
          <Tag color={C.gradientCoral}>Terminal</Tag>
          <div style={{ color: C.inkMuted, marginTop: 12 }}>
            <div>
              <span style={{ color: C.gradientOrange }}>~/my-project</span>
              <span style={{ color: C.inkMuted }}> $ </span>
              <span style={{ color: C.ink }}>claude</span>
            </div>
            <div style={{ color: C.gradientViolet, marginTop: 14 }}>Welcome to Claude Code!</div>
            <div style={{ marginTop: 4 }}>
              Login required <span style={{ color: C.gradientOrange }}>→ opening browser…</span>
            </div>
            <div style={{ color: C.gradientCoral, marginTop: 14 }}>✓ Logged in as designer@example.com</div>
            <div style={{ marginTop: 14, color: C.ink }}>
              &gt; <span style={{ color: C.gradientMagenta }}>你想做什麼？</span>
            </div>
            <div style={{
              marginTop: 12,
              fontSize: 16,
              color: C.inkMuted,
            }}>
              <span style={{ color: C.gradientOrange }}>⌘+L</span> Chat
              <span style={{ margin: '0 12px' }}>·</span>
              <span style={{ color: C.gradientOrange }}>⌘+K</span> Inline
            </div>
          </div>
        </motion.div>

        {/* Right — steps */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {TERMINAL_STEPS.map((step) => (
            <motion.div
              key={step.n}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                alignItems: 'baseline',
                gap: 20,
                paddingBottom: 18,
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <div style={{
                fontSize: TYPE_SCALE.subtitle,
                color: C.gradientCoral,
                fontFamily: MONO,
                fontWeight: 700,
                lineHeight: 1,
              }}>{step.n}</div>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.body,
                  color: C.ink,
                  fontFamily: MONO,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: '0.02em',
                }}>{step.cmd}</div>
                <div style={{
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.4,
                  letterSpacing: TRACK.small,
                }}>{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <BackToHub />
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 06 — Ch.03 Project & CLAUDE.md · Two-Column
   ============================================================ */

const CLAUDEMD_POINTS = [
  { tag: '是什麼', detail: '專案級的 AI 指令檔，每次 Claude 開啟對話都會自動讀。' },
  { tag: '寫什麼', detail: '專案目標、檔案結構、設計規範、禁止事項。' },
  { tag: '不寫什麼', detail: '每次任務的細節（那是 prompt 的工作）。' },
];

const Part1ProjectClaudeMd = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · Project & CLAUDE.md"
        title="一個資料夾 = 一個專案"
        sub="一份 CLAUDE.md = AI 在這個專案的工作守則。"
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
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: 48,
        }}
      >
        {/* Left — folder tree */}
        <motion.div variants={FADE_UP} style={{
          background: C.surface1,
          border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.lg,
          padding: '36px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          <Tag color={C.gradientViolet}>專案資料夾</Tag>
          <div style={{
            fontFamily: MONO,
            fontSize: 24,
            color: C.inkMuted,
            lineHeight: 1.8,
          }}>
            <div style={{ color: C.ink }}>my-project/</div>
            <div style={{
              color: C.gradientViolet,
              fontWeight: 700,
              background: 'rgba(106,76,245,0.12)',
              borderRadius: ROUNDED.sm,
              padding: '4px 8px',
              margin: '4px 0',
            }}>├─ CLAUDE.md          <span style={{ color: C.inkMuted, fontWeight: 400 }}>← AI 工作守則</span></div>
            <div style={{ paddingLeft: 8 }}>├─ package.json       <span style={{ fontSize: 18 }}>← 專案描述</span></div>
            <div style={{ paddingLeft: 8 }}>├─ src/               <span style={{ fontSize: 18 }}>← 程式碼</span></div>
            <div style={{ paddingLeft: 8 }}>├─ assets/            <span style={{ fontSize: 18 }}>← 圖片、字型</span></div>
            <div style={{ paddingLeft: 8 }}>└─ README.md          <span style={{ fontSize: 18 }}>← 給人看的說明</span></div>
          </div>
        </motion.div>

        {/* Right — CLAUDE.md role */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {CLAUDEMD_POINTS.map((point, i) => (
            <motion.div
              key={point.tag}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                alignItems: 'baseline',
                gap: 24,
                padding: '18px 0',
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <Tag color={[C.gradientViolet, C.gradientMagenta, C.gradientOrange][i]}>{point.tag}</Tag>
              <div style={{
                fontSize: TYPE_SCALE.body,
                color: C.ink,
                lineHeight: 1.4,
                letterSpacing: TRACK.body,
              }}>{point.detail}</div>
            </motion.div>
          ))}
          <motion.div
            variants={FADE_UP}
            style={{
              marginTop: 12,
              background: 'rgba(106,76,245,0.12)',
              borderLeft: `4px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.sm,
              padding: '20px 24px',
              fontSize: TYPE_SCALE.body,
              color: C.ink,
              lineHeight: 1.4,
              letterSpacing: TRACK.body,
            }}
          >
            <span style={{ color: C.gradientViolet, fontWeight: 600 }}>設計師類比：</span>
            CLAUDE.md ≈ 給新人的 onboarding 文件 + design spec。
          </motion.div>
        </motion.div>
      </motion.div>
      <BackToHub />
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 07 — Ch.04 AI Fundamentals · 關係圖 + 解釋
   ============================================================ */

const FUNDAMENTAL_TERMS = [
  { term: 'Token',           accent: C.gradientViolet,  detail: 'AI 處理文字的最小單位，輸入輸出都計算。' },
  { term: 'Prompt',          accent: C.gradientMagenta, detail: '你送給 AI 的指令／訊息，內容由 token 組成。' },
  { term: 'Context Window',  accent: C.gradientOrange,  detail: 'AI 一次能「看見」的 token 總量上限。' },
  { term: 'Session',         accent: C.gradientCoral,   detail: '一段持續對話，所有訊息累積在 context window 內。' },
];

const Part1AIFundamentals = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.04 · AI Fundamentals"
        title="四個詞，一張關係圖"
        sub="理解這四者，才知道 AI 為什麼會「忘」、為什麼要新開對話。"
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
          gridTemplateColumns: '0.85fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — diagram */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {FUNDAMENTAL_TERMS.map((t, i) => (
            <React.Fragment key={t.term}>
              <div style={{
                padding: '18px 32px',
                border: `1.5px solid ${t.accent}`,
                borderRadius: ROUNDED.md,
                color: t.accent,
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: '0.02em',
                minWidth: 240,
                textAlign: 'center',
              }}>{t.term}</div>
              {i < FUNDAMENTAL_TERMS.length - 1 && (
                <div style={{ color: C.inkMuted, fontSize: 26, fontFamily: MONO }}>↓</div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Right — explanations */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 18,
          }}
        >
          {FUNDAMENTAL_TERMS.map((t) => (
            <motion.div
              key={t.term}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                alignItems: 'baseline',
                gap: 20,
                paddingBottom: 14,
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <div style={{
                fontSize: TYPE_SCALE.body,
                fontFamily: MONO,
                color: t.accent,
                fontWeight: 600,
                letterSpacing: TRACK.body,
              }}>{t.term}</div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: C.ink,
                lineHeight: 1.45,
                letterSpacing: TRACK.small,
              }}>{t.detail}</div>
            </motion.div>
          ))}
          <motion.div
            variants={FADE_UP}
            style={{
              marginTop: 8,
              background: 'rgba(255,85,119,0.12)',
              borderLeft: `4px solid ${C.gradientCoral}`,
              borderRadius: ROUNDED.sm,
              padding: '18px 22px',
              fontSize: TYPE_SCALE.small,
              color: C.ink,
              lineHeight: 1.45,
              letterSpacing: TRACK.small,
            }}
          >
            <span style={{ color: C.gradientCoral, fontWeight: 600 }}>為什麼會忘：</span>
            超過 context window 上限，早期訊息會被擠出去。
          </motion.div>
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 08 — Ch.04 Pick Your Model · Three Feature Cards
   ============================================================ */

const MODELS = [
  {
    name: 'Opus',
    tag: 'Heavy · 重型任務',
    accent: C.gradientViolet,
    headline: '複雜推理 · 長任務 · 高品質產出',
    detail: '架構規劃、跨檔 refactor、產品決策對話。',
  },
  {
    name: 'Sonnet',
    tag: 'Balanced · 日常主力',
    accent: C.gradientMagenta,
    headline: '平衡型 · 速度與品質都夠用',
    detail: '寫元件、修 bug、一般 UI to code 任務。',
  },
  {
    name: 'Haiku',
    tag: 'Light · 輕量快速',
    accent: C.gradientOrange,
    headline: '快速 · 輕量任務',
    detail: '簡單問答、批次處理、格式轉換。',
  },
];

const Part1PickModel = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.04 · Pick Your Model"
        title="三個 Claude 模型，三種情境"
        sub="不是越貴越好——對的任務配對的模型。"
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
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          flex: 1,
          minHeight: 0,
        }}>
          {MODELS.map((m) => (
            <motion.div
              key={m.name}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: m.accent,
              }} />
              <Tag color={m.accent}>{m.tag}</Tag>
              <div style={{
                fontSize: 64,
                fontWeight: 700,
                color: m.accent,
                fontFamily: MONO,
                letterSpacing: TRACK.heroLat,
                lineHeight: 1,
                marginTop: 8,
              }}>{m.name}</div>
              <div style={{
                fontSize: TYPE_SCALE.body,
                color: C.ink,
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: TRACK.body,
              }}>{m.headline}</div>
              <div style={{
                marginTop: 'auto',
                paddingTop: 20,
                borderTop: `1px solid ${C.hairline}`,
                fontSize: TYPE_SCALE.small,
                color: C.inkMuted,
                lineHeight: 1.45,
                letterSpacing: TRACK.small,
              }}>{m.detail}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={FADE_UP}
          style={{
            background: 'linear-gradient(135deg, rgba(106,76,245,0.15) 0%, rgba(212,77,240,0.15) 50%, rgba(255,122,61,0.15) 100%)',
            borderLeft: `4px solid ${C.gradientMagenta}`,
            borderRadius: ROUNDED.sm,
            padding: '22px 28px',
            fontSize: TYPE_SCALE.body,
            color: C.ink,
            lineHeight: 1.4,
            letterSpacing: TRACK.body,
          }}
        >
          <span style={{ color: C.gradientMagenta, fontWeight: 600 }}>實務判斷：</span>
          開新 session 之前先想——這次任務需要的是 Opus 的腦、Sonnet 的手，還是 Haiku 的速度？
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   Exports
   ============================================================ */

export {
  Part1Agenda,
  Part1Ch1Combined,
  Part1Ch2Combined,
  Part1CursorLayout,
  Part1ClaudeCodeChat,
  Part1Terminal,
  Part1ProjectClaudeMd,
  Part1AIFundamentals,
  Part1PickModel,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = 'UX Design work with AI'
export const subtitle = '從動機建立到環境就緒——設計師走進 AI 工作流的第一章。'

export default [
  { label: 'Section · Part 1', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 1"
      title="UX Design work with AI"
      subtitle="為什麼設計師值得親自走進 AI 工作流。"
      range="Ch.01 – Ch.04 · 開場 + 環境建置"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Agenda', render: (p) => <Part1Agenda {...p} /> },
  { label: 'Ch.01 · The Shift', render: (p) => <Part1Ch1Combined {...p} /> },
  { label: 'Ch.02 · Toolchain', render: (p) => <Part1Ch2Combined {...p} /> },
  { label: 'Ch.03 · Cursor Layout', role: 'cursor-hub', render: (p) => <Part1CursorLayout {...p} /> },
  { label: 'Ch.03 · ① Project & CLAUDE.md', role: 'cursor-folder',   skip: true, render: (p) => <Part1ProjectClaudeMd {...p} /> },
  { label: 'Ch.03 · ③ Claude Chat',         role: 'cursor-chat',     skip: true, render: (p) => <Part1ClaudeCodeChat {...p} /> },
  { label: 'Ch.03 · ④ Terminal',            role: 'cursor-terminal', skip: true, render: (p) => <Part1Terminal {...p} /> },
  { label: 'Ch.04 · AI Fundamentals', render: (p) => <Part1AIFundamentals {...p} /> },
  { label: 'Ch.04 · Pick Your Model', render: (p) => <Part1PickModel {...p} /> },
]
