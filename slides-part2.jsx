/* Part 2 — 兩個 Case 實作：從討論 / 設計稿到 Code（0 → 1）
 *
 * 依 Plan/plan_part2.md 生成：開場 divider + 11 張規劃內容。
 * 三段式：開場定位 → Case 1（討論 → PRD → Code）→ Case 2（設計源 → Code）。
 * 本章止於「第一版跑起來（0 → 1）」；迭代（1 → N）交棒 Part 3、RPI 工作流交棒 Part 4。
 *
 * Self-contained module — design tokens / primitives inlined,
 * mirroring slides-part1.jsx。SectionDivider 由 slides_archived.jsx 以 props 重用。
 *
 * 操作示範章節（Ch.03 / Ch.06）每步附「截圖」佔位框，供日後置換實際截圖。
 *
 * Source plan: Plan/plan_part2.md
 * Manifest + chapter metadata 在檔案最底部。 */

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

/* Left-accent callout banner (會合點 / 邊界 / 常見坑 …) */
const Callout = ({ accent = C.gradientMagenta, title, children, style = {} }) => (
  <div style={{
    background: `${accent}1a`,
    borderLeft: `4px solid ${accent}`,
    borderRadius: ROUNDED.sm,
    padding: '20px 28px',
    fontSize: TYPE_SCALE.small,
    color: C.ink,
    lineHeight: 1.45,
    letterSpacing: TRACK.small,
    ...style,
  }}>
    {title && <span style={{ color: accent, fontWeight: 600 }}>{title}</span>}
    {children}
  </div>
);

/* Demo step with a screenshot placeholder box (操作示範：步驟 + 截圖) */
const ShotStep = ({ id, accent, title, shot, caption }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 30, color: accent, fontWeight: 700, fontFamily: MONO, lineHeight: 1 }}>{id}</span>
      <span style={{
        fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600,
        letterSpacing: TRACK.body, lineHeight: 1.15,
      }}>{title}</span>
    </div>
    <div style={{
      flex: 1,
      minHeight: 190,
      border: `1.5px dashed ${accent}66`,
      borderRadius: ROUNDED.md,
      background: `${accent}0d`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 18,
      textAlign: 'center',
    }}>
      <span style={{
        fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: accent,
        letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
      }}>截圖</span>
      <span style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.4 }}>{shot}</span>
    </div>
    <div style={{
      fontSize: TYPE_SCALE.small, color: C.inkMuted,
      lineHeight: 1.4, letterSpacing: TRACK.small,
    }}>{caption}</div>
  </div>
);

/* Vertical workflow step (number + title + detail), optional highlight */
const VStep = ({ id, accent, title, detail, highlight = false }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '52px 1fr',
    alignItems: 'baseline',
    gap: 18,
    padding: highlight ? '16px 18px' : '0 0 14px 0',
    borderRadius: highlight ? ROUNDED.md : 0,
    background: highlight ? `${accent}1f` : 'transparent',
    border: highlight ? `1px solid ${accent}66` : 'none',
    borderBottom: highlight ? `1px solid ${accent}66` : `1px solid ${C.hairline}`,
  }}>
    <div style={{ fontSize: 30, color: accent, fontWeight: 700, lineHeight: 1, fontFamily: MONO }}>{id}</div>
    <div>
      <div style={{
        fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600,
        marginBottom: 6, letterSpacing: TRACK.body, lineHeight: 1.2,
      }}>{title}</div>
      <div style={{
        fontSize: TYPE_SCALE.small, color: C.inkMuted,
        lineHeight: 1.45, letterSpacing: TRACK.small,
      }}>{detail}</div>
    </div>
  </div>
);

