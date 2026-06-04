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

/* Demo step with a screenshot placeholder box (操作示範：步驟 + 截圖)。
 * 若帶 `prompt`，中間框改顯示該步驟實際使用的提問 prompt，取代截圖佔位。 */
const ShotStep = ({ id, accent, title, shot, caption, prompt }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 30, color: accent, fontWeight: 700, fontFamily: MONO, lineHeight: 1 }}>{id}</span>
      <span style={{
        fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600,
        letterSpacing: TRACK.body, lineHeight: 1.15,
      }}>{title}</span>
    </div>
    {prompt ? (
      <div style={{
        flex: 1,
        minHeight: 190,
        border: `1px solid ${accent}66`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: ROUNDED.md,
        background: `${accent}0d`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '18px 20px',
      }}>
        <span style={{
          fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: accent,
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
        }}>提問 Prompt</span>
        <span style={{ fontSize: 19, color: C.ink, lineHeight: 1.5, letterSpacing: TRACK.small }}>{prompt}</span>
      </div>
    ) : (
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
    )}
    <div style={{
      fontSize: TYPE_SCALE.small, color: C.inkMuted,
      lineHeight: 1.4, letterSpacing: TRACK.small,
    }}>{caption}</div>
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
    desc: ' 0 → 1 做出可操作介面',
  },
  {
    n: '02',
    tag: '情境二',
    accent: C.gradientMagenta,
    name: 'Design from Code',
    desc: '重構成具一致性的設計系統',
  },
  {
    n: '03',
    tag: '情境三',
    accent: C.gradientOrange,
    name: 'RPI Workflow',
    desc: '系統化迭代優化現有流程',
  },
];

const Part2ScenariosIntro = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  const FONT = "Inter, 'Noto Sans TC', system-ui, sans-serif";
  return (
    <Frame bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)">
      {/* 漸層底色：標頭改用白／半透明白，與情境一 divider 同調性 */}
      <div>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 500, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)', fontFamily: MONO,
        }}>02 情境實作介紹</div>
        <h1 style={{
          fontSize: TYPE_SCALE.title, fontWeight: 500, lineHeight: 1.05,
          margin: `${SPACING.titleGap}px 0 0 0`, letterSpacing: TRACK.heroLat, color: '#ffffff',
        }}>AI Design Workflow 情境實作</h1>
        <div style={{
          fontSize: TYPE_SCALE.subtitle, color: 'rgba(255,255,255,0.85)', marginTop: 20,
          lineHeight: 1.3, fontWeight: 400, letterSpacing: TRACK.subtitle, fontFamily: FONT,
        }}>由 AI 驅動的設計與開發協作模式</div>
      </div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 48,
          marginBottom: 24,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
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
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.24)',
                borderRadius: ROUNDED.lg,
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: 'rgba(255,255,255,0.55)',
              }} />
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: '#ffffff',
                  background: 'rgba(255,255,255,0.18)',
                  padding: '6px 14px', borderRadius: ROUNDED.sm,
                  letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                }}>{card.tag}</span>
                <div style={{
                  fontSize: TYPE_SCALE.title, fontFamily: MONO,
                  color: '#ffffff', fontWeight: 700, lineHeight: 1, opacity: 0.5,
                }}>{card.n}</div>
              </div>
              <div style={{
                fontSize: 40, fontWeight: 600, color: '#ffffff',
                lineHeight: 1.15, letterSpacing: TRACK.title,
              }}>{card.name}</div>
              <div style={{
                marginTop: 'auto',
                fontSize: TYPE_SCALE.small, color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.5, letterSpacing: TRACK.small,
              }}>{card.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} color="rgba(255,255,255,0.7)" />
    </Frame>
  );
};

/* ============================================================
   SLIDE 01 — Ch.01 Two Cases · Two-Column 比較
   ============================================================ */

