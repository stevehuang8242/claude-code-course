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
  { h: '任務拆解',     items: ['課程資訊區塊', '報名表單與欄位驗證', '付款流程串接', '報名成功 / 候補狀態頁'] },
  { h: '實作步驟',     items: ['1. 頁面骨架 + 手機優先 RWD 佈局', '2. 套品牌色 token、完成課程資訊區', '3. 報名表單 + 驗證 + 兩個 edge case', '4. 串接付款、完成報名成功頁'] },
];

/* 三欄上方流程列：討論需求 → Create PRD → 執行結果（對齊三欄）。 */
const PRD_FLOW = [
  { id: '1', label: '討論需求',   accent: C.gradientViolet },
  { id: '2', label: 'Create PRD', accent: C.gradientOrange },
  { id: '3', label: '執行結果',   accent: C.gradientCoral },
];

/* 流程列與內容三欄共用的欄寬模板（左：四步驟最寬）。 */
const PRD_COLS = '1.25fr 36px 1fr 36px 1fr';

/* ③ 執行結果：請 AI 依 PRD 產生程式並跑起來的 prompt。 */
const RUN_PROMPT = '「依 PRD 的實作步驟逐步產生程式碼，完成後啟動本地預覽（npm run dev），讓我在瀏覽器看第一版。」';