/* Standard animated content frame */
const Slide = ({ kicker, title, sub, children, n, total, bg }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame bg={bg}>
      <SlideHead kicker={kicker} title={title} sub={sub} />
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
        {children}
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 00 — 情境實作開場 · 三情境總覽
   （情境一 Part 2 / 情境二 Part 3 / 情境三 Part 4，先給全局地圖）
   ============================================================ */

const SCENARIOS = [
  {
    n: '01',
    tag: '情境一',
    accent: C.gradientViolet,
    name: 'Design to Code',
    desc: '從討論或設計源出發，做出第一版可運作介面（0 → 1）。',
  },
  {
    n: '02',
    tag: '情境二',
    accent: C.gradientMagenta,
    name: 'Design from Code',
    desc: '把 AI 生成的雜亂介面，重構成具一致性的設計系統。',
  },
  {
    n: '03',
    tag: '情境三',
    accent: C.gradientOrange,
    name: 'RPI Workflow',
    desc: 'Research → Plan → Implement，10 分鐘做出新功能。',
  },
];

const Part2ScenariosIntro = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="情境實作介紹"
        title="AI Design Workflow 情境實作"
        sub="由 AI 驅動的設計與開發協作模式"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          marginBottom: 40,
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
          {SCENARIOS.map((card) => (
            <motion.div
              key={card.n}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '36px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: card.accent,
              }} />
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <Tag color={card.accent}>{card.tag}</Tag>
                <div style={{
                  fontSize: TYPE_SCALE.title, fontFamily: MONO,
                  color: card.accent, fontWeight: 700, lineHeight: 1, opacity: 0.4,
                }}>{card.n}</div>
              </div>
              <div style={{
                fontSize: 40, fontWeight: 600, color: C.ink,
                lineHeight: 1.15, letterSpacing: TRACK.title,
              }}>{card.name}</div>
              <div style={{
                marginTop: 'auto',
                fontSize: TYPE_SCALE.small, color: C.inkMuted,
                lineHeight: 1.5, letterSpacing: TRACK.small,
              }}>{card.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 01 — Ch.01 Two Cases · Two-Column 比較
   ============================================================ */

const CASES = [
  {
    tag: 'Case 1 · From Discussion',
    accent: C.gradientViolet,
    headline: '只有需求，沒有圖稿',
    inputs: ['需求 / 想法', '品牌素材', '競品參考'],
    path: ['討論', 'PRD', 'Plan', '第一版'],
    when: '探索期 · 新功能 · 手邊無圖稿',
  },
  {
    tag: 'Case 2 · From Design Source',
    accent: C.gradientOrange,
    headline: '已有設計源（Figma 等）',
    inputs: ['Figma file', 'Figma Make', 'Claude Design'],
    path: ['健檢', '接軌', '第一版'],
    when: '落地期 · 改版期 · 既有專案延伸',
  },
];

const Part2TwoCases = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="02 情境一 · Design to Code"
        title="同一個終點，兩條路徑"
        sub="Case 不是技術偏好——你手邊有什麼，決定你走哪一條。"
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
          {CASES.map((sp) => (
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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

        <motion.div variants={FADE_UP}>
          <Callout accent={C.gradientMagenta} title="判斷標準：">
            圖稿完成度 / 客戶階段（探索 vs 落地）/ 是否有 brand guideline。兩個 case 共同終點＝第一版可運作介面（0 → 1），迭代與 RPI 見 Part 3 / Part 4。
          </Callout>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 04 — Ch.02 Plan Mode · 定義 + Case 1 工作流
   ============================================================ */

const PLAN_MODE_POINTS = [
  { label: '只規劃不動手', detail: 'AI 只產出 plan，不直接改檔。' },
  { label: '會主動詢問',   detail: '反問、列 todo、產出 plan 文件。' },
  { label: '何時開啟',     detail: '想法未成形 / 新增功能 / 不確定改哪些檔。' },
];

const CASE1_FLOW = [
  { id: '①', accent: C.gradientViolet,  title: '討論需求',        detail: '跟 AI 對話釐清（Ch.03）。' },
  { id: '②', accent: C.gradientMagenta, title: '整理成 PRD',      detail: '需求文件：做什麼 / 為誰 / 成功樣貌 / edge case。', highlight: true },
  { id: '③', accent: C.gradientOrange,  title: 'PRD 進 Plan Mode', detail: '依 PRD 產出技術 plan（Ch.04）。' },
  { id: '④', accent: C.gradientCoral,   title: 'confirm → Implement', detail: '第一版跑起來。' },
];

const Part2PlanMode = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.02 · Plan Mode"
        title="先想再做，不要一句話就叫 AI 寫"
        sub="Plan mode 把模糊想法跟 AI 一起釐清成可執行的需求書。"
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
          gridTemplateColumns: '1fr 1.05fr',
          gap: 48,
        }}
      >
        {/* Left — what is Plan Mode */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <Tag color={C.gradientViolet}>什麼是 Plan Mode</Tag>
          {PLAN_MODE_POINTS.map((p) => (
            <div key={p.label} style={{
              paddingBottom: 14,
              borderBottom: `1px solid ${C.hairline}`,
            }}>
              <div style={{
                fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600,
                marginBottom: 6, letterSpacing: TRACK.body,
              }}>{p.label}</div>
              <div style={{
                fontSize: TYPE_SCALE.small, color: C.inkMuted,
                lineHeight: 1.45, letterSpacing: TRACK.small,
              }}>{p.detail}</div>
            </div>
          ))}
          {/* Shift+Tab highlight */}
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              fontFamily: MONO,
              fontSize: 28,
              fontWeight: 600,
              color: C.gradientViolet,
              background: C.surface2,
              border: `1px solid ${C.gradientViolet}66`,
              borderRadius: ROUNDED.md,
              padding: '12px 20px',
              letterSpacing: '-0.01em',
            }}>Shift + Tab</div>
            <div style={{
              fontSize: TYPE_SCALE.small, color: C.inkMuted,
              lineHeight: 1.4, letterSpacing: TRACK.small,
            }}>在 plan / accept edits / auto 之間切換。</div>
          </div>
        </motion.div>

        {/* Right — Case 1 workflow */}
        <motion.div
          variants={STAGGER_INNER}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{
            fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: C.inkMuted,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>Case 1 工作流 · 討論 → PRD → 第一版</div>
          {CASE1_FLOW.map((s) => (
            <motion.div key={s.id} variants={FADE_UP}>
              <VStep {...s} />
            </motion.div>
          ))}
          <motion.div variants={FADE_UP} style={{
            fontSize: TYPE_SCALE.small, color: C.inkMuted,
            lineHeight: 1.4, letterSpacing: TRACK.small, fontStyle: 'italic',
          }}>
            Ch.03 做 ①②（產出 PRD），Ch.04 做 ③④（PRD → plan → 第一版）。
          </motion.div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05 — Ch.03 Discussion → PRD · 操作示範（步驟 + 截圖）
   ============================================================ */

const PRD_STEPS = [
  { id: '①', accent: C.gradientViolet,  title: '開場 prompt', shot: 'prompt 輸入畫面', caption: '講「想做什麼 + 為什麼」，請 AI 先別寫 code。' },
  { id: '②', accent: C.gradientMagenta, title: 'AI 反問釐清', shot: 'AI 反問對話',   caption: '使用者是誰 / 成功樣貌 / 邊界——逐一回答。' },
  { id: '③', accent: C.gradientOrange,  title: '補 reference', shot: '加 reference 畫面', caption: '截圖、連結、品牌 token + edge case 都丟進來。' },
  { id: '④', accent: C.gradientCoral,   title: '整理成 PRD',   shot: 'PRD 定稿',     caption: '請 AI 收斂成 PRD，設計師審過才定稿。' },
];

const Part2DiscussionPRD = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.03 · Discussion → PRD"
        title="把想法討論成 PRD"
        sub="好的需求不是寫出來的，是聊出來的——聊完要落成 PRD，不要停在零散對話。"
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
        >
          {PRD_STEPS.map((s) => (
            <motion.div key={s.id} variants={FADE_UP} style={{ display: 'flex' }}>
              <ShotStep {...s} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Callout accent={C.gradientCoral} title="產出物：">
            一份 PRD（目標 / 使用者與情境 / 功能清單 / 成功樣貌 / edge case / 約束），作為 Ch.04 進 Plan Mode 的 input。
          </Callout>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 06 — Ch.04 PRD → 第一版 · 四段流程
   ============================================================ */

const IMPLEMENT_PHASES = [
  {
    step: '01 · PRD → Plan',
    accent: C.gradientViolet,
    headline: '把 PRD 餵進 Plan Mode',
    detail: '請 AI 依 PRD 產出技術 plan（步驟 / 影響範圍 / 風險）。',
  },
  {
    step: '02 · 審 plan',
    accent: C.gradientMagenta,
    headline: '對照 PRD 審一遍',
    detail: '確認流程、互動、邊界、命名符合 UX 預期。',
  },
  {
    step: '03 · Implement',
    accent: C.gradientOrange,
    headline: 'confirm → 退出 → 實作',
    detail: '盯 plan 是否執行到位，不是逐行 review code。',
  },
  {
    step: '04 · 跑起來',
    accent: C.gradientCoral,
    headline: '第一版 UI 有出來',
    detail: '啟動 dev server 對照 plan——有跑出來即達標。',
  },
];

const Part2PlanToImplement = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.04 · PRD → 第一版"
        title="把 PRD 變成第一版可運作的畫面"
        sub="PRD 與 plan 的乾淨度，決定 implement 的速度。"
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
            gap: 14,
          }}
        >
          {IMPLEMENT_PHASES.map((p, i) => (
            <React.Fragment key={p.step}>
              <motion.div
                variants={FADE_UP}
                style={{
                  flex: 1,
                  background: `${p.accent}1f`,
                  border: `1px solid ${p.accent}`,
                  borderRadius: ROUNDED.lg,
                  padding: '28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  fontFamily: MONO,
                  color: p.accent,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>{p.step}</div>
                <div style={{
                  fontSize: 30,
                  fontWeight: 600,
                  color: C.ink,
                  lineHeight: 1.2,
                  letterSpacing: TRACK.title,
                }}>{p.headline}</div>
                <div style={{
                  marginTop: 'auto',
                  paddingTop: 14,
                  borderTop: `1px solid ${C.hairline}`,
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.45,
                  letterSpacing: TRACK.small,
                }}>{p.detail}</div>
              </motion.div>
              {i < IMPLEMENT_PHASES.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: MONO,
                  fontSize: 28,
                  color: C.inkMuted,
                  flexShrink: 0,
                }}>→</div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Callout accent={C.gradientViolet} title="邊界：">
            本章只做到「第一版跑起來」。常見坑——AI 改了 plan 外的檔案、或漏掉 plan 裡的 state。反覆微調 / 驗收（1 → N）見 Part 3，可追溯的 RPI 工作流見 Part 4。
          </Callout>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 08 — Ch.05 Design Sources · 三張比較卡
   ============================================================ */

const DESIGN_SOURCES = [
  {
    n: '01',
    tag: 'Figma',
    accent: C.gradientViolet,
    headline: '既有設計檔，最完整',
    rows: [['起點', '既有圖稿'], ['產出', 'Figma file'], ['對接', 'Figma MCP 讀取']],
  },
  {
    n: '02',
    tag: 'Figma Make',
    accent: C.gradientMagenta,
    headline: 'Figma 內建 AI 生成',
    rows: [['起點', 'prompt'], ['產出', 'Figma frame'], ['對接', 'export → MCP']],
  },
  {
    n: '03',
    tag: 'Claude Design',
    accent: C.gradientOrange,
    headline: '與 Claude Code 同生態',
    rows: [['起點', '文字 + 多模態'], ['產出', 'web preview'], ['對接', '直接 handoff']],
  },
];

const Part2DesignSources = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.05 · Design Sources"
        title="三種設計源，各有擅長的場景"
        sub="設計源不是越多越好——選錯會多繞遠路。"
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
          {DESIGN_SOURCES.map((card) => (
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
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <Tag color={card.accent}>{card.tag}</Tag>
                <div style={{
                  fontSize: TYPE_SCALE.subtitle, fontFamily: MONO,
                  color: card.accent, fontWeight: 700, lineHeight: 1, opacity: 0.5,
                }}>{card.n}</div>
              </div>
              <div style={{
                fontSize: 30, fontWeight: 600, color: C.ink,
                lineHeight: 1.2, letterSpacing: TRACK.title,
              }}>{card.headline}</div>
              <div style={{
                marginTop: 'auto',
                paddingTop: 16,
                borderTop: `1px solid ${C.hairline}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {card.rows.map(([k, v]) => (
                  <div key={k} style={{
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr',
                    gap: 14,
                    alignItems: 'baseline',
                  }}>
                    <span style={{
                      fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: card.accent,
                      letterSpacing: '0.08em',
                    }}>{k}</span>
                    <span style={{
                      fontSize: TYPE_SCALE.small, color: C.ink, letterSpacing: TRACK.small,
                    }}>{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Callout accent={C.gradientCoral} title="選擇建議：">
            成熟專案 → Figma；探索期 → Figma Make 或 Claude Design；極短 sprint → Claude Design。
          </Callout>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 09 — Ch.06 Source to Code · 操作示範（步驟 + 截圖）
   ============================================================ */

const SOURCE_STEPS = [
  { id: '①', accent: C.gradientViolet,  title: '健檢設計源',   shot: '圖層 / component / token', caption: '命名、component、token（見 Part 1 / Part 3）。' },
  { id: '②', accent: C.gradientMagenta, title: '選接軌通道',   shot: '接軌方式選擇',  caption: 'Figma=MCP · Make=export→MCP · Design=handoff。' },
  { id: '③', accent: C.gradientOrange,  title: '接軌指令',     shot: 'Claude Code 讀取', caption: '附 checklist：token 對應 / 互動狀態 / 技術約束。' },
  { id: '④', accent: C.gradientCoral,   title: '產出 + 跑起來', shot: 'code 對照設計源', caption: '產出 component → 對照設計源 → 第一版達標。' },
];

const Part2SourceToCode = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="Ch.06 · Source to Code"
        title="設計源到 Code 的接軌"
        sub="每種設計源接軌方式不同，但目標一致——把視覺轉成 AI 看得懂的 input。"
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
        >
          {SOURCE_STEPS.map((s) => (
            <motion.div key={s.id} variants={FADE_UP} style={{ display: 'flex' }}>
              <ShotStep {...s} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Callout accent={C.gradientOrange} title="注意：">
            設計源 ≈ PRD 的視覺部分，故略過「討論成 PRD」；若缺需求脈絡（流程 / 邊界）可補一份輕量 PRD。預設陷阱——純圖片貼上、未 detach 的 instance、跨檔案 component、漏掉 hover / loading / error。
          </Callout>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 10 — Overview · 兩個 Case 一張圖
   ============================================================ */

const HANDOFF_POINTS = [
  {
    label: '迭代與驗收（1 → N）',
    detail: 'Design from Code：三種調整方式 / 看畫面 / 存檔回復',
    ref: 'Part 3',
    accent: C.gradientViolet,
  },
  {
    label: 'slash command RPI',
    detail: 'Research → Plan → Implement（research.md / plan.md）',
    ref: 'Part 4',
    accent: C.gradientMagenta,
  },
  {
    label: '共用工具',
    detail: 'Cursor + Claude Code + Figma MCP',
    ref: 'Part 1',
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
        title="兩個 Case，一張地圖"
        sub="兩條路都做到第一版完成，本章止於此——接下來交棒。"
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
            gap: 12,
            fontFamily: MONO,
            fontSize: 20,
            color: C.inkMuted,
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: C.ink, fontWeight: 700, fontSize: 24, marginBottom: 8 }}>第一版可運作介面（0 → 1）</div>

          {/* Case 1 path */}
          <div style={{ color: C.gradientViolet }}>
            <div>├─ <span style={{ fontWeight: 700 }}>Case 1 · From Discussion</span></div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│  └─ Plan Mode（Shift+Tab）</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│     └─ 討論 → PRD</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>│        └─ Plan → Implement <span style={{ color: C.gradientViolet }}>──┐</span></div>
          </div>

          <div style={{ color: C.inkMuted, paddingLeft: 24 }}>│                          <span style={{ color: C.ink }}>▼</span></div>
          <div style={{ paddingLeft: 24 }}>│         <span style={{
            color: C.ink, fontWeight: 700, fontSize: 22,
            background: 'linear-gradient(90deg, rgba(106,76,245,0.18), rgba(255,122,61,0.18))',
            padding: '2px 12px', borderRadius: ROUNDED.sm,
          }}>第一版完成 · 本章止於此</span></div>
          <div style={{ color: C.inkMuted, paddingLeft: 24 }}>│                          <span style={{ color: C.ink }}>▲</span></div>

          {/* Case 2 path */}
          <div style={{ color: C.gradientOrange }}>
            <div>└─ <span style={{ fontWeight: 700 }}>Case 2 · From Design Source</span></div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>   └─ 設計源（Figma / Make / Design）</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>      └─ 接軌（MCP / export / handoff）</div>
            <div style={{ paddingLeft: 24, color: C.inkMuted }}>         └─ 產出 component <span style={{ color: C.gradientOrange }}>──┘</span></div>
          </div>
        </motion.div>

        {/* Right — handoff points */}
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
            fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: C.inkMuted,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4,
          }}>第一版之後 · 交棒給</div>
          {HANDOFF_POINTS.map((cp) => (
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
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{
                  fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600, letterSpacing: TRACK.body,
                }}>{cp.label}</div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: cp.accent, letterSpacing: '0.08em',
                }}>{cp.ref}</div>
              </div>
              <div style={{
                fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: TRACK.small, lineHeight: 1.4,
              }}>{cp.detail}</div>
            </motion.div>
          ))}
          <motion.div variants={FADE_UP} style={{
            marginTop: 4,
            fontSize: TYPE_SCALE.small, color: C.inkMuted,
            lineHeight: 1.4, letterSpacing: TRACK.small, fontStyle: 'italic',
          }}>
            本章只做 0 → 1；迭代與工作流自動化交給後面兩個 Part。
          </motion.div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 11 — Closing · 收尾 + 交棒（不含動手作）
   ============================================================ */

const NEXT_CARDS = [
  {
    tag: 'Part 3 · 迭代（1 → N）',
    accent: C.gradientViolet,
    headline: 'Design from Code',
    detail: '三種調整方式（Prompt / 截圖 / Figma MCP）、看畫面、存檔與回復。',
  },
  {
    tag: 'Part 4 · RPI 工作流',
    accent: C.gradientOrange,
    headline: 'Research → Plan → Implement',
    detail: 'slash command 自動化，產出可追溯的 research.md / plan.md。',
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
          第一版只是起點，
          <span style={{
            background: 'rgba(0,0,0,0.32)',
            padding: '0 16px',
            borderRadius: ROUNDED.md,
            marginLeft: 8,
          }}>迭代讓它變好。</span>
        </motion.div>

        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
          }}
        >
          {NEXT_CARDS.map((p) => (
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
  Part2ScenariosIntro,
  Part2TwoCases,
  Part2PlanMode,
  Part2DiscussionPRD,
  Part2PlanToImplement,
  Part2DesignSources,
  Part2SourceToCode,
  Part2Overview,
  Part2Closing,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = '情境一 · Design to Code'
export const subtitle = '兩個 Case：從討論或設計源出發，各自做出第一版可運作介面（0 → 1）。'

export default [
  { label: 'Scenarios · 三情境總覽', render: (p) => <Part2ScenariosIntro {...p} /> },
  { label: 'Section · Part 2', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 2"
      title="情境一 · Design to Code"
      subtitle="兩個 Case：從討論或設計稿出發，做出第一版可運作介面（0 → 1）。"
      range="Ch.01 – Ch.06 · 兩個 Case · Plan Mode · 設計源接軌"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Ch.01 · Two Cases', render: (p) => <Part2TwoCases {...p} /> },
  { label: 'Section · Case 1', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Case 1 · From Discussion"
      title="當你只有想法"
      subtitle="用 Plan Mode 跟 AI 討論成 PRD，再推進到第一版 code。"
      range="Ch.02 – Ch.04 · Plan Mode → PRD → Implement"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Ch.02 · Plan Mode', render: (p) => <Part2PlanMode {...p} /> },
  { label: 'Ch.03 · Discussion → PRD', render: (p) => <Part2DiscussionPRD {...p} /> },
  { label: 'Ch.04 · PRD → 第一版', render: (p) => <Part2PlanToImplement {...p} /> },
  { label: 'Section · Case 2', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Case 2 · From Design Source"
      title="當你已經有設計源"
      subtitle="依來源選對接軌通道，把視覺轉成 AI 看得懂的 input。"
      range="Ch.05 – Ch.06 · Design Sources → Source to Code"
      bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)"
    />
  )},
  { label: 'Ch.05 · Design Sources', render: (p) => <Part2DesignSources {...p} /> },
  { label: 'Ch.06 · Source to Code', render: (p) => <Part2SourceToCode {...p} /> },
  { label: 'Overview', render: (p) => <Part2Overview {...p} /> },
  { label: 'Closing', render: (p) => <Part2Closing {...p} /> },
]