const CASES = [
  {
    tag: 'Case 1',
    accent: C.gradientViolet,
    headline: 'From Requirement',
    inputs: ['需求 / 想法', '參考素材'],
    paths: [
      { steps: ['Create PRD', 'Plan', 'AI Coding'] },
    ],
    when: '探索期 · 新功能',
  },
  {
    tag: 'Case 2',
    accent: C.gradientOrange,
    headline: 'From Design Source',
    inputs: ['Figma file', 'Figma Make', 'Claude Design'],
    paths: [
      { steps: ['Design Source', 'MCP', 'UI generate'] },
    ],
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
        title="從不同的起點出發"
        sub="同一個目標，不同的工作流"
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
              {sp.inputs && (
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
              )}

              {/* Path(s) — 不同起點各自一條工作流 */}
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  color: sp.accent,
                  fontFamily: MONO,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>{sp.paths.length > 1 ? 'Paths' : 'Path'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {sp.paths.map((p, pi) => (
                    <div key={p.label || pi} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {p.label && (
                        <div style={{
                          fontSize: TYPE_SCALE.tiny,
                          color: C.ink,
                          fontFamily: MONO,
                          fontWeight: 600,
                          letterSpacing: TRACK.small,
                        }}>{p.label}</div>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        fontFamily: MONO,
                        fontSize: 17,
                        color: C.ink,
                        letterSpacing: '-0.02em',
                      }}>
                        {p.steps.map((step, i) => (
                          <React.Fragment key={step}>
                            <span style={{
                              padding: '7px 12px',
                              border: `1.5px solid ${sp.accent}`,
                              borderRadius: ROUNDED.md,
                              color: sp.accent,
                              fontWeight: 600,
                            }}>{step}</span>
                            {i < p.steps.length - 1 && (
                              <span style={{ color: C.inkMuted }}>→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
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

      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* 「什麼是 Plan Mode」— 特性 + 建議使用時機，合併成一張卡片（Ch.03）。 */
const PLAN_MODE_TRAITS = [
  { label: '只規劃不動手', detail: 'AI 只產出 plan，不直接改檔。' },
  { label: '會主動詢問',   detail: '反問、列 todo、產出 plan 文件。' },
];
const PLAN_MODE_WHEN = ['想法未成形', '新增功能', '不確定要改哪些檔'];

/* ============================================================
   SLIDE 05 — Ch.03 Discussion → PRD · 操作示範（步驟 + 截圖）
   ============================================================ */

const PRD_STEPS = [
  { id: '①', accent: C.gradientViolet,  title: '開場 prompt', caption: '講「想做什麼 + 為什麼」，請 AI 先別寫 code',
    prompt: '「我想做一個線上課程的報名頁，讓使用者看完課程介紹能直接報名。先別寫 code，我們先把需求討論清楚。」' },
  { id: '②', accent: C.gradientMagenta, title: 'AI 反問釐清', caption: '使用者是誰 / 成功樣貌 / 邊界——逐一回答',
    prompt: '「針對這個需求反問我關鍵問題：使用者是誰、成功的樣子、有哪些限制，一次問幾題就好，我來回答。」' },
  { id: '③', accent: C.gradientOrange,  title: '補 reference', caption: '截圖、連結、品牌 token + edge case 都丟進來',
    prompt: '「附上競品報名頁截圖與我們的品牌色 token。另外要處理『未登入』和『課程已額滿』兩個 edge case。」' },
  { id: '④', accent: C.gradientCoral,   title: '整理成 PRD',   caption: '請 AI 收斂成 PRD，設計師審過才定稿',
    prompt: '「把剛才的討論整理成一份 PRD：目標、使用者與情境、功能清單、成功樣貌、edge case、約束。」' },
];

/* ④ 整理後的 PRD 簡易內容檔（線上課程報名頁情境）— 作為 Ch.04 進 Plan Mode 的 input。
 * 以 markdown 區段呈現：body = 段落、items = 條列。 */
const PRD_MD = [
  { h: '目標',         body: '使用者看完課程介紹後，3 步內完成報名。' },
  { h: '使用者與情境', body: '想進修的上班族，從社群連結進入報名頁。' },
  { h: '功能清單',     items: ['課程資訊', '報名表單', '付款入口', '報名成功確認'] },
  { h: '成功樣貌',     body: '報名轉換率提升、表單放棄率下降。' },
  { h: 'Edge case',    items: ['未登入 → 引導註冊', '課程額滿 → 顯示候補'] },
  { h: '約束',         items: ['沿用品牌色 token', '手機優先 RWD'] },
];

const Part2DiscussionPRD = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="02 情境一 · Design to Code ｜ From Requirement"
        title="使用 Plan mode 把需求整理成 PRD"
        sub="把模糊想法跟 AI 一起釐清成可執行的需求書"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 32,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 36,
        }}
      >
        {/* 左欄 (1/3) — 什麼是 Plan Mode */}
        <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 24, borderRadius: 3, background: C.gradientViolet, flexShrink: 0 }} />
            <span style={{ fontSize: 26, fontWeight: 600, color: C.ink, letterSpacing: TRACK.title }}>什麼是 Plan Mode</span>
          </div>
          {/* 單一卡片：特性 + 建議使用時機 + Shift+Tab */}
          <div style={{
            flex: 1,
            minHeight: 0,
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderLeft: `3px solid ${C.gradientViolet}`,
            borderRadius: ROUNDED.lg,
            padding: '26px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}>
            {/* 特性 */}
            <div>
              <div style={{
                fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: C.gradientViolet,
                letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12,
              }}>特性</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PLAN_MODE_TRAITS.map((t) => (
                  <div key={t.label}>
                    <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600, marginBottom: 2, letterSpacing: TRACK.body }}>{t.label}</div>
                    <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.4, letterSpacing: TRACK.small }}>{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.hairline}` }} />

            {/* 建議使用時機 */}
            <div>
              <div style={{
                fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: C.gradientViolet,
                letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12,
              }}>建議使用時機</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {PLAN_MODE_WHEN.map((w) => (
                  <span key={w} style={{
                    fontSize: TYPE_SCALE.small, color: C.ink,
                    background: C.surface2, border: `1px solid ${C.hairline}`,
                    padding: '8px 16px', borderRadius: ROUNDED.sm, letterSpacing: TRACK.small,
                  }}>{w}</span>
                ))}
              </div>
            </div>

            {/* Shift+Tab */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: MONO, fontSize: TYPE_SCALE.small, fontWeight: 600, color: C.gradientViolet,
                background: C.surface2, border: `1px solid ${C.gradientViolet}66`, borderRadius: ROUNDED.md,
                padding: '8px 14px', letterSpacing: '-0.01em', flexShrink: 0,
              }}>Shift + Tab</span>
              <span style={{ fontSize: TYPE_SCALE.tiny, color: C.inkMuted, lineHeight: 1.4, letterSpacing: TRACK.small }}>在 plan / accept edits / auto 之間切換</span>
            </div>
          </div>
        </motion.div>

        {/* 右欄 (2/3) — 與 AI 討論並形成 PRD */}
        <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 24, borderRadius: 3, background: C.gradientOrange, flexShrink: 0 }} />
            <span style={{ fontSize: 26, fontWeight: 600, color: C.ink, letterSpacing: TRACK.title }}>與 AI 討論並形成 PRD</span>
          </div>

          {/* 情境 */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            padding: '10px 18px',
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.md,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: C.gradientViolet,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0,
            }}>情境</span>
            <span style={{ fontSize: TYPE_SCALE.small, color: C.ink, letterSpacing: TRACK.small }}>
              想做一個「線上課程報名頁」，手邊還沒有任何圖稿
            </span>
          </div>

          {/* 步驟提問 ｜ PRD.md */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* 四步驟提問 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              {PRD_STEPS.map((s) => (
                <div key={s.id} style={{
                  flex: 1,
                  background: C.surface1,
                  border: `1px solid ${C.hairline}`,
                  borderLeft: `3px solid ${s.accent}`,
                  borderRadius: ROUNDED.md,
                  padding: '10px 16px',
                  display: 'flex',
                  gap: 12,
                  minHeight: 0,
                }}>
                  <span style={{ fontSize: 34, color: s.accent, fontWeight: 700, fontFamily: MONO, lineHeight: 1, flexShrink: 0 }}>{s.id}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 20, fontWeight: 600, color: C.ink, letterSpacing: TRACK.body, lineHeight: 1.15 }}>{s.title}</span>
                      <span style={{ fontSize: TYPE_SCALE.tiny, color: s.accent, letterSpacing: TRACK.small }}>{s.caption}</span>
                    </div>
                    <div style={{ fontSize: 17, color: C.inkMuted, lineHeight: 1.4, letterSpacing: TRACK.small }}>
                      <span style={{ fontWeight: 600 }}>Prompt：</span>{s.prompt}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PRD.md 檔案樣式 */}
            <div style={{
              display: 'flex', flexDirection: 'column', minHeight: 0,
              background: C.canvas,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.md,
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 18px',
                background: C.surface1,
                borderBottom: `1px solid ${C.hairline}`,
                flexShrink: 0,
              }}>
                <span style={{ display: 'flex', gap: 6 }}>
                  {[C.gradientCoral, C.gradientOrange, C.gradientViolet].map((c, i) => (
                    <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
                  ))}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 16, color: C.inkMuted, letterSpacing: '0.04em' }}>PRD.md</span>
              </div>
              <div style={{
                flex: 1, minHeight: 0, overflow: 'auto',
                padding: '18px 22px',
                fontFamily: MONO,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
                  <span style={{ color: C.gradientCoral, marginRight: 8 }}>#</span>線上課程報名頁 PRD
                </div>
                {PRD_MD.map((sec) => (
                  <div key={sec.h} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.gradientCoral, letterSpacing: '0.02em' }}>
                      <span style={{ opacity: 0.7, marginRight: 8 }}>##</span>{sec.h}
                    </div>
                    {sec.body && (
                      <div style={{ fontSize: 15, color: C.ink, opacity: 0.9, lineHeight: 1.5 }}>{sec.body}</div>
                    )}
                    {sec.items && sec.items.map((it) => (
                      <div key={it} style={{ fontSize: 15, color: C.ink, opacity: 0.9, lineHeight: 1.5 }}>
                        <span style={{ color: C.inkMuted, marginRight: 8 }}>-</span>{it}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 06 — Ch.04 PRD → 第一版 · 四段流程
   ============================================================ */

/* Ch.04 — 產出物演進：同一份需求，PRD → Plan → 第一版畫面 一路變形。
 * ① PRD.md（承接 Ch.03 產出）→ ② 技術 Plan（設計師唯一審查點）→ ③ 跑起來的畫面（線框）。 */
const PRD_RECAP = [
  { k: '目標',  v: '3 步內完成報名' },
  { k: '功能',  v: '資訊 / 表單 / 付款 / 確認' },
  { k: 'Edge',  v: '未登入、課程額滿' },
  { k: '約束',  v: '品牌 token、手機優先' },
];

const PLAN_STEPS = [
  '建立報名頁 layout + 課程資訊區',
  '報名表單 component（含欄位驗證）',
  '串付款入口 → 報名成功確認',
  '接 edge case：未登入導註冊 / 額滿候補',
];

/* 產出物卡外框 — 視窗樣式，呼應 Ch.03 的 PRD.md mockup */
const evoCard = (accent) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  background: C.canvas,
  border: `1px solid ${C.hairline}`,
  borderTop: `3px solid ${accent}`,
  borderRadius: ROUNDED.md,
  overflow: 'hidden',
});

const EvoBar = ({ name, note, noteColor }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px',
    background: C.surface1,
    borderBottom: `1px solid ${C.hairline}`,
    flexShrink: 0,
  }}>
    <span style={{ display: 'flex', gap: 5 }}>
      {[C.gradientCoral, C.gradientOrange, C.gradientViolet].map((c, i) => (
        <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
      ))}
    </span>
    <span style={{ fontFamily: MONO, fontSize: 16, color: C.inkMuted, letterSpacing: '0.04em' }}>{name}</span>
    {note && (
      <span style={{ marginLeft: 'auto', fontSize: 15, color: noteColor || C.inkMuted, letterSpacing: TRACK.small }}>{note}</span>
    )}
  </div>
);

/* 卡與卡之間的轉換箭頭，帶動作標籤（把 implement 的 how-to 收進這裡） */
const EvoArrow = ({ label, sub }) => (
  <motion.div variants={FADE_UP} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: '0 16px', flexShrink: 0, width: 170,
  }}>
    <div style={{ fontFamily: MONO, fontSize: 34, color: C.inkMuted, lineHeight: 1 }}>→</div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 17, fontFamily: MONO, color: C.ink, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 15, color: C.inkMuted, marginTop: 4, lineHeight: 1.3, letterSpacing: TRACK.small }}>{sub}</div>
    </div>
  </motion.div>
);

/* 線框 skeleton bar */
const Sk = ({ w = '100%', h = 12 }) => (
  <div style={{ width: w, height: h, borderRadius: 4, background: C.surface2 }} />
);

const Part2PlanToImplement = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="02 情境一 · Design to Code ｜ From Requirement"
        title="把 PRD 變成第一版可操作的畫面"
        sub="PRD 與 plan 的乾淨度，決定 implement 的速度。"
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
        {/* 產出物演進流：PRD → Plan → 畫面 */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            alignItems: 'stretch',
          }}
        >
          {/* ① PRD.md — 承接 Ch.03 */}
          <motion.div variants={FADE_UP} style={evoCard(C.gradientViolet)}>
            <EvoBar name="PRD.md" note="與 AI 討論後產出" noteColor={C.gradientViolet} />
            <div style={{ flex: 1, minHeight: 0, padding: '20px 22px', fontFamily: MONO, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
                <span style={{ color: C.gradientViolet, marginRight: 8 }}>#</span>線上課程報名頁
              </div>
              {PRD_RECAP.map((r) => (
                <div key={r.k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.gradientViolet }}>
                    <span style={{ opacity: 0.6, marginRight: 8 }}>##</span>{r.k}
                  </div>
                  <div style={{ fontSize: 17, color: C.ink, opacity: 0.9, lineHeight: 1.5, paddingLeft: 4 }}>{r.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <EvoArrow label="餵進 Plan Mode" sub="請 AI 產出技術 plan" />

          {/* ② Plan — 設計師唯一審查點 */}
          <motion.div variants={FADE_UP} style={evoCard(C.gradientMagenta)}>
            <EvoBar name="技術 Plan" note="Plan Mode 產出" noteColor={C.gradientMagenta} />
            <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 15, color: C.inkMuted, letterSpacing: TRACK.small }}>AI 依 PRD 拆出的步驟：</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {PLAN_STEPS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 17, color: C.ink, lineHeight: 1.4 }}>
                    <span style={{ fontFamily: MONO, color: C.gradientMagenta, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ opacity: 0.92 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 10, borderTop: `1px solid ${C.hairline}`, fontSize: 15, color: C.inkMuted, lineHeight: 1.45 }}>
                影響範圍：報名相關 component + 路由　·　風險：付款串接、edge case 漏接
              </div>
              <div style={{
                marginTop: 'auto',
                background: `${C.gradientMagenta}1a`,
                border: `1px solid ${C.gradientMagenta}66`,
                borderRadius: ROUNDED.sm,
                padding: '12px 14px',
                fontSize: 16, lineHeight: 1.45,
              }}>
                <span style={{ color: C.gradientMagenta, fontWeight: 700 }}>👁 設計師審查點　</span>
                <span style={{ color: C.ink }}>對照 PRD 看流程 / 互動 / 邊界 / 命名——唯一動手介入的地方</span>
              </div>
            </div>
          </motion.div>

          <EvoArrow label="confirm → implement" sub="退出 plan · 啟動 dev server" />

          {/* ③ 第一版畫面 — 跑起來的線框 */}
          <motion.div variants={FADE_UP} style={evoCard(C.gradientCoral)}>
            <EvoBar name="localhost:5173" note="將結果顯示在瀏覽器中" noteColor={C.gradientCoral} />
            <div style={{ flex: 1, minHeight: 0, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 課程 banner skeleton */}
              <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: ROUNDED.sm, padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                <Sk w="62%" h={16} />
                <Sk w="88%" />
                <Sk w="70%" />
              </div>
              {/* 報名表單 */}
              <div style={{ fontSize: 15, color: C.inkMuted, letterSpacing: TRACK.small }}>報名表單</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['姓名', 'Email'].map((ph) => (
                  <div key={ph} style={{
                    height: 40, borderRadius: ROUNDED.sm,
                    border: `1px solid ${C.hairline}`, background: C.surface1,
                    display: 'flex', alignItems: 'center', padding: '0 14px',
                    fontSize: 16, color: C.inkMuted,
                  }}>{ph}</div>
                ))}
              </div>
              {/* CTA 按鈕 */}
              <div style={{
                marginTop: 'auto',
                height: 48, borderRadius: ROUNDED.sm,
                background: C.gradientCoral,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: C.inverseInk,
                letterSpacing: TRACK.body,
              }}>立即報名</div>
            </div>
          </motion.div>
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
    path: ['Connect Figma MCP', 'Copy link to selection', 'AI Coding'],
  },
  {
    n: '02',
    tag: 'Figma Make',
    accent: C.gradientMagenta,
    headline: 'Figma 內建 AI 生成',
    rows: [['起點', 'prompt'], ['產出', 'Figma frame'], ['對接', 'export → MCP']],
    path: ['Prompt 生成', 'Export to MCP', 'AI Coding'],
  },
  {
    n: '03',
    tag: 'Claude Design',
    accent: C.gradientOrange,
    headline: '與 Claude Code 同生態',
    rows: [['起點', '文字 + 多模態'], ['產出', 'web preview'], ['對接', '直接 handoff']],
    path: ['Prompt 生成', 'Web preview', '直接 handoff', 'AI Coding'],
  },
];

const Part2DesignSources = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="02 情境一 · Design to Code"
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

              {/* Path — 各設計源各自的接軌工作流 */}
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny,
                  color: card.accent,
                  fontFamily: MONO,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>Path</div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  fontFamily: MONO,
                  fontSize: 15,
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                }}>
                  {card.path.map((step, i) => (
                    <React.Fragment key={step}>
                      <span style={{
                        padding: '6px 10px',
                        border: `1.5px solid ${card.accent}`,
                        borderRadius: ROUNDED.md,
                        color: card.accent,
                        fontWeight: 600,
                      }}>{step}</span>
                      {i < card.path.length - 1 && (
                        <span style={{ color: C.inkMuted, lineHeight: 1 }}>↓</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

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
        kicker="02 情境一 · Design to Code"
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
        kicker="02 情境一 · Design to Code"
        title="兩個 Case，一張地圖"
        sub="從不同的出發點完成 0 -> 1。"
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
    tag: '03 · 迭代（1 → N）',
    accent: C.gradientViolet,
    headline: '情境二．Design from Code',
    detail: '三種調整方式（Prompt / 截圖 / Figma MCP）、看畫面、存檔與回復。',
  },
  {
    tag: '04 · RPI 工作流',
    accent: C.gradientOrange,
    headline: '情境三．RPI Workflow',
    detail: 'Research → Plan → Implement',
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
          <Eyebrow color="rgba(255,255,255,0.85)">02 情境一 · Design to Code</Eyebrow>
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
      kicker="02 情境一 · Design to Code"
      title="情境一 · Design to Code"
      subtitle="0 → 1 做出第一版可互動的介面"
      range="02 情境一 · Design to Code"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Ch.01 · Two Cases', render: (p) => <Part2TwoCases {...p} /> },
  { label: 'Ch.03 · Discussion → PRD', render: (p) => <Part2DiscussionPRD {...p} /> },
  { label: 'Ch.04 · PRD → 第一版', render: (p) => <Part2PlanToImplement {...p} /> },
  { label: 'Ch.05 · Design Sources', render: (p) => <Part2DesignSources {...p} /> },
  { label: 'Ch.06 · Source to Code', render: (p) => <Part2SourceToCode {...p} /> },
  { label: 'Overview', render: (p) => <Part2Overview {...p} /> },
  { label: 'Closing', render: (p) => <Part2Closing {...p} /> },
]