const Part2DiscussionPRD = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="02 情境一 · Design to Code ｜ From Requirement"
        title="From Requirement"
        sub="先釐清模糊的需求情境，再動手執行"
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
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* 與 AI 討論並形成 PRD（全寬）*/}
        <motion.div variants={FADE_UP} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
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

          {/* 流程列：討論需求 → Create PRD → 執行結果（欄間箭頭串成流程，對齊下方三欄）*/}
          <div style={{ display: 'grid', gridTemplateColumns: PRD_COLS, gap: 12, flexShrink: 0 }}>
            {PRD_FLOW.map((f, i) => (
              <React.Fragment key={f.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: C.surface1,
                  border: `1px solid ${C.hairline}`,
                  borderTop: `3px solid ${f.accent}`,
                  borderRadius: ROUNDED.md,
                  padding: '10px 16px',
                }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${f.accent}22`, border: `1.5px solid ${f.accent}`,
                    color: f.accent, fontFamily: MONO, fontWeight: 700, fontSize: 20, flexShrink: 0,
                  }}>{f.id}</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: TRACK.small }}>{f.label}</span>
                </div>
                {i < PRD_FLOW.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: PRD_FLOW[i + 1].accent, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 三欄：討論需求（bullet）｜ Create PRD（prompt + PRD.md）｜ 執行結果（prompt + 截圖）*/}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: PRD_COLS, gap: 12 }}>
            {/* ① 討論需求 — 三點 bullet list（同一張卡片）*/}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0,
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderTop: `3px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.md,
              padding: '20px 22px',
              overflow: 'auto',
            }}>
              {PRD_STEPS.slice(0, 3).map((s) => (
                <div key={s.id} style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                  <span style={{ color: s.accent, fontSize: 20, lineHeight: 1.4, flexShrink: 0 }}>●</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: TRACK.body, lineHeight: 1.2 }}>{s.title}</span>
                      <span style={{ fontSize: 16, color: C.inkMuted, letterSpacing: TRACK.small }}>{s.caption}</span>
                    </div>
                    <div style={{
                      background: C.canvas,
                      border: `1px solid ${C.hairline}`,
                      borderLeft: `4px solid ${s.accent}`,
                      borderRadius: ROUNDED.sm,
                      padding: '12px 16px',
                      fontFamily: MONO, fontSize: 18, color: C.inkMuted, lineHeight: 1.5, letterSpacing: TRACK.small,
                    }}>
                      <Tag color={s.accent}>Prompt</Tag>{' '}{s.prompt}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 流程箭頭 → Create PRD */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: C.gradientOrange, fontSize: 34, fontWeight: 700, lineHeight: 1 }}>→</span>
            </div>

            {/* ② Create PRD — 整理成 PRD 的 prompt + PRD.md */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              <div style={{
                flexShrink: 0,
                background: C.canvas,
                border: `1px solid ${C.hairline}`,
                borderLeft: `4px solid ${C.gradientOrange}`,
                borderRadius: ROUNDED.sm,
                padding: '12px 16px',
                fontFamily: MONO, fontSize: 18, color: C.inkMuted, lineHeight: 1.5, letterSpacing: TRACK.small,
              }}>
                <Tag color={C.gradientOrange}>Prompt</Tag>{' '}{PRD_STEPS[3].prompt}
              </div>
              {/* PRD.md 檔案樣式（macOS 視窗 mockup）*/}
              <div style={{
                flex: 1, minHeight: 0,
                display: 'flex', flexDirection: 'column',
                background: C.surface2,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: ROUNDED.lg,
                overflow: 'hidden',
                fontFamily: MONO,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexShrink: 0,
                }}>
                  <span style={{ display: 'inline-flex', gap: 8 }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                      <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                    ))}
                  </span>
                  <span style={{ fontSize: 16, color: C.ink, marginLeft: 8, fontWeight: 500 }}>PRD.md</span>
                </div>
                <div style={{
                  flex: 1, minHeight: 0, overflow: 'auto',
                  padding: '20px 24px',
                  lineHeight: 1.6,
                  color: C.ink,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}># 線上課程報名頁 PRD</div>
                  {PRD_MD.map((sec) => (
                    <div key={sec.h} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>## {sec.h}</div>
                      {sec.body && (
                        <div style={{ fontSize: 15, color: C.inkMuted, lineHeight: 1.5 }}>{sec.body}</div>
                      )}
                      {sec.items && sec.items.map((it) => (
                        <div key={it} style={{ fontSize: 15, color: C.inkMuted, lineHeight: 1.5 }}>- {it}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 流程箭頭 → 執行結果 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: C.gradientCoral, fontSize: 34, fontWeight: 700, lineHeight: 1 }}>→</span>
            </div>

            {/* ③ 執行結果 — 產生程式並跑起來的 prompt + 截圖（截圖待補）*/}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              <div style={{
                flexShrink: 0,
                background: C.canvas,
                border: `1px solid ${C.hairline}`,
                borderLeft: `4px solid ${C.gradientCoral}`,
                borderRadius: ROUNDED.sm,
                padding: '12px 16px',
                fontFamily: MONO, fontSize: 18, color: C.inkMuted, lineHeight: 1.5, letterSpacing: TRACK.small,
              }}>
                <Tag color={C.gradientCoral}>Prompt</Tag>{' '}{RUN_PROMPT}
              </div>
              {/* 瀏覽器視窗 mockup */}
              <div style={{
                flex: 1, minHeight: 0,
                display: 'flex', flexDirection: 'column',
                background: C.surface2,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: ROUNDED.lg,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexShrink: 0,
                }}>
                  <span style={{ display: 'inline-flex', gap: 8 }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                      <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                    ))}
                  </span>
                  <span style={{
                    flex: 1, marginLeft: 8,
                    fontFamily: MONO, fontSize: 13, color: C.inkMuted,
                    background: C.canvas, border: `1px solid ${C.hairline}`,
                    borderRadius: ROUNDED.pill, padding: '4px 14px', textAlign: 'center',
                  }}>localhost:5173</span>
                </div>
                <div style={{
                  flex: 1, minHeight: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 12, padding: 24, textAlign: 'center',
                  background: C.canvas,
                  border: `1.5px dashed ${C.hairline}`, margin: 12, borderRadius: ROUNDED.md,
                }}>
                  <span style={{ fontSize: 30, opacity: 0.5 }}>🖼</span>
                  <span style={{ fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 600, letterSpacing: TRACK.small }}>執行結果截圖待補</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, color: C.inkMuted }}>npm run dev 跑起來的畫面</span>
                </div>
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
   SLIDE 08 — Ch.05 Design Sources · 三張比較卡
   ============================================================ */

const DESIGN_SOURCES = [
  {
    n: '01',
    tag: 'Figma',
    accent: C.gradientViolet,
    headline: '既有設計檔，最完整',
    fit: '成熟專案',
    rows: [['起點', '既有圖稿'], ['產出', 'Figma file'], ['對接', 'Figma MCP 讀取']],
    path: ['Connect Figma MCP', 'Copy link to selection', 'AI Coding'],
  },
  {
    n: '02',
    tag: 'Figma Make',
    accent: C.gradientMagenta,
    headline: 'Figma 內建 AI 生成',
    fit: '探索期',
    rows: [['起點', 'prompt'], ['產出', 'Figma frame'], ['對接', 'export → MCP']],
    path: ['Prompt 生成', 'Export to MCP', 'AI Coding'],
  },
  {
    n: '03',
    tag: 'Claude Design',
    accent: C.gradientOrange,
    headline: '與 Claude Code 同生態',
    fit: '探索期 · 極短 sprint',
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
        kicker="02 情境一 · Design to Code ｜ From Design Source"
        title="From Design Source"
        sub="不同的設計來源對應不同的場景需求"
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

              {/* 選擇建議 — 此設計源最適合的場景 */}
              <div style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 8, alignSelf: 'flex-start',
                padding: '6px 14px', borderRadius: ROUNDED.pill,
                background: `${card.accent}1a`, border: `1px solid ${card.accent}55`,
              }}>
                <span style={{ fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: card.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>適用</span>
                <span style={{ fontSize: TYPE_SCALE.small, color: C.ink, letterSpacing: TRACK.small }}>{card.fit}</span>
              </div>

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
  Part2DesignSources,
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
  { label: 'Ch.05 · Design Sources', render: (p) => <Part2DesignSources {...p} /> },
  { label: 'Closing', render: (p) => <Part2Closing {...p} /> },
]
